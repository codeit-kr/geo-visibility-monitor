// 스냅샷 없을 때(초기/오류) 폴백. 실 snapshots/ 있으면 data.ts 가 대체.
import type { RollupIndex, ServicesManifest, WeekSummary } from '../../types/snapshot'

const week = (
  isoWeek: string,
  mentionRate: number,
  sov: number,
  geoScore: number | null,
  byEngine: WeekSummary['byEngine'],
): WeekSummary => ({
  isoWeek,
  mentionRate,
  sov,
  competitorSov: { 패스트캠퍼스: 0.22, 내일배움캠프: 0.18, 항해99: 0.11, 제로베이스: 0.08 },
  sentiment: { positive: 41, neutral: 33, negative: 6 },
  accuracyFlags: { 'wrong-employment-rate': 4, 'wrong-price': 2 },
  byEngine,
  byEngineCostUsd: { chatgpt: 7.9, 'google-aio': 0, 'naver-briefing': 0 },
  sampleSize: 528,
  costUsd: 8.2,
  geoScore,
  geoScoreRange: geoScore == null ? null : [geoScore - 1, geoScore + 1],
})

export const FIXTURE_ROLLUP: RollupIndex = {
  schemaVersion: 1,
  app: 'sprint',
  displayName: '코드잇 스프린트',
  weeks: [
    week('2026-W20', 0.36, 0.33, 74, { 'google-aio': 0.42, chatgpt: 0.31, 'naver-briefing': 0.3 }),
    week('2026-W21', 0.38, 0.34, 74, { 'google-aio': 0.44, chatgpt: 0.34, 'naver-briefing': 0.31 }),
    week('2026-W22', 0.4, 0.35, 78, { 'google-aio': 0.46, chatgpt: 0.36, 'naver-briefing': 0.34 }),
    week('2026-W23', 0.43, 0.38, 80, { 'google-aio': 0.49, chatgpt: 0.4, 'naver-briefing': 0.36 }),
    week('2026-W24', 0.45, 0.4, 82, { 'google-aio': 0.5, chatgpt: 0.42, 'naver-briefing': 0.38 }),
    week('2026-W25', 0.472, 0.41, 82, { 'google-aio': 0.51, chatgpt: 0.44, 'naver-briefing': 0.39 }),
  ],
}

export const FIXTURE_SERVICES: ServicesManifest = {
  schemaVersion: 1,
  services: [{ app: 'sprint', displayName: '코드잇 스프린트', weeks: 6, latestWeek: '2026-W25' }],
}
