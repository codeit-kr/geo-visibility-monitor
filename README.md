# geo-visibility-monitor

코드잇 서비스(우선 코드잇 스프린트)의 **AI 가시성 측정 엔진**. 매주 AI 엔진/SERP 표면에 질의해 코드잇이 어떻게 인용되는지 측정하고, AI 리퍼럴·GEO 점수·소유 표면 노출을 모아 **시계열 스냅샷**(`snapshots/*.json`)을 생성한다. 대시보드는 별도(`frontend-mono/apps/geo-admin`)에서 이 스냅샷을 읽는다.

> **에이전트/기여자는 먼저 [`AGENTS.md`](./AGENTS.md) 를 읽을 것.** 아키텍처·확정 결정·데이터 계약·엔진 provisioning·빌드 순서·미해결 블로커가 모두 거기 있다.

## 빠른 시작

```bash
pnpm install
cp .env.example .env   # 키 채우기(로컬 검증용)
CAPTURED_AT=2026-06-22T00:00:00Z pnpm snapshot
pnpm typecheck
```

## 구조

```
types/snapshot.ts        대시보드와 공유하는 데이터 계약(버저닝)
src/
  config/                prompts.ts(의도×패러프레이즈×rep) · competitors.ts
  promptBuilder.ts       {role}/{competitor} 전개 → CallSpec[]
  engines/               perplexity·openai·gemini·anthropic·serpapi 어댑터(EngineResult 정규화)
  analyze/               matchEntities(SoV) · classifySentiment · checkAccuracy
  jobs/                  citationMonitor(A) · amplitudeReferralSync(B) · geoScoreRunner(C) · searchConsoleSync(D)
  store/                 writeSnapshot · buildRollupIndex
  index.ts               주간 오케스트레이션
snapshots/               결과(source of truth, git 히스토리 = 시계열) + index.json 롤업
.github/workflows/       weekly-snapshot.yml (주간 cron)
```

## 현재 상태

스캐폴드 + 그룹 A(citation monitor) 골격 + **감성·정확도 LLM 판정기**(`analyze/classify` → `llmJudge`, 휴리스틱 폴백) 완성. 남은 작업:
- 엔진 응답 필드 경로 검증(Gemini 리다이렉트 해소, Claude 인용 경로, SerpApi Naver AI 블록 키), 모델 ID 현행 확인
- 잡 B/C/D 실연결(Amplitude / geo-audit 헤드리스 / Search Console)
- **`pnpm-lock.yaml` 커밋** 후 워크플로를 `--frozen-lockfile` + `cache: pnpm` 으로 전환(현재는 lockfile 없어 비활성)
- `pnpm install && pnpm typecheck` 로 타입 검증

`AGENTS.md` §10·§11 참고.
