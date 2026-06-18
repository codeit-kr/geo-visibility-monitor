// 모든 엔진 어댑터의 공통 반환형. 어댑터가 엔진별 응답을 이걸로 정규화하면
// citationMonitor 는 엔진을 몰라도 동일하게 처리한다.

// 엔진별 응답에서 추출한 정규화 사용량(비용 계산용). 엔진마다 채울 수 있는 필드가 다르다.
export interface EngineUsage {
  model?: string // 실제 사용 모델 ID(pricing 조회 키). SerpApi 는 미설정.
  inputTokens?: number
  outputTokens?: number
  webSearches?: number // 웹검색/grounding 호출 수
  serpCredits?: number // SerpApi 크레딧(검색 1콜=1, AIO page_token 2차호출 시 2)
}

export interface EngineResult {
  answer: string // 모델/AI 표면의 답변 본문
  citedUrls: string[] // 인용된 출처 URL(실도메인 기준, gemini 는 리다이렉트 해소 필요)
  usage?: EngineUsage // API 사용량(비용 산정). 미보고 시 비용 0.
  raw?: unknown // 원본 응답(재파싱·디버깅용, 스냅샷엔 저장 안 함)
}

export interface EngineCallOptions {
  locale: string // 'ko-KR'
  userCountry: string // 'KR' — 엔진별 user_location 에 주입
  model?: string // 미지정 시 어댑터 기본값
}

export type EngineAdapter = (query: string, opts: EngineCallOptions) => Promise<EngineResult>
