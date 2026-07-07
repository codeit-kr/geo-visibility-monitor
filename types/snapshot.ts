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

// 그룹 C — 선행지표 GEO 점수. 에이전트형 geo-audit 스킬을 GitHub Action 이 주차당 N회(기본 3) 실행 →
//   각 카테고리/composite 는 N회 평균(LLM 채점 변동을 통계로 흡수). 원시 N회는 geoScoreRuns.json.
//   snapshots/<app>/<isoWeek>/geoScore.json (단일 객체). node 스냅샷 번들과 분리(덮어쓰기 방지).
export interface GeoScoreSnapshot {
  schemaVersion: number
  capturedAt: string
  isoWeek: string
  app: App
  composite: number // N회 평균(반올림)
  citability: number
  brand: number
  eeat: number
  technical: number
  schema: number
  platform: number
  runs?: number // 집계에 쓴 측정 횟수
  compositeRange?: [number, number] // composite 의 [최소, 최대] — 변동폭
}

// geoScoreRuns.json 의 행 — geo-audit run 회차별 원시 카테고리 점수(aggregateGeoAudit 산출).
//   대시보드가 카테고리 증감의 측정 변동폭(노이즈 범위) 판정에 사용.
export type GeoScoreRunRow = { run: number } & Partial<
  Record<'composite' | 'citability' | 'brand' | 'eeat' | 'technical' | 'schema' | 'platform', number | null>
>

// 주차 다이제스트 — 전 회차 대비 변화 기반 팀별 액션 아이템(snapshots/<app>/<isoWeek>/digest.json).
//   엔진 파이프라인(geo-audit aggregate)이 생성·커밋(LLM 요약, 실패 시 규칙 기반) — 대시보드는 읽기만.
export interface WeekDigest {
  schemaVersion: number
  capturedAt: string
  isoWeek: string
  app: App
  prevWeek: string | null // 비교 기준 회차(격주 운영이라 직전 "주"가 아닐 수 있음)
  actions: {
    product: string[] // 프로덕트 팀(사이트 콘텐츠·구조화 데이터·기술 GEO·팩트 정확성)
    marketing: string[] // 마케팅 팀(브랜드 권위·외부 채널·경쟁 대응·평판)
    source: 'llm' | 'rules' // LLM 요약 vs 규칙 기반 폴백
  }
  // 감사 이슈 변화(전 회차 리포트 대비) — LLM 요약일 때만 존재(리포트가 자유 서술이라 기계 diff 불가).
  geoAuditChanges?: {
    improved: string[] // 해소·개선된 신호
    regressed: string[] // 악화·신규 발생 이슈
    stillOpen: string[] // 여전히 남은 이슈
  }
}

// node 스냅샷 번들 = 그룹 A 산출물. geoScore(C)는 별도 GitHub Action 이 기록, B/D 는 드롭.
export interface SnapshotBundle {
  visibility: VisibilitySnapshot[]
  responses: ResponseRecord[] // 풀 응답 원문(visibility 행과 조인 키로 1:1)
  cost: CostSnapshot // API 사용량 기반 비용 집계
}

// ── 롤업 인덱스 계약(대시보드 apps/geo-admin 이 GitHub API 로 읽는 단일 진입점) ──────────
// buildRollupIndex 가 이 타입들로 snapshots/<app>/index.json·snapshots/services.json 을 생성한다.
// 이 파일이 단일 출처(SSOT) — 대시보드는 이 타입을 복사하고 "sync with geo-visibility-monitor" 주석을 단다.

export interface WeekSummary {
  isoWeek: string
  mentionRate: number | null // visibility 풀 언급률
  sov: number | null // 무브랜드 평균 per-call SoV(브랜드)
  competitorSov: Record<string, number> // 경쟁사 canonical → 경쟁 풀 내 점유(브랜드+경쟁사 언급 합 기준)
  sentiment: { positive: number; neutral: number; negative: number } // 감성 분해(언급 건)
  accuracyFlags: Record<string, number> // 'wrong-price' → 횟수
  byEngine: Partial<Record<Engine, number | null>> // 엔진별 언급률(visibility)
  byEngineCostUsd: Partial<Record<Engine, number>> // 엔진별 비용(cost.json byEngine)
  sampleSize: number // visibility 표본 수
  costUsd: number | null // 주 측정 총비용(cost.json total)
  geoScore?: number | null // 그룹 C composite N회 평균(geoScore.json). 감사 미실행 주차는 null
  geoScoreRange?: [number, number] | null // composite 변동폭[min,max]
}

export interface RollupIndex {
  schemaVersion: number
  app: App
  displayName: string
  weeks: WeekSummary[]
}

export interface ServiceManifestEntry {
  app: App
  displayName: string
  weeks: number // 보유 주차 수(0 = 아직 측정 없음)
  latestWeek: string | null
}

export interface ServicesManifest {
  schemaVersion: number
  services: ServiceManifestEntry[]
}
