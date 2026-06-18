// 감성·정확도 LLM 판정기 — 답변 1건을 구조화 JSON 으로 분류(웹검색 없는 저가 모델 1콜).
// OPENAI_API_KEY 재사용. 모델은 CLASSIFIER_MODEL(기본 저가) — 현행 ID 확인 TODO.
import { requireEnv } from '../util/env'
import type { Brand } from '../config/types'
import type { Sentiment } from '../../types/snapshot'

const ENDPOINT = 'https://api.openai.com/v1/chat/completions'

export interface JudgeInput {
  answer: string
  query: string
  brand: Brand // 서비스별 판정 대상 브랜드
  groundTruth?: Record<string, unknown>
}
export interface JudgeResult {
  sentiment: Sentiment | null
  accuracyFlags: string[]
  usage?: { model: string; inputTokens?: number; outputTokens?: number } // 분류기 비용 산정
}

export const judge = async (input: JudgeInput): Promise<JudgeResult> => {
  const model = process.env.CLASSIFIER_MODEL ?? 'gpt-4.1-mini'
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${requireEnv('OPENAI_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      temperature: 0,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt(input.brand) },
        { role: 'user', content: buildPrompt(input) },
      ],
    }),
  })
  if (!res.ok) throw new Error(`Classifier ${res.status}: ${await res.text()}`)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const json: any = await res.json()
  const content = json.choices?.[0]?.message?.content
  if (!content) throw new Error('Classifier: 빈 응답')
  const parsed = JSON.parse(content)
  return {
    sentiment: normalizeSentiment(parsed.sentiment),
    accuracyFlags: Array.isArray(parsed.accuracyFlags)
      ? parsed.accuracyFlags.filter((f: unknown): f is string => typeof f === 'string')
      : [],
    usage: {
      model,
      inputTokens: json.usage?.prompt_tokens,
      outputTokens: json.usage?.completion_tokens,
    },
  }
}

const systemPrompt = (brand: Brand): string =>
  `너는 AI 검색 답변을 분석하는 평가기다. 브랜드 "${brand.canonical}"(별칭: ${brand.aliases.join(', ')}) 관련 정보만 본다. 반드시 JSON 객체만 출력한다.`

const buildPrompt = (input: JudgeInput): string => {
  const brand = input.brand.canonical
  const gt = input.groundTruth ? `\n[정답 데이터]\n${JSON.stringify(input.groundTruth)}` : ''
  return `질문: ${input.query}

AI 답변:
"""
${input.answer}
"""${gt}

판정해서 아래 JSON 으로만 답하라:
- "sentiment": 답변에서 "${brand}"가 언급된 맥락의 톤. "positive" | "neutral" | "negative". 브랜드 언급이 없으면 null. (부정/추천안함 맥락은 negative, 단순 중립 나열은 neutral)
- "accuracyFlags": 정답 데이터가 주어졌고 답변이 "${brand}"에 대해 말한 사실이 그와 어긋나면 해당 항목 플래그(예: "wrong-price", "wrong-employment-rate"). 경쟁사 정보나 일반 진술은 무시. 어긋남 없거나 정답 데이터 없으면 [].

출력 예: {"sentiment": "positive", "accuracyFlags": []}`
}

const normalizeSentiment = (v: unknown): Sentiment | null =>
  v === 'positive' || v === 'neutral' || v === 'negative' ? v : null
