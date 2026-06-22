# geo-visibility-monitor — Agent Context

> Self-contained kickoff context for an AI agent building this repo. You are working in a **fresh repo** with no access to the `frontend-mono` monorepo, so everything you cannot discover here is written below. Read this fully before coding. The deeper "why" lives in the companion plan doc `GEO-AI-가시성-측정-대시보드-플랜.md` (kept in frontend-mono); this file is the operational summary.

## 1. Mission

This repo is the **measurement engine** for the AI Visibility of Codeit services (primarily 코드잇 스프린트 / `sprint.codeit.kr`, later cayde/ascent/10x). Each week it queries AI engines + SERP surfaces, classifies whether/how Codeit is cited, and writes time-series **snapshots**. A separate dashboard (in `frontend-mono`, see §3) reads those snapshots. **This repo never renders UI** — it produces data.

It exists because `frontend-mono` is a pure frontend monorepo with **no scheduler, no database, and no LLM clients**, and we don't want LLM/DB/scheduler deps + API keys in the product build. So the engine is split out here.

## 2. Critical context you cannot discover in this repo

These are facts about the outside world. Do not re-derive or contradict them.

- **AI-referral 분석은 드롭됨(Group B).** `frontend-mono` 의 `libs/shared/util-acquisition` 이 이미 `fromAI` 리퍼럴을 Amplitude 에 계측 중이라, 필요 시 Amplitude ad hoc 조회로 충분. 이 레포는 측정(A) + GEO 점수(C)만 산출한다.
- **Engine web-search/grounding APIs are confirmed available** (verified 2026-06): OpenAI Responses API `web_search` tool, Anthropic `web_search_20260209` tool(Sonnet 4.6 동적 필터링; 구버전 `web_search_20250305`), Gemini `google_search` grounding, Perplexity sonar (`citations`/`search_results` native). See §6.
- **Naver & Google AI Overviews have no official API** → reachable via **SerpApi** (Naver AI Briefing endpoint + Google AI Overview endpoint). Naver "Cue:" was discontinued 2026-04; the live surface is **AI Briefing**.
- **Codeit OpenAI usage exists but is unrelated** — `frontend-mono` only uses OpenAI for an AI-interview *realtime/voice* feature. There is no reusable text/web-search key. Provision a dedicated key with web_search.
- **Codeit Sprint tracks** (authoritative): Frontend (+ 단기심화), Backend (+Spring/Nodejs), Fullstack, Data(데이터분석가), AI, ProductDesign(디자이너), ItFounder(IT창업가). **No Mobile track** (exists in the GraphQL enum but is not offered).

## 3. The other repo (dashboard) & the contract

- The dashboard is a **new Nx app `apps/geo-admin`** inside `frontend-mono` (App Router, its own Vercel project), reusing that monorepo's design-system, `Role.SprintAdmin` auth, and GraphQL proxy. It is **read-only** and consumes this repo's snapshots.
- **The snapshot schema (§5) is a shared contract** between the two repos. Treat `types/snapshot.ts` as a public API: version it (`SCHEMA_VERSION`), never break it silently. The dashboard imports it (npm package or git submodule).
- Override editing (GEO inventory) stays in each product app's `/admin/seo`, NOT here — out of scope (§12).

## 4. Locked decisions (do NOT re-litigate)

| Area | Decision |
|---|---|
| Runner | **GitHub Actions `schedule:`** (weekly cron `0 0 * * 1`). Cost ≈ $0. Weekly chosen over biweekly: cost is negligible and you can always smooth weekly data into rolling trends, but can't recover unsampled resolution. No Vercel cron / worker. |
| Storage | **JSON-in-git is source of truth** — `snapshots/2026-Wnn/*.json` (append-only) + weekly rollup `snapshots/index.json`. Git history = the time series. |
| Query layer | Start = parse JSON in app. If queries get complex = **DuckDB over the JSON** (no server). Postgres only if multi-user/sub-second/scale truly demands it. |
| Repo split | Engine = here. Dashboard = `frontend-mono/apps/geo-admin`. |
| Locale | Every engine call uses **KR `user_location` + Korean** (else you measure US answers). |

## 5. Data contract — `types/snapshot.ts`

```ts
export const SCHEMA_VERSION = 1

export type App = 'sprint' | 'cayde' | 'ascent' | '10x'
export type Engine =
  | 'chatgpt' | 'claude' | 'gemini' | 'perplexity'   // LLM web-search
  | 'google-aio' | 'naver-briefing'                  // SerpApi SERP surfaces
export type MetricRole = 'visibility' | 'reputation' | 'accuracy'
export type Sentiment = 'positive' | 'neutral' | 'negative'

export interface VisibilitySnapshot {       // = one call (intent×paraphrase×rep)
  schemaVersion: number
  capturedAt: string        // ISO, injected via CAPTURED_AT env (NOT new Date())
  isoWeek: string           // '2026-W25'
  app: App
  engine: Engine
  intentId: string
  metricRole: MetricRole    // headline visibility metric filters === 'visibility'
  paraphraseId: string
  query: string             // the actual sent text (placeholders already expanded)
  rep: number
  locale: string            // 'ko-KR'
  mentioned: boolean
  competitorsMentioned: string[]  // canonical names — for SoV
  citedUrls: string[]       // resolved real domains (see §6 Gemini caveat)
  sentiment: Sentiment | null
  position: number | null
  accuracyFlags: string[]   // e.g. 'wrong-employment-rate' | 'wrong-price'
  rawSnippet: string
}

export interface GeoScoreSnapshot {   // Group C — 러너 구현 미결, 계약만 유지
  schemaVersion: number; capturedAt: string; isoWeek: string; app: App
  composite: number; citability: number; brand: number; eeat: number
  technical: number; schema: number; platform: number
}
// 이 외 현행 계약(실제 파일 참조): ResponseRecord(원문), CostSnapshot/UsageCost(비용),
//   RollupIndex/WeekSummary/ServicesManifest(롤업). Group B(Referral)·D(OwnedSurface)는 드롭.
```

Aggregate metrics (Mention Rate, SoV) are **computed from the call pool**, not stored per-call: headline = pool over all `visibility` calls; per-intent = pool over that intent's calls. 비용(cost.json)·원문(responses.json)은 별도 산출물.

## 6. Engines & provisioning (§6)

Every adapter normalizes to one shape so jobs stay engine-agnostic:

```ts
export interface EngineResult { answer: string; citedUrls: string[] }
```

| Engine | How (confirmed available) | Citations | Notes |
|---|---|---|---|
| Perplexity | sonar / sonar-pro | `citations[]` + `search_results[]` native | ⭐ cleanest, cheapest. Start here. |
| OpenAI | Responses API `tools:[{type:'web_search'}]` (NOT legacy `web_search_preview`) | `annotations[].url_citation.url` | Use mid model (GPT-5/5.4), not flagship. Dedicated key w/ web_search. |
| Gemini | `tools:[{google_search:{}}]`, 2.5/3.x Flash | `groundingMetadata.groundingChunks[].web.uri` | URIs are **vertexaisearch redirects** → resolve to real domain before SoV. 5,000 grounded prompts/mo free. |
| Claude | `tools:[{name:'web_search',type:'web_search_20260209'}]`(Sonnet 4.6+; 구버전 `web_search_20250305`) | web search result blocks | `user_location` for KR. Billed $10/1k searches. 기본 모델 `claude-sonnet-4-6`(무료 기본값). |
| Google AIO | **SerpApi** Google AI Overview API | `references` | `gl=kr,hl=ko`. **Visibility seed-only** (p0 per visibility intent, rep=1). |
| Naver AI Briefing | **SerpApi** Naver AI Overview API | linked sources | KR's biggest surface. Seed-only to stay in free tier. |

- **Keys** (GitHub Secrets): `PERPLEXITY_API_KEY`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `ANTHROPIC_API_KEY`, `SERPAPI_API_KEY`, `AMPLITUDE_API_KEY`, `AMPLITUDE_SECRET_KEY`.
- **Cost** (OpenAI default = **gpt-5.5**, matching ChatGPT's logged-in default for fidelity — ~2× gpt-5.4): PoC (OpenAI + SERP on SerpApi **free**) ≈ **$60–70/mo**. Full 4 chatbots ≈ **~$140/mo**. Drop OpenAI to `gpt-5.4` (≈½) or `gpt-5` if cost > fidelity. (+ classifier: 1 cheap LLM call per answer via `CLASSIFIER_MODEL`/`OPENAI_API_KEY` ≈ <$3/mo.) SERP is seed-only (~129 searches/mo → fits SerpApi free 250). **Tier policy (industry norm = commercial uses paid tiers): free for PoC/eval; move to Starter $25/mo when SERP goes steady-state commercial; Production $150 only if legal wants the scraping Legal Shield (separate concern — Free & Starter both lack it).** Web-search surcharge dominates tokens; reps are the main cost lever.
- **Fidelity tiers** (be honest in the dashboard): Perplexity / AIO / Naver = high (≈ the real product). ChatGPT/Gemini/Claude API = **proxy** (consumer apps differ). Run a **quarterly manual calibration** (same queries in the real apps) to quantify the gap. Do NOT browser-automate the consumer apps (ToS/bot-detection).

## 7. Metric groups (현행: A + C)

- **A — Visibility (this repo's core):** Mention Rate, Citation Frequency, SoV, Sentiment, Position, Accuracy. From `citation-monitor`. Headline uses **unbranded (`metricRole:'visibility'`) only** — branded queries trivially mention Codeit and would inflate it.
- **C — Leading:** Composite GEO Score. **에이전트형 `geo-audit` 스킬을 `weekly-geo-audit` GitHub Action 이 헤드리스 실행**(node cron 아님) → 서비스별 `snapshots/<app>/<isoWeek>/geoScore.json` 기록 → `pnpm rollup` 으로 롤업에 합침. 인증=Claude 구독 OAuth 토큰(`CLAUDE_CODE_OAUTH_TOKEN`, opus 고정). 점수식: citability0.25+brand0.20+eeat0.20+technical0.15+schema0.10+platform0.10. **재현성**: 고정 `auditUrls`(우리 페이지만) + `brandSources` 고정 체크리스트(`brandSourcesVersion` 갱신추적, 외 발견은 디스커버리로 점수 제외) + KR 현지화. delta-context 미사용(앵커링 오염 방지).
- **~~B — Value (Amplitude referral)~~ / ~~D — Owned-surface (Search Console)~~ — 드롭됨.** B 는 계측이 이미 Amplitude 에 있어 ad hoc 조회로 충분 + AI 리퍼럴 볼륨 작음/노이즈 큼. D 는 GSC 가 AI 표면 노출을 별도 granularity 로 안 줌(추출 불가). 둘 다 잡·타입·산출물 제거.

## 8. Query set & per-service config — already authored

Config is **per-service** (multi-service ready). Shared types in `src/config/types.ts`; one `ServiceConfig` per service under `src/config/services/<app>.ts`; registry in `src/config/services/index.ts`. `src/config/services/sprint.ts` already exists (marketing-confirmed list + methodology layer). **Do not recreate it.** Key points:
- **intent → paraphrase → rep** 3-level. ~15 intents; visibility-heavy (~11). `{role}` (개발자/데이터 분석가/디자이너) and `{competitor}` placeholders are expanded by `promptBuilder` (takes a `ServiceConfig`).
- `metricRole` tags each intent; `visibilityIntents(service)` is the headline-集計 subset.
- Each `ServiceConfig` bundles its own `brand` (canonical/aliases/**domains** for owned-citation match), `competitors` (aliases + `strictContext` flags for ambiguous names 구름/항해/엘리스/그렙/내일배움캠프 — match by word-boundary + brand context, not bare substring), `jobRoles`, `intents`, `promptsVersion`, locale.
- **Analyzers are brand-decoupled**: `matchEntities`/`llmJudge`/`classify` take `brand`/`competitors` as args (not module globals) so the same code serves every service.
- **Add a new service** = (1) author `config/services/<app>.ts`, (2) register in `config/services/index.ts`, (3) add the `app` key to the `App` union in `types/snapshot.ts`. Gate which services run per-cycle with `ACTIVE_SERVICES` (repo Variable; unset = all).

## 9. Conventions

- **TypeScript**, **pnpm**, run via **tsx**. Arrow functions only (no `function` declarations).
- **In-code comments & JSDoc in Korean.** Comment only non-obvious intent/constraints, not the obvious.
- **No `new Date()`/`Date.now()` for the snapshot timestamp** — read `CAPTURED_AT` from env (CI-injected) so reruns/replays are reproducible and `isoWeek` is stable.
- **Commits:** conventional-commit style with Korean descriptions, **no `Co-Authored-By`**. Split distinct concerns into separate commits.
- **Never commit API keys.** Secrets via env / GitHub Secrets only.
- Snapshots are append-only; partition by **`snapshots/<app>/2026-Wnn/`** (app = service); at the end of a run (re)build per-service **`snapshots/<app>/index.json`** rollups + the **`snapshots/services.json`** manifest (admin service switcher).

## 10. Build sequence

0. **Scaffold** — `package.json`, `tsconfig`, `types/snapshot.ts`, decide shared-contract mechanism (npm pkg / submodule). Register GitHub Secrets.
2. **Prompt builder** — expand `{role}`/`{competitor}`, apply reps, output the call list.
3. **`citationMonitor` — phased rollout via `ACTIVE_ENGINES`** (repo Variable; each step = edit the Variable, no code change). Order by KR usage:
   - **PoC**: `chatgpt,google-aio,naver-briefing` — OpenAI (org already has an account; default **gpt-5.5** = ChatGPT's logged-in default) + SerpApi **free**. Validate the whole pipeline (call → classify → SoV → snapshot → rollup) + see real KR results. ≈ $70/mo.
   - **Next (if PoC good)**: add **`gemini`** — Korea's #2 AI surface. ≈ +$16/mo (~$85/mo).
   - **Later (optional)**: `claude`, `perplexity`.
   - Enforce KR locale on every call. (The existing org OpenAI key is realtime/voice — use a **scoped key with web_search**.)
4. **Analyzers** — sentiment, accuracy (vs `groundTruth`), SoV (competitor matching).
5. **Store + rollup** — `writeSnapshot(app, isoWeek, bundle)` (per `<app>/<week>` JSON) + `buildRollupIndex(services)` (per-service `<app>/index.json` + `services.json` manifest).
6. **`weekly-snapshot.yml`** — `schedule:` weekly + `workflow_dispatch`; commit snapshots. Validate via manual dispatch.
7. **Group C — `weekly-geo-audit.yml`** (claude-code-action 헤드리스로 `/geo-audit` → geoScore.json → `pnpm rollup`). Secret `CLAUDE_CODE_OAUTH_TOKEN`(구독 OAuth) 등록 후 수동 dispatch 검증. (Group B/D 는 드롭.)
8. Start the **6-week collection window** — benchmarks/targets only after ≥4–6 weekly snapshots (per WP VIP). Report on a rolling (e.g. 4-week) trend, not single-week deltas, and annotate when GEO work ships to read the ship→move lag.

## 11. Human-blocked inputs (not solvable in-repo)

- **Budget approval + key provisioning** for the paid LLM APIs (recurring spend, org account). geo-audit Action 은 **`CLAUDE_CODE_OAUTH_TOKEN`**(Claude 구독, `claude setup-token`) Secret 사용 — 별도 종량제 키 불필요(5 서브에이전트 × 서비스 주간, 구독 사용량에 포함).
- **Competitor list final sign-off** + `[경쟁사]` priority (all 10 vs top-4 for vs-comparison).
- **Public employment-rate number** for `fact.employmentRate.groundTruth`.
- **SerpApi tier** (deferred — not a PoC blocker; free is fine for PoC/eval) — when SERP goes steady-state commercial, move to **Starter $25/mo** (industry norm; our ~129/mo fits easily). Legal Shield (scraping liability) is a separate call → **Production $150** only if legal wants it. Note **Google v. SerpApi** litigation = continuity risk for the Naver/AIO SERP dependency.

## 12. Out of scope (do NOT build here)

- Dashboard UI (it's `frontend-mono/apps/geo-admin`).
- GEO override editing / `/admin/seo` (stays per product app — cache-revalidation is per-deployment).
- Any change to `frontend-mono` (AI-referral instrumentation already exists there).
- Browser automation of consumer AI apps.
