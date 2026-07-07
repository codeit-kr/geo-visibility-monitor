import { describe, it, expect } from 'vitest'
import {
  computeTrend,
  extractAuditIssues,
  normalizeAuditChanges,
  ruleBasedActionItems,
  sanitizeDigest,
} from '../src/scripts/weeklyDigest'
import type { WeekSummary } from '../types/snapshot'

const week = (o: Partial<WeekSummary>): WeekSummary => ({
  isoWeek: '2026-W28',
  mentionRate: 0.4,
  sov: 0.15,
  competitorSov: {},
  sentiment: { positive: 10, neutral: 2, negative: 0 },
  accuracyFlags: {},
  byEngine: {},
  byEngineCostUsd: {},
  sampleSize: 100,
  costUsd: 50,
  geoScore: 80,
  geoScoreRange: [79, 80],
  ...o,
})

describe('computeTrend', () => {
  it('전 회차와의 차이를 계산한다(엔진은 양쪽 다 있는 것만)', () => {
    const prev = week({
      isoWeek: '2026-W26',
      mentionRate: 0.34,
      sov: 0.21,
      geoScore: 74,
      byEngine: { chatgpt: 0.32, 'naver-briefing': 0.47 },
    })
    const cur = week({ byEngine: { chatgpt: 0.53, gemini: 0.32 } })
    const t = computeTrend(cur, prev)
    expect(t.prevWeek).toBe('2026-W26')
    expect(t.mentionRateDelta).toBeCloseTo(0.06)
    expect(t.sovDelta).toBeCloseTo(-0.06)
    expect(t.geoScoreDelta).toBe(6)
    expect(t.engineDeltas.chatgpt).toBeCloseTo(0.21)
    expect(t.engineDeltas.gemini).toBeUndefined() // 전 회차 미측정 엔진은 비교 불가
  })

  it('첫 회차(prev 없음)면 모두 null', () => {
    const t = computeTrend(week({}), undefined)
    expect(t.prevWeek).toBeNull()
    expect(t.mentionRateDelta).toBeNull()
    expect(t.sovDelta).toBeNull()
    expect(t.geoScoreDelta).toBeNull()
    expect(t.engineDeltas).toEqual({})
  })

  it('geoScore 미측정 주차(null)는 delta null', () => {
    const t = computeTrend(week({ geoScore: null }), week({ isoWeek: '2026-W26' }))
    expect(t.geoScoreDelta).toBeNull()
  })
})

describe('ruleBasedActionItems', () => {
  it('오정보 플래그 → 프로덕트, 인용률·SoV 하락·부정 감성 → 마케팅', () => {
    const prev = week({ isoWeek: '2026-W26', mentionRate: 0.5, sov: 0.25, geoScore: 84, byEngine: { chatgpt: 0.6 } })
    const cur = week({
      accuracyFlags: { 'wrong-price': 2 },
      sentiment: { positive: 5, neutral: 1, negative: 3 },
      byEngine: { chatgpt: 0.4 },
    })
    const { product, marketing } = ruleBasedActionItems(cur, computeTrend(cur, prev))
    expect(product.some((s) => s.includes('오정보 2건') && s.includes('wrong-price'))).toBe(true)
    expect(product.some((s) => s.includes('GEO Score -4pt'))).toBe(true)
    expect(marketing.some((s) => s.includes('인용률') && s.includes('chatgpt'))).toBe(true)
    expect(marketing.some((s) => s.includes('SoV'))).toBe(true)
    expect(marketing.length).toBeLessThanOrEqual(3) // 부정 감성까지 4개 신호 → 상한 3
  })

  it('신호 없으면 팀별 기본 문구 1개씩', () => {
    const { product, marketing } = ruleBasedActionItems(week({}), computeTrend(week({}), undefined))
    expect(product).toHaveLength(1)
    expect(marketing).toHaveLength(1)
    expect(product[0]).toContain('신규 위험 신호 없음')
  })
})

describe('sanitizeDigest', () => {
  const expect28 = { app: 'sprint', isoWeek: '2026-W28' }
  const valid = {
    app: 'sprint',
    isoWeek: '2026-W28',
    actions: { product: ['p1'], marketing: ['m1', 'm2'], source: 'llm' },
    geoAuditChanges: { improved: ['i1'], regressed: [], stillOpen: ['s1'] },
  }

  it('유효한 action 산출은 정규화해 통과(source 는 항상 llm)', () => {
    const d = sanitizeDigest(valid, expect28)
    expect(d?.actions).toEqual({ product: ['p1'], marketing: ['m1', 'm2'], source: 'llm' })
    expect(d?.geoAuditChanges).toEqual(valid.geoAuditChanges)
  })

  it('대상 주차/앱 불일치·액션 결손이면 null(→ 규칙 기반 폴백)', () => {
    expect(sanitizeDigest(valid, { app: 'sprint', isoWeek: '2026-W30' })).toBeNull() // 지난 주차 산출 재사용 방지
    expect(sanitizeDigest({ ...valid, app: 'cayde' }, expect28)).toBeNull()
    expect(sanitizeDigest({ ...valid, actions: { product: [], marketing: ['m'] } }, expect28)).toBeNull()
    expect(sanitizeDigest(null, expect28)).toBeNull()
  })

  it('액션은 3개로 잘리고 비문자열은 걸러짐', () => {
    const d = sanitizeDigest(
      { ...valid, actions: { product: ['a', 'b', 'c', 'd'], marketing: ['m', 42, ''] } },
      expect28,
    )
    expect(d?.actions.product).toEqual(['a', 'b', 'c'])
    expect(d?.actions.marketing).toEqual(['m'])
  })
})

describe('normalizeAuditChanges', () => {
  it('문자열 리스트만 수용, 리스트별 최대 5개', () => {
    const c = normalizeAuditChanges({
      improved: ['a', '', 3, 'b', 'c', 'd', 'e', 'f'],
      regressed: 'not-array',
      stillOpen: ['x'],
    })
    expect(c).toEqual({ improved: ['a', 'b', 'c', 'd', 'e'], regressed: [], stillOpen: ['x'] })
  })

  it('전부 비었거나 객체가 아니면 undefined', () => {
    expect(normalizeAuditChanges({ improved: [], regressed: [], stillOpen: [] })).toBeUndefined()
    expect(normalizeAuditChanges(null)).toBeUndefined()
    expect(normalizeAuditChanges('x')).toBeUndefined()
  })
})

describe('extractAuditIssues', () => {
  const md = `# Report

## Executive Summary
요약.

## Critical Issues (Fix Immediately)
없음.

## High Priority Issues
1. 위키백과 부재
2. Wikidata 아이템 부재
3. 전용 엔티티 부재

## Category Detail
생략

## 30-Day Action Plan
- [ ] speakable 추가
- [ ] SearchAction 추가
`
  it('이슈·액션플랜 섹션만 발췌한다(여러 줄 본문 전체)', () => {
    const out = extractAuditIssues(md)
    expect(out).toContain('## Critical Issues')
    expect(out).toContain('위키백과 부재')
    expect(out).toContain('전용 엔티티 부재') // 섹션 첫 줄만 잡히는 회귀 방지
    expect(out).toContain('speakable 추가')
    expect(out).toContain('SearchAction 추가') // 문서 끝 섹션도 끝까지
    expect(out).not.toContain('Executive Summary')
    expect(out).not.toContain('Category Detail')
  })

  it('maxChars 로 자른다', () => {
    expect(extractAuditIssues(md, 20)).toHaveLength(20)
  })

  it('구형 한글 헤딩 리포트는 우선 조치 섹션을 발췌한다', () => {
    const legacy = `# GEO 감사 리포트\n\n## 종합 점수\n74\n\n## 우선 조치 (점수 영향 큰 순)\n1. Wikidata 아이템 생성\n2. sameAs 보강\n\n## 부록: 기술 신호 원자료\n생략\n`
    const out = extractAuditIssues(legacy)
    expect(out).toContain('Wikidata 아이템 생성')
    expect(out).toContain('sameAs 보강')
    expect(out).not.toContain('부록')
  })
})
