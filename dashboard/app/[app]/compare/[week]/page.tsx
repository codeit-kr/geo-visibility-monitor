import type { App } from '../../../../../types/snapshot'
import {
  getAppWeeks,
  getDigest,
  getGeoScore,
  getGeoScoreRuns,
  getRollup,
  getServicesManifest,
  getVisibility,
  snapshotsAvailable,
} from '../../../../src/data'
import { compareWeeks } from '../../../../src/compare'
import { WeekCompare } from '../../../../src/WeekCompare'

// 전 회차 비교 — 선택 주차 vs 직전 보유 주차(격주 운영이라 "전 주"가 아닐 수 있음).
export const dynamicParams = false

export const generateMetadata = async ({ params }: { params: Promise<{ week: string }> }) => {
  const { week } = await params
  return { title: `전 회차 비교 · ${week}` }
}

export const generateStaticParams = getAppWeeks

const Page = async ({ params }: { params: Promise<{ app: string; week: string }> }) => {
  const { app: appParam, week } = await params
  const app = appParam as App
  const [services, rollup, available] = await Promise.all([
    getServicesManifest(),
    getRollup(app),
    snapshotsAvailable(),
  ])
  const weeks = rollup.weeks
  const idx = (() => {
    const i = weeks.findIndex((w) => w.isoWeek === week)
    return i >= 0 ? i : weeks.length - 1
  })()
  const cur = weeks[idx]
  const prev = idx > 0 ? weeks[idx - 1] : null

  const [visCur, visPrev, geoCur, geoPrev, runsCur, runsPrev, digest] = cur
    ? await Promise.all([
        getVisibility(app, cur.isoWeek),
        prev ? getVisibility(app, prev.isoWeek) : Promise.resolve([]),
        getGeoScore(app, cur.isoWeek),
        prev ? getGeoScore(app, prev.isoWeek) : Promise.resolve(null),
        getGeoScoreRuns(app, cur.isoWeek),
        prev ? getGeoScoreRuns(app, prev.isoWeek) : Promise.resolve(null),
        getDigest(app, cur.isoWeek),
      ])
    : [[], [], null, null, null, null, null]

  // per-call 스냅샷이 양쪽 다 있어야 질의 단위 전이 계산 가능(없으면 컴포넌트가 안내 문구).
  const comparison = prev && visCur.length && visPrev.length ? compareWeeks(visPrev, visCur) : null

  return (
    <WeekCompare
      app={app}
      rollup={rollup}
      services={services}
      cur={cur}
      prev={prev}
      geoCur={geoCur}
      geoPrev={geoPrev}
      runsCur={runsCur}
      runsPrev={runsPrev}
      comparison={comparison}
      digest={digest}
      usingFixture={!available}
    />
  )
}

export default Page
