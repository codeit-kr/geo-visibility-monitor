// OpenAI ChatGPT 근사 — Responses API + web_search 툴(신규, web_search_preview 아님).
// 인용은 message content 의 annotations[].url_citation.url. 측정용 중간 모델 권장.
import { requireEnv } from '../util/env'
import { fetchWithRetry } from '../util/fetchWithRetry'
import type { EngineAdapter } from './types'

const ENDPOINT = 'https://api.openai.com/v1/responses'

export const queryOpenAI: EngineAdapter = async (query, opts) => {
  // ChatGPT 기본값(GPT-5.5 Instant)과 일치 → 대다수 유저 경험 재현(충실도).
  //   2026-05-05부터 무료 포함 전 티어가 5.5 Instant. 비용 민감 시 gpt-5.4(절반)·gpt-5(더 저가)로.
  const model = opts.model ?? 'gpt-5.5'
  const res = await fetchWithRetry(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${requireEnv('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: query,
      tools: [{ type: 'web_search', user_location: { type: 'approximate', country: opts.userCountry } }],
    }),
  })
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`)

  const json: any = await res.json()
  const output = json.output ?? []
  const messages = output.filter((o: { type: string }) => o.type === 'message')
  const answer =
    json.output_text ??
    messages
      .flatMap((m: any) => m.content ?? [])
      .map((c: any) => c.text ?? '')
      .join('')
  const citedUrls: string[] = messages
    .flatMap((m: any) => m.content ?? [])
    .flatMap((c: any) => c.annotations ?? [])
    .filter((a: any) => a.type === 'url_citation')
    .map((a: any) => a.url)
  // web_search 비용은 검색 콘텐츠가 input 토큰으로 과금되어 usage 에 이미 반영(별도 콜비 없음).
  const usage = {
    model,
    inputTokens: json.usage?.input_tokens,
    outputTokens: json.usage?.output_tokens,
    webSearches: output.filter((o: { type?: string }) => o.type === 'web_search_call').length,
  }
  return { answer, citedUrls, usage, raw: json }
}
