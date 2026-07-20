// geo-audit GitHub Action 용 — 활성 서비스의 감사 대상을 JSON 배열로 stdout 출력.
// 각 항목: { app, url, isoWeek, capturedAt } → 워크플로가 audit-targets.json 으로 저장,
// claude-code-action 프롬프트가 이를 읽어 서비스별 /geo-audit + geoScore.json 기록.
import { getActiveServices } from '../config/services'
import { isoWeekOf } from '../util/time'
import { requireEnv } from '../util/env'
import { resolveAuditUrls } from '../util/resolveAuditUrls'

const main = async (): Promise<void> => {
  const capturedAt = requireEnv('CAPTURED_AT')
  const isoWeek = isoWeekOf(capturedAt)
  const targets = []
  for (const s of getActiveServices()) {
    targets.push({
      app: s.app,
      url: s.siteUrl,
      isoWeek,
      capturedAt,
      // auditUrlSource(sitemap 동적 소싱)는 여기서 resolve — 3-run 이 같은 audit-targets.json 을 읽으므로
      // 한 주의 감사 3회는 항상 동일 감사셋을 쓴다(재현성).
      auditUrls: await resolveAuditUrls(s),
      brandSources: s.brandSources,
      brandSourcesVersion: s.brandSourcesVersion,
    })
  }
  console.log(JSON.stringify(targets, null, 2))
}

main().catch((error) => {
  console.error('[audit:targets] 실패:', error)
  process.exit(1)
})
