import { SERVICES, estimateParaphraseCount, visibilityIntents } from '../../../src/config/services'
import { MODEL_PRICING, SERPAPI_CREDIT_USD } from '../../../src/config/pricing'
import { Methodology } from '../../src/Methodology'

export const metadata = { title: '측정 기준' }

// 측정 엔진의 실제 설정(ServiceConfig·pricing)을 빌드 시점에 그대로 읽어 렌더 — 코드가 곧 기준.
const Page = () => {
  const service = SERVICES[0] // 현재 sprint 단독

  return (
    <Methodology
      service={service}
      pricing={Object.entries(MODEL_PRICING)}
      serpCredit={SERPAPI_CREDIT_USD}
      paraphraseCount={estimateParaphraseCount(service)}
      visibilityCount={visibilityIntents(service).length}
    />
  )
}

export default Page
