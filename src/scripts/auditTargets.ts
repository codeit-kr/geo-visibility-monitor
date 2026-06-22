// geo-audit GitHub Action 용 — 활성 서비스의 감사 대상을 JSON 배열로 stdout 출력.
// 각 항목: { app, url, isoWeek, capturedAt } → 워크플로가 audit-targets.json 으로 저장,
// claude-code-action 프롬프트가 이를 읽어 서비스별 /geo-audit + geoScore.json 기록.
import { getActiveServices } from '../config/services'
import { isoWeekOf } from '../util/time'
import { requireEnv } from '../util/env'

const capturedAt = requireEnv('CAPTURED_AT')
const isoWeek = isoWeekOf(capturedAt)
const targets = getActiveServices().map((s) => ({
  app: s.app,
  url: s.siteUrl,
  isoWeek,
  capturedAt,
}))
console.log(JSON.stringify(targets, null, 2))
