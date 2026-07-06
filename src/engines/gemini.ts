// Gemini — google_search 그라운딩(2.5/3.x). 3.x 는 월 5,000 grounding 무료.
// 주의: groundingChunks[].web.uri 는 vertexaisearch 리다이렉트 URL →
//       SoV/도메인 판정 전 실제 도메인으로 해소(resolveRedirect) 필요.
import { requireEnv } from '../util/env'
import { fetchWithRetry } from '../util/fetchWithRetry'
import { mapLimit } from '../util/concurrency'
import type { EngineAdapter } from './types'

const REDIRECT_HOST = 'vertexaisearch.cloud.google.com'
const RESOLVE_CONCURRENCY = 5
const RESOLVE_TIMEOUT_MS = 5000

// grounding 인용은 vertexaisearch 리다이렉트 URL → 실제 출처로 해소해야 SoV/도메인(brandCited) 판정이 맞음.
// 1순위: HEAD 302 의 Location(실 URL). 실패(타임아웃·차단 등) 시 groundingChunk.web.title(표시 도메인)로 폴백.
const resolveCitation = async (uri: string, title?: string): Promise<string> => {
  if (!uri.includes(REDIRECT_HOST)) return uri
  try {
    const res = await fetch(uri, {
      method: 'HEAD',
      redirect: 'manual',
      signal: AbortSignal.timeout(RESOLVE_TIMEOUT_MS),
    })
    const location = res.headers.get('location')
    if (location) return location
  } catch {
    // 네트워크/타임아웃 → title 폴백
  }
  // title 이 도메인 형태면 스킴 붙여 반환(그래도 .includes(domain) 판정 가능). 아니면 원본 유지.
  return title && /^[a-z0-9.-]+\.[a-z]{2,}$/i.test(title) ? `https://${title}` : uri
}

export const queryGemini: EngineAdapter = async (query, opts) => {
  const model = opts.model ?? 'gemini-3.5-flash' // 무료 grounding 위해 3.x 권장
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
  const res = await fetchWithRetry(endpoint, {
    method: 'POST',
    headers: {
      'x-goog-api-key': requireEnv('GEMINI_API_KEY'),
      'Content-Type': 'application/json',
    },
    // 검색 지역 파라미터가 없어 KR 은 프롬프트 언어로만 유도(한계 — 주석)
    body: JSON.stringify({
      contents: [{ parts: [{ text: query }] }],
      tools: [{ google_search: {} }],
    }),
  })
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`)

  const json: any = await res.json()
  const candidate = json.candidates?.[0]
  const answer = (candidate?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? '').join('')
  const chunks: { web?: { uri?: string; title?: string } }[] =
    candidate?.groundingMetadata?.groundingChunks ?? []
  // vertexaisearch 리다이렉트 → 실 출처로 해소(병렬). uri 없는 청크는 제외.
  const citedUrls: string[] = await mapLimit(
    chunks.filter((c) => c.web?.uri),
    RESOLVE_CONCURRENCY,
    (c) => resolveCitation(c.web!.uri!, c.web?.title),
  )
  // grounding 은 수행된 검색 쿼리당 과금 → webSearchQueries 수(없으면 청크 유무로 1/0 근사).
  const searchQueries: number =
    candidate?.groundingMetadata?.webSearchQueries?.length ?? (chunks.length ? 1 : 0)
  const usage = {
    model,
    inputTokens: json.usageMetadata?.promptTokenCount,
    // 출력 = 답변(candidates) + thinking(thoughts). Gemini 는 추론 토큰을 별도 필드로 주는데 output 요율로 과금됨.
    // toolUsePromptTokenCount(그라운딩 주입 콘텐츠)는 input 토큰 비과금이라 제외.
    outputTokens:
      (json.usageMetadata?.candidatesTokenCount ?? 0) + (json.usageMetadata?.thoughtsTokenCount ?? 0),
    webSearches: searchQueries,
  }
  return { answer, citedUrls, usage, raw: json }
}
