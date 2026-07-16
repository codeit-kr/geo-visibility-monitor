// 페이지 메타 단독 수집 — pages.json 만 기록(주간 런과 별개의 수동/소급 수집용).
//   CAPTURED_AT=<ISO> [APP=sprint] [WEEK=2026-W28] pnpm pages:collect
// WEEK 을 지정하면 해당 주차 폴더에 기록(소급 수집 — capturedAt 은 실제 크롤 시각을 보존).
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { App } from '../../types/snapshot'
import { buildContext } from '../context'
import { collectPages } from '../jobs/collectPages'
import { SERVICES } from '../config/services'
import { SNAPSHOTS_DIR } from '../store/writeSnapshot'

const main = async (): Promise<void> => {
  const app = (process.env.APP ?? 'sprint') as App
  const service = SERVICES.find((s) => s.app === app)
  if (!service) throw new Error(`알 수 없는 서비스: ${app}`)

  const ctx = buildContext(app)
  if (process.env.WEEK) ctx.isoWeek = process.env.WEEK

  const snapshot = await collectPages(ctx, service)
  const dir = join(SNAPSHOTS_DIR, app, ctx.isoWeek)
  await mkdir(dir, { recursive: true })
  await writeFile(join(dir, 'pages.json'), `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8')
  console.info(`[pages] 기록 완료 — ${dir}/pages.json (${snapshot.pages.length}개 페이지)`)
}

main().catch((error) => {
  console.error('[pages] 실패:', error)
  process.exit(1)
})
