import { getRollup, getGeoScore, getGeoReport } from '../../../src/data'
import { GeoAudit } from '../../../src/GeoAudit'

// 주차별 정적 경로 — 빌드 시점에 보유 주차를 전부 prerender(런타임 파일 읽기 없음).
export const dynamicParams = false

export const generateMetadata = async ({ params }: { params: Promise<{ week: string }> }) => {
  const { week } = await params
  return { title: `GEO 감사 · ${week}` }
}

export const generateStaticParams = async () => {
  const rollup = await getRollup('sprint')
  return rollup.weeks.map((w) => ({ week: w.isoWeek }))
}

const Page = async ({ params }: { params: Promise<{ week: string }> }) => {
  const { week } = await params
  const app = 'sprint' as const
  const rollup = await getRollup(app)
  const [score, report] = await Promise.all([getGeoScore(app, week), getGeoReport(app, week)])

  return (
    <GeoAudit
      app={app}
      displayName={rollup.displayName}
      isoWeek={week}
      score={score}
      report={report}
      weeks={rollup.weeks.map((w) => w.isoWeek)}
    />
  )
}

export default Page
