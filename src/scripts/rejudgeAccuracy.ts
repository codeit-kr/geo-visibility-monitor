// 기존 스냅샷의 accuracyFlags 를 현재 config 의 groundTruth 로 재판정(결정적 휴리스틱) — 오탐 정정용 일회성.
// AI 재질의 없음(저장된 answer 재사용). 끝나면 `pnpm rollup` 로 index.json 재집계.
// 사용: tsx src/scripts/rejudgeAccuracy.ts <app> <isoWeek>   예: ... sprint 2026-W26
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { App, ResponseRecord, VisibilitySnapshot } from '../../types/snapshot'
import { checkAccuracy } from '../analyze/checkAccuracy'
import { SERVICES } from '../config/services'
import { SNAPSHOTS_DIR } from '../store/writeSnapshot'

const [app, isoWeek] = process.argv.slice(2)
if (!app || !isoWeek) {
  console.error('사용: tsx src/scripts/rejudgeAccuracy.ts <app> <isoWeek>')
  process.exit(1)
}

const main = async () => {
  const service = SERVICES.find((s) => s.app === (app as App))
  if (!service) throw new Error(`알 수 없는 app: ${app}`)
  const gtByIntent = new Map(service.intents.filter((i) => i.groundTruth).map((i) => [i.id, i.groundTruth!]))

  const dir = join(SNAPSHOTS_DIR, app, isoWeek)
  const vis = JSON.parse(await readFile(join(dir, 'visibility.json'), 'utf8')) as VisibilitySnapshot[]
  const resp = JSON.parse(await readFile(join(dir, 'responses.json'), 'utf8')) as ResponseRecord[]
  const ans = new Map(resp.map((r) => [`${r.paraphraseId}|${r.engine}|${r.rep}`, r.answer]))

  let changed = 0
  for (const v of vis) {
    const gt = gtByIntent.get(v.intentId)
    if (!gt) continue // 정답 데이터 없는 의도는 건드리지 않음
    const text = ans.get(`${v.paraphraseId}|${v.engine}|${v.rep}`) ?? v.rawSnippet ?? ''
    const next = await checkAccuracy(text, gt)
    const before = JSON.stringify(v.accuracyFlags ?? [])
    if (JSON.stringify(next) !== before) {
      console.info(`  [${v.engine}] ${v.intentId}: ${before} → ${JSON.stringify(next)}`)
      v.accuracyFlags = next
      changed += 1
    }
  }

  await writeFile(join(dir, 'visibility.json'), `${JSON.stringify(vis, null, 2)}\n`, 'utf8')
  console.info(`[rejudge] ${app}/${isoWeek} — ${changed}개 행 갱신. 이제 'pnpm rollup' 실행.`)
}

main().catch((error) => {
  console.error('[rejudge] 실패:', error)
  process.exit(1)
})
