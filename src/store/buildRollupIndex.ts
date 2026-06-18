// 스냅샷 → 롤업 인덱스(대시보드 단일 읽기용).
//   snapshots/<app>/index.json   : 서비스별 주차 요약(헤드라인 = visibility)
//   snapshots/services.json       : 서비스 매니페스트(어드민 서비스 스위처용)
// 개별 주차 파일은 드릴다운 때만 읽도록.
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import {
  SCHEMA_VERSION,
  type VisibilitySnapshot,
  type CostSnapshot,
  type Engine,
  type App,
} from '../../types/snapshot'
import type { ServiceConfig } from '../config/types'
import { SNAPSHOTS_DIR } from './writeSnapshot'

interface WeekSummary {
  isoWeek: string
  mentionRate: number | null // visibility 전체 풀
  sov: number | null // 무브랜드 경쟁 점유(평균 per-call SoV)
  byEngine: Partial<Record<Engine, number | null>> // 엔진별 mention rate(visibility)
  sampleSize: number
  costUsd: number | null // 해당 주 측정 비용(cost.json 총액). 없으면 null
}

interface ServiceManifestEntry {
  app: App
  displayName: string
  weeks: number // 보유 주차 수(0 이면 아직 측정 없음)
  latestWeek: string | null
}

export const buildRollupIndex = async (services: ServiceConfig[]): Promise<void> => {
  await mkdir(SNAPSHOTS_DIR, { recursive: true })
  const manifest: ServiceManifestEntry[] = []

  for (const service of services) {
    const appDir = join(SNAPSHOTS_DIR, service.app)
    const weeks = await listWeekDirs(appDir)

    const summaries: WeekSummary[] = []
    for (const isoWeek of weeks) {
      const vis = await loadJson<VisibilitySnapshot[]>(join(appDir, isoWeek, 'visibility.json'))
      if (!vis) continue
      const cost = await loadJson<CostSnapshot>(join(appDir, isoWeek, 'cost.json'))
      summaries.push(summarizeWeek(isoWeek, vis, cost?.total.costUsd ?? null))
    }

    if (summaries.length) {
      const index = {
        schemaVersion: SCHEMA_VERSION,
        app: service.app,
        displayName: service.displayName,
        weeks: summaries,
      }
      await writeFile(join(appDir, 'index.json'), `${JSON.stringify(index, null, 2)}\n`, 'utf8')
    }

    manifest.push({
      app: service.app,
      displayName: service.displayName,
      weeks: summaries.length,
      latestWeek: summaries.length ? summaries[summaries.length - 1].isoWeek : null,
    })
  }

  const services_index = { schemaVersion: SCHEMA_VERSION, services: manifest }
  await writeFile(
    join(SNAPSHOTS_DIR, 'services.json'),
    `${JSON.stringify(services_index, null, 2)}\n`,
    'utf8',
  )
}

const summarizeWeek = (isoWeek: string, all: VisibilitySnapshot[], costUsd: number | null): WeekSummary => {
  const vis = all.filter((s) => s.metricRole === 'visibility')
  const mentionRate = rate(vis.filter((s) => s.mentioned).length, vis.length)

  const byEngine: Partial<Record<Engine, number | null>> = {}
  for (const engine of new Set(vis.map((s) => s.engine))) {
    const calls = vis.filter((s) => s.engine === engine)
    byEngine[engine] = rate(calls.filter((s) => s.mentioned).length, calls.length)
  }

  // per-call SoV 평균(분모 0 콜 제외). visibility 의도는 모두 경쟁사 매칭 대상.
  const sovValues = vis
    .map((s) => {
      // competitorsMentioned 가 구 스키마/손상으로 없을 수 있으니 방어
      const competitors = s.competitorsMentioned?.length ?? 0
      const denom = (s.mentioned ? 1 : 0) + competitors
      return denom === 0 ? null : (s.mentioned ? 1 : 0) / denom
    })
    .filter((v): v is number => v !== null)
  const sov = sovValues.length ? sovValues.reduce((a, b) => a + b, 0) / sovValues.length : null

  return { isoWeek, mentionRate, sov, byEngine, sampleSize: vis.length, costUsd }
}

const rate = (n: number, d: number): number | null => (d === 0 ? null : n / d)

const listWeekDirs = async (dir: string): Promise<string[]> => {
  try {
    const entries = await readdir(dir, { withFileTypes: true })
    return entries
      .filter((e) => e.isDirectory() && /^\d{4}-W\d{2}$/.test(e.name))
      .map((e) => e.name)
      .sort()
  } catch {
    return []
  }
}

const loadJson = async <T>(path: string): Promise<T | null> => {
  let raw: string
  try {
    raw = await readFile(path, 'utf8')
  } catch {
    return null // 파일 없음(정상 — 해당 산출물이 없는 주차)
  }
  try {
    return JSON.parse(raw) as T
  } catch (error) {
    // 파일은 있는데 파싱 실패 = 손상. 조용히 넘기지 말고 경고.
    console.warn(`[rollup] ${path} 파싱 실패(손상 의심):`, error instanceof Error ? error.message : error)
    return null
  }
}
