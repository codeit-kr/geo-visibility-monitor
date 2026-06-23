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
  jobs/                  citationMonitor(A, 본체)   ※ C=geo-audit Action 별도, B/D 드롭
  store/                 writeSnapshot · buildRollupIndex
  util/                  runOpts(안전장치 env) · fetchWithRetry(429 백오프) · concurrency · time · env
  scripts/auditTargets.ts  geo-audit Action 용 감사 대상(app·url·isoWeek) 출력
  index.ts               그룹 A 오케스트레이션(서비스 루프 + 성공률 abort + 런 요약)
  rollup.ts              롤업 단독 재생성(geo-audit Action 이 geoScore 기록 후 호출)
snapshots/<app>/<isoWeek>/   visibility·responses·cost.json (+ geoScore.json·geo-audit-report.md = geo-audit Action)
snapshots/<app>/index.json   서비스별 롤업  ·  snapshots/services.json  서비스 매니페스트
.github/workflows/       weekly-snapshot.yml(A, 주간) · geo-audit.yml(C, A 완료 후 체이닝) · ci.yml
```

## 측정 그룹

- **A — 가시성(node 주간 cron)**: `pnpm snapshot` → visibility·responses·cost.json.
- **C — GEO 점수(geo-audit GitHub Action)**: `/geo-audit` 스킬(에이전트형)을 `weekly-geo-audit` 워크플로가 헤드리스 실행 → 서비스별 `geoScore.json`(+리포트) 기록 → `pnpm rollup` 으로 `index.json` 에 합침. **인증: Claude 구독 OAuth 토큰** — `claude setup-token` 으로 발급 → Secret `CLAUDE_CODE_OAUTH_TOKEN`(별도 API 키 결제 불필요).
  - ⏰ **토큰 만료 1년 — 최종 발급 2026-06-23, ~2027-06-23 갱신 필요.** 만료 시 geo-audit 잡 인증 실패 → `claude setup-token` 재발급 후 Secret `CLAUDE_CODE_OAUTH_TOKEN` 갱신.
  - **재현성 설계**(delta 미사용): 동일 감사를 **3회 실행 → 평균(geoScore.json) + 변동폭(compositeRange), 원시 3회는 geoScoreRuns.json** 으로 LLM 채점 변동을 통계로 흡수. 입력 고정(`auditUrls` 우리 페이지만 + `brandSources` 체크리스트 `brandSourcesVersion` 추적, 외 발견은 디스커버리·점수 제외) + KR 현지화 + `--model claude-opus-4-8` 고정.
- B(Amplitude)·D(GSC)는 드롭.

## 현재 상태

멀티서비스 + 그룹 A + 감성·정확도 LLM 판정기 + 원문 저장(responses.json) + 비용(cost.json) + 안전장치(DRY_RUN/SAMPLE_N/MAX_USD/성공률 abort) + **그룹 C geo-audit Action 연동** + 테스트/lint/CI 완료. `tsc`·`lint`·`test` 통과, 워크플로는 `--frozen-lockfile` + `cache: pnpm`.

남은 작업(에이전트 범위 밖/보류):
- **GitHub Secret**: `CLAUDE_CODE_OAUTH_TOKEN`(`claude setup-token`, Max/Pro 구독) 등록 + 첫 수동 dispatch 로 geoScore.json 산출 검증
- **라이브 검증**: 실키로 그룹 A `SAMPLE_N=2` 1회 dispatch → 엔진 응답 필드경로 실증
- 보류: Gemini 리다이렉트 URL 해소, `position` 메트릭, Claude/Perplexity 실검증

`AGENTS.md` 참고.
