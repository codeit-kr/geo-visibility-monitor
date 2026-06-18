// Gemini — google_search 그라운딩(2.5/3.x). 3.x 는 월 5,000 grounding 무료.
// 주의: groundingChunks[].web.uri 는 vertexaisearch 리다이렉트 URL →
//       SoV/도메인 판정 전 실제 도메인으로 해소(resolveRedirect) 필요.
import { requireEnv } from '../util/env'
import type { EngineAdapter } from './types'

export const queryGemini: EngineAdapter = async (query, opts) => {
  const model = opts.model ?? 'gemini-3.5-flash' // 무료 grounding 위해 3.x 권장
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`
  const res = await fetch(endpoint, {
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json: any = await res.json()
  const candidate = json.candidates?.[0]
  const answer = (candidate?.content?.parts ?? []).map((p: { text?: string }) => p.text ?? '').join('')
  const chunks = candidate?.groundingMetadata?.groundingChunks ?? []
  // TODO: vertexaisearch 리다이렉트 → 실도메인 해소(HEAD follow 또는 web.title 도메인)
  const citedUrls: string[] = chunks
    .map((c: { web?: { uri?: string } }) => c.web?.uri)
    .filter((u: string | undefined): u is string => Boolean(u))
  // grounding 은 수행된 검색 쿼리당 과금 → webSearchQueries 수(없으면 청크 유무로 1/0 근사).
  const searchQueries: number =
    candidate?.groundingMetadata?.webSearchQueries?.length ?? (chunks.length ? 1 : 0)
  const usage = {
    model,
    inputTokens: json.usageMetadata?.promptTokenCount,
    outputTokens: json.usageMetadata?.candidatesTokenCount,
    webSearches: searchQueries,
  }
  return { answer, citedUrls, usage, raw: json }
}
