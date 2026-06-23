'use client'

import classnames from 'classnames/bind'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { isoWeekOf, isoWeekStart, measureRange } from './isoWeek'
import styles from './DashboardHeader.module.scss'

const cx = classnames.bind(styles)

const WD = ['월', '화', '수', '목', '금', '토', '일']
const triggerLabel = (w: string) => {
  const r = measureRange(w)
  return r ? `${w} (${r})` : w
}
const addDays = (d: Date, n: number) => {
  const x = new Date(d)
  x.setUTCDate(x.getUTCDate() + n)
  return x
}

// 헤더 우측 주차 선택 — 월 달력에서 주(week) 행을 선택. 데이터 있는 주만 활성.
//   onSelect — 클라이언트 상태 전환(홈)
//   hrefBase — `${hrefBase}/${week}` 정적 경로로 이동(/calls·/geo)
export const WeekPicker = ({
  weeks,
  current,
  onSelect,
  hrefBase,
}: {
  weeks: string[]
  current: string
  onSelect?: (week: string) => void
  hrefBase?: string
}) => {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open])
  const start = isoWeekStart(current) ?? new Date(Date.UTC(2026, 0, 1))
  const [view, setView] = useState(() => ({ y: start.getUTCFullYear(), m: start.getUTCMonth() }))

  const avail = new Set(weeks)
  const firstOfMonth = new Date(Date.UTC(view.y, view.m, 1))
  const startMon = addDays(firstOfMonth, -((firstOfMonth.getUTCDay() + 6) % 7))
  const lastOfMonth = new Date(Date.UTC(view.y, view.m + 1, 0))
  const rows: { iso: string; days: Date[] }[] = []
  for (let cur = startMon; cur <= lastOfMonth; cur = addDays(cur, 7)) {
    rows.push({ iso: isoWeekOf(cur), days: Array.from({ length: 7 }, (_, i) => addDays(cur, i)) })
  }

  const prev = () => setView((v) => (v.m === 0 ? { y: v.y - 1, m: 11 } : { y: v.y, m: v.m - 1 }))
  const next = () => setView((v) => (v.m === 11 ? { y: v.y + 1, m: 0 } : { y: v.y, m: v.m + 1 }))

  const rowInner = (iso: string, days: Date[]) => (
    <>
      <span className={cx('cal-wk')}>{iso.slice(6)}</span>
      {days.map((d, i) => (
        <span key={i} className={cx('cal-d', { out: d.getUTCMonth() !== view.m })}>
          {d.getUTCDate()}
        </span>
      ))}
    </>
  )

  return (
    <div className={cx('wk', { open })}>
      <button
        type="button"
        className={cx('wk-btn')}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        측정 {triggerLabel(current)}
        <span className={cx('wk-chev')} aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <>
          <div className={cx('wk-scrim')} onClick={() => setOpen(false)} aria-hidden />
          <div className={cx('cal')} role="dialog" aria-label="주차 선택">
            <div className={cx('cal-h')}>
              <button type="button" className={cx('cal-nav')} onClick={prev} aria-label="이전 달">
                ‹
              </button>
              <span className={cx('cal-title')}>
                {view.y}년 {view.m + 1}월
              </span>
              <button type="button" className={cx('cal-nav')} onClick={next} aria-label="다음 달">
                ›
              </button>
            </div>
            <div className={cx('cal-wd')}>
              <span />
              {WD.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
            <div className={cx('cal-body')}>
              {rows.map(({ iso, days }) => {
                // 격주: 한 측정(member)이 자기 주 + 다음 주 2주를 대표.
                // 이 행이 속한 측정 = 자기 주가 데이터 있으면 자기, 아니면 직전 주(그 측정의 둘째 주).
                const prev = isoWeekOf(addDays(days[0], -7))
                const member = avail.has(iso) ? iso : avail.has(prev) ? prev : null
                const selected = member != null && member === current
                if (!member) {
                  return (
                    <div key={iso} className={cx('cal-row', 'off')} aria-disabled>
                      {rowInner(iso, days)}
                    </div>
                  )
                }
                const cls = cx('cal-row', { sel: selected })
                return hrefBase ? (
                  <Link
                    key={iso}
                    href={`${hrefBase}/${member}`}
                    className={cls}
                    aria-current={selected ? 'true' : undefined}
                    onClick={() => setOpen(false)}
                  >
                    {rowInner(iso, days)}
                  </Link>
                ) : (
                  <button
                    key={iso}
                    type="button"
                    className={cls}
                    aria-current={selected ? 'true' : undefined}
                    onClick={() => {
                      onSelect?.(member)
                      setOpen(false)
                    }}
                  >
                    {rowInner(iso, days)}
                  </button>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
