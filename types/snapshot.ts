// ★ 엔진 레포 ↔ 대시보드(apps/geo-admin) 공유 계약. 변경 시 SCHEMA_VERSION 올림.
// 패키지/서브모듈로 양쪽이 같은 파일을 import 한다.

export const SCHEMA_VERSION = 1

export type App = 'sprint' | 'cayde' | 'ascent' | '10x'
export type Engine =
  | 'chatgpt'
  | 'claude'
  | 'gemini'
  | 'perplexity' // 웹검색 LLM
  | 'google-aio'
  | 'naver-briefing' // SerpApi SERP 표면
export type MetricRole = 'visibility' | 'reputation' | 'accuracy'
export type Sentiment = 'positive' | 'neutral' | 'negative'

export interface VisibilitySnapshot {
  schemaVersion: number
  capturedAt: string // ISO. CI의 CAPTURED_AT 주입(런타임 argless new Date 금지)
  isoWeek: string // '2026-W25'
  app: App
  engine: Engine
  intentId: string
  metricRole: MetricRole // 헤드라인 인용률/SoV 는 'visibility' 만
  paraphraseId: string // rep 제외 안정 ID(추이 비교)
  query: string
  rep: number
  locale: string // 'ko-KR'
  mentioned: boolean
  competitorsMentioned: string[] // canonical 명 — SoV 용
  citedUrls: string[] // 실도메인 기준
  sentiment: Sentiment | null
  position: number | null
  accuracyFlags: string[] // 'wrong-price' 등
  rawSnippet: string
}

// 풀 응답 원문 — 어드민 상세 뷰·재계산용(점수 로직 변경 시 재질의 없이 재집계).
// 헤드라인 메트릭(visibility.json)은 가볍게 유지하고 원문은 별도 responses.json 에 분리 저장한다.
// visibility 행과는 (paraphraseId + engine + rep) 조인 키로 1:1 대응.
export interface ResponseRecord {
  schemaVersion: number
  capturedAt: string
  isoWeek: string
  app: App
  engine: Engine
  intentId: string
  paraphraseId: string // rep 제외 안정 ID
  rep: number
  query: string
  answer: string // 모델/AI 표면 답변 전문(rawSnippet 의 무손실 원본)
  citedUrls: string[]
  // API 사용량·비용(엔진이 보고한 경우). 어드민 상세에서 콜당 비용 표시용.
  model?: string
  inputTokens?: number
  outputTokens?: number
  webSearches?: number
  serpCredits?: number
  costUsd?: number
}

// 주차·서비스 단위 비용 집계(snapshots/<app>/<isoWeek>/cost.json). 헤드라인 "이번 주 측정비".
export interface UsageCost {
  calls: number
  inputTokens: number
  outputTokens: number
  webSearches: number
  serpCredits: number
  costUsd: number
}

export interface CostSnapshot {
  schemaVersion: number
  capturedAt: string
  isoWeek: string
  app: App
  byEngine: Record<string, UsageCost> // 엔진 키 + 'classifier'(감성·정확도 판정 비용)
  total: UsageCost
}

export interface ReferralSnapshot {
  schemaVersion: number
  capturedAt: string
  isoWeek: string
  app: App
  engine: Engine
  sessions: number
  conversions: number
  conversionRate: number
}

export interface GeoScoreSnapshot {
  schemaVersion: number
  capturedAt: string
  isoWeek: string
  app: App
  composite: number
  citability: number
  brand: number
  eeat: number
  technical: number
  schema: number
  platform: number
}

export interface OwnedSurfaceSnapshot {
  schemaVersion: number
  capturedAt: string
  isoWeek: string
  app: App
  surface: 'google-aio' | 'bing'
  impressions: number
  clicks: number
}

export interface SnapshotBundle {
  visibility: VisibilitySnapshot[]
  responses: ResponseRecord[] // 풀 응답 원문(visibility 행과 조인 키로 1:1)
  cost: CostSnapshot // API 사용량 기반 비용 집계
  referral: ReferralSnapshot[]
  geoScore: GeoScoreSnapshot[]
  owned: OwnedSurfaceSnapshot[]
}
