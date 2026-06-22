// 서비스 측정 설정의 공유 타입. 서비스별 config 모듈(config/services/*)과 분석기가
// 'sprint' 데이터를 import 하지 않고 이 타입만 의존하도록 분리한다(멀티 서비스 확장의 핵심).
import type { App, MetricRole } from '../../types/snapshot'

export type { MetricRole }

export type IntentGroup = 'core' | 'recommend' | 'role' | 'comparison' | 'condition' | 'brand' | 'factual'

// 측정 대상 브랜드. domains = 인용 URL 이 자사 표면인지 판별(전 BRAND_DOMAINS).
export interface Brand {
  canonical: string
  aliases: string[]
  domains: string[]
}

// SoV·경쟁 매칭 대상. strictContext: 일반어와 겹쳐 단어경계/브랜드 맥락으로만 매칭.
export interface Competitor {
  canonical: string
  aliases: string[]
  strictContext?: boolean
}

// {role} 전개 축. codeitServes=false 면 향후 헤드라인 집계에서 제외 가능.
export interface JobRole {
  token: string
  codeitServes: boolean
}

export interface IntentPreset {
  id: string
  group: IntentGroup
  metricRole: MetricRole
  app: App
  competitorAware: boolean // SoV 경쟁사 매칭 대상 여부
  paraphrases: string[] // {role}/{competitor} 토큰 포함 가능
  reps?: number // 패러프레이즈당 반복(기본 2)
  expand?: { roles?: boolean; competitors?: boolean } // placeholder 전개 지시
  groundTruth?: Record<string, unknown>
}

// 한 서비스의 측정 설정 전부 — 브랜드·경쟁사·질의셋·직무축·로케일을 묶는다.
// 새 서비스 추가 = 이 객체 하나를 만들어 레지스트리(config/services/index.ts)에 등록.
export interface ServiceConfig {
  app: App // 'sprint' | 'cayde' | ... — 스냅샷/저장경로 차원
  displayName: string // 어드민 표시명
  siteUrl: string // GEO 감사(geo-audit) 대상 사이트 루트
  // geo-audit 재현성: 매 실행 동일 페이지만 감사(sitemap 랜덤샘플 금지).
  auditUrls: string[]
  // 점수 대상 엔티티-그라운딩 체크리스트(KR 현지화). 갱신 시 brandSourcesVersion 올림 → 점수 이동 추적.
  // (이 목록 외 발견 소스는 리포트 디스커버리로만, composite 점수 제외)
  brandSources: string[]
  brandSourcesVersion: number
  brand: Brand
  competitors: Competitor[]
  priorityCompetitors: string[] // vs 비교 전개를 상위만으로 제한(비용)
  jobRoles: JobRole[] // {role} 전개값
  intents: IntentPreset[] // 질의셋
  promptsVersion: number // 서비스별 독립 버전(질의셋 변경 시 증가 → 추이 비교 보호)
  locale: string // 'ko-KR'
  userCountry: string // 'KR' — 엔진 user_location
}
