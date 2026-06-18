// Claude — Messages API + web_search 서버툴. 검색당 $10/1k 과금.
// 인용은 web_search 결과 블록/텍스트 citations 에서 수집(정확한 경로는 착수 시 확인).
import { requireEnv } from '../util/env'
import type { EngineAdapter } from './types'

const ENDPOINT = 'https://api.anthropic.com/v1/messages'

export const queryAnthropic: EngineAdapter = async (query, opts) => {
  // Claude.ai 무료 기본값(Sonnet 4.6)과 일치 → 대다수 유저 경험 재현(충실도). Opus 는 유료만.
  const model = opts.model ?? 'claude-sonnet-4-6'
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'x-api-key': requireEnv('ANTHROPIC_API_KEY'),
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1500,
      messages: [{ role: 'user', content: query }],
      tools: [
        {
          // Sonnet 4.6+ 는 동적 필터링 지원하는 신버전 web_search 사용(구버전은 web_search_20250305).
          name: 'web_search',
          type: 'web_search_20260209',
          user_location: { type: 'approximate', country: opts.userCountry },
        },
      ],
    }),
  })
  if (!res.ok) throw new Error(`Anthropic ${res.status}: ${await res.text()}`)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json: any = await res.json()
  const blocks = json.content ?? []
  const answer = blocks
    .filter((b: { type: string }) => b.type === 'text')
    .map((b: { text?: string }) => b.text ?? '')
    .join('')
  // 텍스트 블록의 citations[].url + web_search_tool_result 블록의 결과 URL 수집
  const citedUrls: string[] = blocks
    .flatMap((b: any) =>
      b.type === 'text'
        ? (b.citations ?? []).map((c: any) => c.url)
        : b.type === 'web_search_tool_result'
          ? (b.content ?? []).map((r: any) => r.url)
          : [],
    )
    .filter(Boolean)
  const usage = {
    model,
    inputTokens: json.usage?.input_tokens,
    outputTokens: json.usage?.output_tokens,
    webSearches: json.usage?.server_tool_use?.web_search_requests ?? 0,
  }
  return { answer, citedUrls, usage, raw: json }
}
