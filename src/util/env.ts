// 필수 환경변수 조회 — 누락 시 즉시 throw (GitHub Secrets 미설정 조기 검출).
export const requireEnv = (key: string): string => {
  const value = process.env[key]
  if (!value) throw new Error(`환경변수 ${key} 누락 — GitHub Secrets/.env 확인`)
  return value
}
