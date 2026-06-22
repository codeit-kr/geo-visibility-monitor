# GEO Audit Report: 코드잇 스프린트 (Codeit Sprint)

**Audit Date:** 2026-06-22
**capturedAt:** 2026-06-22T16:53:34Z
**isoWeek:** 2026-W26
**App:** sprint
**URL:** https://sprint.codeit.kr
**Business Type:** EdTech / 코딩 부트캠프 (국비지원 KDT)
**Locale:** Korean (KR) — 한국 시장 서비스
**brandSourcesVersion:** 2

> **재현성 고지 (Reproducibility).** 이 감사는 `audit-targets.json` 의 `sprint` 항목에 고정된 입력만 사용했습니다.
> 감사 대상 페이지는 그 항목의 `auditUrls` 10개로 한정했고(sitemap 임의 크롤·블로그 랜덤 샘플 없음),
> 기술 신호는 robots.txt / sitemap.xml / server-sitemap.xml / llms.txt / llms-full.txt 의 **존재 여부**만 점검했으며,
> composite 에 반영한 외부 신호는 `brandSources` (**version 2**) 고정 체크리스트 8개뿐입니다.
> 각 카테고리 점수는 주관 인상이 아니라 아래 **객관 신호 체크리스트의 가점 합**으로 산정했습니다 (동일 입력 = 동일 점수).

> **v2 변경점 (모회사 부분 가점).** brandSources v2 는 namu·ko.wikipedia·Wikidata·잡플래닛에 **"(모회사)"** 표기를 추가했습니다.
> 사이트 Organization 스키마가 `parentOrganization` 으로 코드잇(`www.codeit.kr/#organization`)에 연결돼 있고 그 **모회사 엔티티가 존재**하면 **부분 가점**합니다(자식이 부모 엔티티 상속). 완전 가점은 sprint **전용** 엔티티가 있을 때만 부여합니다.

---

## Executive Summary

**Overall GEO Score: 65/100 (Fair)**

코드잇 스프린트는 우수한 기술적 기반(robots/sitemap/llms.txt 완비, Next.js SSR, 보안 헤더)과 강력한 구조화 데이터(전 트랙 Course·FAQPage·BreadcrumbList)를 갖추고 있습니다. 이번 v2 감사에서 핵심 변화는 **모회사(코드잇) 엔티티의 부분 가점**입니다: 사이트의 `parentOrganization` 이 코드잇(`www.codeit.kr/#organization`)에 연결되고, **코드잇 Organization 스키마의 `sameAs` 가 나무위키(`namu.wiki/w/코드잇`)를 직접 가리킴**이 확인되어, 나무위키 직접 fetch 가 403(봇 차단)이어도 부모 엔티티 상속으로 **부분 가점**됩니다. 이로써 Brand 38→47, Platform(엔티티 그라운딩) 54→62 로 상향되었습니다. 다만 **sprint 전용 엔티티 그라운딩은 여전히 공백**입니다: 한국어 위키백과(404 확인)·Wikidata 엔티티(부재 확인)는 모회사로도 부재라 가점이 없고, 잡플래닛은 코드잇 `sameAs` 미연결·403 으로 검증 불가입니다. Course 스키마의 `aggregateRating`·`instructor` 누락, /career 전용 스키마 부재, llms-full.txt 부재(404)가 다음 우선 과제입니다.

### Score Breakdown

| Category | Score | Weight | Weighted | v1 대비 |
|---|---|---|---|---|
| AI Citability | 68/100 | 25% | 17.00 | — |
| Brand Authority | 47/100 | 20% | 9.40 | ▲ +9 (namu 모회사 부분 가점) |
| Content E-E-A-T | 65/100 | 20% | 13.00 | — |
| Technical GEO | 85/100 | 15% | 12.75 | — |
| Schema & Structured Data | 66/100 | 10% | 6.60 | — |
| Platform Optimization | 62/100 | 10% | 6.20 | ▲ +8 (엔티티 그라운딩 부분 가점) |
| **Overall GEO Score** | | | **64.95 → 65** | ▲ +3 |

`composite = round(citability·0.25 + brand·0.20 + eeat·0.20 + technical·0.15 + schema·0.10 + platform·0.10)`
`= round(68·0.25 + 47·0.20 + 65·0.20 + 85·0.15 + 66·0.10 + 62·0.10) = round(64.95) = 65`

---

## 점검한 고정 입력 (Fixed Inputs)

### auditUrls (10) — HTTP 상태

| # | URL | HTTP | 비고 |
|---|---|---|---|
| 1 | https://sprint.codeit.kr/ | 200 | 홈 ~198KB SSR / EduOrg·WebSite·FAQPage(7) + parentOrganization(코드잇) + sameAs 5종 |
| 2 | https://sprint.codeit.kr/career | 200 | ~177KB / 전용 스키마 없음(EduOrg·WebSite만) |
| 3 | https://sprint.codeit.kr/track/frontend-advanced | 200 | Course·FAQ·Breadcrumb |
| 4 | https://sprint.codeit.kr/track/backend-spring | 200 | Course·FAQ·Breadcrumb |
| 5 | https://sprint.codeit.kr/track/fullstack | 200 | Course(teaches·offers·hasCourseInstance)·FAQ·Breadcrumb |
| 6 | https://sprint.codeit.kr/track/ai | 200 | Course(teaches·offers·hasCourseInstance)·FAQ·Breadcrumb |
| 7 | https://sprint.codeit.kr/track/data | 200 | Course·FAQ·Breadcrumb |
| 8 | https://sprint.codeit.kr/track/product-design | 200 | Course·FAQ·Breadcrumb |
| 9 | https://sprint.codeit.kr/track/it-founder | 200 | Course·FAQ·Breadcrumb |
| 10 | https://sprint.codeit.kr/llms.txt | 200 | `text/plain` well-formed (아래 기술 신호 참조) |

### 기술 신호 — 존재 여부만 점검 (5)

| 신호 | 존재 | 근거 |
|---|---|---|
| robots.txt | ✅ 200 (`text/plain`) | `User-agent: *` / `Disallow: /admin`, `/become` 만. 2개 Sitemap·Host 선언. AI 크롤러 차단 없음(전면 허용). |
| sitemap.xml | ✅ 200 (`application/xml`) | 2 URL (`/`, `/career`), `lastmod`+`priority 0.7` |
| server-sitemap.xml | ✅ 200 | 8 트랙 URL, `lastmod` 有 |
| llms.txt | ✅ 200 (`text/plain`) | H1 제목 + blockquote 설명 + H2 섹션(부트캠프 트랙·취업 지원·회사) + 마크다운 링크. 8 트랙+career+모회사(코드잇) 수록. 24행·1,816바이트. |
| llms-full.txt | ❌ 404 | **HTTP 404** (`content-type: text/html`). 실제 파일 부재(soft-200 아님, 확정 404). |

> **참고:** `/llms.txt` 는 `content-type: text/plain; charset=UTF-8` 의 실제 평문 파일로 확인됨(마크다운 변환기가 본문을 HTML 로 오인하지 않도록 raw 확인). `/llms-full.txt` 는 확정 404.

---

## Critical Issues (즉시)

**없음.** AI 크롤러 전면 차단·noindex·5xx·구조화 데이터 전무 등 critical 트리거 해당 사항 없음.
KR 현지화 원칙에 따라 영문 Wikipedia·Reddit·G2·Trustpilot·Clutch 부재는 critical 로 분류하지 않습니다(가중치 하향, 아래 Brand 참조). Wikidata 부재는 언어무관 핵심이라 가중치를 유지하되 critical 은 아닙니다.

## High Priority

1. **sprint 전용 엔티티 그라운딩 부재** — 모회사(코드잇)는 나무위키 연결로 부분 가점되나, sprint 전용 ko.wikipedia(404 확인)·Wikidata 엔티티(부재 확인)는 없음. 완전 가점·한국 AI 인용 신뢰도의 핵심 공백.
2. **Course 스키마 `aggregateRating`·`instructor` 누락** — 전 트랙 공통. 별점 리치결과·강사 엔티티 연결 불가.
3. **/career 전용 스키마 부재** — 핵심 차별점 페이지인데 `Service`/`EducationalOccupationalProgram`/`FAQPage` 없음.

## Medium Priority

4. **llms-full.txt 부재(404)** — 전체 본문 컨텍스트 제공 표준 미충족.
5. **본문 인용형 prose 부족** — 정량 사실 다수가 FAQ/그래픽에 갇혀 있고, 자기완결 문단 형태가 적음.
6. **잡플래닛 미연결** — 코드잇 `sameAs` 에 잡플래닛 없음 + 직접 403. 모회사 항목이나 부모 스키마로도 검증 불가라 미가점.
7. **hreflang 부재** — `hreflang="ko"`/`x-default` 없음.

## Low Priority

8. `twitter:card` / og:image 정합성 점검.
9. robots.txt `Content-Signal:` 디렉티브 부재 / AI 크롤러 명시 `Allow` 없음(현재 기본 허용).
10. Instagram 지정 핸들(`@codeit.kr`/`@codeit_sprint`)과 실제 연결 핸들(`@codeit_kr`) 불일치.

---

## Category Deep Dives — 객관 체크리스트 근거

### AI Citability — 68/100  *(brandSources 버전 무관 · 콘텐츠 신호 재현)*

| # | 체크 항목 | Max | 획득 | 근거 |
|---|---|---|---|---|
| 1 | 홈 FAQPage 자기완결 Q&A | 10 | 10 | 7개 Q&A, `acceptedAnswer.text` 구체(출석률 80%·HRD-Net·훈련장려금) |
| 2 | 트랙 FAQ Q&A (≥6 페이지) | 10 | 10 | 8개 트랙 전부 FAQPage 다수 Q&A |
| 3 | 답변 구체성(수치·절차·기간) | 12 | 10 | "월~금 9~19시", "ZEP QR 출석", 정부지원 안내 명시 |
| 4 | 통계 밀도(정량 주장 ≥4) | 10 | 8 | 취업률·수료율·만족도·수강생 수·정부지원 금액 등 |
| 5 | 통계 출처 표기 | 10 | 7 | "고용24 기준"(취업률), "내부 기준·수강생 n" (만족도) — 툴팁 |
| 6 | FAQ 외 본문 자기완결 prose | 14 | 4 | 히어로/밸류 문구가 슬로건 위주("압도적 만족도") — 인용 부적합 |
| 7 | 헤딩 위계·스캔 가능 구조 | 12 | 6 | SSR 본문 풍부하나 헤딩이 스타일 컴포넌트 처리 |
| 8 | 비교·고유 주장 + 근거 | 8 | 5 | "만족도 1위" + 기준 툴팁 |
| 9 | llms.txt 구조 요약(추출 보조) | 8 | 5 | well-formed 요약 제공(단 full-text 부재) |
| 10 | 페이지 내 정의형 자기완결 인트로 | 6 | 3 | 정의는 llms.txt 에 명확, 페이지는 슬로건 중심 |
| | **합계** | **100** | **68** | |

**Top 인용 후보:** 홈 FAQ "수료 후 취업 지원", "훈련장려금 지급(출석률 80%·HRD-Net)", 트랙별 실시간 수업/출석 인증 절차.
**약점:** FAQ를 벗어난 본문 prose 가 마케팅 슬로건 위주라 자기완결 인용 단위가 적음.

### Brand Authority — 47/100  *(KR 현지화 가중 · brandSources **v2** 고정 8개만 반영)*

> KR 원칙: 영문 위키·Reddit·G2·Trustpilot·Clutch 부재는 critical 아님·가중치 하향. **Wikidata 는 언어무관 핵심이라 가중치 유지.** composite 외 신호는 디스커버리에만 기록.
> **모회사 규칙:** "(모회사)" 표기 항목은 코드잇(parent) 엔티티. 사이트 `parentOrganization` → `www.codeit.kr/#organization` 연결 + 모회사 엔티티 존재 확인 시 **부분 가점(가중치 50%)**. sprint 전용 엔티티가 있을 때만 완전 가점.

| # | brandSource (v2) | 가중 | 획득 | 판정 / 근거 |
|---|---|---|---|---|
| 1 | namu.wiki/코드잇 **(모회사)** | 18 | **9** | ◐ **부분 가점** — 직접 fetch HTTP **403**(봇 차단)이나, **코드잇 Organization `sameAs` 가 `namu.wiki/w/코드잇` 직접 연결** + sprint `parentOrganization.@id = www.codeit.kr/#organization`(코드잇 Org @id 정확 일치)로 모회사 엔티티 존재 확인. 부모 상속 부분 가점(18×0.5) |
| 2 | ko.wikipedia/코드잇 **(모회사)** | 18 | 0 | ❌ 부재 확정 — **HTTP 404**. 모회사로도 문서 부재 → 가점 없음 |
| 3 | Wikidata 코드잇/Codeit 엔티티 **(모회사)** | 16 | 0 | ❌ 부재 확정 — 검색 결과 없음(언어무관 핵심이라 가중치 유지). 모회사로도 엔티티 부재 → 가점 없음 |
| 4 | blog.naver/codeitofficial | 12 | 12 | ✅ 사이트 `sameAs` 직접 연결 |
| 5 | youtube/@codeit | 12 | 12 | ✅ 사이트 `sameAs` 직접 연결 |
| 6 | Instagram @codeit.kr / @codeit_sprint | 8 | 6 | ◐ 부분 — 사이트는 변형 핸들 `instagram.com/codeit_kr` 연결. 지정 `@codeit.kr`/`@codeit_sprint` 미확인 |
| 7 | linkedin/codeit-official | 8 | 8 | ✅ 사이트 `sameAs` 직접 연결 |
| 8 | 잡플래닛 코드잇 기업 페이지 **(모회사)** | 8 | 0 | ⚠ 검증불가 — 직접 **403** + 코드잇 `sameAs` **미연결**(부모 스키마로도 미확인). 재현성·객관성상 미가점 |
| | **합계** | **100** | **47** | |

**해석:** v2 부분 가점 규칙으로 **나무위키(모회사)가 0→9** 로 인정되었습니다 — 코드잇 `sameAs`→나무위키 + sprint `parentOrganization`→코드잇 연결이 직접 fetch 403 을 대신해 모회사 엔티티 존재를 입증하기 때문입니다(직접 fetch 불필요). 소셜 인프라(YouTube·LinkedIn·Naver 블로그)는 사이트 `sameAs` 로 견고히 연결. 그러나 ko.위키백과·Wikidata 는 모회사로도 부재라 0, 잡플래닛은 부모 스키마 미연결로 0 입니다. **완전 가점**은 sprint 전용 엔티티(나무위키 "코드잇 스프린트" 독립 문서 등)가 생길 때 부여됩니다.

### Content E-E-A-T — 65/100

| 차원 | Max | 획득 | 근거 |
|---|---|---|---|
| Experience | 25 | 15 | 수강생 성과·실무 프로젝트(실기업 데이터) 언급. 단 졸업생 실명·기수·프로필 링크 등 검증 메타 부족 |
| Expertise | 25 | 17 | 강사 이력 공개(전 카카오/네이버/토스 등). 단 `Person` 스키마·개별 강사 프로필 페이지 없음 |
| Authoritativeness | 25 | 17 | 통계 출처 표기(취업률 "고용24 기준", 만족도 "내부 기준 n"), `parentOrganization`(코드잇), 채용 기업명 인용. 모회사 엔티티 그라운딩은 Brand/Platform 에서 별도 반영 |
| Trustworthiness | 25 | 16 | HTTPS·canonical·푸터 사업자 정보(통신판매업)·약관/개인정보. 단 리뷰 집계·aggregateRating 부재 |
| | **100** | **65** | |

> E-E-A-T 차원은 온페이지 신호 기준이며 brandSources 버전과 독립적이라 v1 과 동일(65) 재현. parentOrganization 은 v1 에서 이미 Authoritativeness 에 반영됨.

### Technical GEO — 85/100  *(존재 여부 + auditUrls 직접 관측 신호만)*

| # | 체크 항목 | Max | 획득 | 근거 |
|---|---|---|---|---|
| 1 | robots.txt 존재·AI 전면 허용 | 20 | 20 | 200 / `/admin`·`/become` 만 차단 / AI 크롤러 차단 없음 |
| 2 | sitemap.xml 존재 | 12 | 12 | 200 / 2 URL + lastmod + priority |
| 3 | server-sitemap.xml 존재 | 13 | 13 | 200 / 8 트랙 URL |
| 4 | llms.txt 존재·well-formed | 20 | 20 | 200 `text/plain` / H1·blockquote·H2·링크 구조 |
| 5 | llms-full.txt 존재 | 15 | 0 | ❌ HTTP 404 |
| 6 | HTTPS + HSTS | 6 | 6 | HTTPS/2 + HSTS |
| 7 | SSR(본문 HTML 포함) | 6 | 6 | Next.js, 홈 198KB·트랙 1~2.3MB 본문 인라인 |
| 8 | canonical + 핵심 보안 헤더 | 8 | 8 | canonical 有 / 핵심 보안 헤더 present (CSP 부재는 별도 기록) |
| | **합계** | **100** | **85** | |

**AI 크롤러:** robots.txt 가 `User-agent: *` 전면 허용이라 GPTBot·OAI-SearchBot·ChatGPT-User·ClaudeBot·PerplexityBot·Google-Extended·CCBot·Bytespider 등 모두 기본 허용 상속(개별 명시 디렉티브·`Content-Signal:` 없음).

### Schema & Structured Data — 66/100

| # | 체크 항목 | Max | 획득 | 근거 |
|---|---|---|---|---|
| 1 | EduOrg + sameAs + parentOrganization | 14 | 14 | 전 페이지 EducationalOrganization(@id `#organization`), sameAs 5종, `parentOrganization` 코드잇(`www.codeit.kr/#organization`) |
| 2 | WebSite 스키마 | 5 | 5 | 전 페이지(publisher → #organization) |
| 3 | Course 스키마(전 트랙) | 15 | 15 | 8 트랙 전부 Course(name·description·url·teaches·datePublished·inLanguage) |
| 4 | Course.offers(price/currency/availability) | 8 | 8 | `Offer{price, priceCurrency=KRW, availability=InStock}` |
| 5 | Course.provider | 5 | 5 | provider 노드(EduOrg #organization) |
| 6 | Course.hasCourseInstance(일정/장소) | 7 | 6 | 대부분 트랙 `CourseInstance`(frontend-advanced 누락 추정) |
| 7 | Course.aggregateRating | 12 | 0 | ❌ 전 트랙 누락 |
| 8 | Course.instructor(Person) | 10 | 0 | ❌ 전 트랙 누락 |
| 9 | FAQPage(홈+트랙) | 8 | 8 | 홈 7 + 트랙 다수 Q&A |
| 10 | BreadcrumbList(트랙) | 5 | 5 | 전 트랙 |
| 11 | Course image/educationalLevel/timeRequired/credential | 6 | 0 | ❌ 객체 레벨 없음 |
| 12 | /career 전용 스키마 | 5 | 0 | ❌ EduOrg·WebSite 만, Service/EduOccProgram/FAQ 없음 |
| | **합계** | **100** | **66** | |

### Platform Optimization — 62/100  *(한국 생태계 기준)*

| # | 체크 항목 | Max | 획득 | 근거 |
|---|---|---|---|---|
| 1 | AI 크롤러 접근(robots 전면 허용) | 15 | 15 | AI 차단 없음 |
| 2 | llms.txt 존재·well-formed | 12 | 12 | 200 `text/plain` |
| 3 | llms-full.txt 존재 | 8 | 0 | ❌ 404 |
| 4 | 답변엔진용 구조화 콘텐츠(FAQPage) | 15 | 15 | 홈+전 트랙 FAQPage |
| 5 | 엔티티 그라운딩(위키백과/Wikidata/나무위키) | 25 | **8** | ◐ **부분 가점** — 모회사(코드잇) 나무위키 연결 확인(코드잇 `sameAs`→나무위키 + sprint `parentOrganization`). sprint 전용·ko.위키백과·Wikidata 는 여전히 부재 → 1/3 부분 |
| 6 | KR 플랫폼 신호(Naver 블로그 연결·KR 로케일) | 10 | 7 | Naver 블로그 `sameAs` 연결·`lang=ko`·국비지원 콘텐츠 |
| 7 | AI Overviews 리치결과 신호(aggregateRating/review) | 10 | 0 | ❌ 없음 |
| 8 | SSR + clean canonical(전 엔진 인덱싱) | 5 | 5 | SSR + canonical |
| | **합계** | **100** | **62** | |

| AI 플랫폼 | 준비도 | 핵심 이슈 |
|---|---|---|
| Google AI Overviews | 보통 | FAQ 有, Course `aggregateRating` 부재로 별점 스니펫 미적격 |
| ChatGPT 웹검색 | 보통 | SSR·llms.txt 양호, sprint 전용 엔티티 확인 부재(모회사만 연결) |
| Perplexity | 보통 | 크롤 가능, 권위 3rd-party 인용 빈약 |
| Google Gemini | 낮음~보통 | hreflang 부재·작성자 E-E-A-T 신호 약함 |
| Bing Copilot | 낮음~보통 | 접근 양호, 전용 신호 없음 |
| 한국 AI (Naver AI Briefing / CLOVA) | 보통 | Naver 블로그 연결 + 모회사 나무위키 연결. sprint 전용 나무위키 문서는 부재 |

---

## 디스커버리 (Discovery) — composite 미반영

> 아래는 이번 감사에서 **새로 관찰**되었으나 `brandSources` v2 고정 체크리스트 가점에 직접 들어가지 않는(또는 부모 스키마 경유로만 확인된) 신호입니다. 차기 `brandSourcesVersion` 검토용으로 기록합니다.

- **모회사 그라운딩 체인(v2 핵심 발견):** `sprint.codeit.kr` Organization `parentOrganization.@id = https://www.codeit.kr/#organization` → 코드잇 Organization(`@id` 정확 일치) `sameAs` 에 **`https://namu.wiki/w/%EC%BD%94%EB%93%9C%EC%9E%97`(= 나무위키/코드잇)** 포함. 이 체인으로 나무위키 직접 403 에도 모회사 엔티티 존재가 입증됨(brandSources #1 부분 가점 근거).
- **사이트 `sameAs` 에 있으나 brandSources 미수록:** `facebook.com/codeit.kr` (Facebook — 코드잇/sprint 양쪽 스키마에 존재, brandSources 미수록 → composite 미반영). Instagram 실제 연결 핸들은 지정값 `@codeit.kr` 가 아니라 **`@codeit_kr`** (핸들 불일치).
- **지정값 `@codeit_sprint` 인스타그램:** 사이트 `sameAs` 에 없음(존재 미확인).
- **정부/공신력 레퍼런스:** 취업률 "**고용24**", 훈련장려금 "**HRD-Net**", 국비지원(내일배움카드/KDT) 맥락 — 제3자 권위 신호 후보(composite 미반영).
- **검증 불가(봇 차단)로 미가점 처리된 고정 소스:** 잡플래닛(403, 코드잇 `sameAs` 미연결) — 부모 스키마 연결이 확인되거나 sprint 전용 페이지가 생기면 가점 상향 여지.
- **커뮤니티(미점검·후보):** OKKY·블라인드·커리어리·네이버 카페 등 한국 개발자 커뮤니티는 이번 감사에서 **점검하지 않았으며** composite 에 미반영(재현성 원칙상 임의 크롤 배제). 차기 버전 KR 평판 신호 편입 검토 가능.

---

## Quick Wins (이번 주)

1. **Course 스키마에 `aggregateRating` 추가** — 내부 만족도 데이터를 별점/리뷰수로 매핑. 별점 리치결과 해금.
2. **Course 스키마에 `instructor`(Person) 추가** — 공개 강사 이력을 `Person`+LinkedIn `sameAs` 로 구조화.
3. **/llms-full.txt 생성** — 전 커리큘럼·통계·FAQ·강사 이력 전문 포함(현재 404).
4. **/career 페이지 스키마 추가** — `FAQPage` + `Service`/`EducationalOccupationalProgram`.
5. **잡플래닛 기업 페이지를 코드잇 `sameAs` 에 연결** — 부모 스키마 경유 부분 가점 해금(현재 미연결로 0).

## 30-Day Action Plan

### Week 1 — 스키마·기술
- [ ] 전 트랙 Course 에 `aggregateRating`·`instructor`·`image`·`timeRequired`·`educationalLevel` 추가
- [ ] frontend-advanced 트랙 `hasCourseInstance` 보강
- [ ] /career `FAQPage`+`Service` 스키마, /llms-full.txt 생성
- [ ] robots.txt `Content-Signal:`·AI `Allow`, hreflang, CSP 헤더

### Week 2 — 인용 최적화 콘텐츠
- [ ] 트랙별 자기완결 "답변 문단" 3~5개(정량+출처 포함) 본문화
- [ ] 성과 데이터 섹션을 prose 로 재구성(현 그래픽/툴팁 → 인용 가능한 문장)
- [ ] 후기에 졸업생 식별 메타(기수·트랙·재직사) 부여

### Week 3 — 엔티티 그라운딩(완전 가점 전환)
- [ ] **나무위키 "코드잇 스프린트" 전용 문서** 정비 + 사이트 `sameAs` 직접 연결 → 모회사 부분 가점에서 **완전 가점** 전환
- [ ] **Wikidata 엔티티 생성**(언어무관 핵심, 현재 부재) + 사이트 `sameAs` 추가
- [ ] 한국어 위키백과 "코드잇"/"코드잇 스프린트" 독립 문서 제안

### Week 4 — 플랫폼·평판 증폭
- [ ] 잡플래닛 기업 페이지 정비·코드잇 `sameAs` 연결
- [ ] Naver AI Briefing 노출 겨냥 KR 장문 콘텐츠(KDT 가이드 등)
- [ ] Instagram 핸들 정합성 정리(`@codeit_kr` ↔ brandSources 지정값)

---

## Appendix: Methodology

- **고정 입력:** `audit-targets.json` → `sprint` (isoWeek 2026-W26, capturedAt 2026-06-22T16:53:34Z). auditUrls 10개만 점검, sitemap 임의 크롤·블로그 랜덤 샘플 없음.
- **기술 신호:** robots.txt / sitemap.xml / server-sitemap.xml / llms.txt / llms-full.txt 존재 여부 + auditUrls 응답에서 직접 관측된 HTTPS/헤더/SSR/canonical.
- **채점:** 카테고리별 객관 신호 체크리스트의 가점 합(위 표). composite 가중식 = citability·0.25 + brand·0.20 + eeat·0.20 + technical·0.15 + schema·0.10 + platform·0.10, 반올림.
- **brandSources:** **version 2** 고정 8개의 존재/연결만 composite 반영. "(모회사)" 항목은 `parentOrganization`→코드잇 연결 + 모회사 엔티티 존재 시 **부분 가점(50%)**, sprint 전용 엔티티 존재 시 완전 가점. 나무위키 직접 fetch 403 이어도 코드잇 `sameAs`·`parentOrganization` 연결로 확인되면 인정. 그 외 발견 소스는 디스커버리 섹션 한정.
- **KR 현지화:** 엔티티 그라운딩·평판·플랫폼을 한국 생태계 기준 평가. 영문 Wikipedia/Reddit/G2/Trustpilot/Clutch 부재는 critical 미분류·가중치 하향. Wikidata 는 언어무관 핵심으로 가중치 유지.
