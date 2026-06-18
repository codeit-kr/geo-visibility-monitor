// Perplexity Sonar — 응답에 citations/search_results 네이티브 포함(가장 깔끔).
// 모델 ID·필드명은 착수 시 현행 문서로 확인.
import { requireEnv } from '../util/env'
import type { EngineAdapter } from './types'

const ENDPOINT = 'https://api.perplexity.ai/chat/completions'

export const queryPerplexity: EngineAdapter = async (query, opts) => {
  const model = opts.model ?? 'sonar'
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${requireEnv('PERPLEXITY_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages: [{ role: 'user', content: query }],
      // KR 사용자 근사(버전에 따라 web_search_options.user_location 지원)
      web_search_options: { user_location: { country: opts.userCountry } },
    }),
  })
  if (!res.ok) throw new Error(`Perplexity ${res.status}: ${await res.text()}`)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json: any = await res.json()
  const searchResults: string[] = (json.search_results ?? []).map((r: { url: string }) => r.url)
  // sonar online 은 요청당 웹 컨텐츠 요청비가 붙음 → 요청 1건당 webSearches 1.
  const usage = {
    model,
    inputTokens: json.usage?.prompt_tokens,
    outputTokens: json.usage?.completion_tokens,
    webSearches: 1,
  }
  return {
    answer: json.choices?.[0]?.message?.content ?? '',
    citedUrls: json.citations ?? searchResults,
    usage,
    raw: json,
  }
}
