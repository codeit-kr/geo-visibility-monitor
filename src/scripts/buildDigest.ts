// 다이제스트 검증·폴백 — claude-code-action(구독)이 digest-targets.json 을 보고 쓴
// snapshots/<app>/<isoWeek>/digest.json 을 검증·정규화하고, 없거나 깨졌으면 규칙 기반으로 생성한다.
// (LLM 산출이 파이프라인을 깨지 않게 하는 안전망 — 항상 유효한 digest.json 을 남기고 끝난다.)
// 대시보드는 이 파일을 읽어 전 회차 비교 페이지에 렌더만 한다(대시보드에 LLM 키 금지 — 잠긴 결정).
import { readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { SCHEMA_VERSION, type GeoScoreSnapshot, type RollupIndex, type WeekDigest } from '../../types/snapshot'
import { getActiveServices } from '../config/services'
import { SNAPSHOTS_DIR } from '../store/writeSnapshot'
import { computeTrend, ruleBasedActionItems, sanitizeDigest, type DigestContent } from './weeklyDigest'

const readJson = async <T>(path: string): Promise<T | null> => {
  try {
    return JSON.parse(await readFile(path, 'utf8')) as T
  } catch {
    return null
  }
}

const main = async () => {
  for (const svc of getActiveServices()) {
    const rollup = await readJson<RollupIndex>(join(SNAPSHOTS_DIR, svc.app, 'index.json'))
    const cur = rollup?.weeks[rollup.weeks.length - 1]
    if (!rollup || !cur) {
      console.warn(`[digest] ${svc.app}: 주차 데이터 없음 — 스킵`)
      continue
    }
    const prev = rollup.weeks[rollup.weeks.length - 2]
    const trend = computeTrend(cur, prev)
    const weekDir = join(SNAPSHOTS_DIR, svc.app, cur.isoWeek)
    const outPath = join(weekDir, 'digest.json')

    const existing = await readJson<Record<string, unknown>>(outPath)
    const sanitized = existing ? sanitizeDigest(existing, { app: svc.app, isoWeek: cur.isoWeek }) : null
    const content: DigestContent = sanitized ?? {
      actions: { ...ruleBasedActionItems(cur, trend), source: 'rules' },
    }

    // capturedAt — action 산출값 우선, 없으면 CI 주입(CAPTURED_AT) → geoScore 측정 시각(argless new Date 금지).
    const geoScore = await readJson<GeoScoreSnapshot>(join(weekDir, 'geoScore.json'))
    const existingCapturedAt = sanitized && typeof existing?.capturedAt === 'string' ? existing.capturedAt : ''
    const digest: WeekDigest = {
      schemaVersion: SCHEMA_VERSION,
      capturedAt: existingCapturedAt || process.env.CAPTURED_AT || geoScore?.capturedAt || '',
      isoWeek: cur.isoWeek,
      app: svc.app,
      prevWeek: trend.prevWeek,
      actions: content.actions,
      ...(content.geoAuditChanges ? { geoAuditChanges: content.geoAuditChanges } : {}),
    }
    await writeFile(outPath, `${JSON.stringify(digest, null, 2)}\n`, 'utf8')
    console.info(
      `[digest] ${svc.app} ${cur.isoWeek}: product ${digest.actions.product.length} · marketing ${digest.actions.marketing.length} (${digest.actions.source}${sanitized ? ', action 산출 검증됨' : existing ? ', action 산출 무효 → 폴백' : ''})${digest.geoAuditChanges ? ' + 감사 변화' : ''}`,
    )
  }
}

main().catch((error) => {
  console.error('[digest] 실패:', error)
  process.exit(1)
})
