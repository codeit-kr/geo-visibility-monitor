# GEO 감사 리포트 — 코드잇 스프린트 (sprint)

- **대상 URL:** https://sprint.codeit.kr
- **app:** `sprint`
- **isoWeek:** `2026-W26`
- **capturedAt:** `2026-06-23T03:59:20Z`
- **brandSourcesVersion:** `2`
- **시장/현지화:** 한국(KR) — 엔티티 그라운딩·평판·플랫폼은 한국 생태계 기준 평가
- **재현성:** 감사 대상은 아래 고정 `auditUrls` 10개로만 한정. sitemap 임의 크롤·블로그 랜덤 샘플 없음. 동일 입력 = 동일 점수.

## 종합 점수

| 카테고리 | 가중치 | 점수 | 가중 기여 |
|---|---|---|---|
| AI Citability | 0.25 | **78** | 19.50 |
| Brand Authority | 0.20 | **50** | 10.00 |
| Content E-E-A-T | 0.20 | **76** | 15.20 |
| Technical GEO | 0.15 | **80** | 12.00 |
| Schema & Structured Data | 0.10 | **88** | 8.80 |
| Platform Optimization | 0.10 | **70** | 7.00 |
| **Composite** | | **73** | 72.50 → 73 (반올림) |

> 등급: **Fair 상단(60–74)** — Good(75+) 진입 직전. composite 의 핵심 발목은 brand(50): 한국어 지식그래프(Wikidata/ko.Wikipedia) 엔티티 부재.

---

## 고정 입력 (재현성)

### 감사 대상 페이지 (auditUrls, 10)
| # | URL | HTTP | SSR 본문(chars) | ld+json |
|---|---|---|---|---|
| 1 | https://sprint.codeit.kr/ | 200 | 1,991 | 6 |
| 2 | https://sprint.codeit.kr/career | 200 | 1,447 | 2 |
| 3 | https://sprint.codeit.kr/track/frontend-advanced | 200 | 8,186 | 4 |
| 4 | https://sprint.codeit.kr/track/backend-spring | 200 | 19,424 | 4 |
| 5 | https://sprint.codeit.kr/track/fullstack | 200 | 16,401 | 4 |
| 6 | https://sprint.codeit.kr/track/ai | 200 | 19,591 | 4 |
| 7 | https://sprint.codeit.kr/track/data | 200 | 12,775 | 4 |
| 8 | https://sprint.codeit.kr/track/product-design | 200 | 14,267 | 4 |
| 9 | https://sprint.codeit.kr/track/it-founder | 200 | 15,096 | 4 |
| 10 | https://sprint.codeit.kr/llms.txt | 200 | (텍스트 파일) | — |

### 기술 신호 (존재여부만 점검)
| 신호 | 결과 | 근거 |
|---|---|---|
| `/robots.txt` | ✅ 존재 (200) | `User-agent: *` / `Disallow: /admin, /become` 만. AI 크롤러(GPTBot·ClaudeBot·PerplexityBot) 차단 없음. 두 sitemap·Host 선언 포함 |
| `/sitemap.xml` | ✅ 존재 (200) | `/`, `/career` 2 URL (lastmod 2026-06-23) |
| `/server-sitemap.xml` | ✅ 존재 (200) | 8개 track URL (동적 sitemap) |
| `/llms.txt` | ✅ 존재 (200) | 트랙·취업지원·회사(모회사 코드잇 링크) 구조화. Course/FAQPage/BreadcrumbList 안내 명시 |
| `/llms-full.txt` | ❌ 부재 (404) | 404 + SPA fallback HTML 반환 (실파일 아님) |

---

## 카테고리별 체크리스트 근거

### 1. AI Citability — 78 / 100 (가중 0.25)
객관 신호 가점 합. 추출 가능한 자기완결 패시지 중심 평가.

| 체크 항목 | 결과 | 근거 |
|---|---|---|
| 자기완결 FAQ Q&A 블록 | ✅ | track 페이지 8–13개 질문/페이지, home 7개. (career 0) |
| FAQ 답변 길이 적정(인용가능) | ✅ | 평균 130–190자 — 단독 인용 가능한 길이 |
| 명확한 제목 계층(h1/h2/h3) | ✅ | track 페이지 h1=1, h2 2–7, h3 2–13 |
| 인용가능 수치 팩트(취업률·기간·% 등) | ✅ | track 페이지당 19–56개 수치 신호 |
| 콘텐츠 페이지 SSR 본문 충분 | ⚠️ 부분 | track 7개 8K–19K자 충분 / **home·career 1.4–2K자(클라이언트 렌더 의존)** |
| 정의·리스트형 구조 | ✅ | track 본문 구조화 양호 |

**감점 사유:** home·career 본문이 JS 렌더 의존 → JS 미실행 크롤러가 보는 본문 빈약(스키마·FAQ는 SSR 되어 일부 상쇄).

### 2. Brand Authority — 50 / 100 (가중 0.20)
composite 반영 외부 신호 = `brandSources` (v2) 고정 체크리스트 **8개뿐**. 각 소스 존재/연결 여부로 채점. 동일 가중(12.5점/소스).
KR 현지화: 영문 위키·Reddit·G2·Trustpilot·Clutch 는 목록에 없음. **Wikidata 는 언어무관 핵심이라 가중 유지**.

| # | brandSource | 판정 | 점수 | 근거 |
|---|---|---|---|---|
| 1 | namu.wiki/w/코드잇 (모회사) | 🟡 부분 | 6.25 | 직접 fetch 403. **단 모회사 코드잇(`www.codeit.kr/#organization`) sameAs 에 `namu.wiki/w/코드잇` 포함 확인 → 연결 인정**(직접 fetch 불필요). 부모 엔티티 상속. |
| 2 | ko.wikipedia.org/wiki/코드잇 (모회사) | 🔴 부재 | 0 | API `missing`, HTTP 404. 한국어 위키 문서 없음 |
| 3 | Wikidata: 코드잇/Codeit (모회사) | 🔴 부재 | 0 | `wbsearchentities` 한국어/영문 검색 결과 무관 엔티티(CodeIT Norway, Q30299760)만. 코드잇 교육사 엔티티 없음 |
| 4 | blog.naver.com/codeitofficial | 🟢 연결 | 12.5 | sprint `sameAs` + 모회사 `sameAs` 양쪽 등재 |
| 5 | youtube.com/@codeit | 🟢 연결 | 12.5 | sprint `sameAs` 등재 |
| 6 | Instagram @codeit.kr / @codeit_sprint | 🟡 부분 | 6.25 | `sameAs` 에 `instagram.com/codeit_kr`(모회사 핸들) 연결 ✅ / **sprint 전용 `@codeit_sprint` 는 sameAs 미연결** ❌ |
| 7 | linkedin.com/company/codeit-official | 🟢 연결 | 12.5 | sprint `sameAs` 등재 |
| 8 | 잡플래닛: 코드잇 기업 페이지 | 🔴 미확인 | 0 | 직접 fetch 403, 어떤 sameAs/스키마 연결로도 확인 불가 |
| | **합계** | | **50.0 / 100** | 4.0 / 8 소스 |

**모회사(코드잇) 그라운딩 메모:** sprint 의 Organization 스키마는 `parentOrganization → 코드잇(@id https://www.codeit.kr/#organization)` 로 연결되어 있고, 동일 @id 의 부모 엔티티가 `www.codeit.kr` 에 실재하며 자체 sameAs(YouTube·Instagram·Facebook·Naver·LinkedIn·namu.wiki)를 보유 → **"(모회사)" 표기 소스는 부분 가점** 규칙 적용. **완전 가점은 sprint 전용 엔티티(예: Wikidata sprint 항목)가 생길 때만** 부여 — 현재 미존재.

### 3. Content E-E-A-T — 76 / 100 (가중 0.20)
KR 기준. 객관 신호 마커 카운트 기반.

| 신호 (E-E-A-T) | 결과 | 근거 |
|---|---|---|
| Expertise — 멘토/현직/강사 | ✅ | track 페이지 19–34회 언급 |
| Experience — 수강생 후기/인터뷰 | ✅ | track 페이지 31–35회 |
| Experience — 취업률·성과 수치 | ✅ | track 페이지 7–18회 |
| Trust — 국비지원/내일배움카드 | ✅ | track 페이지 8회(frontend-advanced 3) |
| Trust — 사업자/대표/개인정보 표기 | ⚠️ 부분 | 일부 track(9–10) SSR 확인 / home·일부 track 0 (푸터 클라이언트 렌더 추정) |
| Authoritativeness — 모회사 코드잇 그라운딩 | ✅ | parentOrganization 연결, 확립된 교육 플랫폼 |
| Authoritativeness — 외부 지식그래프 엔티티 | 🔴 | Wikidata/ko.Wikipedia 엔티티 부재(2번·3번 참조) |
| Trust — 외부 리뷰 집계(Review/AggregateRating) | 🔴 | 해당 스키마 없음 |
| 채용 연계사/제휴 증빙 | 🔴 | SSR 본문에서 채용사·제휴 마커 0 |

### 4. Technical GEO — 80 / 100 (가중 0.15)
기술 신호 5종 존재여부만(가점 20점/항목).

| 항목 | 결과 | 점수 |
|---|---|---|
| robots.txt | ✅ | 20 |
| sitemap.xml | ✅ | 20 |
| server-sitemap.xml | ✅ | 20 |
| llms.txt | ✅ | 20 |
| llms-full.txt | ❌ (404) | 0 |
| **합계** | | **80** |

보조 관찰(가점 외): robots.txt 가 AI 크롤러를 차단하지 않고 두 sitemap 을 명시 → 접근성 양호.

### 5. Schema & Structured Data — 88 / 100 (가중 0.10)
JSON-LD GEO 핵심 타입 체크리스트(전 페이지 파싱 오류 0).

| 체크 항목 | 결과 | 근거 |
|---|---|---|
| Organization/EducationalOrganization | ✅ (10) | 전 페이지 `#organization` |
| Organization `sameAs` | ✅ (10) | YouTube·Instagram·Facebook·Naver·LinkedIn |
| `parentOrganization` 연결 | ✅ (10) | → `www.codeit.kr/#organization` |
| WebSite | ✅ (10) | 전 페이지 |
| Course | ✅ (10) | 전 track 페이지 |
| Offer + CourseInstance | ✅ (9) | Offer 전 track / **CourseInstance 는 frontend-advanced 누락** |
| FAQPage + Question/Answer | ✅ (10) | 전 페이지(career 제외) |
| BreadcrumbList | ✅ (9) | track 8/8 / **career 누락**(home 은 ItemList 대체) |
| Review/AggregateRating | ❌ (0) | 평점·리뷰 스키마 없음 |
| 유효 JSON(파싱 오류 없음) | ✅ (10) | 전 블록 정상 파싱 |
| **합계** | | **88** |

### 6. Platform Optimization — 70 / 100 (가중 0.10)
플랫폼 준비도 신호 + brandSources 기반 외부 채널 존재(외부 신호는 brandSources 한정).

| 체크 항목 | 결과 | 근거 |
|---|---|---|
| AI Overviews/Perplexity — FAQ 스키마 | ✅ | 전 페이지 FAQPage |
| ChatGPT/Claude — llms.txt | ✅ | 존재(트랙 구조화) |
| AI 크롤러 robots 허용 | ✅ | GPTBot·ClaudeBot·PerplexityBot 차단 없음 |
| 영상 플랫폼(YouTube) | ✅ | sameAs 연결 |
| 한국형 채널(Naver 블로그) | ✅ | sameAs 연결 |
| 소셜(LinkedIn/Instagram) | 🟡 | LinkedIn ✅ / Instagram 부분(sprint 핸들 미연결) |
| 지식패널 엔티티(Wikidata/Wikipedia) | 🔴 | 부재 → Google/Gemini 엔티티 패널 약함 |
| 크롤 가능 SSR 본문 | 🟡 | track ✅ / home·career 빈약 |

---

## 디스커버리 (composite 미반영 — 기록 전용)

> 아래는 이번 감사 중 발견한, `brandSources` v2 체크리스트에 **없는** 신호/기회. 점수에 반영하지 않음.

- **Facebook 페이지** `facebook.com/codeit.kr` — sprint·모회사 schema `sameAs` 에 존재하나 brandSources 체크리스트엔 없음 → 차기 버전 후보.
- **모회사 namu.wiki 문서** 실재(코드잇) — 모회사 sameAs 로 확인됨. sprint 전용 namu 문서는 미확인.
- **Instagram sprint 전용 핸들** `@codeit_sprint` — brandSources 에 명시되나 site schema `sameAs` 미연결 → 연결 시 brand 부분→완전 상향 여지.
- **한국 개발/커리어 커뮤니티 후보(미점검·미반영):** OKKY, 블라인드, 커리어리, 네이버 카페(부트캠프/취준), 인프런·DevOcean 등 — 한국 생태계 평판 신호 확장 후보.
- **잡플래닛 기업 페이지** — 직접 fetch 403 으로 이번 회차 검증 실패. 별도 인증/수동 확인 필요(현재 brand 0점 처리).

---

## 주요 갭 & 권고 (재현 가능 신호 기반)

1. **[brand/eeat 치명] 한국어 지식그래프 엔티티 생성** — Wikidata(언어무관 핵심) + ko.Wikipedia 에 코드잇/스프린트 엔티티 부재. composite 최대 상승 레버.
2. **[technical] `/llms-full.txt` 추가** — 현재 404. 전체 콘텐츠 인덱스 제공 시 technical +20 여지.
3. **[citability] home·career SSR 본문 강화** — 클라이언트 렌더 의존 → 핵심 본문 SSR/프리렌더.
4. **[brand] sprint 전용 소셜 그라운딩** — `@codeit_sprint` 를 Organization `sameAs` 에 연결.
5. **[schema] Review/AggregateRating 추가** — 후기 다수 보유하나 스키마 미반영.

---

## 부록 — 사용 버전/방법
- **brandSourcesVersion:** 2 (audit-targets.json 고정 체크리스트)
- **외부 신호 정책:** composite 반영 외부 신호는 brandSources 8종 한정. 그 외 발견 소스는 디스커버리 전용.
- **모회사 규칙:** "(모회사)" 표기 소스는 parentOrganization→코드잇 연결 + 부모 엔티티 실재 시 부분 가점(자식이 부모 상속). 완전 가점은 sprint 전용 엔티티 존재 시.
- **기술 신호:** robots.txt/sitemap.xml/server-sitemap.xml/llms.txt/llms-full.txt 존재여부만.
- **검증 도구:** curl(HTTP 상태·파일 존재), JSON-LD 파서(스키마 타입·sameAs·parentOrganization), HTML 텍스트 추출(제목·FAQ·수치·EEAT 마커), Wikidata `wbsearchentities` / Wikipedia API(엔티티 실재 확인).
