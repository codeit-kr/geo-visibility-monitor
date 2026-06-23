import { redirect } from 'next/navigation'
import { getDefaultApp } from '../src/data'

// 루트는 기본 서비스로 리다이렉트(/ → /<defaultApp> → /<defaultApp>/<latestWeek>).
const Page = async () => {
  redirect(`/${await getDefaultApp()}`)
}

export default Page
