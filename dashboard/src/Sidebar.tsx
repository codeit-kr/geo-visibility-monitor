'use client'

import classnames from 'classnames/bind'
import { usePathname } from 'next/navigation'
import styles from './Sidebar.module.scss'

const cx = classnames.bind(styles)

// 경로는 /<app>/... 형태. seg = 라우트 섹션('' = 대시보드). 주차 인지 섹션은 현재 주차를 슬러그로 이어 붙여 유지.
const NAV = [
  { seg: '', label: '대시보드' },
  { seg: 'compare', label: '전 회차 비교' },
  { seg: 'calls', label: 'AI 응답 상세' },
  { seg: 'geo', label: 'GEO 감사' },
  { seg: 'methodology', label: '측정 기준' },
]
const WEEK_AWARE = new Set(['', 'compare', 'calls', 'geo'])
const WEEK_RE = /(\d{4}-W\d{2})/
const SECTIONS = new Set(['compare', 'calls', 'geo', 'methodology'])

export const Sidebar = () => {
  const path = usePathname()
  const parts = path.split('/').filter(Boolean)
  const app = parts[0]
  if (!app) return null
  const week = path.match(WEEK_RE)?.[1]
  // 현재 섹션 — parts[1] 이 알려진 섹션이면 그것, 아니면(주차 슬러그/없음) 대시보드.
  const cur = SECTIONS.has(parts[1]) ? parts[1] : ''

  const hrefFor = (seg: string) => {
    const base = seg ? `/${app}/${seg}` : `/${app}`
    return week && WEEK_AWARE.has(seg) ? `${base}/${week}` : base
  }

  return (
    <aside className={cx('sidebar')}>
      <div className={cx('eyebrow')}>탐색</div>
      <nav className={cx('nav')} aria-label="페이지">
        {NAV.map((n) => {
          const active = n.seg === cur
          return (
            <a
              key={n.seg || 'home'}
              href={hrefFor(n.seg)}
              className={cx('item', { active })}
              aria-current={active ? 'page' : undefined}
            >
              {n.label}
            </a>
          )
        })}
      </nav>
    </aside>
  )
}
