import type { App } from '../../../../types/snapshot'
import { getAppWeeks, getRollup, getServicesManifest, snapshotsAvailable } from '../../../src/data'
import { AiVisibilityDashboard } from '../../../src/AiVisibilityDashboard'

// 서비스×주차별 대시보드 — 빌드 시점에 보유 조합을 전부 prerender.
export const dynamicParams = false

export const generateMetadata = async ({ params }: { params: Promise<{ week: string }> }) => {
  const { week } = await params
  return { title: `대시보드 · ${week}` }
}

export const generateStaticParams = getAppWeeks

const Page = async ({ params }: { params: Promise<{ app: string; week: string }> }) => {
  const { app, week } = await params
  const [services, rollup, available] = await Promise.all([
    getServicesManifest(),
    getRollup(app as App),
    snapshotsAvailable(),
  ])
  return (
    <AiVisibilityDashboard rollup={rollup} services={services} usingFixture={!available} selectedWeek={week} />
  )
}

export default Page
