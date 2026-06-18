// 주어진 ISO 문자열에서 ISO week 라벨('2026-W25') 산출. 인자가 명시적이라 결정적.
// (argless new Date() 만 금지 — 입력값 기반 변환은 재현 가능하므로 허용)
export const isoWeekOf = (iso: string): string => {
  const d = new Date(iso)
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
  const day = date.getUTCDay() || 7
  date.setUTCDate(date.getUTCDate() + 4 - day) // 목요일 기준
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86_400_000 + 1) / 7)
  return `${date.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}
