import { notFound } from 'next/navigation'
import { SERVICES, estimateParaphraseCount, visibilityIntents } from '../../../../src/config/services'
import { MODEL_PRICING, SERPAPI_CREDIT_USD } from '../../../../src/config/pricing'
import { getApps, getLatestWeeks } from '../../../src/data'
import { Methodology } from '../../../src/Methodology'

export const dynamicParams = false

export const generateMetadata = () => ({ title: '측정 기준' })

export const generateStaticParams = async () => (await getApps()).map((app) => ({ app }))

// 측정 엔진의 실제 설정(ServiceConfig·pricing)을 빌드 시점에 그대로 읽어 렌더 — 코드가 곧 기준.
const Page = async ({ params }: { params: Promise<{ app: string }> }) => {
  const { app } = await params
  const service = SERVICES.find((s) => s.app === app)
  if (!service) notFound() // 데이터는 있으나 엔진 ServiceConfig 미등록 — sprint 설정을 잘못 노출하지 않도록 404
  const [available, latestWeeks] = await Promise.all([getApps(), getLatestWeeks()])

  return (
    <Methodology
      service={service}
      pricing={Object.entries(MODEL_PRICING)}
      serpCredit={SERPAPI_CREDIT_USD}
      paraphraseCount={estimateParaphraseCount(service)}
      visibilityCount={visibilityIntents(service).length}
      available={available}
      latestWeekOf={latestWeeks}
    />
  )
}

export default Page
