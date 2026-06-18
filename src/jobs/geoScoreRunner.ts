// 그룹 C — 선행지표. 기존 geo-audit 스킬을 헤드리스로 돌려 GEO 점수 스냅샷화.
import { SCHEMA_VERSION, type GeoScoreSnapshot } from '../../types/snapshot'
import type { SnapshotContext } from '../context'
import type { ServiceConfig } from '../config/types'

export const runGeoScoreRunner = async (
  ctx: SnapshotContext,
  service: ServiceConfig,
): Promise<GeoScoreSnapshot[]> => {
  // TODO: geo-audit 를 헤드리스로 실행(서브프로세스 또는 포팅)해 composite/카테고리 점수 추출.
  //   서비스별 사이트(service.brand.domains)를 대상으로. 현재 frontend-mono baseline 과 동일 산식.
  void ctx
  void service
  console.warn(`[geoScoreRunner] 미구현 — geo-audit 헤드리스화 필요 (${ctx.app})`)
  return []
}
