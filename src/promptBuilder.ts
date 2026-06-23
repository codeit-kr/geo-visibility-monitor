// 서비스 질의셋(service.intents)을 실제 호출 단위(CallSpec)로 전개한다.
//  - {role}/{competitor} placeholder 치환 (intent.expand 지시 + service.jobRoles/competitors)
//  - paraphrase × 전개값 × reps 곱 → 콜 1건당 CallSpec 1개
// CallSpec 1건 = VisibilitySnapshot 1건(엔진 호출 1회)에 대응.

import type { ServiceConfig, IntentGroup, MetricRole } from './config/types'
import type { App } from '../types/snapshot'

const DEFAULT_REPS = 2

export interface CallSpec {
  intentId: string
  group: IntentGroup
  metricRole: MetricRole
  app: App
  competitorAware: boolean
  paraphraseId: string // 안정 ID(추이 비교용) — rep 은 제외, 전개값은 포함
  paraphraseIndex: number // 의도 내 패러프레이즈 순번(0 = seed). SERP seed-only 선택용
  query: string // placeholder 치환 완료된 최종 문장(챗봇용)
  serpQuery?: string // SERP 표면용 키워드(치환 완료). 미지정 시 selectSerpQueries 가 query 로 폴백
  rep: number // 1..reps
  locale: string
  role?: string // {role} 전개분일 때
  roleServed?: boolean // 해당 직무를 서비스가 제공하는지(jobRoles.codeitServes)
  competitor?: string // {competitor} 전개분일 때 canonical 명
}

export interface BuildOptions {
  locale?: string
  competitorScope?: 'all' | 'priority' // vs비교 전개 범위(비용 조절)
}

export const buildCalls = (service: ServiceConfig, opts: BuildOptions = {}): CallSpec[] => {
  const locale = opts.locale ?? service.locale
  const competitorPool =
    opts.competitorScope === 'priority'
      ? service.competitors.filter((c) => service.priorityCompetitors.includes(c.canonical))
      : service.competitors

  const specs: CallSpec[] = []

  for (const intent of service.intents) {
    // 의도 단위로 격리: 한 의도의 config 오타(placeholder 미치환 등)가 전체 잡을 죽이지 않게
    // all-or-nothing 으로 모은 뒤 커밋. 실패 의도는 스킵+로그.
    try {
      const reps = intent.reps ?? DEFAULT_REPS
      // 전개 안 하는 축은 [null] 한 칸으로 두어 곱셈이 1배가 되게 한다.
      const roles = intent.expand?.roles ? service.jobRoles : [null]
      const competitors = intent.expand?.competitors ? competitorPool : [null]
      const intentSpecs: CallSpec[] = []

      intent.paraphrases.forEach((template, pIndex) => {
        for (const role of roles) {
          for (const competitor of competitors) {
            const query = applyTokens(template, role?.token, competitor?.canonical)
            // SERP 키워드도 동일 토큰 전개({role} 등). 없으면 undefined → 호출부에서 query 폴백.
            const serpQuery = intent.serpQuery
              ? applyTokens(intent.serpQuery, role?.token, competitor?.canonical)
              : undefined
            const paraphraseId = [
              `${intent.id}#p${pIndex}`,
              role ? `role=${role.token}` : '',
              competitor ? `comp=${competitor.canonical}` : '',
            ]
              .filter(Boolean)
              .join(':')

            for (let rep = 1; rep <= reps; rep++) {
              intentSpecs.push({
                intentId: intent.id,
                group: intent.group,
                metricRole: intent.metricRole,
                app: intent.app,
                competitorAware: intent.competitorAware,
                paraphraseId,
                paraphraseIndex: pIndex,
                query,
                ...(serpQuery ? { serpQuery } : {}),
                rep,
                locale,
                ...(role ? { role: role.token, roleServed: role.codeitServes } : {}),
                ...(competitor ? { competitor: competitor.canonical } : {}),
              })
            }
          }
        }
      })

      specs.push(...intentSpecs)
    } catch (error) {
      console.error(
        `[promptBuilder] 의도 "${intent.id}" 전개 실패 — 스킵:`,
        error instanceof Error ? error.message : error,
      )
    }
  }

  return specs
}

// placeholder 치환. 전개 지시와 템플릿이 어긋나 토큰이 남으면 설정 오류이므로 즉시 throw.
const applyTokens = (template: string, role?: string, competitor?: string): string => {
  let out = template
  if (role) out = out.replaceAll('{role}', role)
  if (competitor) out = out.replaceAll('{competitor}', competitor)
  if (out.includes('{')) {
    throw new Error(`치환되지 않은 placeholder: "${out}" — intent.expand 설정 확인`)
  }
  return out
}
