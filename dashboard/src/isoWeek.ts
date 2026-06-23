// ISO 주차 유틸. UTC 계산으로 TZ 흔들림 방지.

// '2026-W26' → 해당 주 월요일 Date(UTC). 파싱 실패 시 null.
export const isoWeekStart = (isoWeek: string): Date | null => {
  const m = /^(\d{4})-W(\d{2})$/.exec(isoWeek)
  if (!m) return null
  const year = Number(m[1])
  const week = Number(m[2])
  // ISO 1주차는 1월 4일이 속한 주. 그 주 월요일 기준 (week-1)*7 더한다.
  const jan4 = new Date(Date.UTC(year, 0, 4))
  const jan4Mon = (jan4.getUTCDay() + 6) % 7 // 0=월
  const monday = new Date(jan4)
  monday.setUTCDate(jan4.getUTCDate() - jan4Mon + (week - 1) * 7)
  return monday
}

// '2026-W26' → 시작 월요일부터 weeks 주 범위(기본 1주). 예: weeks=2 → '6.22–7.5'.
export const isoWeekRange = (isoWeek: string, weeks = 1): string | null => {
  const monday = isoWeekStart(isoWeek)
  if (!monday) return null
  const end = new Date(monday)
  end.setUTCDate(monday.getUTCDate() + weeks * 7 - 1)
  const fmt = (d: Date) => `${d.getUTCMonth() + 1}.${d.getUTCDate()}`
  return `${fmt(monday)}–${fmt(end)}`
}

// 측정 주기(격주 = 2주). 측정 라벨의 날짜범위는 한 측정이 대표하는 기간이므로 2주로 표기.
export const MEASURE_WEEKS = 2
export const measureRange = (isoWeek: string): string | null => isoWeekRange(isoWeek, MEASURE_WEEKS)

// 임의 날짜 → 그 날이 속한 ISO 주차 '2026-W26'(주의 목요일 기준 연도).
export const isoWeekOf = (date: Date): string => {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const dayNum = (d.getUTCDay() + 6) % 7 // 0=월
  d.setUTCDate(d.getUTCDate() - dayNum + 3) // 그 주 목요일
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4))
  const ftDayNum = (firstThursday.getUTCDay() + 6) % 7
  firstThursday.setUTCDate(firstThursday.getUTCDate() - ftDayNum + 3)
  const week = 1 + Math.round((d.getTime() - firstThursday.getTime()) / (7 * 86400000))
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`
}
