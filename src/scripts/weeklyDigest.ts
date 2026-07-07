// 주차 다이제스트 로직 — 전 회차 대비 추세 + 프로덕트/마케팅 팀 액션 아이템.
//   LLM 요약은 Claude 구독(claude-code-action)이 담당: digestTargets 가 만든 digest-targets.json 을 보고
//   action 이 digest.json 을 직접 쓴다. 여기는 그 입력(지표)·검증(sanitize)·규칙 기반 폴백의 순수 함수만.
import type { Engine, WeekSummary } from '../../types/snapshot'

// ── 추세(전 회차 대비) ─────────────────────────────────────────────────────

export interface WeekTrend {
  prevWeek: string | null // 비교 기준 회차(격주 운영이라 "전 주"가 아닐 수 있음 — 라벨에 명시)
  mentionRateDelta: number | null // 비율 차(0.064 = +6.4%p)
  sovDelta: number | null
  geoScoreDelta: number | null // 점수 차(pt)
  engineDeltas: Partial<Record<Engine, number>> // 엔진별 언급률 변화(양쪽 다 측정된 엔진만)
}

const diff = (cur: number | null | undefined, prev: number | null | undefined): number | null =>
  cur == null || prev == null ? null : cur - prev

export const computeTrend = (cur: WeekSummary, prev: WeekSummary | undefined): WeekTrend => {
  const engineDeltas: WeekTrend['engineDeltas'] = {}
  if (prev) {
    for (const [engine, rate] of Object.entries(cur.byEngine)) {
      const d = diff(rate, prev.byEngine[engine as Engine])
      if (d != null) engineDeltas[engine as Engine] = d
    }
  }
  return {
    prevWeek: prev?.isoWeek ?? null,
    mentionRateDelta: diff(cur.mentionRate, prev?.mentionRate),
    sovDelta: diff(cur.sov, prev?.sov),
    geoScoreDelta: diff(cur.geoScore, prev?.geoScore),
    engineDeltas,
  }
}

// ── 팀별 액션 아이템 ──────────────────────────────────────────────────────

export interface ActionItems {
  product: string[] // 프로덕트 팀(사이트·콘텐츠·스키마·기술)
  marketing: string[] // 마케팅 팀(브랜드 권위·외부 채널·경쟁 대응)
  source: 'llm' | 'rules'
}

const MAX_ITEMS = 3
const MAX_AUDIT_ITEMS = 5
const pp = (v: number) => `${(v * 100).toFixed(1)}%p`

// 규칙 기반 폴백 — 주차 지표의 명확한 신호만 기계적으로 액션화(LLM 불가 시에도 항상 동작).
export const ruleBasedActionItems = (cur: WeekSummary, trend: WeekTrend): Omit<ActionItems, 'source'> => {
  const product: string[] = []
  const marketing: string[] = []

  // 프로덕트: 오정보 플래그 → 사이트의 팩트 노출 보강이 1순위 대응
  const flagEntries = Object.entries(cur.accuracyFlags)
  if (flagEntries.length > 0) {
    const total = flagEntries.reduce((s, [, n]) => s + n, 0)
    product.push(
      `AI 답변 오정보 ${total}건(${flagEntries.map(([f]) => f).join(', ')}) — 응답 원문 확인 후 해당 페이지의 팩트(가격·취업률 등) 노출 보강`,
    )
  }
  // 프로덕트: GEO Score 하락 → 감사 리포트의 이슈 우선 조치
  if (trend.geoScoreDelta != null && trend.geoScoreDelta <= -3)
    product.push(`GEO Score ${Math.round(trend.geoScoreDelta)}pt 하락 — geo-audit 리포트의 High Priority 이슈 우선 조치`)

  // 마케팅: 인용률 급락 → 하락 엔진 원문 점검
  if (trend.mentionRateDelta != null && trend.mentionRateDelta <= -0.05) {
    const worst = Object.entries(trend.engineDeltas).sort(([, a], [, b]) => a - b)[0]
    marketing.push(
      `인용률 ${pp(trend.mentionRateDelta)} 하락${worst ? `(최다 하락: ${worst[0]} ${pp(worst[1])})` : ''} — 미언급 질의군 응답 원문 점검`,
    )
  }
  // 마케팅: SoV 하락 → 경쟁 점유 잠식 점검
  if (trend.sovDelta != null && trend.sovDelta <= -0.05)
    marketing.push(`SoV ${pp(trend.sovDelta)} 하락 — 경쟁사 언급이 늘어난 질의군 확인 및 비교 콘텐츠 대응 검토`)
  // 마케팅: 부정 감성 발생 → 원문 확인
  if (cur.sentiment.negative > 0)
    marketing.push(`부정 감성 ${cur.sentiment.negative}건 발생 — 응답 원문에서 부정 맥락 확인 및 대응 검토`)

  if (product.length === 0) product.push('신규 위험 신호 없음 — geo-audit 리포트의 30-Day Action Plan 항목 계속 진행')
  if (marketing.length === 0) marketing.push('신규 위험 신호 없음 — 브랜드 권위(외부 채널·엔티티) 장기 과제 계속 진행')
  return { product: product.slice(0, MAX_ITEMS), marketing: marketing.slice(0, MAX_ITEMS) }
}

// geo-audit 리포트(md)에서 LLM 프롬프트에 넣을 이슈 섹션만 발췌(전문은 너무 김).
//   신형(영문 헤딩) 우선, 없으면 구형 한글 헤딩('우선 조치' 등 — 2026-W26 이전 형식) 폴백.
export const extractAuditIssues = (md: string, maxChars = 4000): string => {
  const titles = [
    'Critical Issues',
    'High Priority Issues',
    'Medium Priority Issues',
    '30-Day Action Plan',
    '우선 조치', // 구형 리포트의 이슈 섹션
  ]
  const parts: string[] = []
  for (const title of titles) {
    // 끝 앵커는 (?![\s\S])(진짜 입력 끝) — m 플래그의 $ 는 줄 끝마다 매칭돼 첫 줄만 잡힌다.
    const m = md.match(new RegExp(`^## ${title}[^\\n]*\\n([\\s\\S]*?)(?=\\n## |(?![\\s\\S]))`, 'm'))
    if (m) parts.push(`## ${title}\n${m[1].trim()}`)
  }
  return parts.join('\n\n').slice(0, maxChars)
}

// ── LLM(claude-code-action) 입력·산출물 검증 ─────────────────────────────

export interface AuditChanges {
  improved: string[]
  regressed: string[]
  stillOpen: string[]
}

// digest-targets.json 의 metrics — action 프롬프트에 그대로 들어가는 지표 요약.
export const buildDigestMetrics = (cur: WeekSummary, prev: WeekSummary | undefined, trend: WeekTrend) => ({
  isoWeek: cur.isoWeek,
  prevWeek: trend.prevWeek,
  mentionRate: cur.mentionRate,
  mentionRateDelta: trend.mentionRateDelta,
  sov: cur.sov,
  sovDelta: trend.sovDelta,
  geoScore: cur.geoScore,
  geoScoreDelta: trend.geoScoreDelta,
  byEngine: cur.byEngine,
  engineDeltas: trend.engineDeltas,
  sentiment: cur.sentiment,
  accuracyFlags: cur.accuracyFlags,
  competitorSov: cur.competitorSov,
  prevCompetitorSov: prev?.competitorSov ?? null,
})

const normalizeItems = (v: unknown, max = MAX_ITEMS): string[] =>
  Array.isArray(v) ? v.filter((s): s is string => typeof s === 'string' && s.trim().length > 0).slice(0, max) : []

// geoAuditChanges 정규화 — 세 리스트 전부 비어 있으면 없는 것으로 취급.
export const normalizeAuditChanges = (v: unknown): AuditChanges | undefined => {
  if (typeof v !== 'object' || v == null) return undefined
  const o = v as Record<string, unknown>
  const changes: AuditChanges = {
    improved: normalizeItems(o.improved, MAX_AUDIT_ITEMS),
    regressed: normalizeItems(o.regressed, MAX_AUDIT_ITEMS),
    stillOpen: normalizeItems(o.stillOpen, MAX_AUDIT_ITEMS),
  }
  return changes.improved.length + changes.regressed.length + changes.stillOpen.length > 0 ? changes : undefined
}

export interface DigestContent {
  actions: ActionItems
  geoAuditChanges?: AuditChanges // LLM 요약일 때만(규칙 기반은 리포트 diff 불가)
}

// action 이 쓴 digest.json 검증·정규화 — 대상 주차와 다르거나 액션이 비면 null(→ 규칙 기반 폴백).
export const sanitizeDigest = (raw: unknown, expect: { app: string; isoWeek: string }): DigestContent | null => {
  if (typeof raw !== 'object' || raw == null) return null
  const o = raw as Record<string, unknown>
  if (o.app !== expect.app || o.isoWeek !== expect.isoWeek) return null
  const actions = typeof o.actions === 'object' && o.actions != null ? (o.actions as Record<string, unknown>) : {}
  const product = normalizeItems(actions.product)
  const marketing = normalizeItems(actions.marketing)
  if (product.length === 0 || marketing.length === 0) return null
  return {
    actions: { product, marketing, source: 'llm' },
    geoAuditChanges: normalizeAuditChanges(o.geoAuditChanges),
  }
}
