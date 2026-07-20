// 주차 스냅샷을 snapshots/<app>/<isoWeek>/ 에 append-only JSON 으로 쓴다(= source of truth).
// app 차원으로 서비스를 분리 → 서비스 간 덮어쓰기 충돌 방지, 어드민 서비스별 드릴다운.
import { mkdir, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { App, PagesSnapshot, SnapshotBundle } from '../../types/snapshot'

export const SNAPSHOTS_DIR = 'snapshots'

export const writeSnapshot = async (app: App, isoWeek: string, bundle: SnapshotBundle): Promise<void> => {
  const dir = join(SNAPSHOTS_DIR, app, isoWeek)
  await mkdir(dir, { recursive: true })
  await Promise.all([
    save(join(dir, 'visibility.json'), bundle.visibility),
    save(join(dir, 'responses.json'), bundle.responses),
    save(join(dir, 'cost.json'), bundle.cost),
    save(join(dir, 'pages.json'), bundle.pages),
    // geoScore.json 은 geo-audit GitHub Action 이 별도 기록(여기서 안 씀).
  ])
}

// pages.json 단독 기록 — passive 서비스 주간 런 + 수동/소급 수집(collectPagesOnce) 공용.
// visibility/responses/cost 를 만들지 않아 passive 주차가 가시성 데이터가 있는 척하지 않는다.
export const writePages = async (app: App, isoWeek: string, pages: PagesSnapshot): Promise<void> => {
  const dir = join(SNAPSHOTS_DIR, app, isoWeek)
  await mkdir(dir, { recursive: true })
  await save(join(dir, 'pages.json'), pages)
}

const save = (path: string, data: unknown): Promise<void> =>
  writeFile(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
