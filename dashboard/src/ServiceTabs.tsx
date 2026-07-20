'use client'

import classnames from 'classnames/bind'
import Link from 'next/link'
import styles from './ServiceTabs.module.scss'

const cx = classnames.bind(styles)

// 서비스 탭(상단 중앙). 데이터(스냅샷)가 있는 서비스만 활성 — 클릭 시 /<app> 으로 이동(해당 서비스 최신 주차로 리다이렉트).
// 나머지는 '준비 중' 비활성. 새 서비스 키는 여기 TABS 에 추가하면 데이터가 생기는 즉시 활성화된다.
const TABS: { key: string; label: string }[] = [
  { key: 'sprint', label: '코드잇 스프린트' },
  { key: 'codeit', label: '코드잇' },
  { key: '10x', label: '10x' },
  { key: 'cayde', label: '케이드' },
  { key: 'ascent', label: '어센트' },
]

export const ServiceTabs = ({
  current,
  available = ['sprint'],
  latestWeekOf,
}: {
  current: string
  available?: string[]
  latestWeekOf?: Record<string, string | null>
}) => (
  <nav className={cx('tabs')} aria-label="서비스 선택">
    {TABS.map((t) => {
      const active = t.key === current
      const ready = available.includes(t.key)
      if (!ready) {
        return (
          <button key={t.key} type="button" className={cx('tab', 'soon')} disabled title="준비 중">
            {t.label}
          </button>
        )
      }
      // 최신 주차를 알면 직링크 — /<app> 서버 리다이렉트 hop(전환 시 깜빡임)을 건너뛴다.
      const latest = latestWeekOf?.[t.key]
      return (
        <Link
          key={t.key}
          href={latest ? `/${t.key}/${latest}` : `/${t.key}`}
          className={cx('tab', { active })}
          aria-current={active ? 'page' : undefined}
        >
          {t.label}
        </Link>
      )
    })}
  </nav>
)
