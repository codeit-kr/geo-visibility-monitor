// 엔진 레지스트리 — citationMonitor 가 엔진 키로 어댑터를 찾는다.
// 키는 types/snapshot.ts 의 Engine 과 동일.
import type { EngineAdapter, EngineResult } from './types'
import type { Engine } from '../../types/snapshot'
import { queryPerplexity } from './perplexity'
import { queryOpenAI } from './openai'
import { queryGemini } from './gemini'
import { queryAnthropic } from './anthropic'
import { queryGoogleAio, queryNaverBriefing } from './serpapi'

export type { EngineResult, EngineAdapter, EngineCallOptions } from './types'

// 웹검색 LLM — EngineCallOptions(로케일·국가·모델) 사용.
// satisfies 로 키가 Engine union 에 속함을 강제(키 오타를 tsc 가 잡도록).
export const CHATBOT_ADAPTERS = {
  chatgpt: queryOpenAI,
  claude: queryAnthropic,
  gemini: queryGemini,
  perplexity: queryPerplexity,
} satisfies Partial<Record<Engine, EngineAdapter>>

// SERP 표면 — query 만 받음(로케일은 gl/hl 고정), reps 는 LLM 보다 낮게
export const SERP_ADAPTERS = {
  'google-aio': queryGoogleAio,
  'naver-briefing': queryNaverBriefing,
} satisfies Partial<Record<Engine, (query: string) => Promise<EngineResult>>>

export const ALL_ENGINE_KEYS = [...Object.keys(CHATBOT_ADAPTERS), ...Object.keys(SERP_ADAPTERS)]

// 점진적 활성화용. ACTIVE_ENGINES(쉼표구분) 미설정이면 전부.
// 예: ACTIVE_ENGINES=chatgpt → OpenAI 만 / =chatgpt,perplexity → 둘만.
export const getActiveEngines = (): Set<string> | null => {
  const raw = process.env.ACTIVE_ENGINES?.trim()
  if (!raw) return null
  return new Set(raw.split(',').map((s) => s.trim()).filter(Boolean))
}
