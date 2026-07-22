// 엔진 어댑터 파싱 계약 테스트 — 각 API 의 문서화된 응답 형태(fixture)를 정규화(EngineResult)로
// 잘 옮기는지 검증. raw 응답을 any 로 다루는 어댑터 특성상 API 스키마 변경·파싱 회귀를
// 컴파일러가 못 잡으므로, 여기서 잡는다. fetch 를 스텁해 네트워크 없이 돈다.
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { queryOpenAI } from '../src/engines/openai'
import { queryGemini } from '../src/engines/gemini'
import { queryAnthropic } from '../src/engines/anthropic'
import { queryPerplexity } from '../src/engines/perplexity'
import { queryGoogleAio, queryNaverBriefing } from '../src/engines/serpapi'

const OPTS = { locale: 'ko-KR', userCountry: 'KR' }

const jsonRes = (body: unknown, status = 200, headers: Record<string, string> = {}): Response =>
  ({
    ok: status >= 200 && status < 300,
    status,
    headers: new Headers(headers),
    json: async () => body,
    text: async () => JSON.stringify(body),
  }) as unknown as Response

/** URL 부분문자열 → 응답 매핑으로 fetch 스텁. 매칭 없으면 throw(의도치 않은 콜 검출). */
const stubFetch = (routes: Array<[match: string, res: () => Response | Promise<Response>]>) => {
  const calls: string[] = []
  vi.stubGlobal(
    'fetch',
    vi.fn(async (url: string | URL) => {
      const u = String(url)
      calls.push(u)
      const hit = routes.find(([m]) => u.includes(m))
      if (!hit) throw new Error(`stubFetch: 매핑 없는 URL ${u}`)
      return hit[1]()
    }),
  )
  return calls
}

beforeAll(() => {
  process.env.OPENAI_API_KEY = 'test'
  process.env.GEMINI_API_KEY = 'test'
  process.env.ANTHROPIC_API_KEY = 'test'
  process.env.PERPLEXITY_API_KEY = 'test'
  process.env.SERPAPI_API_KEY = 'test'
})
afterEach(() => vi.unstubAllGlobals())

describe('openai (Responses API + web_search)', () => {
  const fixture = {
    output_text: '코드잇 스프린트는 국비지원 부트캠프입니다.',
    output: [
      { type: 'web_search_call', id: 'ws_1' },
      { type: 'web_search_call', id: 'ws_2' },
      {
        type: 'message',
        content: [
          {
            type: 'output_text',
            text: '코드잇 스프린트는 국비지원 부트캠프입니다.',
            annotations: [
              { type: 'url_citation', url: 'https://sprint.codeit.kr' },
              { type: 'file_citation', file_id: 'f1' }, // url_citation 아님 — 제외돼야 함
              { type: 'url_citation', url: 'https://boottent.com/camps' },
            ],
          },
        ],
      },
    ],
    usage: { input_tokens: 70000, output_tokens: 500 },
  }

  it('output_text·url_citation·web_search 횟수를 정규화한다', async () => {
    stubFetch([['api.openai.com/v1/responses', () => jsonRes(fixture)]])
    const r = await queryOpenAI('질의', OPTS)
    expect(r.answer).toBe('코드잇 스프린트는 국비지원 부트캠프입니다.')
    expect(r.citedUrls).toEqual(['https://sprint.codeit.kr', 'https://boottent.com/camps'])
    expect(r.usage).toMatchObject({ inputTokens: 70000, outputTokens: 500, webSearches: 2 })
  })

  it('output_text 부재 시 message content 텍스트를 이어붙인다', async () => {
    const noTopText = { ...fixture, output_text: undefined }
    stubFetch([['api.openai.com/v1/responses', () => jsonRes(noTopText)]])
    const r = await queryOpenAI('질의', OPTS)
    expect(r.answer).toBe('코드잇 스프린트는 국비지원 부트캠프입니다.')
  })

  it('non-ok(4xx) 응답이면 상태코드를 담아 던진다', async () => {
    stubFetch([['api.openai.com/v1/responses', () => jsonRes({ error: 'bad request' }, 400)]])
    await expect(queryOpenAI('질의', OPTS)).rejects.toThrow(/OpenAI 400/)
  })
})

describe('gemini (google_search 그라운딩)', () => {
  const fixture = (chunks: unknown[], queries?: string[]) => ({
    candidates: [
      {
        content: { parts: [{ text: '부트캠프 ' }, { text: '비교 답변' }] },
        groundingMetadata: { groundingChunks: chunks, ...(queries ? { webSearchQueries: queries } : {}) },
      },
    ],
    usageMetadata: { promptTokenCount: 100, candidatesTokenCount: 300, thoughtsTokenCount: 200 },
  })
  const REDIRECT = 'https://vertexaisearch.cloud.google.com/grounding-api-redirect/abc'

  it('parts 텍스트 연결 + 리다이렉트 해소(302 Location) + thinking 토큰 합산', async () => {
    stubFetch([
      ['generativelanguage.googleapis.com', () =>
        jsonRes(fixture([{ web: { uri: REDIRECT, title: 'sprint.codeit.kr' } }, { web: { uri: 'https://direct.example.com' } }], ['q1', 'q2'])),
      ],
      ['vertexaisearch.cloud.google.com', () => jsonRes(null, 302, { location: 'https://sprint.codeit.kr/tracks' })],
    ])
    const r = await queryGemini('질의', OPTS)
    expect(r.answer).toBe('부트캠프 비교 답변')
    expect(r.citedUrls).toEqual(['https://sprint.codeit.kr/tracks', 'https://direct.example.com'])
    expect(r.usage).toMatchObject({ inputTokens: 100, outputTokens: 500, webSearches: 2 })
  })

  it('리다이렉트 해소 실패 시 title(도메인 형태)로 폴백한다', async () => {
    stubFetch([
      ['generativelanguage.googleapis.com', () =>
        jsonRes(fixture([{ web: { uri: REDIRECT, title: 'sprint.codeit.kr' } }])),
      ],
      ['vertexaisearch.cloud.google.com', () => Promise.reject(new Error('timeout'))],
    ])
    const r = await queryGemini('질의', OPTS)
    expect(r.citedUrls).toEqual(['https://sprint.codeit.kr'])
    expect(r.usage?.webSearches).toBe(1) // webSearchQueries 없음 → 청크 유무로 1 근사
  })
})

describe('anthropic (Messages API + web_search 서버툴)', () => {
  const fixture = {
    content: [
      { type: 'server_tool_use', id: 'st_1', name: 'web_search' },
      {
        type: 'web_search_tool_result',
        content: [{ type: 'web_search_result', url: 'https://boottent.com' }],
      },
      {
        type: 'text',
        text: '코드잇 스프린트 요약.',
        citations: [{ type: 'web_search_result_location', url: 'https://sprint.codeit.kr' }],
      },
    ],
    usage: { input_tokens: 1200, output_tokens: 400, server_tool_use: { web_search_requests: 1 } },
  }

  it('text 블록 연결 + citations/tool_result URL 수집 + 검색횟수', async () => {
    stubFetch([['api.anthropic.com/v1/messages', () => jsonRes(fixture)]])
    const r = await queryAnthropic('질의', OPTS)
    expect(r.answer).toBe('코드잇 스프린트 요약.')
    expect(r.citedUrls).toEqual(['https://boottent.com', 'https://sprint.codeit.kr'])
    expect(r.usage).toMatchObject({ inputTokens: 1200, outputTokens: 400, webSearches: 1 })
  })
})

describe('perplexity (sonar)', () => {
  const base = {
    choices: [{ message: { content: '부트캠프 답변' } }],
    search_results: [{ url: 'https://from-search.example.com' }],
    usage: { prompt_tokens: 50, completion_tokens: 150 },
  }

  it('citations 필드가 있으면 우선 사용한다', async () => {
    stubFetch([['api.perplexity.ai', () => jsonRes({ ...base, citations: ['https://from-citations.example.com'] })]])
    const r = await queryPerplexity('질의', OPTS)
    expect(r.answer).toBe('부트캠프 답변')
    expect(r.citedUrls).toEqual(['https://from-citations.example.com'])
  })

  it('citations 부재 시 search_results 로 폴백한다', async () => {
    stubFetch([['api.perplexity.ai', () => jsonRes(base)]])
    const r = await queryPerplexity('질의', OPTS)
    expect(r.citedUrls).toEqual(['https://from-search.example.com'])
    expect(r.usage).toMatchObject({ inputTokens: 50, outputTokens: 150, webSearches: 1 })
  })
})

describe('serpapi — google AI Overview', () => {
  const overview = {
    text_blocks: [{ snippet: '첫 블록' }, { snippet: '둘째 블록' }],
    references: [{ link: 'https://sprint.codeit.kr' }, { title: 'link 없는 ref' }],
  }

  it('1차 응답에 text_blocks 가 바로 오면 크레딧 1', async () => {
    stubFetch([['serpapi.com', () => jsonRes({ ai_overview: overview })]])
    const r = await queryGoogleAio('부트캠프 비교')
    expect(r.answer).toBe('첫 블록\n둘째 블록')
    expect(r.citedUrls).toEqual(['https://sprint.codeit.kr'])
    expect(r.usage).toEqual({ serpCredits: 1 })
  })

  it('page_token 만 오면 google_ai_overview 로 2차 호출(크레딧 2)', async () => {
    const calls = stubFetch([
      ['engine=google_ai_overview', () => jsonRes({ ai_overview: overview })],
      ['serpapi.com', () => jsonRes({ ai_overview: { page_token: 'tok123' } })],
    ])
    const r = await queryGoogleAio('부트캠프 비교')
    expect(r.answer).toBe('첫 블록\n둘째 블록')
    expect(r.usage).toEqual({ serpCredits: 2 })
    expect(calls[1]).toContain('page_token=tok123')
  })

  it('AIO 미노출이면 빈 결과 + 크레딧 1(호출 성공)', async () => {
    stubFetch([['serpapi.com', () => jsonRes({ organic_results: [] })]])
    const r = await queryGoogleAio('부트캠프 비교')
    expect(r.answer).toBe('')
    expect(r.citedUrls).toEqual([])
    expect(r.usage).toEqual({ serpCredits: 1 })
  })
})

describe('serpapi — naver AI Briefing', () => {
  it('최상위 text_blocks/references 를 파싱한다', async () => {
    stubFetch([
      ['serpapi.com', () =>
        jsonRes({ text_blocks: [{ snippet: '네이버 답변' }], references: [{ link: 'https://blog.naver.com/x' }] }),
      ],
    ])
    const r = await queryNaverBriefing('부트캠프 비교')
    expect(r.answer).toBe('네이버 답변')
    expect(r.citedUrls).toEqual(['https://blog.naver.com/x'])
    expect(r.usage).toEqual({ serpCredits: 1 })
  })

  it('미노출이면 빈 결과 + 크레딧 1', async () => {
    stubFetch([['serpapi.com', () => jsonRes({})]])
    const r = await queryNaverBriefing('부트캠프 비교')
    expect(r.answer).toBe('')
    expect(r.citedUrls).toEqual([])
  })
})
