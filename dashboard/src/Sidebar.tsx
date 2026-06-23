'use client'

import classnames from 'classnames/bind'
import { usePathname } from 'next/navigation'
import styles from './Sidebar.module.scss'

const cx = classnames.bind(styles)

// base = 라우트 루트. 주차 인지 페이지(/ · /calls · /geo)는 현재 주차를 슬러그로 이어 붙여 이동 시 주차 유지.
const NAV = [
  { base: '/', label: '대시보드' },
  { base: '/calls', label: 'AI 응답 상세' },
  { base: '/geo', label: 'GEO 감사' },
  { base: '/methodology', label: '측정 기준' },
]
const WEEK_AWARE = new Set(['/', '/calls', '/geo'])
const WEEK_RE = /(\d{4}-W\d{2})/

const isActive = (path: string, base: string) =>
  base === '/' ? path === '/' || /^\/\d{4}-W\d{2}$/.test(path) : path.startsWith(base)

const hrefFor = (base: string, week?: string) => {
  if (!week || !WEEK_AWARE.has(base)) return base
  return base === '/' ? `/${week}` : `${base}/${week}`
}

export const Sidebar = () => {
  const path = usePathname()
  const week = path.match(WEEK_RE)?.[1]
  return (
    <aside className={cx('sidebar')}>
      <div className={cx('eyebrow')}>탐색</div>
      <nav className={cx('nav')} aria-label="페이지">
        {NAV.map((n) => {
          const active = isActive(path, n.base)
          return (
            <a
              key={n.base}
              href={hrefFor(n.base, week)}
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
