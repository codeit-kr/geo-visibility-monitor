// 감사셋 resolve — auditUrlSource(sitemap 동적 소싱)가 있으면 sitemap 을 읽어 결정적 규칙으로 확장.
// 재현성 원칙: 랜덤 없음(exclude·섹션 pick·정렬 전부 결정적) + resolve 결과가 그대로 스냅샷/감사 입력에 기록돼
// 주차 간 감사셋 변화(diff)를 추적할 수 있다. 같은 주의 pages 수집과 geo-audit 이 각각 resolve 하지만
// 규칙이 결정적이라 sitemap 이 그 사이 변하지 않는 한 동일 집합이 나온다.
import type { ServiceConfig, AuditUrlSource } from '../config/types'
import { fetchWithRetry } from './fetchWithRetry'

const USER_AGENT = 'codeit-geo-monitor/1.0 (audit-url resolve)'

// 후행 슬래시 무시 dedupe 키('https://a.com' == 'https://a.com/').
const dedupeKey = (url: string): string => url.replace(/\/+$/, '')

const pathOf = (url: string): string => {
  try {
    const p = new URL(url).pathname
    return p === '' ? '/' : p
  } catch {
    return url // URL 파싱 불가 항목은 원문 유지(exclude/section 미매칭 → 포함)
  }
}

// 세그먼트 경계 접두사 매칭 — '/teams' 가 '/teams-admin' 을 잡지 않게.
const underPrefix = (path: string, prefix: string): boolean =>
  path === prefix || path.startsWith(`${prefix}/`)

const isExcluded = (path: string, rules: string[]): boolean =>
  rules.some((rule) =>
    rule.endsWith('/*') ? underPrefix(path, rule.slice(0, -2)) : path === rule,
  )

// 순수 선별 로직(테스트 대상) — sitemap URL 목록에 exclude·섹션 정책을 적용하고 고정 코어와 합친다.
// 반환 순서: 고정 auditUrls(원래 순서) → 동적 선별분(오름차순). 중복은 고정 쪽 우선.
export const selectAuditUrls = (
  fixed: string[],
  sitemapUrls: string[],
  source: AuditUrlSource,
): string[] => {
  const excludeRules = source.exclude ?? []
  const sections = source.sections ?? []

  // 섹션별 버킷(가장 긴 prefix 우선 매칭) + 미매칭 버킷
  const bySection = new Map<string, string[]>()
  const rest: string[] = []
  const sorted = [...sections].sort((a, b) => b.prefix.length - a.prefix.length)
  for (const url of sitemapUrls) {
    const path = pathOf(url)
    if (isExcluded(path, excludeRules)) continue
    const section = sorted.find((s) => underPrefix(path, s.prefix))
    if (section) {
      const list = bySection.get(section.prefix) ?? []
      list.push(url)
      bySection.set(section.prefix, list)
    } else {
      rest.push(url)
    }
  }

  const dynamic: string[] = [...rest]
  for (const s of sections) {
    const list = (bySection.get(s.prefix) ?? []).sort()
    dynamic.push(...(s.pick === 'all' ? list : list.slice(0, s.pick)))
  }
  dynamic.sort()

  const seen = new Set(fixed.map(dedupeKey))
  const merged = [...fixed]
  for (const url of dynamic) {
    const key = dedupeKey(url)
    if (seen.has(key)) continue
    seen.add(key)
    merged.push(url)
  }
  return merged
}

const parseSitemapLocs = (xml: string): string[] =>
  [...xml.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)].map((m) => m[1])

// 서비스의 최종 감사셋. auditUrlSource 없으면 auditUrls 그대로(기존 서비스 무변경).
// sitemap fetch/파싱 실패 시 고정 auditUrls 로 폴백 — 측정 런 전체를 죽이는 것보다 축소셋+경고가 낫다
// (pages.json 의 감사셋 diff 로 드러남).
export const resolveAuditUrls = async (service: ServiceConfig): Promise<string[]> => {
  const source = service.auditUrlSource
  if (!source) return service.auditUrls
  try {
    const sitemapUrls: string[] = []
    for (const sitemap of source.sitemaps) {
      const res = await fetchWithRetry(sitemap, { headers: { 'user-agent': USER_AGENT } })
      if (!res.ok) throw new Error(`${sitemap} → HTTP ${res.status}`)
      const locs = parseSitemapLocs(await res.text())
      if (locs.length === 0) throw new Error(`${sitemap} → <loc> 0개(형식 변경 의심)`)
      sitemapUrls.push(...locs)
    }
    const resolved = selectAuditUrls(service.auditUrls, sitemapUrls, source)
    // stderr 로 — audit:targets 가 stdout 을 JSON 으로 리다이렉트하므로 로그가 산출물을 오염시키면 안 됨.
    console.warn(`[auditUrls] ${service.app} — 고정 ${service.auditUrls.length} + sitemap ${sitemapUrls.length} → ${resolved.length}개 resolve`)
    return resolved
  } catch (error) {
    console.warn(`[auditUrls] ${service.app} — sitemap resolve 실패, 고정 auditUrls(${service.auditUrls.length}개)로 폴백:`, error instanceof Error ? error.message : error)
    return service.auditUrls
  }
}
