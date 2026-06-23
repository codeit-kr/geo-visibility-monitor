import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type {
  App,
  RollupIndex,
  ServicesManifest,
  VisibilitySnapshot,
  ResponseRecord,
  GeoScoreSnapshot,
} from '../../types/snapshot'
import { FIXTURE_ROLLUP, FIXTURE_SERVICES } from './fixture'

// 같은 레포의 커밋된 스냅샷을 빌드 시점에 직접 읽는다(GitHub 토큰 불필요).
// 주간 Action 이 snapshots/ 커밋 → Vercel 자동 재배포 → 최신 데이터로 정적 재생성.
// build 는 dashboard/ 에서 실행되므로 process.cwd() = dashboard/ → ../snapshots = 레포 루트.
const SNAP_ROOT = join(process.cwd(), '..', 'snapshots')

const readJson = async <T>(rel: string): Promise<T | null> => {
  try {
    return JSON.parse(await readFile(join(SNAP_ROOT, rel), 'utf8')) as T
  } catch {
    return null
  }
}

const readText = async (rel: string): Promise<string | null> => {
  try {
    return await readFile(join(SNAP_ROOT, rel), 'utf8')
  } catch {
    return null
  }
}

export const getServicesManifest = async (): Promise<ServicesManifest> =>
  (await readJson<ServicesManifest>('services.json')) ?? FIXTURE_SERVICES

// 데이터(스냅샷)가 있는 서비스 키 — 라우팅(generateStaticParams)·기본 서비스 선택의 단일 출처.
// 매니페스트 기반이라 새 서비스가 첫 스냅샷을 쌓으면 라우트가 자동 생성된다(대시보드 코드 수정 불필요).
export const getApps = async (): Promise<App[]> => (await getServicesManifest()).services.map((s) => s.app)

export const getDefaultApp = async (): Promise<App> => (await getApps())[0] ?? 'sprint'

// 앱×주차 조합 전체 — 주차 단위 정적 경로(/[app]/[week] 등)의 generateStaticParams.
export const getAppWeeks = async (): Promise<{ app: App; week: string }[]> => {
  const apps = await getApps()
  const rollups = await Promise.all(apps.map((app) => getRollup(app)))
  return apps.flatMap((app, i) => rollups[i].weeks.map((w) => ({ app, week: w.isoWeek })))
}

export const getRollup = async (app: App): Promise<RollupIndex> => {
  const r = await readJson<RollupIndex>(join(app, 'index.json'))
  if (r) return r
  // 스냅샷 전무(로컬 데모)면 sprint fixture, 그 외 앱은 요청 app 을 보존한 빈 롤업.
  // (fixture 의 'sprint' 가 새어나가 타 서비스 페이지 링크·주차가 /sprint 로 가는 것 방지)
  return app === FIXTURE_ROLLUP.app ? FIXTURE_ROLLUP : { ...FIXTURE_ROLLUP, app, displayName: app, weeks: [] }
}

// 상세 드릴다운 — 주차별 per-call 메트릭(visibility) + 응답 원문(responses).
export const getVisibility = async (app: App, isoWeek: string): Promise<VisibilitySnapshot[]> =>
  (await readJson<VisibilitySnapshot[]>(join(app, isoWeek, 'visibility.json'))) ?? []

export const getResponses = async (app: App, isoWeek: string): Promise<ResponseRecord[]> =>
  (await readJson<ResponseRecord[]>(join(app, isoWeek, 'responses.json'))) ?? []

// GEO 감사(그룹 C) — 카테고리 점수 JSON + 리포트 본문(MD).
export const getGeoScore = async (app: App, isoWeek: string): Promise<GeoScoreSnapshot | null> =>
  readJson<GeoScoreSnapshot>(join(app, isoWeek, 'geoScore.json'))

export const getGeoReport = async (app: App, isoWeek: string): Promise<string | null> =>
  readText(join(app, isoWeek, 'geo-audit-report.md'))

// 실 스냅샷 존재 여부(없으면 fixture로 렌더 중임을 배지로 표시)
export const snapshotsAvailable = async (): Promise<boolean> =>
  (await readJson('services.json')) !== null
