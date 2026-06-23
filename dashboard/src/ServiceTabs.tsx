'use client'

import classnames from 'classnames/bind'
import styles from './ServiceTabs.module.scss'

const cx = classnames.bind(styles)

// 서비스 탭(상단 중앙). 현재 sprint 만 데이터 있음 — 나머지는 추후 추가 시 available 에 포함.
// 새 서비스 라우팅이 붙으면 활성 탭 클릭을 해당 서비스 대시보드로 연결한다(현재는 sprint 단독).
const TABS: { key: string; label: string }[] = [
  { key: 'sprint', label: '코드잇 스프린트' },
  { key: 'codeit', label: '코드잇' },
  { key: '10x', label: '10x' },
  { key: 'cayde', label: '케이드' },
  { key: 'ascent', label: '어센트' },
]

export const ServiceTabs = ({ current, available = ['sprint'] }: { current: string; available?: string[] }) => (
  <nav className={cx('tabs')} aria-label="서비스 선택">
    {TABS.map((t) => {
      const active = t.key === current
      const ready = available.includes(t.key)
      return (
        <button
          key={t.key}
          type="button"
          className={cx('tab', { active, soon: !ready })}
          aria-current={active ? 'page' : undefined}
          disabled={!ready}
          title={ready ? undefined : '준비 중'}
        >
          {t.label}
        </button>
      )
    })}
  </nav>
)
