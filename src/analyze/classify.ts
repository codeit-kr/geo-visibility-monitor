// 감성·정확도 분류 오케스트레이터. LLM 판정기(primary) → 실패 시 휴리스틱(fallback).
// 분류 실패가 스냅샷 전체를 잃지 않도록 폴백을 둔다.
import { judge } from './llmJudge'
import { classifySentiment } from './classifySentiment'
import { checkAccuracy } from './checkAccuracy'
import type { Brand } from '../config/types'
import type { Sentiment } from '../../types/snapshot'

export interface ClassifyInput {
  answer: string
  query: string
  brand: Brand // 서비스별 판정 대상 브랜드
  groundTruth?: Record<string, unknown>
  mentioned: boolean
}
export interface ClassifyResult {
  sentiment: Sentiment | null
  accuracyFlags: string[]
  usage?: { model: string; inputTokens?: number; outputTokens?: number } // LLM 판정 시에만(폴백은 없음)
}

export const classifyAnswer = async (input: ClassifyInput): Promise<ClassifyResult> => {
  // 분류할 게 없으면 LLM 콜 생략(비용 절약): 언급도 없고 정답대조 대상도 아님
  if (!input.mentioned && !input.groundTruth) {
    return { sentiment: null, accuracyFlags: [] }
  }

  try {
    return await judge({
      answer: input.answer,
      query: input.query,
      brand: input.brand,
      groundTruth: input.groundTruth,
    })
  } catch (error) {
    console.warn(
      '[classify] LLM 판정 실패 → 휴리스틱 폴백:',
      error instanceof Error ? error.message : error,
    )
    return {
      sentiment: input.mentioned ? await classifySentiment(input.answer) : null,
      accuracyFlags: input.groundTruth ? await checkAccuracy(input.answer, input.groundTruth) : [],
    }
  }
}
