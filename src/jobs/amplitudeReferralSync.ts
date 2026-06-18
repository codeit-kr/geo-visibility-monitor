// 그룹 B — 가치. 계측은 frontend-mono(util-acquisition)에 이미 라이브.
// 이 잡은 Amplitude Dashboard/Query API 로 fromAI 이벤트 + 전환을 당겨 집계만 한다.
import { SCHEMA_VERSION, type ReferralSnapshot, type Engine } from '../../types/snapshot'
import type { SnapshotContext } from '../context'
import type { ServiceConfig } from '../config/types'

// util-acquisition 의 source → 우리 Engine 키 매핑(목록 어긋남 방지 위해 미러링)
const SOURCE_TO_ENGINE: Record<string, Engine> = {
  chatgpt: 'chatgpt',
  claude: 'claude',
  gemini: 'gemini',
  perplexity: 'perplexity',
}

// 전환 이벤트(그로스 확정 대기, 기본값)
const CONVERSION_EVENTS = ['complete.application_submission', 'complete.signup']

export const runAmplitudeReferralSync = async (
  ctx: SnapshotContext,
  service: ServiceConfig,
): Promise<ReferralSnapshot[]> => {
  // TODO: Amplitude Dashboard REST/Query API 호출
  //   - AMPLITUDE_API_KEY / AMPLITUDE_SECRET_KEY (requireEnv)
  //   - 서비스별 Amplitude 프로젝트/세그먼트(추후 service 에 식별자 추가)
  //   - fromAI=true 세그먼트를 source 별 세션 수로 집계
  //   - CONVERSION_EVENTS 를 동일 세그먼트로 교차 → 전환율
  //   - 기간 = ctx.isoWeek 해당 주
  void SOURCE_TO_ENGINE
  void CONVERSION_EVENTS
  void ctx
  void service
  console.warn(`[amplitudeReferralSync] 미구현 — Amplitude secret key 확보 후 연결 (${ctx.app})`)
  return []
}
