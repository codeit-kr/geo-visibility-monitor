import { redirect } from 'next/navigation'
import type { App } from '../../../../types/snapshot'
import { getApps, getRollup } from '../../../src/data'

// 슬러그 일관성 — /<app>/geo 는 최신 주차로 리다이렉트.
export const dynamicParams = false

export const generateStaticParams = async () => (await getApps()).map((app) => ({ app }))

const Page = async ({ params }: { params: Promise<{ app: string }> }) => {
  const { app } = await params
  const rollup = await getRollup(app as App)
  const latest = rollup.weeks.length ? rollup.weeks[rollup.weeks.length - 1].isoWeek : null
  redirect(latest ? `/${app}/geo/${latest}` : `/${app}/methodology`)
}

export default Page
