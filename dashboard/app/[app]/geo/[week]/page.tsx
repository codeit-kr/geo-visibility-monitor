import type { App } from '../../../../../types/snapshot'
import { getApps, getAppWeeks, getLatestWeeks, getRollup, getGeoScore, getGeoReport } from '../../../../src/data'
import { GeoAudit } from '../../../../src/GeoAudit'

// 서비스×주차별 정적 경로 — 빌드 시점에 보유 조합을 전부 prerender(런타임 파일 읽기 없음).
export const dynamicParams = false

export const generateMetadata = async ({ params }: { params: Promise<{ week: string }> }) => {
  const { week } = await params
  return { title: `GEO 감사 · ${week}` }
}

export const generateStaticParams = getAppWeeks

const Page = async ({ params }: { params: Promise<{ app: string; week: string }> }) => {
  const { app: appParam, week } = await params
  const app = appParam as App
  const [rollup, score, report, available, latestWeeks] = await Promise.all([
    getRollup(app),
    getGeoScore(app, week),
    getGeoReport(app, week),
    getApps(),
    getLatestWeeks(),
  ])

  return (
    <GeoAudit
      app={app}
      displayName={rollup.displayName}
      isoWeek={week}
      score={score}
      report={report}
      weeks={rollup.weeks.map((w) => w.isoWeek)}
      available={available}
      latestWeekOf={latestWeeks}
    />
  )
}

export default Page
