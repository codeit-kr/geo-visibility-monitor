import { getRollup, getServicesManifest, snapshotsAvailable } from '../../src/data'
import { AiVisibilityDashboard } from '../../src/AiVisibilityDashboard'

// 주차별 대시보드 — 빌드 시점에 보유 주차를 전부 prerender.
export const dynamicParams = false

export const generateMetadata = async ({ params }: { params: Promise<{ week: string }> }) => {
  const { week } = await params
  return { title: `대시보드 · ${week}` }
}

export const generateStaticParams = async () => {
  const rollup = await getRollup('sprint')
  return rollup.weeks.map((w) => ({ week: w.isoWeek }))
}

const Page = async ({ params }: { params: Promise<{ week: string }> }) => {
  const { week } = await params
  const [services, rollup, available] = await Promise.all([
    getServicesManifest(),
    getRollup('sprint'),
    snapshotsAvailable(),
  ])
  return (
    <AiVisibilityDashboard rollup={rollup} services={services} usingFixture={!available} selectedWeek={week} />
  )
}

export default Page
