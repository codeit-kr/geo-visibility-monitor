'use client'

import classnames from 'classnames/bind'
import { ServiceTabs } from './ServiceTabs'
import { WeekPicker } from './WeekPicker'
import styles from './DashboardHeader.module.scss'

const cx = classnames.bind(styles)

// 홈/상세 공유 헤더. 골격(탭·타이틀·우측 메타·뒤로가기)은 고정, 텍스트만 props 로 주입해 위치 통일.
type Props = {
  app: string
  available?: string[]
  latestWeekOf?: Record<string, string | null> // 서비스 탭 직링크용(리다이렉트 hop 제거)
  kicker: string
  title: string
  dot?: boolean // 타이틀 앞 라이브 도트(홈)
  measured: string // 우측 1행(측정 주차) — weekNav 없을 때 표시
  sub?: string // 우측 2행(상세의 응답·언급 수 등)
  // 주차 선택(있으면 measured 대신 드롭다운). 홈=onSelect(클라 상태), 상세/geo=hrefBase([week] 경로).
  weekNav?: {
    weeks: string[]
    current: string
    onSelect?: (week: string) => void
    hrefBase?: string
  }
}

// 페이지 이동은 좌측 Sidebar 가 담당 — 헤더는 컨텍스트(서비스 탭·타이틀·측정 메타)만.
export const DashboardHeader = ({ app, available, latestWeekOf, kicker, title, dot, measured, sub, weekNav }: Props) => (
  <header className={cx('top')}>
    <ServiceTabs current={app} available={available} latestWeekOf={latestWeekOf} />
    <div className={cx('top-row')}>
      <div>
        <div className={cx('kicker')}>{kicker}</div>
        <div className={cx('brand')}>
          {dot && <span className={cx('pulse')} aria-hidden />}
          <h1 className={cx('h1')}>{title}</h1>
        </div>
      </div>
      <div className={cx('top-right')}>
        {weekNav ? (
          <WeekPicker
            weeks={weekNav.weeks}
            current={weekNav.current}
            onSelect={weekNav.onSelect}
            hrefBase={weekNav.hrefBase}
          />
        ) : (
          <div className={cx('measured')}>{measured}</div>
        )}
        {sub && <div className={cx('measured', 'dim')}>{sub}</div>}
      </div>
    </div>
  </header>
)
