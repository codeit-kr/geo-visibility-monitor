import type { App } from '../../../../../types/snapshot'
import { getAppWeeks, getPages, getRollup, getServicesManifest } from '../../../../src/data'
import type { WeekPages } from '../../../../src/pagesDiff'
import { PagesMonitor } from '../../../../src/PagesMonitor'

// 페이지 메타 모니터 — 선택 주차 vs 페이지 메타가 있는 직전 회차(격주·소급 수집이라 직전 주가 아닐 수 있음).
export const dynamicParams = false

export const generateMetadata = async ({ params }: { params: Promise<{ week: string }> }) => {
  const { week } = await params
  return { title: `페이지 메타 · ${week}` }
}

export const generateStaticParams = getAppWeeks

const Page = async ({ params }: { params: Promise<{ app: string; week: string }> }) => {
  const { app: appParam, week: weekParam } = await params
  const app = appParam as App
  const [services, rollup] = await Promise.all([getServicesManifest(), getRollup(app)])
  const weeks = rollup.weeks.map((w) => w.isoWeek)
  const week = weeks.includes(weekParam) ? weekParam : weeks[weeks.length - 1]

  // 타임라인·이슈 지속 판정에 전 주차가 필요 — 주차당 페이지 10개 수준이라 빌드 시 전량 로드 부담 없음.
  const snaps = await Promise.all(weeks.map((w) => getPages(app, w)))
  const history: WeekPages[] = weeks.map((isoWeek, i) => ({ isoWeek, snap: snaps[i] }))

  const idx = history.findIndex((h) => h.isoWeek === week)
  const cur = idx >= 0 ? history[idx].snap : null
  const earlier = history.slice(0, Math.max(idx, 0)).filter((h) => h.snap != null)
  const prev = earlier.length ? earlier[earlier.length - 1] : null

  return (
    <PagesMonitor app={app} rollup={rollup} services={services} week={week ?? weekParam} cur={cur} prev={prev} history={history} />
  )
}

export default Page
