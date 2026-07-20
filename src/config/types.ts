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
  paraphrases: string[] // {role}/{competitor} 토큰 포함 가능 — 챗봇(문장형)용
  // SERP(Google AIO·Naver) 표면용 키워드 질의. 검색창엔 문장이 아니라 키워드를 치므로 분리한다.
  // {role}/{competitor} 토큰 사용 가능(promptBuilder 가 전개). 미지정 시 seed 문장으로 폴백.
  // visibility 의도에서만 의미 있음(SERP 는 visibility seed 만 호출).
  serpQuery?: string
  reps?: number // 패러프레이즈당 반복(기본 1)
  expand?: { roles?: boolean; competitors?: boolean } // placeholder 전개 지시
  groundTruth?: Record<string, unknown>
}

// 동적 감사셋 소스 — sitemap 에서 "결정적 규칙"으로 감사 URL 을 뽑는다(랜덤샘플 금지 원칙 유지).
// 대형 섹션(예: codeit /tutorials 647개)은 템플릿 페이지라 대표 N개면 실질 커버리지 동일 → sections 로 샘플.
export interface AuditUrlSection {
  prefix: string // pathname 접두사(예: '/tutorials') — 세그먼트 경계 기준 매칭
  pick: number | 'all' // 'all' = 전체, N = URL 오름차순 앞에서 N개(결정적 대표)
}
export interface AuditUrlSource {
  sitemaps: string[] // 읽을 sitemap URL 들(정적 + server-sitemap 등)
  // 제외 규칙: '/signin' = 정확히 그 경로만, '/teams/blog/*' = 그 경로와 하위 전체.
  exclude?: string[]
  sections?: AuditUrlSection[] // 미매칭 URL 은 전체 포함(exclude 통과분)
}

// 한 서비스의 측정 설정 전부 — 브랜드·경쟁사·질의셋·직무축·로케일을 묶는다.
// 새 서비스 추가 = 이 객체 하나를 만들어 레지스트리(config/services/index.ts)에 등록.
export interface ServiceConfig {
  app: App // 'sprint' | 'cayde' | ... — 스냅샷/저장경로 차원
  displayName: string // 어드민 표시명
  // 주간 측정 완료 후 알림 보낼 Slack 채널 ID(예: sprint → #bu-sprint). 봇(SLACK_BOT_TOKEN)을 채널에 초대해둘 것.
  slackChannelId?: string
  siteUrl: string // GEO 감사(geo-audit) 대상 사이트 루트
  // passive 서비스 = 챗봇/SERP 측정 없이 passive check(geo-audit + 페이지 메타)만 수행.
  //   주간 런은 pages.json 만 기록하고 visibility/responses/cost 를 만들지 않는다(다이제스트·Slack 도 스킵).
  //   intents/competitors/jobRoles 는 빈 배열로 둔다.
  passive?: boolean
  // geo-audit 재현성: 매 실행 동일 페이지만 감사(sitemap 랜덤샘플 금지).
  auditUrls: string[]
  // 선택 — sitemap 동적 소싱. 최종 감사셋 = auditUrls(고정 코어, 순서 유지) ∪ 규칙 적용된 sitemap URL(오름차순).
  //   sitemap fetch 실패 시 auditUrls 만으로 폴백(런 전체를 죽이지 않음 — 로그로 표시).
  auditUrlSource?: AuditUrlSource
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
