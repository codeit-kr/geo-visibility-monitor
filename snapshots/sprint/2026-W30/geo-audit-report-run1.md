# GEO Audit Report: 코드잇 스프린트 (Codeit Sprint)

**Audit Date:** 2026-07-20
**capturedAt:** 2026-07-20T03:44:00Z
**isoWeek:** 2026-W30
**App:** sprint
**URL:** https://sprint.codeit.kr
**Business Type:** EdTech / 코딩 부트캠프 (국비지원 KDT)
**Locale:** Korean (KR) — 한국 시장 서비스
**brandSourcesVersion:** 2
**Pages Analyzed:** 10 (고정 `auditUrls`)

> **재현성 고지 (Reproducibility).** 이 감사는 `audit-targets.json` 의 `sprint` 항목에 고정된 입력만 사용했습니다.
> 감사 대상 페이지는 그 항목의 `auditUrls` 10개로 한정했고(sitemap 임의 크롤·블로그 랜덤 샘플 없음),
> 기술 신호는 robots.txt / sitemap.xml / server-sitemap.xml / llms.txt / llms-full.txt 의 **존재 여부**만 점검했으며,
> composite 에 반영한 외부 신호는 `brandSources` (**version 2**) 고정 체크리스트 8개뿐입니다.
> 각 카테고리 점수는 주관 인상이 아니라 아래 객관 신호 체크리스트의 가점 합으로 산정했고 항목별 근거를 남겼습니다.
> 이전 주차 점수를 앵커로 사용하지 않았습니다(delta-context 미사용). 본문의 "전주 대비" 언급은 점수 앵커가 아니라 관측된 객관 신호 변화의 사실 기록입니다.

---

## Executive Summary

**Overall GEO Score: 81/100 (Good)**

코드잇 스프린트는 **기술 인프라(92)·구조화 데이터(92)·플랫폼(93)** 이 매우 강하다. 10개 고정 페이지가 전부 SSR 로 제공되고(빈 JS 셸 없음) AI 크롤러가 전부 허용되며, `EducationalOrganization`→`parentOrganization`(코드잇)→`Course`+`CourseInstance`+`Offer`/`FAQPage`/`BreadcrumbList` 그래프가 7개 트랙 전부에 유효한 JSON-LD 로 심겨 있다. 이번 회차에는 (a) 홈 성과 지표(수강생 수·완주율·취업률)에 **산출 기준·모집단(“2025년 고용24 기준”, “수강생 2,598명 대상”)이 인라인 표기**되어 신뢰성이 개선됐고, (b) FAQPage 전 페이지에 `speakable` 이 추가됐으며, (c) Organization 로고가 `sprint-logo.png` 로 통일되어 전주의 로고 불일치가 해소됐고, (d) 전 Course 노드에 `datePublished` 가 추가돼 신선도 신호가 붙었으며, (e) `og:locale=ko_KR` 이 전 페이지 head 에서 객관 확인됐다. 가장 큰 취약점은 여전히 **브랜드 권위(53)** 로, 모회사 코드잇의 **한국어 위키백과·Wikidata 엔티티가 부재**하고 스프린트 전용 엔티티는 어떤 플랫폼에도 없다.

### Score Breakdown

| Category | Score | Weight | Weighted |
|---|---|---|---|
| AI Citability | 84/100 | 25% | 21.00 |
| Brand Authority | 53/100 | 20% | 10.60 |
| Content E-E-A-T | 85/100 | 20% | 17.00 |
| Technical GEO | 92/100 | 15% | 13.80 |
| Schema & Structured Data | 92/100 | 10% | 9.20 |
| Platform Optimization | 93/100 | 10% | 9.30 |
| **Overall GEO Score** | | | **80.90 → 81** |

`composite = round(84·0.25 + 53·0.20 + 85·0.20 + 92·0.15 + 92·0.10 + 93·0.10) = round(80.9) = 81`

---

## Critical Issues (Fix Immediately)

KR 현지화 기준상 **critical 등급 이슈는 없음.** (영문 Wikipedia/Reddit/G2/Trustpilot/Clutch 부재는 규칙에 따라 critical 로 분류하지 않고 가중치를 낮춤. Wikidata 는 언어무관 핵심이라 가중치 유지.)

## High Priority Issues

1. **모회사 코드잇의 한국어 위키백과 문서 부재** — `ko.wikipedia.org/wiki/코드잇` 직접 조회 결과 **HTTP 404**. 한국어 위키백과는 KR 시장에서 핵심 엔티티 근거이며(영문 위키와 달리 down-weight 대상 아님), AI 엔티티 그라운딩의 큰 공백.
2. **모회사 코드잇의 Wikidata 아이템 부재** — `wbsearchentities`(ko/en) 결과 관련 항목 0건(무관한 `Q30299760 CodeIT(Norway)` 만 존재). Wikidata 는 언어무관 핵심 신호로 가중치를 유지했으며, 부재는 `sameAs` 엔티티 링크의 최상위 근거를 잃는 것.
3. **스프린트 전용 엔티티 부재** — 브랜드 신호는 전부 모회사(코드잇) 채널 상속에 의존. 스프린트 전용 위키/엔티티가 없어 브랜드 카테고리 완전 가점 불가.

## Medium Priority Issues

1. **Organization `sameAs` 에 Wikipedia/Wikidata 미포함** — AI 엔티티 링킹 최강 신호 부재(엔티티 자체가 없으니 선결과제는 High #1·#2).
2. **환불·보증 정책 미노출** — 감사 페이지 푸터에 사업자등록번호·대표·주소·통신판매신고는 노출되나, 환불/보증 정책은 여전히 감사 페이지에서 확인 불가. (성과 통계의 산출 기준·모집단은 이번 회차에 노출됨 — 아래 E-E-A-T 참조.)
3. **스프린트 전용 IG `@codeit_sprint` 미확인** — `sameAs` 는 모회사 핸들 `instagram.com/codeit_kr` 만 확정. 체크리스트의 스프린트 전용 핸들 검증 불가.
4. **헤드라인 성과 수치가 애니메이션 숫자 릴로 렌더** — 홈의 취업률·완주율·수강생 수가 정적 SSR 텍스트에 `NN%` 형태가 아니라 0–9 오도미터 릴로 노출됨. 산출 기준·모집단(2,598명)은 정적 텍스트로 추출되나, **수치 값 자체는 정적 추출 난이도가 높음**(citability 인용가능 정량 블록 −).

## Low Priority Issues

1. `WebSite` 에 `SearchAction`(사이트링크 검색창) 없음.
2. 명시적 `Content-Security-Policy` 헤더 부재(그 외 보안 헤더는 양호).
3. `llms-full.txt` 부재(404) — `llms.txt` 는 존재.
4. `ItemList`·llms.txt 의 `/track/frontend` 참조 — 고정 감사셋(`frontend-advanced`)과 별개 URL. llms.txt 에 "프론트엔드 단기심화 과정과 별개로 운영되는 과정"으로 명시되어 있으나 감사셋 밖이라 본 회차 미점검.
5. `Offer.price` 표기 불일치 — Course JSON-LD `offers.price="300000"` vs 트랙 본문 자부담 `600,000원`/정가 `22,687,500원`. AI 가격 인용 시 혼동 소지.
6. `hreflang` 신호 없음(단일 언어 사이트라 영향 제한적).

---

## Category Deep Dives

### AI Citability (84/100)

객관 체크리스트 가점 합. 10개 고정 URL 모두 실 텍스트가 SSR 로 추출 가능(빈 JS 셸 없음).

| # | 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|---|
| 1 | 독립 인용가능 정량 블록 | 15 | 13 | 성과 지표에 **산출 기준·모집단 표기**("2025년 고용24 기준", "수강생 2,598명 대상") 추가 = 방법론 근거 강화(+). 단 취업률·완주율·수강생 수 **값 자체가 애니메이션 숫자 릴**로 렌더되어 정적 추출 난이도 높음(−2) |
| 2 | 질문형 헤딩(쿼리 매칭) | 10 | 7 | 실제 FAQ 질문 다수("학업 또는 직장과 병행이 가능한가요?", "훈련장려금은 어떻게 지급되나요?") vs 슬로건성 H2("만족할 수 밖에 없는 이유") 혼재 |
| 3 | 상단 정의/요약 문장 | 10 | 6 | H1 은 서술적("압도적 만족도의 IT 취업 부트캠프")이나 "X는 ~이다" 정의 패턴 적고 도입부가 홍보성. llms.txt 요약 blockquote 는 정의형(양호) |
| 4 | 사실 리스트·표(커리큘럼/트랙/성과/가격) | 20 | 19 | 주차별 커리큘럼·정가(₩22,687,500)·자부담(60만)·기수일정(26.08.04~27.02.26)·툴(Numpy/PyTorch/Transformers/RAG) 매우 추출 친화 |
| 5 | 고유명사·구체 수치 | 15 | 15 | 정확한 학비·기수일정·기간·툴·고용사(토스·쿠팡·카카오페이·미래에셋·LG CNS·컬리·현대오토에버) 및 채용공고 분석(네이버·쏘카·비바리퍼블리카·카카오·우아한형제들·당근) |
| 6 | FAQ형 콘텐츠 | 10 | 8 | "자주 묻는 질문" 홈(7)+트랙(9–13), 실 Q→A (Question/Answer JSON-LD, `speakable` 포함) |
| 7 | 구조화 llms.txt 요약 | 10 | 9 | 유효 llms.txt(H1+요약 blockquote+트랙 링크+성과수치 기준 안내). 헤드라인 통계 인라인 수치 부재 −1 |
| 8 | 낮은 부풀림 비율 | 10 | 7 | 트랙=사실 위주(양호). 홈/career 은 "압도적"·"무조건 책임" 등 홍보 부풀림으로 희석 |
| | **합계** | **100** | **84** | |

- **강한 인용 예시:** `/track/ai` "수강 기간 26.08.04~27.02.26, 수강료 22,687,500원(자부담 60만), 훈련장려금 최대 210만"; `/career` 실 고용사 30+.
- **약한 예시:** `/`(홈) 성과 수치가 오도미터 릴로 렌더 → 값 추출 난이도.

### Brand Authority (53/100)

composite 반영은 **`brandSources` (version 2) 고정 8개 소스의 존재/연결 여부**만. "(모회사)" 항목은 코드잇(parent) 엔티티이며,
사이트 Organization 스키마가 `parentOrganization` 으로 코드잇(`www.codeit.kr`)에 연결되어 있고 **그 모회사 엔티티가 존재하면 부분 가점**(자식이 부모 상속).
완전 가점은 스프린트 전용 엔티티가 있을 때만.

> **이번 회차 확인 — 모회사 엔티티/연결 강화.** 모회사 사이트 `www.codeit.kr` 를 직접 파싱한 결과 `EducationalOrganization`
> `@id: https://www.codeit.kr/#organization` name `코드잇` 가 **실재**하며, 그 `sameAs` 에 **`https://namu.wiki/w/코드잇` 이 명시적으로 포함**됨.
> 스프린트 스키마의 `parentOrganization.@id` 가 이 모회사 `@id` 와 정확히 일치 → 자식(sprint)의 부모(코드잇) 엔티티 상속·나무위키 연결이 **직접 fetch 없이 확정**됨(규칙에 따라 namu 직접 403 은 불이익 아님). 다만 엔티티 그라운딩의 핵심 축(ko.wikipedia·Wikidata)은 전주와 **동일하게 부재**.

| # | 고정 소스 | 가능 | 가점 | 존재/연결 근거 | 완전/부분 |
|---|---|---|---|---|---|
| 1 | namu.wiki/w/코드잇 (모회사) | 15 | 9 | 직접 fetch **403**(규칙상 불이익 없음). 모회사 `www.codeit.kr` Org `sameAs` 에 **namu.wiki 명시** + `parentOrganization`→`www.codeit.kr/#organization` 연결 확정 → 모회사 인정(전주보다 확증 강화). 스프린트 전용 엔티티 아님 | 부분 |
| 2 | ko.wikipedia/코드잇 (모회사) | 15 | 0 | 직접 조회 **404** — 모회사 문서 부재. 한국어 위키는 KR 핵심(down-weight 대상 아님) → 상속할 엔티티 없음 | 없음 |
| 3 | Wikidata 코드잇/Codeit (모회사) | 15 | 0 | `wbsearchentities`(ko/en) 관련 0건. 언어무관 핵심 → 가중치 유지, 엔티티 없어 가점 불가 | 없음 |
| 4 | blog.naver.com/codeitofficial | 10 | 9 | Org `sameAs` 에 **정확히 동일 핸들** 포함 → 존재·연결 확정 | 부분(모회사 채널) |
| 5 | youtube.com/@codeit | 15 | 13 | `sameAs` 포함 + 직접 조회 **HTTP 200** 확정. 구독/조회수 JS-gated 미확인 −2 | 준-완전 |
| 6 | Instagram @codeit.kr, @codeit_sprint | 10 | 7 | `sameAs` 에 `instagram.com/codeit_kr`(모회사) 확정. 스프린트 전용 `@codeit_sprint` 미확인 | 부분 |
| 7 | linkedin/company/codeit-official | 10 | 10 | Org `sameAs` 에 동일 URL 확정(연결 확정). 직접 fetch 는 LinkedIn 봇차단(부재 아님, 규칙상 불이익 없음) | 완전(연결 기준) |
| 8 | 잡플래닛: 코드잇 기업 페이지 | 10 | 5 | 직접 미확인. 법인 `(주) 코드잇`(사업자등록 313-86-00797) 실재 → 잡플래닛 페이지 개연 높으나 본 회차 미확인 | 부분 |
| | **합계** | **100** | **53** | | |

`9 + 0 + 0 + 9 + 13 + 7 + 10 + 5 = 53`

**Organization schema 연결 (원본 SSR HTML 직접 파싱, 권위 근거):**
- 스프린트 엔티티 `EducationalOrganization` `@id: https://sprint.codeit.kr/#organization`, name `코드잇 스프린트`, logo `codeit-images.codeit.com/logo/sprint-logo.png`.
- `sameAs`: `youtube.com/@codeit`, `instagram.com/codeit_kr`, `facebook.com/codeit.kr`, `blog.naver.com/codeitofficial`, `linkedin.com/company/codeit-official`.
- `parentOrganization`: `{ "@type":"EducationalOrganization", "@id": "https://www.codeit.kr/#organization", "name": "코드잇", "url": "https://www.codeit.kr" }` — **확정**. 모회사 사이트 실측 결과 이 `@id` 엔티티가 실재하고 `sameAs` 에 `namu.wiki/w/코드잇` 포함 → 나무위키 연결 확정(직접 fetch 불필요).
- Wikipedia/Wikidata 링크는 `sameAs` 에 없음(해당 엔티티 자체 부재).

### Content E-E-A-T (85/100)

| 축 | 가능 | 가점 | 핵심 근거 |
|---|---|---|---|
| Experience | 25 | 20 | 실명 수료생 성과·1인칭 후기("건설사 직원에서 개발자로 | 김하늘", "육아 병행 | 나윤주"), 트랙별 실제 프로젝트. career 페이지 취업 후기는 익명 마스킹(주** 님) −, 학생 포트폴리오 이미지 미확인 − |
| Expertise | 25 | 22 | 트랙별 실무 커리큘럼·정확한 기술용어(PyTorch/RAG/scikit-learn), 채용공고 기반 커리큘럼 설계(네이버·카카오·당근 등). CEO/강사 트랙별 전문성 세분 노출 약함 − |
| Authoritativeness | 25 | 19 | KDT/고용노동부/내일배움카드, 고용사 30+(토스·쿠팡·카카오페이·미래에셋·LG CNS·현대오토에버·컬리). 외부 평판 링크(잡플래닛/네이버 후기) 감사셋 내 부재 −, 운영사 권위 페이지 감사셋 내 부재 − |
| Trustworthiness | 25 | 24 | HTTPS, **정량 성과에 산출 기준·모집단 표기(“2025년 고용24 기준”, “수강생 2,598명 대상”) — 전주 방법론 공백 해소(+3)**, 투명 학비(정가 22,687,500·자부담 60만·지원 2,208만)·국비지원 내역, 신선한 기수일정, 운영사 법인 식별정보(사업자등록 313-86-00797·대표 강영훈/이윤수·주소 서울 중구 청계천로 100·통신판매 2019-서울중구-1034) 푸터 노출. 환불/보증 정책 여전히 미노출 −1 |
| **합계** | **100** | **85** | |

### Technical GEO (92/100)

기술 신호는 5개 파일 **존재 여부**만 점검(규칙). 정규화 점수 96/104 → **92**.

| 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|
| HTTPS/TLS | 8 | 8 | HTTP/2 TLS |
| HSTS | 4 | 4 | `strict-transport-security: max-age=31536000` |
| robots.txt 존재 | 6 | 6 | 200, 유효, 양 sitemap 참조 |
| AI 크롤러 허용 | 8 | 8 | `User-agent:*` 가 `/admin`,`/become` 만 차단. GPTBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot 등 별도 차단 없음(전면 허용) |
| sitemap.xml | 6 | 6 | 200 |
| server-sitemap.xml | 4 | 4 | 200 |
| llms.txt | 6 | 6 | 200, 유효 포맷 |
| llms-full.txt | 3 | 0 | **404 (부재)** |
| SSR(실 HTML) | 20 | 20 | 9개 HTML 페이지 전부 풀 SSR(JSON-LD 포함), CSR 빈 셸 아님 |
| canonical | 6 | 6 | 9개 HTML 전부 `rel=canonical`(자기참조 확인) |
| meta robots noindex 아님 | 6 | 6 | `robots` 메타 없음/차단 X-Robots-Tag 없음 |
| viewport | 4 | 4 | `width=device-width, initial-scale=1, viewport-fit=cover` 확인 |
| structured data 존재 | 5 | 5 | Course/FAQPage/BreadcrumbList 전 트랙 |
| 보안 헤더 | 8 | 7 | nosniff/SAMEORIGIN/Referrer-Policy/Permissions-Policy O, CSP 부재 −1 |
| 클린 URL | 4 | 4 | 소문자·하이픈·계층(`/track/<slug>`) |
| 10개 페이지 200 | 6 | 6 | 전부 HTTP 200 |
| **합계(정규화)** | **104 → 100** | **96 → 92** | |

**5-File 존재표:** robots.txt 200 · sitemap.xml 200 · server-sitemap.xml 200 · llms.txt 200 · **llms-full.txt 404**.

### Schema & Structured Data (92/100)

원본 SSR HTML 직접 파싱. 정규화 99/108 → **92**. 전 페이지 유효 JSON-LD(100% JSON-LD, Microdata/RDFa 없음).

| 페이지 | @types |
|---|---|
| / | EducationalOrganization, WebSite, FAQPage(7 Q&A, `speakable` #landing-faq), ItemList(8 트랙) |
| /career | EducationalOrganization, WebSite |
| /track/frontend-advanced | EduOrg, WebSite, Course, **CourseInstance**, Offer, VirtualLocation, FAQPage(11, `speakable`), BreadcrumbList |
| /track/{backend-spring,fullstack,ai,data,product-design,it-founder} | EduOrg, WebSite, Course, **CourseInstance**, Offer, VirtualLocation, FAQPage(9–13, `speakable`), BreadcrumbList |
| /llms.txt | n/a(text/plain) |

- **이번 회차 개선:** (1) FAQPage 전 페이지 `speakable` 추가(전주 결측 해소); (2) Organization 로고가 `sprint-logo.png` 로 통일 → org 블록 vs `Course.provider` 로고 **불일치 해소**; (3) 전 Course 노드에 `datePublished`(예: `/track/frontend-advanced` 2026-06-25) 추가 → 신선도 신호; (4) 7개 트랙 전부 `hasCourseInstance`(`courseMode:"blended"`, startDate 2026-08 대)+`Offer`+`VirtualLocation` 정합.
- 주요 가점: Organization(+sameAs 5 + `parentOrganization`→코드잇), Course(name/description/provider/teaches/offers/hasCourseInstance/datePublished), FAQPage(Question/Answer+speakable), BreadcrumbList, WebSite, ItemList.
- 감점(잔존): `sameAs` 에 Wikipedia/Wikidata 없음(엔티티 부재) −, `WebSite.SearchAction` 부재 −, ItemList `/track/frontend` 참조(감사셋 외) −, `Offer.price`(300000) vs 본문 가격(600,000/22,687,500) 불일치 −.

### Platform Optimization (93/100)

10개 고정 URL 의 on-page 신호만. KR 현지화(네이버/구글-KR 가중). head 태그(`html lang`·OG·Twitter)를 원본 HTML 에서 **객관 확인**함.

| 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|
| 한국어 콘텐츠 | 8 | 8 | 9개 HTML 전부 한국어 |
| html lang/og:locale | 7 | 7 | `<html lang="ko">` + `og:locale="ko_KR"` 전 페이지 **확정**(전주 og:locale 결측 해소) |
| AI Overview/Briefing 추출 블록 | 12 | 10 | 직답 FAQ + 정량 stat 블록(기준·모집단 표기). 헤드라인 수치 릴 렌더로 −2 |
| FAQ/구조화 Q&A | 12 | 11 | 전 페이지 "자주 묻는 질문"(Question/Answer JSON-LD + speakable) |
| FAQPage/Course/Org JSON-LD | 12 | 12 | 전 페이지 유효·SSR, Course/CourseInstance/Offer 정합 |
| 비교/리스트(Perplexity 친화) | 10 | 10 | 트랙 비교·리스트, ItemList 8 트랙 |
| 헤딩 계층 | 8 | 6 | 단일 H1+논리적 H2/H3, 슬로건 H2 일부 |
| 신선도/날짜 | 8 | 8 | CourseInstance startDate/endDate + Course `datePublished` 추가 |
| llms.txt 크롤러 피딩 | 6 | 6 | 유효 llms.txt |
| OG/Twitter 카드 | 5 | 5 | `og:title/description/image/locale` + `twitter:card`(트랙 `summary_large_image`) **확정** |
| SSR/크롤 가능 텍스트 | 7 | 7 | 전 페이지 SSR |
| 모바일 viewport | 3 | 3 | `width=device-width` 확정 |
| canonical/hreflang | 2 | 1 | canonical 확정, hreflang 신호 없음 −1 |
| **합계(정규화)** | **100** | **94 → 93** | |

**서피스별:** 네이버 AI Briefing/Perplexity/Google AIO = 강함(비교표·FAQ·SSR·llms.txt·확정 lang/OG·CourseInstance). ChatGPT/Gemini/Bing = 중상(스키마·엔티티 보강, off-page 엔티티 부재가 한계).

---

## Discovery (composite 점수 미반영)

규칙상 고정 `brandSources` 외 새로 발견한 소스/커뮤니티는 **점수에 넣지 않고 여기에만 기록**한다.

- **Facebook** `facebook.com/codeit.kr` — 모회사 공식 페이지(스프린트 Org `sameAs` 포함). 고정 리스트 외.
- **모회사 사이트 codeit.kr Organization 엔티티** — `@id: https://www.codeit.kr/#organization` 실재 확인, `sameAs` 에 namu.wiki/유튜브/인스타/페북/네이버블로그/링크드인 포함. 브랜드 채점(namu #1)의 확증 근거로만 사용, 별도 소스로 가산하지 않음.
- **`/track/frontend` (프론트엔드 엔지니어 과정)** — llms.txt·ItemList 에 존재(단기심화와 별개 운영 명시). 고정 `auditUrls` 밖이라 본 회차 미점검.
- **잠재 커뮤니티/평판 채널(미채점)** — OKKY·블라인드·커리어리·네이버 카페 등 KR 개발자 커뮤니티는 본 회차 고정 리스트에 없어 점수 미반영. 향후 `brandSources` 확장 검토 대상.
- **AI 가시성 관측(visibility.json, 참고용)** — ChatGPT "개발 부트캠프 비교" 계열 쿼리에서 스프린트 미언급, 경쟁사(SSAFY·우아한테크코스·카카오테크·부스트캠프·멋쟁이사자처럼·프로그래머스·내일배움캠프) 인용. 엔티티 그라운딩(High #1–#3) 공백과 정합. composite 미반영.

---

## Recommended Actions (우선순위)

### 최우선: 엔티티 그라운딩 (브랜드 상한 해제)
- [ ] 모회사 **코드잇 Wikidata 아이템 생성**(언어무관 핵심) 후 `sameAs` 연결.
- [ ] **한국어 위키백과 문서**(코드잇/코드잇 스프린트) 확보 — KR 시장 핵심 근거.
- [ ] 스프린트 **전용 엔티티**(위키/Wikidata) 확보 시 브랜드 완전 가점 가능.

### 신뢰성/인용가능성
- [ ] 홈 성과 수치를 **정적 텍스트로도 노출**(오도미터 릴과 병기) → AI 정적 추출 가능하게. (기준·모집단 표기는 이미 완료.)
- [ ] 환불·보증 정책을 감사 대상 페이지에서 접근 가능하게 노출.
- [ ] `Offer.price`(300000)를 본문 가격 체계(자부담 600,000/정가 22,687,500)와 정합.

### 스키마/플랫폼(마감)
- [ ] `WebSite.SearchAction` 추가, ItemList `/track/frontend` 정합 정리.
- [ ] `llms-full.txt` 추가(현재 404), llms.txt 에 헤드라인 통계 스냅샷 인라인.

---

## Appendix: Pages Analyzed (고정 auditUrls)

| # | URL | HTTP | SSR | 비고 |
|---|---|---|---|---|
| 1 | https://sprint.codeit.kr/ | 200 | Y | Org/WebSite/FAQPage(7,speakable)/ItemList(8) |
| 2 | https://sprint.codeit.kr/career | 200 | Y | Org/WebSite, 법인정보 푸터·고용사 30+ |
| 3 | https://sprint.codeit.kr/track/frontend-advanced | 200 | Y | Course(+CourseInstance/Offer/datePublished) |
| 4 | https://sprint.codeit.kr/track/backend-spring | 200 | Y | Course(+CourseInstance/Offer/datePublished) |
| 5 | https://sprint.codeit.kr/track/fullstack | 200 | Y | Course(+CourseInstance/Offer/datePublished) |
| 6 | https://sprint.codeit.kr/track/ai | 200 | Y | Course(+CourseInstance/Offer/datePublished) |
| 7 | https://sprint.codeit.kr/track/data | 200 | Y | Course(+CourseInstance/Offer/datePublished) |
| 8 | https://sprint.codeit.kr/track/product-design | 200 | Y | Course(+CourseInstance/Offer/datePublished) |
| 9 | https://sprint.codeit.kr/track/it-founder | 200 | Y | Course(+CourseInstance/Offer/datePublished) |
| 10 | https://sprint.codeit.kr/llms.txt | 200 | n/a | 유효 llms.txt(text/plain) |

**Technical signal files (존재 여부만):** robots.txt 200 · sitemap.xml 200 · server-sitemap.xml 200 · llms.txt 200 · **llms-full.txt 404**.

**brandSourcesVersion 사용:** 2 (8개 고정 소스)
