# geo-visibility-monitor

코드잇 서비스가 **AI 검색(ChatGPT·Google AI Overview·Naver AI·Gemini·Claude·Perplexity)에 얼마나/어떻게 인용되는지**를 정기 측정하는 엔진과, 그 결과를 보는 in-repo 대시보드.

매 측정 주기마다 AI 표면에 질의 → 코드잇 인용 여부·SoV·감성·정확도를 분류하고, GEO 점수·비용까지 모아 **JSON 시계열 스냅샷**(`snapshots/*.json`)으로 git에 쌓는다. 같은 레포의 **Next.js 대시보드(`dashboard/`)** 가 그 스냅샷을 빌드 시점에 직접 읽어 시각화한다.

> 아키텍처·확정 결정·미해결 항목 등 **심층 컨텍스트는 [`AGENTS.md`](./AGENTS.md)**, 엔진↔대시보드 **데이터 계약은 [`types/snapshot.ts`](./types/snapshot.ts)**. 새 서비스 추가는 **`/add-service` 스킬**.

---

## 전체 흐름

```
월요일 09:00 KST · ISO 짝수주(격주) — GitHub Actions cron
┌────────────────────────────────────────────────────────────────┐
│ weekly-visibility-snapshot                             │
│   pnpm snapshot → snapshots/<app>/<week>/{visibility,responses,  │
│                    cost}.json + index.json 커밋·push             │
└───────────────┬────────────────────────────────────────────────┘
                │ 성공 시 workflow_run 체이닝
┌───────────────▼────────────────────────────────────────────────┐
│ weekly-geo-audit                                      │
│   audit ×3 (Claude 구독 OAuth, opus) → aggregate 평균/변동폭     │
│   → geoScore.json + geo-audit-report.md + rollup 커밋·push       │
│   → Vercel 재배포 READY 대기 → Slack 서비스 채널 알림            │
└────────────────────────────────────────────────────────────────┘
   git push ──► Vercel 자동 재배포 ──► 대시보드 갱신
```

- 두 워크플로 모두 매주 cron으로 깨어나되 **ISO 짝수주만 통과**(격주). **수동 `workflow_dispatch` 는 게이트 무시**하고 항상 실행.
- 데이터 소스가 git이라 측정·대시보드·알림이 단일 진실원천을 공유한다.

---

## 구조

```
types/snapshot.ts          엔진↔대시보드 공유 데이터 계약(SCHEMA_VERSION). 스냅샷 + 롤업 타입.
src/
  config/
    types.ts               ServiceConfig·Brand·Competitor·IntentPreset 등 공유 타입
    pricing.ts             모델/표면 단가 → 콜당 USD 비용 계산
    services/<app>.ts       서비스별 측정 설정(브랜드·경쟁사·질의셋·groundTruth) + index.ts 레지스트리
  promptBuilder.ts         intent → paraphrase × {role}/{competitor} 전개 × reps → CallSpec[]
  engines/                 openai·gemini·anthropic·perplexity(챗봇) + serpapi(google-aio·naver) 어댑터
  analyze/                 matchEntities(SoV) · classify→llmJudge(감성·정확도) · checkAccuracy(휴리스틱 폴백)
  jobs/citationMonitor.ts  콜 실행·분류·비용 집계
  store/                   writeSnapshot · buildRollupIndex
  util/                    runOpts(안전장치 env) · fetchWithRetry(429 백오프) · concurrency · time
  scripts/                 auditTargets(geo-audit 대상 산출) · aggregateGeoAudit(3회 집계) · notifySlack
  index.ts                 오케스트레이션(서비스 루프 + 성공률 abort + 런 요약)
  rollup.ts                롤업 단독 재생성(geo-audit 가 geoScore 기록 후 호출)
snapshots/
  <app>/<isoWeek>/         visibility·responses·cost.json (+ geoScore·geoScoreRuns.json·geo-audit-report.md)
  <app>/index.json         서비스별 주차 롤업(대시보드 헤드라인)
  services.json            서비스 매니페스트
.github/workflows/         weekly-snapshot.yml · geo-audit.yml · ci.yml
dashboard/                 in-repo Next.js 대시보드 (아래 §대시보드)
```

---

## 측정 로직 (`pnpm snapshot`)

1. **질의셋 전개** (`config/services/<app>.ts` → `promptBuilder`): 의도(intent) → 패러프레이즈(같은 의도 다른 문구 ~5) → rep(반복, 기본 1)로 펼쳐 `CallSpec[]` 생성. `{role}`·`{competitor}` 토큰 전개.
   - **metricRole**: `visibility`(무브랜드 — **헤드라인 인용률·SoV는 이것만**), `reputation`(브랜드 평판·감성), `accuracy`(팩트 vs groundTruth).
   - **표면별 질의 형태**: **챗봇 = 문장**, **SERP(검색) = 키워드(`serpQuery`)**. 실제 사용자 행동에 맞춤.
2. **엔진 호출** (`engines/`): 각 어댑터가 응답을 `EngineResult{answer, citedUrls, usage}` 로 정규화. 모든 콜은 서비스의 로케일/국가(`locale`/`userCountry`)를 강제.
3. **분류** (`analyze/`): 브랜드/경쟁사 매칭(`matchEntities` → SoV), **LLM 판정기**(`classify`→`llmJudge`)로 감성·정확도 플래그(`checkAccuracy` 는 휴리스틱 폴백).
4. **저장** (`store/`): `visibility.json`(콜당 메트릭) + `responses.json`(답변 전문, 조인키 `paraphraseId|engine|rep`) + `cost.json`(사용량 기반 비용). `buildRollupIndex` 가 `index.json`·`services.json` 집계.
5. **안전장치** (`util/runOpts`): `DRY_RUN`·`SAMPLE_N`·`MAX_USD`(소프트 캡)·`MIN_SUCCESS_RATE`(미달 시 non-zero exit → 손상 스냅샷 커밋 차단).

> 챗봇 API는 소비자 앱의 proxy → **절대값보다 추이·SoV가 신뢰도 높음**. 단일 주 델타는 노이즈(이동평균으로 판단).

## GEO 점수 (`weekly-geo-audit`)

선행지표. `/geo-audit` 에이전트 스킬을 GitHub Action이 헤드리스 실행해 서비스별 `geoScore.json`(+리포트) 산출.
- **인증**: Claude 구독 OAuth 토큰(`claude setup-token` → Secret `CLAUDE_CODE_OAUTH_TOKEN`, 별도 종량제 키 불필요). ⏰ **1년 만료 — 최종 2026-06-23, ~2027-06-23 갱신.**
- **재현성**: 동일 감사를 **3회 실행 → 평균(`geoScore.json`) + 변동폭(`compositeRange`)**, 원시 3회는 `geoScoreRuns.json`. 입력 고정(`auditUrls` 우리 페이지만 · `brandSources` 체크리스트 + `brandSourcesVersion`) + 타깃 시장 현지화 + `--model claude-opus-4-8`.

(B=Amplitude 리퍼럴, D=Search Console 은 현재 드롭.)

---

## 대시보드 (`dashboard/`)

빌드 시점에 `../snapshots` 를 직접 읽어 정적 생성하는 Next.js 앱(GitHub 토큰 불필요, 없으면 fixture 폴백). Google `codeit.com` 로그인(next-auth). Vercel 배포. **멀티 서비스** — 모든 라우트가 `/[app]/...` 로 서비스별 분기.

| 라우트 | 내용 |
|---|---|
| `/[app]/[week]` | 대시보드 — 인용률·SoV·GEO·표본 KPI, 추이(최근 8주), 엔진별 언급률, 경쟁 점유(SoV), 정확도·감성 |
| `/[app]/calls/[week]` | AI 응답 상세 — 질의→응답 원문, 브랜드/경쟁사 하이라이트, 인용 URL. 검색·엔진/감성/오정보 필터 |
| `/[app]/geo/[week]` | GEO 감사 — composite + 6개 카테고리 점수 + 감사 리포트 |
| `/[app]/methodology` | 측정 기준 — 질의셋·엔진·단가·경쟁사·감사 기준(코드 설정을 그대로 렌더) |

- 상단 서비스 탭(서비스 전환) + 좌측 사이드바 내비 + 주차 선택 달력. `/` → 기본 서비스 최신 주차로 리다이렉트.
- **서비스/주차 경로는 `services.json` 매니페스트 기반 자동 생성**(`getApps`→`generateStaticParams`) — 새 서비스가 첫 스냅샷을 쌓으면 페이지·탭이 코드 수정 없이 뜬다. 런타임 파일 읽기 없음.
- 대시보드 항목(엔진·오정보·감성) 클릭 → 상세로 필터된 채 이동.
- 로컬: `cd dashboard && pnpm install && pnpm dev` → `:4350`(dev는 로그인 우회, 프로덕션은 인증 유지).

---

## 자동화 (GitHub Actions)

| 워크플로 | 트리거 | 하는 일 |
|---|---|---|
| `weekly-visibility-snapshot` | cron(월 00:00 UTC) · dispatch | gate(ISO 짝수주) 통과 시 그룹 A 측정·커밋 |
| `weekly-geo-audit` | 위 완료(workflow_run) · dispatch | gate 통과 시 감사 ×3 → 집계·커밋 → **Vercel READY 대기 → Slack 알림** |
| `ci` | push(main)·PR | 엔진 typecheck/lint/test + 대시보드 lint/build |

- **격주 게이트**: 매주 cron이지만 `gate` 잡이 ISO 짝수주만 통과. 수동 dispatch는 무시(항상 실행).
- **Slack 알림**: `notifySlack` 가 서비스별 `slackChannelId` 로 주간 요약 전송(봇 채널 초대 필요).
- **Vercel 대기**: 알림 전 방금 커밋이 production READY 될 때까지 폴링 → 대시보드 링크 404 방지.

---

## 로컬 개발

```bash
pnpm install
cp .env.example .env                 # 키 채우기(로컬 검증용)

# 안전한 첫 실행
DRY_RUN=1 pnpm snapshot              # 실호출 없이 콜 계획만
SAMPLE_N=2 ACTIVE_ENGINES=chatgpt CAPTURED_AT=2026-06-23T00:00:00Z pnpm snapshot

pnpm typecheck && pnpm lint && pnpm test
pnpm rollup                          # 롤업 재생성

cd dashboard && pnpm install && pnpm dev    # 대시보드 :4350
```

### 실행 안전장치 env

| env | 효과 |
|---|---|
| `DRY_RUN=1` | 실호출 없이 CallSpec 계획만 출력. 스냅샷 미기록 |
| `SAMPLE_N=N` | 엔진당 콜 N개로 제한(샘플) |
| `MAX_USD=N` | 누적 비용 N USD 초과 시 이후 콜 스킵(소프트 캡) |
| `MIN_SUCCESS_RATE=r` | 성공률 미만이면 non-zero exit(손상 스냅샷 차단). 기본 0.7 |
| `ACTIVE_SERVICES` / `ACTIVE_ENGINES` | 측정 대상 게이트(쉼표). 미설정이면 전체 |
| `CLASSIFIER_MODEL` | 감성·정확도 판정기 모델. 미설정이면 `gpt-4.1-mini` |

---

## 설정 (Secrets / Variables)

**엔진 Secrets**: `OPENAI_API_KEY`(web_search 전용), `SERPAPI_API_KEY`, (확장 시 `GEMINI_API_KEY`·`ANTHROPIC_API_KEY`·`PERPLEXITY_API_KEY`), `CLAUDE_CODE_OAUTH_TOKEN`(geo-audit), `SLACK_BOT_TOKEN`(chat:write), `VERCEL_TOKEN`·`VERCEL_PROJECT_ID`·`VERCEL_TEAM_ID`(재배포 대기).
**대시보드 env**: `GOOGLE_CLIENT_ID`·`GOOGLE_CLIENT_SECRET`·`NEXTAUTH_SECRET`·`NEXTAUTH_URL`.
**Repo Variables**: `ACTIVE_ENGINES`(기본 `chatgpt,google-aio,naver-briefing`)·`ACTIVE_SERVICES`·`DRY_RUN`·`SAMPLE_N`·`MAX_USD`·`MIN_SUCCESS_RATE`·`CLASSIFIER_MODEL`·`DASHBOARD_URL`.

## 비용

chatgpt(gpt-5.5 web_search)는 검색 콘텐츠를 input 토큰(~70k/콜)으로 끌어와 **콜당 ~$0.49** 지배. 주 레버는 **reps**(기본 1)와 **경쟁사 스코프**, 그리고 **격주** 운영. SerpApi 는 free 플랜(크레딧 단가 0). 판정기(gpt-4.1-mini)는 무시 가능.

## 새 서비스 추가

**`/add-service` 스킬**을 사용한다 — 필요한 브리핑(질의셋·브랜드·경쟁사·감사 페이지·Slack 채널·시장/로케일)과 손댈 코드(`config/services/<app>.ts`·레지스트리·App union·대시보드 배선)와 수동 작업·방법론 제약을 한 번에 안내한다. sprint(국비 부트캠프·KR)는 정답 템플릿이되 도메인/시장 특화 부분은 새 서비스 성격에 맞게 일반화한다.
