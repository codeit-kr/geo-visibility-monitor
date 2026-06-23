// geo-audit N회 실행 결과(geoScore-run*.json)를 평균/range 로 집계 → geoScore.json + geoScoreRuns.json.
// LLM 채점 변동을 통계로 흡수하는 단계. geo-audit GitHub Action 이 N회 감사 후 호출.
import { readdir, readFile, writeFile, rm } from 'node:fs/promises'
import { join } from 'node:path'
import { SCHEMA_VERSION, type GeoScoreSnapshot } from '../../types/snapshot'
import { getActiveServices } from '../config/services'
import { isoWeekOf } from '../util/time'
import { requireEnv } from '../util/env'

const SNAPSHOTS_DIR = 'snapshots'
const SCORE_FIELDS = ['composite', 'citability', 'brand', 'eeat', 'technical', 'schema', 'platform'] as const

const main = async (): Promise<void> => {
  const capturedAt = requireEnv('CAPTURED_AT')
  const isoWeek = isoWeekOf(capturedAt)

  for (const svc of getActiveServices()) {
    const dir = join(SNAPSHOTS_DIR, svc.app, isoWeek)
    let runFiles: string[]
    try {
      runFiles = (await readdir(dir)).filter((f) => /^geoScore-run\d+\.json$/.test(f)).sort()
    } catch {
      continue // 디렉터리 없음
    }
    if (!runFiles.length) {
      console.warn(`[geo:aggregate] ${svc.app} ${isoWeek}: run 파일 없음 — 스킵`)
      continue
    }

    const runs: GeoScoreSnapshot[] = []
    for (const f of runFiles) {
      try {
        runs.push(JSON.parse(await readFile(join(dir, f), 'utf8')) as GeoScoreSnapshot)
      } catch (error) {
        console.warn(`[geo:aggregate] ${f} 파싱 실패 — 제외:`, error instanceof Error ? error.message : error)
      }
    }
    if (!runs.length) continue

    const mean = (k: (typeof SCORE_FIELDS)[number]): number =>
      Math.round(runs.reduce((sum, r) => sum + (r[k] ?? 0), 0) / runs.length)
    const composites = runs.map((r) => r.composite ?? 0)
    const compositeRange: [number, number] = [Math.min(...composites), Math.max(...composites)]

    const agg: GeoScoreSnapshot = {
      schemaVersion: SCHEMA_VERSION,
      capturedAt,
      isoWeek,
      app: svc.app,
      composite: mean('composite'),
      citability: mean('citability'),
      brand: mean('brand'),
      eeat: mean('eeat'),
      technical: mean('technical'),
      schema: mean('schema'),
      platform: mean('platform'),
      runs: runs.length,
      compositeRange,
    }

    await save(join(dir, 'geoScore.json'), agg)
    // 원시 N회(투명성·재계산용). 점수 필드만 추려 보관.
    const rawRuns = runs.map((r, i) => ({
      run: i + 1,
      ...Object.fromEntries(SCORE_FIELDS.map((k) => [k, r[k] ?? null])),
    }))
    await save(join(dir, 'geoScoreRuns.json'), rawRuns)
    for (const f of runFiles) await rm(join(dir, f)) // 개별 run 파일은 geoScoreRuns.json 으로 통합 후 정리

    console.info(
      `[geo:aggregate] ${svc.app} ${isoWeek}: ${runs.length}회 평균 composite ${agg.composite} (range ${compositeRange[0]}–${compositeRange[1]})`,
    )
  }
}

const save = (path: string, data: unknown): Promise<void> =>
  writeFile(path, `${JSON.stringify(data, null, 2)}\n`, 'utf8')

main().catch((error) => {
  console.error('[geo:aggregate] 실패:', error)
  process.exit(1)
})
