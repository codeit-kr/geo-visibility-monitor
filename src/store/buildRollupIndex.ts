// 스냅샷 → 롤업 인덱스(대시보드 단일 읽기용).
//   snapshots/<app>/index.json   : 서비스별 주차 요약(헤드라인 = visibility)
//   snapshots/services.json       : 서비스 매니페스트(어드민 서비스 스위처용)
// 개별 주차 파일은 드릴다운 때만 읽도록. 타입은 types/snapshot.ts(공유 계약).
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import {
  SCHEMA_VERSION,
  type VisibilitySnapshot,
  type CostSnapshot,
  type GeoScoreSnapshot,
  type Engine,
  type WeekSummary,
  type RollupIndex,
  type ServiceManifestEntry,
  type ServicesManifest,
} from '../../types/snapshot'
import type { ServiceConfig } from '../config/types'
import { SNAPSHOTS_DIR } from './writeSnapshot'

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
      const geo = await loadJson<GeoScoreSnapshot>(join(appDir, isoWeek, 'geoScore.json'))
      summaries.push(summarizeWeek(isoWeek, vis, cost, geo))
    }

    if (summaries.length) {
      const index: RollupIndex = {
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

  const services_index: ServicesManifest = { schemaVersion: SCHEMA_VERSION, services: manifest }
  await writeFile(
    join(SNAPSHOTS_DIR, 'services.json'),
    `${JSON.stringify(services_index, null, 2)}\n`,
    'utf8',
  )
}

// 주차 1개 집계. `all` = 해당 주 visibility.json 전체(모든 metricRole 행), `cost` = cost.json(없으면 null).
// 헤드라인 지표(mention/SoV/엔진별)는 visibility 풀만, 감성·정확도는 전 행(reputation/accuracy 포함).
export const summarizeWeek = (
  isoWeek: string,
  all: VisibilitySnapshot[],
  cost: CostSnapshot | null,
  geo: GeoScoreSnapshot | null = null,
): WeekSummary => {
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
      const competitors = s.competitorsMentioned?.length ?? 0
      const denom = (s.mentioned ? 1 : 0) + competitors
      return denom === 0 ? null : (s.mentioned ? 1 : 0) / denom
    })
    .filter((v): v is number => v !== null)
  const sov = sovValues.length ? sovValues.reduce((a, b) => a + b, 0) / sovValues.length : null

  // 경쟁사별 SoV 분해 — 경쟁 풀(브랜드 언급 + 전 경쟁사 언급) 내 각 경쟁사 점유.
  const brandMentions = vis.filter((s) => s.mentioned).length
  const competitorCounts: Record<string, number> = {}
  for (const s of vis) {
    for (const c of s.competitorsMentioned ?? []) competitorCounts[c] = (competitorCounts[c] ?? 0) + 1
  }
  const pool = brandMentions + Object.values(competitorCounts).reduce((a, b) => a + b, 0)
  const competitorSov: Record<string, number> = {}
  for (const [c, n] of Object.entries(competitorCounts)) competitorSov[c] = pool ? n / pool : 0

  // 감성 분해(전 행, sentiment 있는 건만) + 정확도 플래그 카운트(전 행).
  const sentiment = { positive: 0, neutral: 0, negative: 0 }
  const accuracyFlags: Record<string, number> = {}
  for (const s of all) {
    if (s.sentiment) sentiment[s.sentiment] += 1
    for (const f of s.accuracyFlags ?? []) accuracyFlags[f] = (accuracyFlags[f] ?? 0) + 1
  }

  // 엔진별 비용(cost.json byEngine). classifier 버킷은 엔진이 아니므로 제외.
  const byEngineCostUsd: Partial<Record<Engine, number>> = {}
  if (cost) {
    for (const [bucket, uc] of Object.entries(cost.byEngine)) {
      if (bucket !== 'classifier') byEngineCostUsd[bucket as Engine] = uc.costUsd
    }
  }

  return {
    isoWeek,
    mentionRate,
    sov,
    competitorSov,
    sentiment,
    accuracyFlags,
    byEngine,
    byEngineCostUsd,
    sampleSize: vis.length,
    costUsd: cost?.total.costUsd ?? null,
    geoScore: geo?.composite ?? null, // 그룹 C composite N회 평균(geo-audit Action)
    geoScoreRange: geo?.compositeRange ?? null,
  }
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
