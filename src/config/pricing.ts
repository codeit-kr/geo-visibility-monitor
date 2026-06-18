// 모델/표면별 단가 → 콜당 비용(USD) 계산. 사용량(토큰·웹검색·SerpApi 크레딧)을 받아 USD 로 환산.
//
// 단가 출처(2026-06 기준, 공식·집계 가격). ⚠️ 모델 ID·요금제는 수시로 바뀜 → 정기 갱신할 것.
//   OpenAI gpt-5.5: $5/$30 per 1M + web_search 하이브리드 — 콜당 $10/1k($0.01) + 검색 콘텐츠는
//     input 토큰으로 과금(usage.input_tokens 에 이미 포함). 그래서 perWebSearch 엔 콜비만 넣음(토큰 중복 X).
//   OpenAI gpt-4.1-mini(분류기): $0.40/$1.60 per 1M  ※ 값 재확인 권장
//   Gemini 3.5 Flash: $1.50/$9 per 1M, grounding 5k/월 무료 후 $14/1k 쿼리
//   Anthropic Sonnet 4.6: $3/$15 per 1M, web_search $10/1k
//   Perplexity sonar: $1/$1 per 1M, 웹 컨텐츠 요청비 ~$8/1k(저~고 컨텍스트 $5–12 중앙값)

export interface ModelPricing {
  inputPerMTok: number // USD / 1M input tokens
  outputPerMTok: number // USD / 1M output tokens
  perWebSearch?: number // USD / web_search·grounding 호출(해당 엔진만)
}

// 키 = 어댑터가 EngineUsage.model 로 보고하는 실제 모델 ID.
export const MODEL_PRICING: Record<string, ModelPricing> = {
  'gpt-5.5': { inputPerMTok: 5.0, outputPerMTok: 30.0, perWebSearch: 0.01 },
  'gpt-4.1-mini': { inputPerMTok: 0.4, outputPerMTok: 1.6 },
  'gemini-3.5-flash': { inputPerMTok: 1.5, outputPerMTok: 9.0, perWebSearch: 0.014 },
  'claude-sonnet-4-6': { inputPerMTok: 3.0, outputPerMTok: 15.0, perWebSearch: 0.01 },
  sonar: { inputPerMTok: 1.0, outputPerMTok: 1.0, perWebSearch: 0.008 },
}

// SerpApi 크레딧 단가(USD/크레딧). 무료 플랜(250/월)의 한계 비용은 0.
// 유료 시작가 starter = $25/1k = $0.025. 본인 플랜 단가로 맞출 것(0 이면 무료 플랜 가정).
export const SERPAPI_CREDIT_USD = 0

export interface Usage {
  model?: string // 가격표 조회 키(챗봇·LLM). SerpApi 는 미설정.
  inputTokens?: number
  outputTokens?: number
  webSearches?: number // 웹검색/grounding 호출 수
  serpCredits?: number // SerpApi 크레딧(검색 1콜=1, AIO page_token 2차호출 시 2)
}

// 사용량 1건 → USD. 가격표에 없는 모델은 토큰 비용 0(웹/크레딧만 계산) — 미등록 경고는 호출측에서.
export const computeCostUsd = (u: Usage): number => {
  let cost = 0
  if (u.serpCredits) cost += u.serpCredits * SERPAPI_CREDIT_USD
  const p = u.model ? MODEL_PRICING[u.model] : undefined
  if (p) {
    cost += ((u.inputTokens ?? 0) / 1_000_000) * p.inputPerMTok
    cost += ((u.outputTokens ?? 0) / 1_000_000) * p.outputPerMTok
    if (p.perWebSearch) cost += (u.webSearches ?? 0) * p.perWebSearch
  }
  return cost
}
