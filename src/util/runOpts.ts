// 실행 모드 env — PoC 안전장치(워크플로 env: 로 주입). 모듈 로드 시 1회 평가.
const flag = (v?: string): boolean => /^(1|true|yes)$/i.test(v ?? '')

// 실호출 없이 CallSpec 계획만 출력(첫 dispatch 비용 0 검증).
export const DRY_RUN = flag(process.env.DRY_RUN)

// 엔진별 콜 N개로 제한(샘플 실행). 미설정이면 전체.
export const SAMPLE_N = process.env.SAMPLE_N ? Math.max(1, Math.floor(Number(process.env.SAMPLE_N))) : null

// 누적 비용 상한(USD). 초과 시 이후 콜 스킵. 미설정이면 무제한.
export const MAX_USD = process.env.MAX_USD ? Number(process.env.MAX_USD) : null

// 콜 성공률이 이 값 미만이면 non-zero exit(빈/손상 스냅샷 커밋 방지). 기본 0.7.
export const MIN_SUCCESS_RATE = process.env.MIN_SUCCESS_RATE ? Number(process.env.MIN_SUCCESS_RATE) : 0.7
