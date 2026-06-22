import { describe, it, expect } from 'vitest'
import { isoWeekOf } from '../src/util/time'

describe('isoWeekOf', () => {
  it('ISO week 라벨 산출', () => {
    expect(isoWeekOf('2026-06-22T00:00:00Z')).toBe('2026-W26')
  })

  it('연 경계 — 2026-01-01(목)은 W01', () => {
    expect(isoWeekOf('2026-01-01T00:00:00Z')).toBe('2026-W01')
  })

  it('연 롤오버 — 2025-12-29(월)은 2026-W01(ISO)', () => {
    expect(isoWeekOf('2025-12-29T00:00:00Z')).toBe('2026-W01')
  })
})
