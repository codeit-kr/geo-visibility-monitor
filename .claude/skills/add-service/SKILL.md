---
name: add-service
description: 새 Codeit 서비스(cayde·ascent·10x·codeit 등)를 AI 가시성 모니터링 대상에 추가할 때 필요한 설정·코드·수동작업을 한 번에 생성·안내. "서비스 추가", "<이름> 모니터링 추가", "새 서비스 온보딩" 류 요청에 사용.
---

# 새 모니터링 서비스 추가

엔진(`geo-visibility-monitor`)에 서비스 하나를 추가하면 매주(격주) 측정 → GEO 감사 → 대시보드 → Slack 알림이 그 서비스에도 자동으로 돈다. **`src/config/services/sprint.ts` 가 정답 템플릿** — 항상 먼저 읽고 구조·주석·컨벤션을 미러링한다. 단, **sprint 는 "국비 부트캠프 · KR" 서비스**라 그 도메인/시장 특화 부분(취업률·수강료·한국 생태계)은 새 서비스의 성격에 맞게 **일반화**할 것.

핵심 컨텍스트는 `AGENTS.md`, 데이터 계약은 `types/snapshot.ts`.

## 0. 입력(브리핑) — 시작 전 확보. 없으면 사용자에게 물어본다.

질의셋·경쟁사·팩트 수치는 **마케팅/담당자 확정 = 측정 스코프 source of truth** 라 임의 생성 금지. 다음을 모은다:

- **app 키**(`types/snapshot.ts` App union 값) + **displayName**
- **서비스 성격(제품 유형)** — 서비스마다 제품이 다르다(**부트캠프는 sprint 뿐**, 나머지는 각기 다른 제품). 질의·경쟁사·검증 팩트는 그 서비스 자체의 성격에서 도출하고, **sprint(부트캠프) 기준을 그대로 복붙하지 말 것**. 먼저 파악.
- **측정 시장/로케일** — 기본 KR(`ko-KR`/`KR`). 북미 등 다른 시장이면 §1e 참고(언어·경쟁사·grounding 소스가 전부 달라짐).
- **siteUrl** + **auditUrls[]** — geo-audit 할 **우리 고정 페이지** 목록(sitemap 랜덤 금지, 재현성 핵심).
- **brand**: `canonical`, `aliases[]`(답변에서 잡을 표기 변형), `domains[]`(자사 도메인)
- **competitors[]**: 각 `canonical`·`aliases[]`·`strictContext?`(일반어와 겹치면 true) + **priorityCompetitors[]**(vs 비교 전개 상위만 — 비용)
- **jobRoles[]** (`{role}` 전개값) — 해당 없으면 생략
- **질의셋(intents)**: 의도별 `id·group·metricRole·paraphrases(~5)·expand?·reps?·serpQuery?·groundTruth?`. **accuracy 의도·groundTruth 는 그 서비스에 검증 가능한 공개 팩트가 있을 때만**(부트캠프 취업률·수강료는 sprint 예시일 뿐, 타 서비스엔 비적용일 수 있음).
- **brandSources[]** + **brandSourcesVersion**(1부터) — **타깃 시장 생태계 기준** 엔티티 그라운딩 체크리스트.
- **slackChannelId** (알림 채널) — 봇 초대 필요(수동).

## 1. 코드 생성·수정

### a) `src/config/services/<app>.ts` (핵심) — sprint.ts 미러링
- **arrow/const만**(func 선언 금지, eslint `func-style`). intents 는 top-level `const` 배열.
- `metricRole`:
  - `visibility` = **무브랜드**. 안 시켜도 떠야 진짜 가시성 → **헤드라인 인용률·SoV는 이것만** 집계.
  - `reputation` = 브랜드 줬을 때 평판·감성(언급 자명 → 가시성 제외).
  - `accuracy` = 팩트 질의. `groundTruth` 대조로 오정보 탐지 — **검증 팩트 없으면 트랙 자체 생략**.
- `paraphrases`: seed 1문장 + 표현 분산 변형(의도당 ~5). `{role}`/`{competitor}` 토큰 가능.
- **`serpQuery`**: **visibility 의도에만**. SERP(검색)는 문장 아닌 **키워드**로 질의. `{role}` 전개됨. 미지정 시 seed 폴백.
- `expand`: `{ roles?: true }` / `{ competitors?: true }`.
- `reps`: 기본 1. 비용 레버 — 올릴 필요 거의 없음.
- `groundTruth` (accuracy만, **도메인별로 다름**): 서비스에 맞는 검증 가능한 공개 팩트(가격·플랜·수치·기능 주장 등). LLM 판정기가 읽으므로 **`basis`/라벨 명시**로 오탐 방지. 값 미확정이면 **넣지 말 것**(빈 플래그/혼란 방지).
  - 예(sprint·부트캠프) 가격 → `{ feIntensive:300000, others:600000, basis:'국비 후 본인부담금. 정가·지원금 제외', currency:'KRW' }`
  - 예(sprint·부트캠프) 취업률 → `{ employmentRatePct:71, basis:'공시 취업률(%). ±3%p 허용' }`
  - 휴리스틱 폴백(`checkAccuracy`)은 **KRW 가격·% 만** 인식 → 그 외 팩트 유형은 LLM 판정에 의존(프롬프트가 `basis` 보고 판단). 새 팩트 유형이 중요하면 `llmJudge` 프롬프트 보강 검토.
- `brandSources`: **타깃 시장 생태계** 기준(KR=나무위키/한국어위키/Wikidata/네이버·잡플래닛, 북미=en-Wikipedia/Wikidata/G2/Trustpilot/Crunchbase 등). 모회사 엔티티는 `"(모회사)"` 표기 → geo-audit 가 `parentOrganization` 연결로 부분 가점.
- `promptsVersion: 1` 로 시작(질의셋 변경 시 +1).

### b) `src/config/services/index.ts` — `SERVICES` 에 `import` + 추가.
### c) `types/snapshot.ts` — App union 에 새 키 추가(이미 있으면 생략). 리전 분리 시 `<app>-na` 같은 키도 추가.
### d) 대시보드 배선
대시보드는 **멀티 서비스 라우팅**(`/[app]/[week]`·`/[app]/calls/[week]`·`/[app]/geo/[week]`·`/[app]/methodology`). 라우트는 **`services.json` 매니페스트 기반 자동 생성**(`getApps`→`generateStaticParams`) — **새 서비스가 첫 스냅샷을 쌓으면 페이지·탭이 코드 수정 없이 활성화**된다. 따라서 페이지 파일은 만들 필요 없고, **표시용 토큰만** 손대면 된다:
- `dashboard/src/ServiceTabs.tsx` → `TABS` 에 **새 app 키면** `{key,label}` 추가(이미 있는 5개 외일 때만). 활성 여부는 매니페스트가 자동 판정.
- `dashboard/src/AiVisibilityDashboard.tsx` → `COMP_COLOR` 에 신규 경쟁사 대표색(없으면 `COMP_COLORS` 순환).
- `dashboard/src/CallsDetail.tsx` → `BRAND_ALIASES[app]` 에 하이라이트용 브랜드 별칭.
- (페이지 로더·주차 라우팅·서비스 탭 네비게이션·methodology 는 전부 app 파라미터화돼 자동 동작 — 별도 작업 불필요.)

### e) 측정 시장(region) — 기본 KR, 그 외/멀티 시장
- **단일 비-KR 시장**(예: 북미 전용): `locale:'en-US'`·`userCountry:'US'` + 질의셋·brand aliases·competitors·brandSources 를 **그 시장 언어/생태계**로 작성. 엔진이 콜마다 config 의 locale/country 를 강제하므로 이대로 동작.
- **한 서비스를 KR + 북미 둘 다**(멀티리전): 현재 엔진은 **서비스당 단일 locale/country** + 스냅샷이 `app/week` 차원(리전 축 없음). → **리전별 서비스 엔트리로 분리** 권장: `<app>`(KR)·`<app>-na`(북미) 로 각각 ServiceConfig 작성. 대시보드 탭·스냅샷·Slack 이 자연히 분리됨.
  - 진짜 단일 서비스에 region 차원을 넣으려면 ServiceConfig·`types/snapshot.ts` 계약·rollup·대시보드에 region 축 추가하는 **엔진 확장**이 필요 — 별도 작업으로 다룰 것.
- ⚠️ **geo-audit 프롬프트**(`.github/workflows/geo-audit.yml`)의 현지화 블록이 **KR 하드코딩**(영문 위키 부재 critical 아님 등). 비-KR 서비스 추가 시 그 블록을 시장별로 일반화하거나 분기해야 함(안 하면 북미 서비스를 한국 기준으로 채점).

## 2. 방법론 제약 (어기지 말 것)
- 헤드라인 인용률·SoV = **visibility(무브랜드)만**. SoV = 자사 ÷ (자사+경쟁사) per-call 평균.
- **SERP=키워드 / 챗봇=문장**.
- 모든 콜에 **그 서비스의 타깃 시장 로케일** 강제(`locale`/`userCountry`) — 안 맞으면 엉뚱한 지역 답 측정.
- geo-audit **재현성**: auditUrls·brandSources 고정(목록 외 발견은 디스커버리·점수 제외), 3회 평균+변동폭, `--model claude-opus-4-8`.
- 챗봇 API는 소비자 앱 proxy → 절대값보다 추이·SoV 신뢰. 단일 주 델타는 노이즈(이동평균).

## 3. 수동 작업 (코드 밖)
- **Slack 봇을 채널에 초대**(`/invite @봇`) — 안 하면 `not_in_channel`.
- (선택) `ACTIVE_SERVICES` repo Variable 로 점진 활성화(미설정=전체).
- **비용 감각**: chatgpt web_search ~**콜당 $0.49**(input ~70k 토큰 지배). reps·경쟁사 스코프가 레버. 격주 운영(ISO 짝수주 gate, 수동 dispatch 는 gate 무시).
- **첫 검증**: `SAMPLE_N=2`(또는 30) + `MAX_USD` 캡으로 `workflow_dispatch` 1회 → 응답 파싱·로케일 반영·분류 sanity 확인 후 풀 측정.

## 4. 검증 (커밋 직전 한 번)
```
pnpm typecheck && pnpm lint && pnpm test      # 엔진(루트)
cd dashboard && pnpm build                    # 대시보드(정적 생성까지)
```

## 5. 마무리
- 관심사별 커밋(한국어 conventional, **Co-Authored-By 없음**). 커밋/푸시는 사용자 요청 시.
- 첫 실측 후 결과 보고 질의셋·경쟁사·groundTruth 튜닝(담당자와).
