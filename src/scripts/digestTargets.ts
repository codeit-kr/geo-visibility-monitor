// digest-targets.json 산출(stdout) — claude-code-action(구독) 다이제스트 생성의 고정 입력.
//   서비스별 최신 주차의 지표 요약 + 전 회차 대비 delta + 감사 리포트 이슈 발췌를 한 파일로 모아,
//   action 프롬프트가 이 파일만 읽고 outPath 에 digest.json 을 쓰게 한다(임의 크롤 없음 — 재현성).
//   사용: CAPTURED_AT=... pnpm -s digest:targets > digest-targets.json
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import type { RollupIndex } from '../../types/snapshot'
import { getActiveServices } from '../config/services'
import { SNAPSHOTS_DIR } from '../store/writeSnapshot'
import { buildDigestMetrics, computeTrend, extractAuditIssues } from './weeklyDigest'

const readAuditIssues = (app: string, isoWeek: string): Promise<string> =>
  readFile(join(SNAPSHOTS_DIR, app, isoWeek, 'geo-audit-report-run1.md'), 'utf8')
    .then(extractAuditIssues)
    .catch(() => '')

const main = async () => {
  const targets = []
  for (const svc of getActiveServices()) {
    // passive 서비스는 가시성 지표가 없어 다이제스트(팀별 액션) 대상이 아님 — geo 리포트는 대시보드에서 확인.
    if (svc.passive) {
      console.warn(`[digest:targets] ${svc.app}: passive — 스킵`)
      continue
    }
    let rollup: RollupIndex
    try {
      rollup = JSON.parse(await readFile(join(SNAPSHOTS_DIR, svc.app, 'index.json'), 'utf8')) as RollupIndex
    } catch {
      console.warn(`[digest:targets] ${svc.app}: index.json 없음 — 스킵`)
      continue
    }
    const cur = rollup.weeks[rollup.weeks.length - 1]
    if (!cur) {
      console.warn(`[digest:targets] ${svc.app}: 주차 데이터 없음 — 스킵`)
      continue
    }
    const prev = rollup.weeks[rollup.weeks.length - 2]
    const trend = computeTrend(cur, prev)
    const [auditIssues, prevAuditIssues] = await Promise.all([
      readAuditIssues(svc.app, cur.isoWeek),
      prev ? readAuditIssues(svc.app, prev.isoWeek) : Promise.resolve(''),
    ])
    targets.push({
      app: svc.app,
      displayName: svc.displayName,
      isoWeek: cur.isoWeek,
      prevWeek: trend.prevWeek,
      capturedAt: process.env.CAPTURED_AT ?? '',
      outPath: `${SNAPSHOTS_DIR}/${svc.app}/${cur.isoWeek}/digest.json`,
      metrics: buildDigestMetrics(cur, prev, trend),
      auditIssues,
      prevAuditIssues,
    })
  }
  console.log(JSON.stringify(targets, null, 2))
}

main().catch((error) => {
  console.error('[digest:targets] 실패:', error)
  process.exit(1)
})
