// 그룹 A — 가시성. buildCalls() → 엔진 호출 → 분류 → VisibilitySnapshot[].
import { buildCalls, type CallSpec, type BuildOptions } from '../promptBuilder'
import { CHATBOT_ADAPTERS, SERP_ADAPTERS, getActiveEngines } from '../engines'
import type { EngineResult } from '../engines'
import { mentionsBrand, matchedCompetitors } from '../analyze/matchEntities'
import { classifyAnswer } from '../analyze/classify'
import { mapLimit } from '../util/concurrency'
import type { ServiceConfig } from '../config/types'
import { computeCostUsd } from '../config/pricing'
import {
  SCHEMA_VERSION,
  type VisibilitySnapshot,
  type ResponseRecord,
  type CostSnapshot,
  type UsageCost,
  type Engine,
} from '../../types/snapshot'
import type { SnapshotContext } from '../context'

// 콜 1건의 산출 — 메트릭(snapshot)·원문(response)·분류기 사용량(비용 집계용).
interface CallOutcome {
  snapshot: VisibilitySnapshot
  response: ResponseRecord
  classifier?: { model: string; inputTokens?: number; outputTokens?: number }
}

const CONCURRENCY = 4

export const runCitationMonitor = async (
  ctx: SnapshotContext,
  service: ServiceConfig,
  buildOpts: BuildOptions = {},
): Promise<{ snapshots: VisibilitySnapshot[]; responses: ResponseRecord[]; cost: CostSnapshot }> => {
  const calls = buildCalls(service, buildOpts)
  const callOpts = { locale: service.locale, userCountry: service.userCountry }

  // 점진적 활성화: ACTIVE_ENGINES 에 든 엔진만 실행(미설정이면 전부).
  const active = getActiveEngines()
  const isActive = (key: string): boolean => active === null || active.has(key)

  // 챗봇: 활성 엔진 × 모든 CallSpec
  const chatbotTasks = Object.entries(CHATBOT_ADAPTERS)
    .filter(([engine]) => isActive(engine))
    .flatMap(([engine, adapter]) =>
      calls.map((call) => async () => {
        const result = await adapter(call.query, callOpts)
        return toSnapshot(ctx, service, engine as Engine, call, result)
      }),
    )

  // SERP: 활성 엔진 × visibility 의도별 seed 쿼리만(rep=1).
  // SerpApi free plan(250/월) 안에 들어가도록 간소화 — seed 15개 × 2표면 ≈ 129/월.
  const serpQueries = selectSerpQueries(calls)
  const serpTasks = Object.entries(SERP_ADAPTERS)
    .filter(([engine]) => isActive(engine))
    .flatMap(([engine, adapter]) =>
      serpQueries.map((call) => async () => {
        const result = await adapter(call.query)
        return toSnapshot(ctx, service, engine as Engine, { ...call, rep: 1 }, result)
      }),
    )

  const tasks = [...chatbotTasks, ...serpTasks]
  const results = await mapLimit(tasks, CONCURRENCY, (task) => runSafe(task))
  const ok = results.filter((r): r is CallOutcome => r !== null)

  // 비용 집계: 엔진별 + classifier 버킷 + 총합.
  const byEngine: Record<string, UsageCost> = {}
  for (const o of ok) {
    const r = o.response
    accumulate(byEngine, r.engine, {
      inputTokens: r.inputTokens,
      outputTokens: r.outputTokens,
      webSearches: r.webSearches,
      serpCredits: r.serpCredits,
      costUsd: r.costUsd,
    })
    if (o.classifier) {
      accumulate(byEngine, 'classifier', {
        inputTokens: o.classifier.inputTokens,
        outputTokens: o.classifier.outputTokens,
        costUsd: computeCostUsd(o.classifier),
      })
    }
  }
  const cost: CostSnapshot = {
    schemaVersion: SCHEMA_VERSION,
    capturedAt: ctx.capturedAt,
    isoWeek: ctx.isoWeek,
    app: ctx.app,
    byEngine,
    total: Object.values(byEngine).reduce(sumUsageCost, emptyUsageCost()),
  }

  return { snapshots: ok.map((o) => o.snapshot), responses: ok.map((o) => o.response), cost }
}

const emptyUsageCost = (): UsageCost => ({
  calls: 0,
  inputTokens: 0,
  outputTokens: 0,
  webSearches: 0,
  serpCredits: 0,
  costUsd: 0,
})

// 버킷에 콜 1건 누적(calls 는 +1). 미보고 필드는 0 취급.
const accumulate = (
  byEngine: Record<string, UsageCost>,
  bucket: string,
  u: { inputTokens?: number; outputTokens?: number; webSearches?: number; serpCredits?: number; costUsd?: number },
): void => {
  const acc = (byEngine[bucket] ??= emptyUsageCost())
  acc.calls += 1
  acc.inputTokens += u.inputTokens ?? 0
  acc.outputTokens += u.outputTokens ?? 0
  acc.webSearches += u.webSearches ?? 0
  acc.serpCredits += u.serpCredits ?? 0
  acc.costUsd += u.costUsd ?? 0
}

const sumUsageCost = (a: UsageCost, b: UsageCost): UsageCost => ({
  calls: a.calls + b.calls,
  inputTokens: a.inputTokens + b.inputTokens,
  outputTokens: a.outputTokens + b.outputTokens,
  webSearches: a.webSearches + b.webSearches,
  serpCredits: a.serpCredits + b.serpCredits,
  costUsd: a.costUsd + b.costUsd,
})

// 콜 단위 실패는 전체를 죽이지 않고 null 로 떨군다(엔진 부분 장애 허용).
const runSafe = async (task: () => Promise<CallOutcome>): Promise<CallOutcome | null> => {
  try {
    return await task()
  } catch (error) {
    console.error('[citationMonitor] 콜 실패:', error instanceof Error ? error.message : error)
    return null
  }
}

// SERP 는 visibility 의도별 seed(p0)만 — free plan 절약 + SERP 는 LLM 보다 덜 random.
const selectSerpQueries = (calls: CallSpec[]): CallSpec[] => {
  const seen = new Set<string>()
  return calls.filter((c) => {
    if (c.metricRole !== 'visibility' || c.paraphraseIndex !== 0 || seen.has(c.query)) return false
    seen.add(c.query)
    return true
  })
}

const toSnapshot = async (
  ctx: SnapshotContext,
  service: ServiceConfig,
  engine: Engine,
  call: CallSpec,
  result: EngineResult,
): Promise<CallOutcome> => {
  const answer = result.answer ?? ''
  const citedUrls = result.citedUrls ?? []
  const brandCited = citedUrls.some((u) => service.brand.domains.some((d) => u.includes(d)))
  const mentioned = mentionsBrand(answer, service.brand) || brandCited
  const intent = service.intents.find((i) => i.id === call.intentId)
  const competitorsMentioned = call.competitorAware ? matchedCompetitors(answer, service.competitors) : []

  // 감성·정확도는 LLM 판정(실패 시 휴리스틱 폴백). LLM 엔 답변 전문을 넘긴다.
  const classified = await classifyAnswer({
    answer,
    query: call.query,
    brand: service.brand,
    groundTruth: intent?.groundTruth,
    mentioned,
  })

  const snapshot: VisibilitySnapshot = {
    schemaVersion: SCHEMA_VERSION,
    capturedAt: ctx.capturedAt,
    isoWeek: ctx.isoWeek,
    app: ctx.app,
    engine,
    intentId: call.intentId,
    metricRole: call.metricRole,
    paraphraseId: call.paraphraseId,
    query: call.query,
    rep: call.rep,
    locale: call.locale,
    mentioned,
    competitorsMentioned,
    citedUrls,
    sentiment: classified.sentiment,
    accuracyFlags: classified.accuracyFlags,
    position: null, // TODO: 답변 내 브랜드 등장 순번/추천 리스트 순위
    rawSnippet: excerpt(answer, service.brand.aliases),
  }

  // 원문 레코드 — visibility 행과 (paraphraseId + engine + rep) 로 조인. 어드민 상세/재계산용.
  // 엔진이 보고한 사용량을 평탄화해 담고, 콜당 비용(USD)을 계산.
  const usage = result.usage ?? {}
  const response: ResponseRecord = {
    schemaVersion: SCHEMA_VERSION,
    capturedAt: ctx.capturedAt,
    isoWeek: ctx.isoWeek,
    app: ctx.app,
    engine,
    intentId: call.intentId,
    paraphraseId: call.paraphraseId,
    rep: call.rep,
    query: call.query,
    answer,
    citedUrls,
    model: usage.model,
    inputTokens: usage.inputTokens,
    outputTokens: usage.outputTokens,
    webSearches: usage.webSearches,
    serpCredits: usage.serpCredits,
    costUsd: computeCostUsd(usage),
  }

  return { snapshot, response, classifier: classified.usage }
}

// 브랜드 첫 등장 주변(또는 앞부분) 발췌 — 스냅샷 경량화용(rawSnippet).
// 어떤 별칭(코드잇/Codeit 등)으로 등장하든 잡도록 brand.aliases 전체를 탐색.
const excerpt = (answer: string, aliases: string[], max = 400): string => {
  if (answer.length <= max) return answer
  const positions = aliases.map((a) => answer.indexOf(a)).filter((i) => i >= 0)
  if (positions.length === 0) return answer.slice(0, max)
  const start = Math.max(0, Math.min(...positions) - 120)
  return answer.slice(start, start + max)
}
