import { getRollup, getVisibility, getResponses } from '../../../src/data'
import { CallsDetail } from '../../../src/CallsDetail'

// 주차별 정적 경로 — 빌드 시점에 보유 주차를 전부 prerender(런타임 파일 읽기 없음).
export const dynamicParams = false // 미생성 주차는 404(동적 폴백 금지 → 정적 보장)

export const generateMetadata = async ({ params }: { params: Promise<{ week: string }> }) => {
  const { week } = await params
  return { title: `AI 응답 상세 · ${week}` }
}

export const generateStaticParams = async () => {
  const rollup = await getRollup('sprint')
  return rollup.weeks.map((w) => ({ week: w.isoWeek }))
}

const Page = async ({ params }: { params: Promise<{ week: string }> }) => {
  const { week } = await params
  const app = 'sprint' as const
  const rollup = await getRollup(app)
  const [visibility, responses] = await Promise.all([getVisibility(app, week), getResponses(app, week)])

  return (
    <CallsDetail
      app={app}
      displayName={rollup.displayName}
      isoWeek={week}
      visibility={visibility}
      responses={responses}
      weeks={rollup.weeks.map((w) => w.isoWeek)}
    />
  )
}

export default Page
