import { describe, it, expect } from 'vitest'
import { summarizeWeek } from '../src/store/buildRollupIndex'
import type { VisibilitySnapshot } from '../types/snapshot'

const row = (o: Partial<VisibilitySnapshot>): VisibilitySnapshot => ({
  schemaVersion: 1,
  capturedAt: '',
  isoWeek: '2026-W26',
  app: 'sprint',
  engine: 'chatgpt',
  intentId: 'i',
  metricRole: 'visibility',
  paraphraseId: 'p',
  query: 'q',
  rep: 1,
  locale: 'ko-KR',
  mentioned: false,
  competitorsMentioned: [],
  citedUrls: [],
  sentiment: null,
  position: null,
  accuracyFlags: [],
  rawSnippet: '',
  ...o,
})

describe('summarizeWeek', () => {
  it('mentionRate·SoV·competitorSov 를 visibility 풀에서 집계', () => {
    const rows = [
      row({ mentioned: true, competitorsMentioned: ['A'] }), // per-call SoV 1/2
      row({ mentioned: false, competitorsMentioned: ['A', 'B'] }), // per-call SoV 0/2
    ]
    const w = summarizeWeek('2026-W26', rows, null)
    expect(w.mentionRate).toBeCloseTo(0.5)
    expect(w.sov).toBeCloseTo((0.5 + 0) / 2)
    expect(w.sampleSize).toBe(2)
    // 경쟁 풀 = 브랜드 언급(1) + 경쟁사 언급(A=2,B=1)=4 → A 점유 2/4
    expect(w.competitorSov['A']).toBeCloseTo(0.5)
  })

  it('감성·정확도 플래그는 전 행 기준 집계', () => {
    const rows = [
      row({ sentiment: 'positive' }),
      row({ metricRole: 'accuracy', accuracyFlags: ['wrong-price'] }),
    ]
    const w = summarizeWeek('2026-W26', rows, null)
    expect(w.sentiment.positive).toBe(1)
    expect(w.accuracyFlags['wrong-price']).toBe(1)
  })

  it('engineModels — 엔진별 최빈 모델, model 미보고(SERP)는 제외, responses 없으면 필드 생략', () => {
    const responses = [
      { engine: 'chatgpt' as const, model: 'gpt-5.5' },
      { engine: 'chatgpt' as const, model: 'gpt-5.5' },
      { engine: 'chatgpt' as const, model: 'gpt-6' }, // 소수파 — 최빈값에 밀림
      { engine: 'gemini' as const, model: 'gemini-3.5-flash' },
      { engine: 'google-aio' as const, model: undefined }, // SERP — 모델 없음
    ]
    const w = summarizeWeek('2026-W26', [], null, null, responses)
    expect(w.engineModels).toEqual({ chatgpt: 'gpt-5.5', gemini: 'gemini-3.5-flash' })

    const empty = summarizeWeek('2026-W26', [], null)
    expect(empty.engineModels).toBeUndefined()
  })
})
