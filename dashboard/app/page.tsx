import { redirect } from 'next/navigation'
import { getRollup } from '../src/data'

// 루트는 항상 주차 슬러그를 갖도록 최신 주차로 리다이렉트(/ → /<latestWeek>).
const Page = async () => {
  const rollup = await getRollup('sprint')
  const latest = rollup.weeks.length ? rollup.weeks[rollup.weeks.length - 1].isoWeek : null
  redirect(latest ? `/${latest}` : '/methodology')
}

export default Page
