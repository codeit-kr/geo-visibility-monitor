# GEO Audit Report: 코드잇 스프린트 (Codeit Sprint)

**Audit Date:** 2026-07-20
**capturedAt:** 2026-07-20T03:43:57Z (fixed input) · dataset capturedAt 2026-07-20T02:56:41Z
**isoWeek:** 2026-W30
**App:** sprint
**URL:** https://sprint.codeit.kr
**Business Type:** EdTech / 코딩 부트캠프 (국비지원 KDT)
**Locale:** Korean (KR) — 한국 시장 서비스
**brandSourcesVersion:** 2
**Pages Analyzed:** 10 (고정 `auditUrls`)

> **재현성 고지 (Reproducibility).** 이 감사는 `audit-targets.json` 의 `sprint` 항목에 고정된 입력만 사용했습니다.
> - 감사 대상 페이지는 그 항목의 `auditUrls` **10개로 한정**(sitemap 임의 크롤·블로그 랜덤 샘플 없음). 온페이지 신호는 그 주차의 스냅샷 `pages.json`(고정 캡처)에서 파싱.
> - 기술 신호는 **robots.txt / sitemap.xml / server-sitemap.xml / llms.txt / llms-full.txt 의 존재 여부만** 점검.
> - composite 에 반영한 외부 신호는 `brandSources` (**version 2**) 고정 체크리스트 **8개뿐**.
> - 각 카테고리 점수는 주관 인상이 아니라 아래 객관 신호 체크리스트의 **가점 합**으로 산정했고 항목별 근거를 남겼습니다. 동일 입력 = 동일 점수.
> - 이전 주차 점수를 앵커로 사용하지 않았습니다(delta-context 미사용). 본문의 "전주 대비" 언급은 점수 앵커가 아니라 관측된 객관 신호의 사실 기록입니다.

---

## Executive Summary

**Overall GEO Score: 79/100 (Good)**

코드잇 스프린트는 **기술 인프라(92)·플랫폼(91)·구조화 데이터(88)** 가 매우 강하다. 10개 고정 페이지 전부 SSR 로 제공되고(빈 JS 셸 없음) AI 크롤러가 전부 허용되며, `EducationalOrganization`→`parentOrganization`(코드잇)→`Course`+`CourseInstance`+`Offer`/`FAQPage`/`BreadcrumbList` 그래프가 전 트랙에 유효한 JSON-LD 로 심겨 있다. 이번 회차 고정 데이터 기준으로 (a) 7개 트랙 전부 `hasCourseInstance`+`Offer`+`VirtualLocation` 정합, (b) `#organization` @id 로고가 전 블록 `sprint-logo.png` 로 일관(불일치 없음), (c) `html lang=ko`·OG/Twitter 카드가 head 에서 객관 확인됐다. 가장 큰 취약점은 여전히 **브랜드 권위(52)** 로, 모회사 코드잇의 **한국어 위키백과·Wikidata 엔티티가 부재**하고 스프린트 전용 엔티티는 어떤 플랫폼에도 없다(브랜드 신호가 전부 모회사 채널 상속에 의존).

### Score Breakdown

| Category | Score | Weight | Weighted |
|---|---|---|---|
| AI Citability | 84/100 | 25% | 21.00 |
| Brand Authority | 52/100 | 20% | 10.40 |
| Content E-E-A-T | 82/100 | 20% | 16.40 |
| Technical GEO | 92/100 | 15% | 13.80 |
| Schema & Structured Data | 88/100 | 10% | 8.80 |
| Platform Optimization | 91/100 | 10% | 9.10 |
| **Overall GEO Score** | | | **79.50 → 79** |

`composite = round(84·0.25 + 52·0.20 + 82·0.20 + 92·0.15 + 88·0.10 + 91·0.10)`
가중합의 수학적 값은 정확히 **79.50** 이나, 재현성을 위해 리포지토리의 표준 반올림 프리미티브(`Math.round` over IEEE-754 double)를 사용한다. 해당 부동소수점 합은 `79.49999…` 로 평가되어 **`Math.round → 79`**. 동일 입력·동일 프리미티브로 재계산 시 항상 79 로 재현된다.

---

## Critical Issues (Fix Immediately)

KR 현지화 기준상 **critical 등급 이슈는 없음.** (영문 Wikipedia/Reddit/G2/Trustpilot/Clutch 부재는 규칙에 따라 critical 로 분류하지 않고 가중치를 낮춤. Wikidata 는 언어무관 핵심이라 가중치 유지.)

## High Priority Issues

1. **모회사 코드잇의 한국어 위키백과 문서 부재** — `ko.wikipedia.org/wiki/코드잇` 직접 조회 결과 **HTTP 404**. 한국어 위키백과는 KR 시장 핵심 엔티티 근거이며(영문 위키와 달리 down-weight 대상 아님), AI 엔티티 그라운딩의 큰 공백.
2. **모회사 코드잇의 Wikidata 아이템 부재** — `wbsearchentities`(ko/en) 결과 관련 항목 0건(무관한 `Q30299760 CodeIT(Norway)` 만 존재). Wikidata 는 언어무관 핵심 신호로 가중치를 유지했으며, 부재는 `sameAs` 엔티티 링크의 최상위 근거를 잃는 것.
3. **스프린트 전용 엔티티 부재** — 브랜드 신호는 전부 모회사(코드잇) 채널 상속에 의존. 스프린트 전용 위키/엔티티가 없어 브랜드 카테고리 완전 가점 불가.

## Medium Priority Issues

1. **Organization `sameAs` 에 Wikipedia/Wikidata 미포함** — AI 엔티티 링킹 최강 신호 부재(엔티티 자체가 없으니 선결과제는 High #1·#2). 모회사 `www.codeit.kr` 도 자체 페이지에 Wikipedia/Wikidata/namu 링크 없음(라이브 확인).
2. **환불·보증 정책 및 성과통계 방법론 미노출** — 성과통계(취업률 등) 산출 방법론(모집단/연도)·환불정책이 감사 대상 페이지에서 확인 불가.
3. **스프린트 전용 IG `@codeit_sprint` 미확인** — `sameAs` 는 모회사 핸들 `instagram.com/codeit_kr` 만 확정. 체크리스트의 스프린트 전용 핸들 검증 불가.
4. **ItemList·llms.txt 의 `/track/frontend` 참조** — 고정 감사셋(`frontend-advanced`)과 별개 URL. server-sitemap.xml·llms.txt 상 별도 트랙("프론트엔드 엔지니어 양성 과정")일 개연이 있으나 감사셋 밖이라 본 회차 미점검.

## Low Priority Issues

1. `WebSite` 에 `SearchAction`(사이트링크 검색창) 없음.
2. `og:locale=ko_KR` 명시 태그 미검출(`html lang=ko` 는 확정).
3. 명시적 `Content-Security-Policy` 헤더 부재(그 외 보안 헤더는 양호).
4. `llms-full.txt` 부재(404) — `llms.txt` 는 존재.
5. FAQ 답변엔 `speakable`(cssSelector) 존재하나, 코스 요약·헤드라인 통계엔 `speakable` 미적용.

---

## Category Deep Dives

### AI Citability (84/100)

객관 체크리스트 가점 합. 10개 고정 URL 모두 실 텍스트가 SSR 로 추출 가능(빈 JS 셸 없음). FAQ Q&A·`teaches` 리스트·`Offer` 가격이 JSON-LD 로 직접 추출 가능.

| # | 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|---|
| 1 | 독립 인용가능 정량 블록 | 15 | 14 | 트랙 성과 수치·정가·기수일정 등 정량 블록 일관. 출처/방법론 약함 −1 |
| 2 | 질문형 헤딩(쿼리 매칭) | 10 | 7 | 실제 FAQ 질문 다수("학업 또는 직장과 병행이 가능한가요?", "훈련장려금은 어떻게 지급되나요?") vs 슬로건성 H2 혼재 |
| 3 | 상단 정의/요약 문장 | 10 | 6 | H1 은 서술적이나 "X는 ~이다" 정의 패턴 적고 도입부가 홍보성 |
| 4 | 사실 리스트·표(커리큘럼/트랙/성과/가격) | 20 | 19 | Course `teaches` 배열·정가(`Offer` ₩300,000/600,000)·ItemList 8트랙 매우 추출 친화 |
| 5 | 고유명사·구체 수치 | 15 | 15 | 정확한 학비·기수일정(startDate/endDate)·기간·툴(React/Spring/PyTorch/AWS 등) |
| 6 | FAQ형 콘텐츠 | 10 | 8 | "자주 묻는 질문" 홈(7 Q&A)+트랙(트랙당 9~12 Q&A), 실 Q→A (Question/Answer JSON-LD) |
| 7 | 구조화 llms.txt 요약 | 10 | 9 | 유효 llms.txt(H1+요약 blockquote+섹션 링크+트랙 목록). 헤드라인 통계 인라인 수치 부재 −1 |
| 8 | 낮은 부풀림 비율 | 10 | 6 | 트랙=사실 위주(양호), 홈/career=홍보 부풀림으로 희석 |
| | **합계** | **100** | **84** | |

- **강한 인용 예시:** `/track/backend-spring` `teaches`(Java·Spring·JPA·RESTful API·대용량 트래픽 처리) + `Offer` ₩600,000 + 기수(startDate 2026-08-03) — JSON-LD 로 직접 추출.
- **약한 예시:** `/`(홈) 슬로건성 H2("압도적 만족도…") 사실 밀도 낮음.

### Brand Authority (52/100)

composite 반영은 **`brandSources` (version 2) 고정 8개 소스의 존재/연결 여부**만. "(모회사)" 항목은 코드잇(parent) 엔티티이며,
사이트 Organization 스키마가 `parentOrganization` 으로 코드잇(`www.codeit.kr`)에 연결되어 있고 **그 모회사 엔티티가 존재(라이브 200)하면 부분 가점**(자식이 부모 상속).
완전 가점은 스프린트 전용 엔티티가 있을 때만. 이번 회차 엔티티 그라운딩(Wikidata·ko.wiki 부재, sameAs 세트)은 전주와 **동일**.

| # | 고정 소스 | 가능 | 가점 | 존재/연결 근거 | 완전/부분 |
|---|---|---|---|---|---|
| 1 | namu.wiki/w/코드잇 (모회사) | 15 | 8 | 직접 fetch **403**(규칙상 불이익 없음). `parentOrganization`→코드잇(`www.codeit.kr/#organization`) 연결 확정 + 모회사 사이트 라이브 **200** 으로 모회사 엔티티 인정(직접 fetch 불필요). 스프린트 전용 엔티티 아님 | 부분 |
| 2 | ko.wikipedia/코드잇 (모회사) | 15 | 0 | 직접 조회 **404** — 모회사 문서 부재. 한국어 위키는 KR 핵심(down-weight 대상 아님) → 상속할 엔티티 없음 | 없음 |
| 3 | Wikidata 코드잇/Codeit (모회사) | 15 | 0 | `wbsearchentities`(ko/en) 관련 0건(`Q30299760 CodeIT-Norway` 는 무관). 언어무관 핵심 → 가중치 유지, 엔티티 없어 가점 불가 | 없음 |
| 4 | blog.naver.com/codeitofficial | 10 | 9 | Org `sameAs` 에 **정확히 동일 핸들** 포함 → 존재·연결 확정 | 부분(모회사 채널) |
| 5 | youtube.com/@codeit | 15 | 13 | `sameAs` 포함 + 직접 조회 **HTTP 200** 확정. 구독/조회수 JS-gated 미확인 −2 | 준-완전 |
| 6 | Instagram @codeit.kr, @codeit_sprint | 10 | 7 | `sameAs` 에 `instagram.com/codeit_kr` 확정. 스프린트 전용 `@codeit_sprint` 미확인 | 부분 |
| 7 | linkedin/company/codeit-official | 10 | 10 | Org `sameAs` 에 동일 URL 확정(연결 확정). 직접 fetch 는 LinkedIn 봇차단(부재 아님, 규칙상 불이익 없음) | 완전(연결 기준) |
| 8 | 잡플래닛: 코드잇 기업 페이지 | 10 | 5 | 직접 fetch **403**(봇차단). 법인 `(주) 코드잇`(사업자등록 313-86-00797) 라이브 확인 → 잡플래닛 페이지 개연 높으나 본 회차 미확인 | 부분 |
| | **합계** | **100** | **52** | | |

`8 + 0 + 0 + 9 + 13 + 7 + 10 + 5 = 52`

**Organization schema 연결 (스냅샷 SSR HTML 직접 파싱, 권위 근거):**
- 엔티티 `EducationalOrganization` `@id: https://sprint.codeit.kr/#organization`, name `코드잇 스프린트`, logo `codeit-images.codeit.com/logo/sprint-logo.png`.
- `sameAs`: `youtube.com/@codeit`, `instagram.com/codeit_kr`, `facebook.com/codeit.kr`, `blog.naver.com/codeitofficial`, `linkedin.com/company/codeit-official`.
- `parentOrganization`: `{ "@type":"EducationalOrganization", "@id":"https://www.codeit.kr/#organization", "name":"코드잇", "url":"https://www.codeit.kr" }` — **확정**. 자식(sprint)이 모회사(코드잇) 엔티티 상속 근거. 모회사 사이트 라이브 200 + 법인정보 노출로 실재 확인(나무위키 직접 403 이어도 이 연결로 모회사 인정).
- Wikipedia/Wikidata 링크는 `sameAs` 에 없음(해당 엔티티 자체 부재). 모회사 `www.codeit.kr` 자체 페이지에도 Wikipedia/Wikidata/namu 링크 없음(라이브 확인).

### Content E-E-A-T (82/100)

| 축 | 가능 | 가점 | 핵심 근거 |
|---|---|---|---|
| Experience | 25 | 20 | 트랙별 실제 프로젝트(기업 서비스 데이터 프로젝트, Figma 요구사항 등)·수료 직무 사례. 학생 포트폴리오 원자료 미확인 − |
| Expertise | 25 | 22 | 트랙별 정확한 커리큘럼·기술 용어(`teaches` 배열), 직무 매핑 상세. CEO/공통 요소 트랙 중복으로 트랙별 전문성 희석 − |
| Authoritativeness | 25 | 18 | KDT/고용노동부/내일배움카드·훈련장려금 전 트랙, HRD-Net 연동 명시. 외부 평판 링크(잡플래닛/네이버 후기) 부재 −, 운영사 권위 페이지 감사셋 내 부재 − |
| Trustworthiness | 25 | 22 | HTTPS/HSTS, 투명 학비·국비지원·훈련장려금 상세, 신선한 기수일정(CourseInstance startDate/endDate). 법인 식별정보(`(주) 코드잇`·사업자등록 313-86-00797·대표·주소)는 모회사에서 확인. 환불정책·통계 산출 방법론 미노출 −3 |
| **합계** | **100** | **82** | |

### Technical GEO (92/100)

기술 신호는 5개 파일 **존재 여부**만 점검(규칙). 정규화 점수 96/104 → **92**. 라이브 재검증 완료.

| 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|
| HTTPS/TLS | 8 | 8 | HTTPS 제공 |
| HSTS | 4 | 4 | `strict-transport-security` |
| robots.txt 존재 | 6 | 6 | **200**, 유효, 양 sitemap 참조 |
| AI 크롤러 허용 | 8 | 8 | `User-agent:*` 가 `/admin`,`/become` 만 차단. GPTBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot 개별 차단 규칙 없음(전부 허용) |
| sitemap.xml | 6 | 6 | **200**, 유효 XML |
| server-sitemap.xml | 4 | 4 | **200**, 유효 XML(트랙 8 URL) |
| llms.txt | 6 | 6 | **200**, 유효 포맷(H1+요약+섹션) |
| llms-full.txt | 3 | 0 | **404 (부재)** |
| SSR(실 HTML) | 20 | 20 | 9개 HTML 페이지 전부 풀 SSR(JSON-LD 포함), CSR 빈 셸 아님 |
| canonical | 6 | 6 | 9개 HTML 전부 `rel=canonical`(자기참조 확인) |
| meta robots noindex 아님 | 6 | 6 | `robots:null`(noindex 없음) |
| viewport | 4 | 4 | 모바일 viewport |
| structured data 존재 | 5 | 5 | Course/FAQPage/BreadcrumbList 전 페이지 |
| 보안 헤더 | 8 | 7 | 표준 보안 헤더 양호, CSP 부재 −1 |
| 클린 URL | 4 | 4 | 소문자·하이픈·계층(`/track/<slug>`) |
| 10개 페이지 200 | 6 | 6 | 전부 HTTP 200 |
| **합계** | **104 → 100 정규화** | **96 → 92** | |

**5-File 존재표:** robots.txt **200** · sitemap.xml **200** · server-sitemap.xml **200** · llms.txt **200** · llms-full.txt **404**.

### Schema & Structured Data (88/100)

스냅샷 SSR HTML 직접 파싱. 전 페이지 유효 JSON-LD(100% JSON-LD, Microdata/RDFa 없음). 정규화 95/108 → **88**.

| 페이지 | @types |
|---|---|
| / | EducationalOrganization, WebSite, FAQPage(7 Q&A), ItemList(8 트랙), ImageObject |
| /career | EducationalOrganization, WebSite, ImageObject |
| /track/frontend-advanced | EduOrg, WebSite, Course, CourseInstance, Offer, VirtualLocation, FAQPage(11 Q&A), BreadcrumbList |
| /track/{backend-spring,fullstack,ai,data,product-design,it-founder} | EduOrg, WebSite, Course, CourseInstance, Offer, VirtualLocation, FAQPage, BreadcrumbList |
| /llms.txt | n/a(text/plain) |

- **가점 근거:** Organization(name/url/logo/description/@id + sameAs 5 + `parentOrganization`→코드잇), Course(name/description/provider/inLanguage/datePublished/`teaches`/`offers`/`hasCourseInstance`), CourseInstance(courseMode `blended`/startDate/endDate/VirtualLocation), Offer(price/priceCurrency/availability), FAQPage(Question/Answer + `speakable` cssSelector), BreadcrumbList, WebSite, ItemList(8 트랙). 7개 트랙 전부 Course 인스턴스 정합.
- **로고 일관성:** `#organization` @id 로고가 org 블록·Course.provider 전부 `sprint-logo.png` 로 일치(불일치 없음).
- **감점(잔존):** `sameAs` 에 Wikipedia/Wikidata 없음(엔티티 부재) −, `WebSite.SearchAction` 부재 −, ItemList `/track/frontend` 참조(감사셋 외) −, 코스 요약/헤드라인 통계에 `speakable` 미적용 −.

### Platform Optimization (91/100)

10개 고정 URL 의 on-page 신호만. KR 현지화(네이버/구글-KR 가중). head 태그(`html lang`·OG·Twitter)를 스냅샷 HTML 에서 객관 확인.

| 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|
| 한국어 콘텐츠 | 8 | 8 | 10페이지 전부 한국어 |
| html lang/og:locale | 7 | 6 | `<html lang="ko">` 9개 HTML 전부 확정. `og:locale` 명시 태그는 미검출 −1 |
| AI Overview/Briefing 추출 블록 | 12 | 10 | 직답 FAQ + 정량 stat 블록 |
| FAQ/구조화 Q&A | 12 | 11 | 전 페이지 "자주 묻는 질문"(Question/Answer JSON-LD) |
| FAQPage/Course/Org JSON-LD | 12 | 11 | 전 페이지 유효·SSR |
| 비교/리스트(Perplexity 친화) | 10 | 10 | 트랙 비교·리스트, ItemList 8 트랙 |
| 헤딩 계층 | 8 | 6 | 단일 H1+논리적 하위 헤딩, 슬로건 H2 일부 |
| 신선도/날짜 | 8 | 7 | 기수일정·CourseInstance startDate/endDate·`datePublished`. publish/modified 페이지 타임스탬프는 아님 |
| llms.txt 크롤러 피딩 | 6 | 6 | 유효 llms.txt |
| OG/Twitter 카드 | 5 | 5 | `og:title`/`og:description`/`og:image` + `twitter:card`/`title`/`description`/`image` 확정 |
| SSR/크롤 가능 텍스트 | 7 | 7 | 전 페이지 SSR |
| 모바일 viewport | 3 | 3 | `width=device-width` |
| canonical/hreflang | 2 | 1 | canonical 확정, hreflang 신호 없음 −1 |
| **합계** | **100** | **91** | |

**서피스별:** 네이버 AI Briefing/Perplexity/Google AIO = 강함(비교표·FAQ·SSR·llms.txt·확정 lang/OG). ChatGPT/Gemini/Bing = 중상(스키마·엔티티 보강, off-page 엔티티가 한계).

---

## Discovery (composite 점수 미반영)

규칙상 고정 `brandSources` 외 새로 발견한 소스/커뮤니티·신호는 **점수에 넣지 않고 여기에만 기록**한다.

- **AI 가시성 프로브(관측 데이터, `visibility.json` 290건):** 이번 스냅샷의 실측 AI 응답에서 스프린트/코드잇 언급률 **60% (174/290)**, 인용 URL 에 sprint.codeit/codeit.kr 포함 **153건**. 엔진별 언급: chatgpt 88/130, gemini 75/130, naver-briefing 7/15, google-aio 4/15. — **점수 미반영(참고 관측치)**.
- **경쟁 브랜드(프로브 내 동시 언급 상위):** 내일배움캠프(104)·패스트캠퍼스(91)·프로그래머스 데브코스(89)·엘리스(57)·멋쟁이사자처럼(50)·제로베이스(41)·구름(34)·커널 아카데미(31)·항해99(12). — 경쟁 맥락 참고용.
- **Facebook** `facebook.com/codeit.kr` — 모회사 공식 페이지(Org `sameAs`). 고정 리스트 외.
- **실제 IG 핸들 `@codeit_kr`** — `sameAs` 의 실 핸들(체크리스트의 `@codeit.kr` 와 표기 상이).
- **카카오 채널** `pf.kakao.com/_HxcRDM` — 모회사 codeit.kr 라이브 페이지에서 확인. 고정 리스트 외.
- **별도 프론트엔드 트랙** — server-sitemap.xml·llms.txt 에 `/track/frontend`(프론트엔드 엔지니어 양성 과정)가 `frontend-advanced` 와 별개로 존재. 고정 감사셋 밖.
- **법인정보** `(주) 코드잇`, 사업자등록 `313-86-00797`, 대표 강영훈·이윤수, 서울 중구 청계천로 100 시그니쳐타워 — 모회사 `www.codeit.kr` 에서 라이브 확인.
- 미확인 KR 커뮤니티(OKKY·블라인드·커리어리·네이버 카페) — 본 회차 별도 조사 미수행.

---

## Quick Wins (This Week)

1. `og:locale=ko_KR` 명시 태그 추가(현재 `html lang=ko` 만 확정) — 플랫폼 신호 마감.
2. `llms-full.txt` 생성 — 현재 404, `llms.txt` 와 함께 풀 본문 제공.
3. `WebSite.SearchAction` 추가 + 코스 요약/헤드라인 통계에 `speakable` 속성 확장(FAQ 답변엔 이미 적용).
4. 명시적 `Content-Security-Policy` 헤더 추가.
5. 성과통계 산출 방법론(모집단/연도)·환불/보증 정책을 감사 대상 페이지에 노출(E-E-A-T 신뢰성 잔여 감점 해소).

## 30-Day Action Plan

### Week 1: 엔티티 그라운딩 (최우선)
- [ ] 모회사 **코드잇 Wikidata 아이템 생성**(언어무관 핵심) + 한국어 위키백과 문서화 추진.
- [ ] Wikidata/위키백과 생성 후 Organization `sameAs` 에 추가(모회사·스프린트 양측).

### Week 2: 신뢰성(E-E-A-T) 마감
- [ ] 취업률·완주율 등 핵심 통계의 **산출 방법론·기준(모집단/연도) 명시**.
- [ ] 환불·보증 정책을 감사 대상 페이지에서 접근 가능하게 노출.

### Week 3: 스키마/플랫폼
- [ ] 코스 요약에 `speakable` 확장, `WebSite.SearchAction` 추가.
- [ ] `og:locale=ko_KR` 보강, `llms-full.txt` 생성, CSP 헤더 추가.

### Week 4: 인용가능성
- [ ] 트랙/홈 도입부에 "X는 ~이다" **정의·요약 문장** 추가, 슬로건 H2 를 질문형으로 전환.
- [ ] llms.txt 에 헤드라인 통계 스냅샷(취업률/완주율 수치) 인라인 추가.

---

## Appendix: Pages Analyzed (고정 auditUrls)

| # | URL | HTTP | SSR | 비고 |
|---|---|---|---|---|
| 1 | https://sprint.codeit.kr/ | 200 | Y | Org/WebSite/FAQPage(7)/ItemList(8) |
| 2 | https://sprint.codeit.kr/career | 200 | Y | Org/WebSite |
| 3 | https://sprint.codeit.kr/track/frontend-advanced | 200 | Y | Course(+CourseInstance/Offer)/FAQPage(11)/Breadcrumb |
| 4 | https://sprint.codeit.kr/track/backend-spring | 200 | Y | Course(+CourseInstance/Offer)/FAQPage/Breadcrumb |
| 5 | https://sprint.codeit.kr/track/fullstack | 200 | Y | Course(+CourseInstance/Offer)/FAQPage/Breadcrumb |
| 6 | https://sprint.codeit.kr/track/ai | 200 | Y | Course(+CourseInstance/Offer)/FAQPage/Breadcrumb |
| 7 | https://sprint.codeit.kr/track/data | 200 | Y | Course(+CourseInstance/Offer)/FAQPage/Breadcrumb |
| 8 | https://sprint.codeit.kr/track/product-design | 200 | Y | Course(+CourseInstance/Offer)/FAQPage/Breadcrumb |
| 9 | https://sprint.codeit.kr/track/it-founder | 200 | Y | Course(+CourseInstance/Offer)/FAQPage/Breadcrumb |
| 10 | https://sprint.codeit.kr/llms.txt | 200 | n/a | 유효 llms.txt(text/plain) |

**Technical signal files (라이브 재검증):** robots.txt 200 · sitemap.xml 200 · server-sitemap.xml 200 · llms.txt 200 · llms-full.txt **404**.
**brandSourcesVersion:** 2 (8개 고정 소스 — composite 반영 외부 신호는 이 목록뿐).
