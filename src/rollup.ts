// 롤업 단독 재생성 — geo-audit GitHub Action 이 geoScore.json 을 쓴 뒤 index.json 을 갱신할 때 사용.
// (node 주간 스냅샷도 끝에 buildRollupIndex 를 호출하므로, 이건 그 이후 geoScore 반영용 보강 실행)
import { buildRollupIndex } from './store/buildRollupIndex'
import { SERVICES } from './config/services'

buildRollupIndex(SERVICES)
  .then(() => console.info('[rollup] index.json·services.json 갱신 완료'))
  .catch((error) => {
    console.error('[rollup] 실패:', error)
    process.exit(1)
  })
