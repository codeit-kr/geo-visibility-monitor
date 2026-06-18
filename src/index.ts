// 오케스트레이션 — 주간 측정 1회. GitHub Actions(weekly-snapshot.yml)가 호출.
//   활성 서비스(getActiveServices)별로:
//     1) 컨텍스트(CAPTURED_AT 주입) → 2) 4그룹 잡 실행 → 3) 주차 스냅샷 기록
//   마지막에 전 서비스 롤업 인덱스 + 서비스 매니페스트 갱신.
import { buildContext } from './context'
import { runCitationMonitor } from './jobs/citationMonitor'
import { runAmplitudeReferralSync } from './jobs/amplitudeReferralSync'
import { runGeoScoreRunner } from './jobs/geoScoreRunner'
import { runSearchConsoleSync } from './jobs/searchConsoleSync'
import { writeSnapshot } from './store/writeSnapshot'
import { buildRollupIndex } from './store/buildRollupIndex'
import { SERVICES, getActiveServices } from './config/services'
import type { SnapshotBundle } from '../types/snapshot'

const main = async (): Promise<void> => {
  const services = getActiveServices()
  console.info(`[run] 측정 대상 ${services.length}개 서비스: ${services.map((s) => s.app).join(', ')}`)

  // 서비스는 순차 실행(엔진 비용·SerpApi 쿼터 관리). 서비스 내부 B·C·D 잡은 병렬.
  for (const service of services) {
    const ctx = buildContext(service.app)
    console.info(`[run] ${ctx.app} · ${ctx.isoWeek} · ${ctx.capturedAt}`)

    const [visibilityResult, referral, geoScore, owned] = await Promise.all([
      runCitationMonitor(ctx, service),
      runAmplitudeReferralSync(ctx, service),
      runGeoScoreRunner(ctx, service),
      runSearchConsoleSync(ctx, service),
    ])
    const { snapshots: visibility, responses, cost } = visibilityResult

    const bundle: SnapshotBundle = { visibility, responses, cost, referral, geoScore, owned }
    await writeSnapshot(ctx.app, ctx.isoWeek, bundle)

    console.info(
      `[run] ${ctx.app} 완료 — visibility ${visibility.length} / responses ${responses.length} / cost $${cost.total.costUsd.toFixed(4)} / referral ${referral.length} / geoScore ${geoScore.length} / owned ${owned.length}`,
    )
  }

  // 롤업·매니페스트는 전체 서비스 레지스트리 기준(이번에 안 돈 서비스의 과거 데이터/목록도 유지).
  await buildRollupIndex(SERVICES)
  console.info('[run] 전체 완료 — 롤업/매니페스트 갱신')
}

main().catch((error) => {
  console.error('[run] 실패:', error)
  process.exit(1)
})
