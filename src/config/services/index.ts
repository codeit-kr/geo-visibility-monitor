// 측정 대상 서비스 레지스트리. 새 서비스는 모듈을 만들어 SERVICES 에 추가하면 끝.
//   1) config/services/<app>.ts 에 ServiceConfig 작성
//   2) 아래 SERVICES 배열에 등록
//   3) types/snapshot.ts 의 App union 에 app 키 추가
import type { ServiceConfig } from '../types'
import { sprint } from './sprint'

export const SERVICES: ServiceConfig[] = [sprint]

// 점진 활성화 — ACTIVE_SERVICES(쉼표구분, app 키) 미설정이면 전부.
//   예: ACTIVE_SERVICES=sprint → 스프린트만 / =sprint,cayde → 둘만.
export const getActiveServices = (): ServiceConfig[] => {
  const raw = process.env.ACTIVE_SERVICES?.trim()
  if (!raw) return SERVICES
  const set = new Set(raw.split(',').map((s) => s.trim()).filter(Boolean))
  return SERVICES.filter((s) => set.has(s.app))
}

// 헤드라인 인용률/SoV 집계 대상(브랜드·팩트 제외). role 전개분은 jobRoles.codeitServes 로
// 필터 가능하나 현재 코드잇은 등록 직무 모두 서비스 → 전부 포함.
export const visibilityIntents = (service: ServiceConfig): ServiceConfig['intents'] =>
  service.intents.filter((i) => i.metricRole === 'visibility')

// 전개 후 총 패러프레이즈 수 추정(reps 제외) — 비용 가늠용.
export const estimateParaphraseCount = (service: ServiceConfig): number =>
  service.intents.reduce((sum, it) => {
    const mult =
      (it.expand?.roles ? service.jobRoles.length : 1) *
      (it.expand?.competitors ? service.competitors.length : 1)
    return sum + it.paraphrases.length * mult
  }, 0)
