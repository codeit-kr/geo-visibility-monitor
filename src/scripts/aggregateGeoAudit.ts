// geo-audit N회 결과를 평균/range 로 집계 → snapshots/<app>/<isoWeek>/geoScore.json + geoScoreRuns.json.
// 입력: repo 루트의 평면 파일 georun-<app>-run<N>.json / georeport-<app>-run<N>.md
//   (matrix 병렬 잡이 아티팩트로 올린 것 — upload-artifact 의 공통경로 스트립을 피하려 루트 평면 사용).
// app·isoWeek 은 파일 내용(GeoScoreSnapshot)에서 읽어 그룹화하므로 멀티 서비스도 안전.
import { readdir, readFile, writeFile, rm, mkdir, copyFile } from 'node:fs/promises'
import { join } from 'node:path'
import { SCHEMA_VERSION, type App, type GeoScoreSnapshot } from '../../types/snapshot'

const SNAPSHOTS_DIR = 'snapshots'
const SCORE_FIELDS = ['composite', 'citability', 'brand', 'eeat', 'technical', 'schema', 'platform'] as const

interface Group {
  app: App
  isoWeek: string
  capturedAt: string
  runs: GeoScoreSnapshot[]
}

const main = async (): Promise<void> => {
  const rootFiles = await readdir('.')
  const runFiles = rootFiles.filter((f) => /^georun-.+-run\d+\.json$/.test(f)).sort()
  if (!runFiles.length) {
    console.warn('[geo:aggregate] georun-*.json 없음 — 스킵(감사 산출물 미수합?)')
    return
  }

  // app/isoWeek(파일 내용) 으로 그룹화.
  const groups = new Map<string, Group>()
  for (const f of runFiles) {
    let snap: GeoScoreSnapshot
    try {
      snap = JSON.parse(await readFile(f, 'utf8')) as GeoScoreSnapshot
    } catch (error) {
      console.warn(`[geo:aggregate] ${f} 파싱 실패 — 제외:`, error instanceof Error ? error.message : error)
      continue
    }
    const key = `${snap.app}/${snap.isoWeek}`
    const g = groups.get(key) ?? { app: snap.app, isoWeek: snap.isoWeek, capturedAt: snap.capturedAt, runs: [] }
    g.runs.push(snap)
    groups.set(key, g)
  }

  // 주차 가드 — 같은 앱에 여러 isoWeek 그룹이 생기면(에이전트가 엉뚱한 주차 폴더에 쓴 경우 등)
  // run 수가 가장 많은 주차(동수면 최신)만 채택. 리포트 복사가 앱 단위(파일명에 주차 없음)라,
  // 소수 그룹을 살리면 다른 주차 폴더가 이번 회차 산출물로 덮인다(2026-W28 런이 W26 을 덮은 사고 재발 방지).
  const byApp = new Map<App, Group[]>()
  for (const g of groups.values()) byApp.set(g.app, [...(byApp.get(g.app) ?? []), g])
  const accepted: Group[] = []
  for (const appGroups of byApp.values()) {
    const [expected, ...rest] = appGroups.sort(
      (a, b) => b.runs.length - a.runs.length || b.isoWeek.localeCompare(a.isoWeek),
    )
    accepted.push(expected)
    for (const g of rest)
      console.warn(
        `[geo:aggregate] ${g.app} ${g.isoWeek}: 예상 주차(${expected.isoWeek})와 불일치한 run ${g.runs.length}건 — 제외`,
      )
  }

  for (const g of accepted) {
    const dir = join(SNAPSHOTS_DIR, g.app, g.isoWeek)
    await mkdir(dir, { recursive: true })

    const mean = (k: (typeof SCORE_FIELDS)[number]): number =>
      Math.round(g.runs.reduce((sum, r) => sum + (r[k] ?? 0), 0) / g.runs.length)
    const composites = g.runs.map((r) => r.composite ?? 0)
    const compositeRange: [number, number] = [Math.min(...composites), Math.max(...composites)]

    const agg: GeoScoreSnapshot = {
      schemaVersion: SCHEMA_VERSION,
      capturedAt: g.capturedAt,
      isoWeek: g.isoWeek,
      app: g.app,
      composite: mean('composite'),
      citability: mean('citability'),
      brand: mean('brand'),
      eeat: mean('eeat'),
      technical: mean('technical'),
      schema: mean('schema'),
      platform: mean('platform'),
      runs: g.runs.length,
      compositeRange,
    }
    await save(join(dir, 'geoScore.json'), agg)
    await save(
      join(dir, 'geoScoreRuns.json'),
      g.runs.map((r, i) => ({ run: i + 1, ...Object.fromEntries(SCORE_FIELDS.map((k) => [k, r[k] ?? null])) })),
    )

    // 회차별 리포트(georeport-<app>-run<N>.md) 를 주차 폴더로 이동.
    for (const rf of rootFiles.filter((f) => new RegExp(`^georeport-${g.app}-run\\d+\\.md$`).test(f))) {
      const run = rf.match(/run(\d+)\.md$/)?.[1]
      await copyFile(rf, join(dir, `geo-audit-report-run${run}.md`))
    }

    console.info(
      `[geo:aggregate] ${g.app} ${g.isoWeek}: ${g.runs.length}회 평균 composite ${agg.composite} (range ${compositeRange[0]}–${compositeRange[1]})`,
    )
  }

  // 루트 평면 staging 파일 정리.
  for (const f of rootFiles.filter((f) => /^geo(run|report)-.+-run\d+\.(json|md)$/.test(f))) await rm(f)
}

const save = (path: string, data: unknown): Promise<void> =>
  writeFile(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8')

main().catch((error) => {
  console.error('[geo:aggregate] 실패:', error)
  process.exit(1)
})
