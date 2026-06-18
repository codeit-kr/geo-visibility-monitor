// SerpApi — 공식 API 없는 표면(Google AI Overview, Naver AI Briefing)을 스크랩.
// 실제 렌더된 제품 화면 기반이라 챗봇 API 보다 충실도 높음. gl/hl 로 KR 강제.
// 응답 경로 검증 완료(2026-06): google AIO 는 ai_overview.{text_blocks,references}(page_token 2차호출),
//   Naver 는 engine=naver_ai_overview 의 최상위 {text_blocks,references}.
import { requireEnv } from '../util/env'
import type { EngineResult } from './types'

const ENDPOINT = 'https://serpapi.com/search.json'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fetchSerp = async (params: Record<string, string>): Promise<any> => {
  const qs = new URLSearchParams({ ...params, api_key: requireEnv('SERPAPI_API_KEY') })
  const res = await fetch(`${ENDPOINT}?${qs}`)
  if (!res.ok) throw new Error(`SerpApi ${res.status}: ${await res.text()}`)
  return res.json()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseAiOverview = (overview: any): EngineResult => {
  const answer = (overview?.text_blocks ?? [])
    .map((b: { snippet?: string }) => b.snippet ?? '')
    .join('\n')
  const citedUrls: string[] = (overview?.references ?? [])
    .map((r: { link?: string }) => r.link)
    .filter((l: string | undefined): l is string => Boolean(l))
  return { answer, citedUrls, raw: overview }
}

/**
 * Google AI Overview (KR 로케일).
 * AIO 는 1차 응답에 text_blocks 가 바로 오기도, page_token 만 오기도 한다 →
 * page_token 만 있으면 google_ai_overview 엔진으로 2차 호출해 본문을 가져온다.
 * (이걸 안 하면 AIO 가 떠도 빈 결과로 오탐)
 */
export const queryGoogleAio = async (query: string): Promise<EngineResult> => {
  const json = await fetchSerp({ engine: 'google', q: query, gl: 'kr', hl: 'ko' })
  const overview = json.ai_overview

  if (overview?.page_token && !overview?.text_blocks) {
    // 2차 호출 → SerpApi 크레딧 2 소모.
    const full = await fetchSerp({ engine: 'google_ai_overview', page_token: overview.page_token })
    return { ...parseAiOverview(full.ai_overview ?? full), usage: { serpCredits: 2 } }
  }
  if (!overview) {
    // AIO 미노출(쿼리에 따라 정상). 빈 결과지만 호출은 성공(크레딧 1).
    return { answer: '', citedUrls: [], usage: { serpCredits: 1 }, raw: json.ai_overview ?? null }
  }
  return { ...parseAiOverview(overview), usage: { serpCredits: 1 } }
}

/**
 * Naver AI Briefing(= SerpApi 의 Naver AI Overview).
 * 전용 엔진 naver_ai_overview 에 query 직접 입력(google AIO 의 page_token 2차호출 불필요).
 * AIO 와 달리 text_blocks/references 가 최상위로 온다 → json 을 그대로 파싱.
 */
export const queryNaverBriefing = async (query: string): Promise<EngineResult> => {
  const json = await fetchSerp({ engine: 'naver_ai_overview', query })
  if (!json.text_blocks) {
    // AI Briefing 미노출(쿼리에 따라 정상). 빈 결과지만 호출은 성공(크레딧 1).
    return { answer: '', citedUrls: [], usage: { serpCredits: 1 }, raw: null }
  }
  return { ...parseAiOverview(json), usage: { serpCredits: 1 } }
}
