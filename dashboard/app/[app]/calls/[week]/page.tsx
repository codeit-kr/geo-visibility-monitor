import { Suspense } from 'react'
import type { App } from '../../../../../types/snapshot'
import { getApps, getAppWeeks, getRollup, getVisibility, getResponses } from '../../../../src/data'
import { CallsDetail } from '../../../../src/CallsDetail'

// 서비스×주차별 정적 경로 — 빌드 시점에 보유 조합을 전부 prerender(런타임 파일 읽기 없음).
export const dynamicParams = false

export const generateMetadata = async ({ params }: { params: Promise<{ week: string }> }) => {
  const { week } = await params
  return { title: `AI 응답 상세 · ${week}` }
}

export const generateStaticParams = getAppWeeks

const Page = async ({ params }: { params: Promise<{ app: string; week: string }> }) => {
  const { app: appParam, week } = await params
  const app = appParam as App
  const [rollup, visibility, responses, available] = await Promise.all([
    getRollup(app),
    getVisibility(app, week),
    getResponses(app, week),
    getApps(),
  ])

  return (
    // useSearchParams(필터)는 Suspense 경계 필요 — 데이터는 props 로 전달, 필터만 클라 반영.
    <Suspense>
      <CallsDetail
        app={app}
        displayName={rollup.displayName}
        isoWeek={week}
        visibility={visibility}
        responses={responses}
        weeks={rollup.weeks.map((w) => w.isoWeek)}
        available={available}
      />
    </Suspense>
  )
}

export default Page
