import { redirect } from 'next/navigation'
import { getRollup } from '../../src/data'

// 슬러그 일관성 — /calls 는 최신 주차로 리다이렉트(/calls → /calls/<latestWeek>).
const Page = async () => {
  const rollup = await getRollup('sprint')
  const latest = rollup.weeks.length ? rollup.weeks[rollup.weeks.length - 1].isoWeek : null
  redirect(latest ? `/calls/${latest}` : '/methodology')
}

export default Page
