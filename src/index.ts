// 오케스트레이션 — 주간 측정 1회. GitHub Actions(weekly-snapshot.yml)가 호출.
//   활성 서비스(getActiveServices)별로:
//     1) 컨텍스트(CAPTURED_AT 주입) → 2) 그룹 A(citation) 실행 → 3) 주차 스냅샷 기록
//   마지막에 전 서비스 롤업 인덱스 + 서비스 매니페스트 갱신.
// 측정 그룹: A(citation, 본체)만 이 node 런이 담당. C(geoScore)는 에이전트형이라 별도
//   GitHub Action(geo-audit.yml)이 geoScore.json 을 기록 → buildRollupIndex 가 롤업에 합침.
//   B(Amplitude)·D(GSC)는 드롭.
import { appendFile } from 'node:fs/promises'
import { buildContext } from './context'
import { runCitationMonitor, type RunStats } from './jobs/citationMonitor'
import { collectPages } from './jobs/collectPages'
import { writeSnapshot } from './store/writeSnapshot'
import { buildRollupIndex } from './store/buildRollupIndex'
import { SERVICES, getActiveServices } from './config/services'
import { DRY_RUN, MIN_SUCCESS_RATE } from './util/runOpts'
import type { SnapshotBundle } from '../types/snapshot'

const main = async (): Promise<void> => {
  const services = getActiveServices()
  console.info(`[run] 측정 대상 ${services.length}개 서비스: ${services.map((s) => s.app).join(', ')}${DRY_RUN ? ' (DRY_RUN)' : ''}`)

  const summary: string[] = ['| service | rows | success | cost(USD) |', '|---|---|---|---|']
  const totals: RunStats = { attempted: 0, succeeded: 0, skipped: 0 }

  // 서비스는 순차 실행(엔진 비용·SerpApi 쿼터 관리).
  for (const service of services) {
    const ctx = buildContext(service.app)
    console.info(`[run] ${ctx.app} · ${ctx.isoWeek} · ${ctx.capturedAt}`)

    const visibilityResult = await runCitationMonitor(ctx, service)
    const { snapshots: visibility, responses, cost, stats } = visibilityResult
    totals.attempted += stats.attempted
    totals.succeeded += stats.succeeded
    totals.skipped += stats.skipped

    // DRY_RUN 은 계획만 — 페이지 크롤·스냅샷 기록·롤업 생략(빈 산출물 커밋 방지).
    if (!DRY_RUN) {
      const pages = await collectPages(ctx, service)
      const bundle: SnapshotBundle = { visibility, responses, cost, pages }
      await writeSnapshot(ctx.app, ctx.isoWeek, bundle)
    }

    const ok = stats.attempted ? `${stats.succeeded}/${stats.attempted}` : '—'
    console.info(
      `[run] ${ctx.app} 완료 — visibility ${visibility.length} / responses ${responses.length} / cost $${cost.total.costUsd.toFixed(4)} / 성공 ${ok}${stats.skipped ? ` / 스킵 ${stats.skipped}(비용캡)` : ''}`,
    )
    summary.push(`| ${ctx.app} | ${visibility.length} | ${ok} | ${cost.total.costUsd.toFixed(4)} |`)
  }

  if (!DRY_RUN) {
    // 롤업·매니페스트는 전체 서비스 레지스트리 기준(이번에 안 돈 서비스의 과거 데이터/목록도 유지).
    await buildRollupIndex(SERVICES)
    console.info('[run] 전체 완료 — 롤업/매니페스트 갱신')
  }

  // 런 요약을 GitHub Actions 스텝 요약에 기록(엔진별이 아닌 서비스별 — 콜 수·성공률·비용).
  const successRate = totals.attempted ? totals.succeeded / totals.attempted : 1
  await writeStepSummary(summary, totals, successRate)

  // 실패율 abort: 성공률이 임계 미만이면 non-zero exit → 워크플로 커밋 스텝이 안 돈다(빈/손상 스냅샷 방지).
  if (totals.attempted > 0 && successRate < MIN_SUCCESS_RATE) {
    console.error(
      `[run] 실패 — 성공률 ${(successRate * 100).toFixed(1)}% < 임계 ${(MIN_SUCCESS_RATE * 100).toFixed(0)}% (커밋 차단)`,
    )
    process.exit(1)
  }
}

const writeStepSummary = async (rows: string[], totals: RunStats, rate: number): Promise<void> => {
  const path = process.env.GITHUB_STEP_SUMMARY
  if (!path) return
  const body = [
    '## 측정 런 요약',
    '',
    ...rows,
    '',
    `**성공률**: ${totals.succeeded}/${totals.attempted} (${(rate * 100).toFixed(1)}%)${totals.skipped ? ` · 스킵 ${totals.skipped}(비용캡)` : ''}`,
    '',
  ].join('\n')
  await appendFile(path, `${body}\n`, 'utf8')
}

main().catch((error) => {
  console.error('[run] 실패:', error)
  process.exit(1)
})
