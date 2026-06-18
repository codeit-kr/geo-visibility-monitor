// 측정 1회의 공통 컨텍스트. capturedAt 은 CI(CAPTURED_AT)에서만 주입 → 재실행 재현성.
import type { App } from '../types/snapshot'
import { isoWeekOf } from './util/time'
import { requireEnv } from './util/env'

export interface SnapshotContext {
  capturedAt: string
  isoWeek: string
  app: App
}

export const buildContext = (app: App = 'sprint'): SnapshotContext => {
  const capturedAt = requireEnv('CAPTURED_AT')
  return { capturedAt, isoWeek: isoWeekOf(capturedAt), app }
}
