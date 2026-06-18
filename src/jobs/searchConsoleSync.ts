// 그룹 D — 소유 표면 실측. Search Console / Bing Webmaster 의 AI 표면 노출·클릭.
// 시뮬레이션(그룹 A)의 챗봇 proxy 약점을 실측으로 보정.
import { SCHEMA_VERSION, type OwnedSurfaceSnapshot } from '../../types/snapshot'
import type { SnapshotContext } from '../context'
import type { ServiceConfig } from '../config/types'

export const runSearchConsoleSync = async (
  ctx: SnapshotContext,
  service: ServiceConfig,
): Promise<OwnedSurfaceSnapshot[]> => {
  // TODO: Search Console API(searchanalytics.query) — AI Overview/AI Mode 표면 노출·클릭.
  //   서비스별 사이트(service.brand.domains) 단위. 현행 granularity 확인 필요(2026). Bing 동일 패턴.
  void ctx
  void service
  console.warn(`[searchConsoleSync] 미구현 — Search Console API 접근/granularity 확인 필요 (${ctx.app})`)
  return []
}
