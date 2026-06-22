# geo-visibility-monitor

코드잇 서비스(우선 코드잇 스프린트)의 **AI 가시성 측정 엔진**. 매주 AI 엔진/SERP 표면에 질의해 코드잇이 어떻게 인용되는지 측정하고, AI 리퍼럴·GEO 점수·소유 표면 노출을 모아 **시계열 스냅샷**(`snapshots/*.json`)을 생성한다. 대시보드는 별도(`frontend-mono/apps/geo-admin`)에서 이 스냅샷을 읽는다.

> **에이전트/기여자는 먼저 [`AGENTS.md`](./AGENTS.md) 를 읽을 것.** 아키텍처·확정 결정·데이터 계약·엔진 provisioning·빌드 순서·미해결 블로커가 모두 거기 있다.

## 빠른 시작

```bash
pnpm install
cp .env.example .env   # 키 채우기(로컬 검증용)
# 첫 실행은 안전하게: 계획만 보거나(DRY_RUN) 엔진별 1콜만(SAMPLE_N)
DRY_RUN=1 CAPTURED_AT=2026-06-22T00:00:00Z pnpm snapshot
SAMPLE_N=1 ACTIVE_ENGINES=chatgpt CAPTURED_AT=2026-06-22T00:00:00Z pnpm snapshot
pnpm typecheck && pnpm lint && pnpm test
```

### 실행 안전장치 env (PoC)

| env | 효과 |
|---|---|
| `DRY_RUN=1` | 실호출 없이 CallSpec 계획(엔진별 콜 수)만 출력. 스냅샷 미기록 |
| `SAMPLE_N=N` | 엔진별 콜 N개로 제한(샘플 실행) |
| `MAX_USD=N` | 누적 비용 N USD 초과 시 이후 콜 스킵(소프트 캡) |
| `MIN_SUCCESS_RATE=r` | 콜 성공률 r 미만이면 non-zero exit(빈/손상 스냅샷 커밋 차단). 기본 0.7 |
| `ACTIVE_SERVICES` / `ACTIVE_ENGINES` | 측정 대상 서비스/엔진 게이트(쉼표). 미설정이면 전체 |

## 구조

```
types/snapshot.ts        대시보드와 공유하는 데이터 계약(스냅샷 + 롤업 RollupIndex/WeekSummary/ServicesManifest)
src/
  config/
    types.ts             ServiceConfig·Brand·Competitor·IntentPreset 공유 타입
    pricing.ts           모델/표면 단가 → 콜당 비용 계산
    services/<app>.ts    서비스별 측정 설정(브랜드·경쟁사·질의셋) + index.ts 레지스트리
  promptBuilder.ts       {role}/{competitor} 전개 → CallSpec[]
  engines/               perplexity·openai·gemini·anthropic·serpapi 어댑터(EngineResult 정규화, 사용량 포함)
  analyze/               matchEntities(SoV) · classify→llmJudge · classifySentiment · checkAccuracy
  jobs/                  citationMonitor(A, 본체) · geoScoreRunner(C, 선행지표)  ※ B/D 드롭
  store/                 writeSnapshot · buildRollupIndex
  util/                  runOpts(안전장치 env) · fetchWithRetry(429 백오프) · concurrency · time · env
  index.ts               주간 오케스트레이션(서비스 루프 + 성공률 abort + 런 요약)
snapshots/<app>/<isoWeek>/   visibility·responses·cost·geoScore.json
snapshots/<app>/index.json   서비스별 롤업  ·  snapshots/services.json  서비스 매니페스트
.github/workflows/       weekly-snapshot.yml(주간 cron) · ci.yml(typecheck/lint/test)
```

## 현재 상태

멀티서비스 구조 + 그룹 A(citation monitor) + **감성·정확도 LLM 판정기** + **원문 응답 저장(responses.json)** + **API 사용량 기반 비용(cost.json)** + 안전장치(DRY_RUN/SAMPLE_N/MAX_USD/성공률 abort) + 테스트/lint/CI 완료. `tsc --noEmit`·`pnpm lint`·`pnpm test` 통과, `pnpm-lock.yaml` 커밋되어 워크플로는 `--frozen-lockfile` + `cache: pnpm` 사용.

남은 작업(에이전트 범위 밖/보류):
- **라이브 검증**: 실키로 `SAMPLE_N=2` 1회 dispatch → 엔진 응답 필드경로 실증(미검증)
- 그룹 C `geoScoreRunner` 구현방식 확정(현재 계약 필드만 예약). 그룹 B(Amplitude)·D(GSC)는 드롭됨
- 보류: Gemini 리다이렉트 URL 해소, `position` 메트릭, Claude/Perplexity 실검증

`AGENTS.md` 참고.
