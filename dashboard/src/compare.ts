// 전 회차 비교 — 두 주차의 per-call visibility 스냅샷을 질의(엔진×패러프레이즈) 단위로 접어
// 언급 전이(신규/상실/유지/계속 미언급)를 계산한다. 헤드라인과 동일하게 visibility 풀만 본다.
import type { Engine, Sentiment, VisibilitySnapshot } from '../../types/snapshot'

export type ChangeStatus = 'new' | 'lost' | 'kept' | 'none'

export interface QueryChange {
  engine: Engine
  intentId: string
  paraphraseId: string
  query: string
  prevRate: number // 언급률(rep 평균) 0..1
  curRate: number
  status: ChangeStatus
  curSentiment: Sentiment | null // 이번 회차 언급 행의 대표(최빈) 감성
}

export interface CompareResult {
  changes: QueryChange[] // 공통 측정 엔진의 질의별 전이 — 상실 → 신규 → 유지(변화 큰 순) 정렬, 계속 미언급 뒤
  counts: Record<ChangeStatus, number>
  newEngines: Engine[] // 이번 회차에 새로 측정된 엔진(전이 비교 대상 아님)
  droppedEngines: Engine[] // 전 회차엔 있었지만 이번 회차 미측정 엔진
}

interface Group {
  rows: number
  mentioned: number
  query: string
  intentId: string
  sentiments: Partial<Record<Sentiment, number>>
}

const fold = (snapshots: VisibilitySnapshot[]): Map<string, Group> => {
  const groups = new Map<string, Group>()
  for (const s of snapshots) {
    if (s.metricRole !== 'visibility') continue
    const key = `${s.engine}|${s.paraphraseId}`
    const g = groups.get(key) ?? { rows: 0, mentioned: 0, query: s.query, intentId: s.intentId, sentiments: {} }
    g.rows += 1
    if (s.mentioned) {
      g.mentioned += 1
      if (s.sentiment) g.sentiments[s.sentiment] = (g.sentiments[s.sentiment] ?? 0) + 1
    }
    groups.set(key, g)
  }
  return groups
}

const enginesOf = (groups: Map<string, Group>): Set<Engine> =>
  new Set([...groups.keys()].map((k) => k.split('|')[0] as Engine))

const topSentiment = (g: Group): Sentiment | null => {
  const entries = Object.entries(g.sentiments) as [Sentiment, number][]
  return entries.sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
}

const STATUS_ORDER: Record<ChangeStatus, number> = { lost: 0, new: 1, kept: 2, none: 3 }

export const compareWeeks = (prev: VisibilitySnapshot[], cur: VisibilitySnapshot[]): CompareResult => {
  const prevGroups = fold(prev)
  const curGroups = fold(cur)
  const prevEngines = enginesOf(prevGroups)
  const curEngines = enginesOf(curGroups)
  const common = new Set([...curEngines].filter((e) => prevEngines.has(e)))

  const changes: QueryChange[] = []
  const keys = new Set([...prevGroups.keys(), ...curGroups.keys()])
  for (const key of keys) {
    const engine = key.split('|')[0] as Engine
    if (!common.has(engine)) continue // 한쪽만 측정된 엔진은 전이 판단 불가
    const p = prevGroups.get(key)
    const c = curGroups.get(key)
    const prevRate = p ? p.mentioned / p.rows : 0
    const curRate = c ? c.mentioned / c.rows : 0
    const status: ChangeStatus =
      prevRate > 0 && curRate === 0 ? 'lost' : prevRate === 0 && curRate > 0 ? 'new' : curRate > 0 ? 'kept' : 'none'
    const src = c ?? p // query 텍스트는 이번 회차 우선(패러프레이즈 ID 는 안정)
    changes.push({
      engine,
      intentId: src?.intentId ?? '',
      paraphraseId: key.split('|')[1],
      query: src?.query ?? '',
      prevRate,
      curRate,
      status,
      curSentiment: c ? topSentiment(c) : null,
    })
  }
  changes.sort(
    (a, b) =>
      STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
      Math.abs(b.curRate - b.prevRate) - Math.abs(a.curRate - a.prevRate),
  )

  const counts: CompareResult['counts'] = { new: 0, lost: 0, kept: 0, none: 0 }
  for (const ch of changes) counts[ch.status] += 1
  return {
    changes,
    counts,
    newEngines: [...curEngines].filter((e) => !prevEngines.has(e)),
    droppedEngines: [...prevEngines].filter((e) => !curEngines.has(e)),
  }
}
