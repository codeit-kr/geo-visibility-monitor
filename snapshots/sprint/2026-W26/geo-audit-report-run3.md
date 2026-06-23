# GEO Audit Report: 코드잇 스프린트 (Codeit Sprint)

**Audit Date:** 2026-06-23
**capturedAt:** 2026-06-23T03:59:25Z
**isoWeek:** 2026-W26
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
> 모든 페이지·신호·스키마는 **원본 SSR HTML 을 `curl` 로 직접 파싱**해 확인했습니다(WebFetch 마크다운 변환의 `<head>`/`<script>` 유실 회피).
> 이전 주차 점수를 앵커로 사용하지 않았습니다(delta-context 미사용).

---

## Executive Summary

**Overall GEO Score: 74/100 (Fair–Good 경계)**

코드잇 스프린트는 **기술 인프라(95)와 구조화 데이터(82)** 가 매우 강하다. 10개 고정 URL 이 모두 풀 SSR 로 제공되고(JS 빈 셸 아님), AI 크롤러가 전부 허용되며, `EducationalOrganization`→`parentOrganization`(코드잇 `www.codeit.kr`)→`Course`/`FAQPage`/`BreadcrumbList` 그래프가 전 페이지에 유효한 JSON-LD 로 심겨 있다. 플랫폼 최적화(85)도 네이버 AI Briefing·Google AIO·Gemini 친화적으로 높다.

이번 회차의 핵심 발견은 **인용가능성(74)·E-E-A-T(64) 하향**으로, 두 가지 실측 신호가 원인이다: (1) 홈 헤드라인 통계(취업률/완주율/수강생 수)가 **JS 디지트-스피너 애니메이션**으로 렌더되어 SSR 텍스트에 실제 수치가 없어 AI 가 대표 숫자를 인용할 수 없다. (2) **환불/환급 정책이 10개 페이지 어디에도 없고**, 운영사 법인 식별정보 푸터가 8개 트랙 중 3개(ai·backend-spring·fullstack)에만 SSR 노출된다(홈·career·나머지 4개 트랙 결측). 브랜드 권위(57)는 모회사 코드잇의 `parentOrganization` 상속으로 부분 가점되나, 한국어 위키백과(404)·Wikidata(엔티티 부재)·스프린트 전용 엔티티 부재가 상한을 누른다.

### Score Breakdown

| Category | Score | Weight | Weighted |
|---|---|---|---|
| AI Citability | 74/100 | 25% | 18.50 |
| Brand Authority | 57/100 | 20% | 11.40 |
| Content E-E-A-T | 64/100 | 20% | 12.80 |
| Technical GEO | 95/100 | 15% | 14.25 |
| Schema & Structured Data | 82/100 | 10% | 8.20 |
| Platform Optimization | 85/100 | 10% | 8.50 |
| **Overall GEO Score** | | | **73.65 → 74** |

`composite = round(74·0.25 + 57·0.20 + 64·0.20 + 95·0.15 + 82·0.10 + 85·0.10) = round(73.65) = 74`

---

## Critical Issues (Fix Immediately)

KR 현지화 기준상 영문 Wikipedia/Reddit/G2/Trustpilot/Clutch 부재는 critical 로 분류하지 않는다. 그러나 다음 두 가지는 KR 기준에서도 critical 이다:

1. **환불/환급/위약 정책 부재 (전 10페이지)** — 500만원대 KDT 상품에서 환불·운영규정 페이지가 감사 페이지 어디에도 없다(“100% 보장” 문구는 인턴십 자격이지 학비 환불이 아님). YMYL 신뢰 공백.
2. **운영사 법인 식별정보 사이트-와이드 미노출** — 사업자등록번호/대표/주소/연락처+약관/개인정보 푸터가 8개 트랙 중 3개(ai·backend-spring·fullstack)에서만 SSR 렌더. 홈·`/career`·나머지 4개 트랙은 SSR DOM 에 법인정보 결측(footer 가 지연 JS 청크).

## High Priority Issues

1. **헤드라인 통계가 JS 디지트-스피너로 렌더 → 텍스트 추출 불가** — 홈의 취업률/완주율/수강생 수가 `0 1 2 …% ` 애니메이션 span 으로만 존재. 각주(“2025년 고용24 기준 · 수강생 2,598명 대상”)는 텍스트지만 **수치 본체가 SSR 텍스트에 없어** AI 가 대표 숫자를 인용 못 함. 인용가능성·신뢰성 동시 감점.
2. **모회사 코드잇의 한국어 위키백과 문서 부재** — `ko.wikipedia.org/wiki/코드잇` `curl -sI` 결과 **HTTP 404**. KR 핵심 엔티티 근거(영문 위키와 달리 down-weight 대상 아님).
3. **모회사 코드잇의 Wikidata 아이템 부재** — `wbsearchentities`(ko/en) 0건(무관한 `Q30299760 CodeIT(노르웨이)` 만 존재 → 오귀속 위험). 언어무관 핵심 신호로 가중치 유지, 부재는 sameAs 엔티티 링크 최상위 근거 상실.
4. **강사 Person 스키마/실명 이력 부재** — 전 페이지에 instructor/author `Person` 엔티티 0개. 강사진이 “현직자/강사진”으로 익명. E-E-A-T 전문성의 최대 공백.

## Medium Priority Issues

1. **`hasCourseInstance` 누락 (frontend-advanced)** — 7개 트랙 중 프론트엔드 단기심화 Course 만 `hasCourseInstance`(courseMode/startDate/endDate) 결측. 나머지 6개는 보유.
2. **비교표/번호 절차 리스트(`<table>`/`<ol>`) 부재** — 커리큘럼·혜택이 `<li>`/`<div>` 카드 그리드로만 존재. Perplexity·Google AIO·Bing 이 선호하는 표·단계 콘텐츠 없음.
3. **Organization `sameAs` 에 Wikipedia/Wikidata 미포함** — AI 엔티티 링킹 최강 신호 부재(엔티티 자체가 없으니 선결과제는 #2·#3).
4. **스프린트 전용 IG `@codeit_sprint` 미확인** — `sameAs` 는 모회사 핸들 `instagram.com/codeit_kr` 만 확정. 체크리스트의 스프린트 전용 핸들 검증 불가.
5. **`og:locale` 전 페이지 부재** — `html lang=ko` 는 전 페이지 존재하나 `og:locale=ko_KR` 결측. 네이버/구글-KR 로케일 신호 누락.
6. **명시적 신선도 스탬프 부재** — 가시적 “최종 업데이트” 및 schema `dateModified` 없음(기수일정으로만 암시).

## Low Priority Issues

1. `WebSite` 에 `SearchAction`(사이트링크 검색창) 없음.
2. FAQ 답변/코스 요약에 `speakable` 속성 없음.
3. 명시적 `Content-Security-Policy` 헤더 부재(그 외 보안 헤더 nosniff/SAMEORIGIN/Referrer-Policy/Permissions-Policy 는 양호).
4. `#organization` 동일 @id 에서 로고 불일치(org 블록 `codeit-logo.png` vs Course.provider `sprint-logo.png`).
5. `llms-full.txt` 부재(404) — `llms.txt` 는 존재.
6. 홈·`/career` 에 BreadcrumbList 부재(트랙 페이지는 보유); `og:type`·`hreflang` 부재(단일 로케일이라 허용).
7. llms.txt 가 `/track/frontend`(base) 링크 — 고정 감사셋의 `frontend-advanced` 와 불일치(stale/중복 가능).

---

## Category Deep Dives

### AI Citability (74/100)

10개 고정 URL 모두 실 텍스트 SSR 추출 가능. 객관 체크리스트 가점 합.

| # | 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|---|
| 1 | 독립 인용가능 정량 블록 | 15 | 9 | 트랙별 “취업률 71%·취업자 91%·완주율 86%·비전공자 60%”(frontend-advanced), “수강생 80%+”(fullstack), “사람인 9,777건·신입수요 36%”(data) 존재. **−6: 홈 헤드라인 통계가 JS 디지트-스피너로 렌더돼 수치 본체가 SSR 텍스트에 없음(AI 인용 불가)** |
| 2 | 질문형 헤딩(쿼리 매칭) | 10 | 5 | “왜 데이터 분석가일까요?”·“왜 AI 엔지니어로 시작?” 등 일부 실 질문. 대부분 H1/H2 는 슬로건(“취업에 강한 웹 개발 부트캠프”) |
| 3 | 상단 정의/요약 문장 | 10 | 5 | 깔끔한 정의는 JSON-LD·llms.txt 에 존재(“코드잇 스프린트는 실무 중심 IT 취업 부트캠프입니다”). 가시 히어로는 슬로건 선행 |
| 4 | 사실 리스트·표(커리큘럼/트랙/성과/가격) | 20 | 18 | 최강축. 주차별 커리큘럼(“1주차 Git: add/commit/reset…”), `Course.teaches[]`, 정가/지원가, 홈 ItemList(8트랙). −2: 시맨틱 `<table>` 아닌 div 카드 |
| 5 | 고유명사·구체 수치 | 15 | 14 | 기수일정(`CourseInstance` 26.07.02~27.01.28), 학비(22,687,500→60만), 툴(React/Spring/PyTorch/YOLO/BigQuery), 고용사(토스·쿠팡·카카오페이·LG CNS·미래에셋) |
| 6 | FAQ형 콘텐츠 | 10 | 10 | 전 트랙 `FAQPage`(8–13 Q&A)+홈(7). 답변 구체·자기완결(훈련장려금/출석/비전공자), 텍스트+구조화 동시 |
| 7 | 구조화 llms.txt 요약 | 10 | 9 | 유효 llms.txt(H1+요약 blockquote+섹션 링크, 구조화데이터 위치 명시). −1: `/llms-full.txt` 부재·`/track/frontend` 링크 |
| 8 | 낮은 부풀림 비율 | 10 | 4 | 가시 본문에 “압도적/무조건 책임/유일한 곳/1위” 슬로건 과다 → 인용가능 실질을 희석 |
| | **합계** | **100** | **74** | |

- **강한 인용 예시:** `/track/backend-spring` “1주차 Git으로 협업하기 — add/commit/log/diff/reset, .gitignore, 브랜치 병합·충돌 해결, PR 생성·리뷰·머지”; FAQ “출석률 80%+면 훈련장려금 지급, HRD-Net 에서 확인”.
- **약한 예시:** 홈 헤드라인 통계가 디지트-스피너로 수치 미추출; `/track/data` “제대로 가르치는 유일한 곳”(범위·출처 없는 슬로건).

### Brand Authority (57/100)

composite 반영은 **`brandSources` (version 2) 고정 8개 소스의 존재/연결 여부**만. "(모회사)" 항목은 코드잇(parent) 엔티티이며,
사이트 Organization 스키마가 `parentOrganization` 으로 코드잇(`www.codeit.kr/#organization`)에 연결되어 있고 **그 모회사 엔티티가 존재하면 부분 가점**(자식이 부모 상속).
완전 가점은 스프린트 전용 엔티티가 있을 때만. namu.wiki 403 은 불이익 아님(parentOrganization·sameAs 로 확인되면 인정).

| # | 고정 소스 | 가능 | 가점 | 존재/연결 근거 | 완전/부분 |
|---|---|---|---|---|---|
| 1 | namu.wiki/w/코드잇 (모회사) | 15 | 11 | 직접 fetch **403**(규칙상 불이익 없음). **모회사 `www.codeit.kr` 의 `sameAs` 에 `namu.wiki/w/코드잇` 직접 포함** + `parentOrganization` 연결 확정 → 모회사 인정. 스프린트 전용 아님 | 부분 |
| 2 | ko.wikipedia/코드잇 (모회사) | 15 | 0 | `curl -sI` **HTTP 404** — 모회사 문서 부재. 한국어 위키는 KR 핵심(down-weight 대상 아님) → 상속할 엔티티 없음 | 없음 |
| 3 | Wikidata 코드잇/Codeit (모회사) | 15 | 0 | `wbsearchentities`(ko/en) 0건(무관 노르웨이 Q30299760 제외). 언어무관 핵심 → 가중치 유지, 엔티티 없어 가점 불가 | 없음 |
| 4 | blog.naver.com/codeitofficial | 10 | 10 | HTTP 200 + sprint·parent `sameAs` 동시 포함 → 존재·연결 확정 | 완전(모회사 채널) |
| 5 | youtube.com/@codeit | 15 | 15 | HTTP 200 + 양 `sameAs` 확정 | 완전 |
| 6 | Instagram @codeit.kr, @codeit_sprint | 10 | 6 | `sameAs` 에 `instagram.com/codeit_kr` 자기선언(302 로그인월, 서버단정 불가). 체크리스트 핸들(`@codeit.kr`,`@codeit_sprint`)과 상이, `@codeit_sprint` 미연결·미확인 | 부분 |
| 7 | linkedin/company/codeit-official | 10 | 10 | HTTP 200 + 양 `sameAs` 확정 | 완전 |
| 8 | 잡플래닛: 코드잇 기업 페이지 | 10 | 5 | HTTP 403(봇 차단)·`sameAs` 부재로 본 회차 미확인. 법인 실재로 개연 높으나 cautious 부분 | 부분 |
| | **합계** | **100** | **57** | | |

`11 + 0 + 0 + 10 + 15 + 6 + 10 + 5 = 57`

**Organization schema 연결 (원본 SSR HTML 직접 파싱, 권위 근거):**
- 엔티티 `EducationalOrganization` `@id: https://sprint.codeit.kr/#organization`, name `코드잇 스프린트`, url `https://sprint.codeit.kr`, logo `codeit-logo.png`.
- sprint `sameAs` (5): `youtube.com/@codeit`, `instagram.com/codeit_kr`, `facebook.com/codeit.kr`, `blog.naver.com/codeitofficial`, `linkedin.com/company/codeit-official`.
- `parentOrganization`: `{ "@id": "https://www.codeit.kr/#organization", "name": "코드잇", "url": "https://www.codeit.kr" }` — **확정**(부모 200). 자식(sprint)이 모회사(코드잇) 엔티티 상속 근거.
- **모회사 `www.codeit.kr` `sameAs` (6): 위 5개 + `https://namu.wiki/w/코드잇`** — 나무위키 직접 fetch(403) 없이 연결 확인.
- Wikipedia/Wikidata 링크는 어느 `sameAs` 에도 없음(해당 엔티티 자체 부재).

### Content E-E-A-T (64/100)

| 축 | 가능 | 가점 | 핵심 근거 |
|---|---|---|---|
| Experience | 25 | 17 | 고용사 실명(`/career` 토스·쿠팡·LG CNS·카카오페이·컬리·현대오토에버·미래에셋), 1인칭 후기(건설사→개발자, 3개월 미래에셋 합격), 실 프로젝트(서울 대중교통 시각화, AWS ECS/RDS/S3, ResNet 구현). **−: 수료생명 마스킹(김** 님), 포트폴리오/GitHub 링크 없음, 후기 짧음** |
| Expertise | 25 | 16 | 주차별 정확한 커리큘럼·정확 기술용어, `Course/CourseInstance` 실데이터. **−: 실명 강사 이력·`Person` 스키마 전무(“현직자/강사진” 익명) — 최대 공백** |
| Authoritativeness | 25 | 16 | KDT/고용노동부/내일배움카드 7/8 트랙, HRD-Net 훈련장려금 안내, 고용사 30+, 모회사 코드잇. **−: “1위”·수상에 수여기관/출처 링크 없음, 외부 평판·press 링크 부재, Org `sameAs` 권위링크 약함** |
| Trustworthiness | 25 | 15 | HTTPS 전 페이지, 정량 성과 라벨(“고용24 기준·2,598명 대상”), 투명 학비·국비지원, 신선 기수일정, 법인정보 실재((주)코드잇·313-86-00797·서울 중구 청계천로 100). **−10: (1) 법인정보+약관/개인정보 푸터가 8개 트랙 중 3개만 SSR(홈·career·4트랙 결측) (2) 환불/환급 정책 전무 (3) 헤드라인 통계 디지트-스피너로 수치 미추출 (4) 통계 방법론 출처 링크 없음** |
| **합계** | **100** | **64** | |

### Technical GEO (95/100)

기술 신호는 5개 파일 **존재 여부**만 점검(규칙). 원시 99/104 → 정규화 **95**.

| 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|
| HTTPS/TLS | 8 | 8 | 전 URL HTTPS, 유효 인증서, 무리다이렉트 |
| HSTS | 4 | 4 | `max-age=31536000` 9개 HTML 전부 |
| robots.txt 존재 | 6 | 6 | 200, 유효, 2개 sitemap 참조 |
| AI 크롤러 허용 | 8 | 8 | `User-agent:*` 가 `/admin`,`/become` 만 차단. GPTBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot 전부 허용 |
| sitemap.xml | 6 | 6 | 200, 유효 XML, lastmod(2026-06-23) |
| server-sitemap.xml | 4 | 4 | 200, 8개 트랙 URL |
| llms.txt | 6 | 6 | 200, 유효 포맷 |
| llms-full.txt | 3 | 0 | **404 (부재)** |
| SSR(실 HTML) | 20 | 20 | 9개 HTML 전부 풀 SSR(4K–40K 텍스트+JSON-LD), CSR 빈 셸 아님 |
| canonical | 6 | 6 | 9개 HTML 전부 self-canonical |
| meta robots noindex 아님 | 6 | 6 | noindex/차단 X-Robots-Tag 없음 |
| viewport | 4 | 4 | `width=device-width…viewport-fit=cover` |
| structured data 존재 | 5 | 5 | EduOrg/Course/FAQPage/BreadcrumbList 전 페이지 |
| 보안 헤더 | 8 | 6 | nosniff/SAMEORIGIN/Referrer-Policy/Permissions-Policy O, **CSP 부재 −2** |
| 클린 URL | 4 | 4 | 소문자·하이픈·계층(`/track/<slug>`) |
| 10개 페이지 200 | 6 | 6 | 전부 HTTP 200, 0 리다이렉트 |
| **합계** | **104 → 99 가점** | **99 → 95 정규화** | |

**5-File 존재표:** robots.txt 200 · sitemap.xml 200 · server-sitemap.xml 200 · llms.txt 200 · **llms-full.txt 404**.

### Schema & Structured Data (82/100)

원본 SSR HTML 직접 파싱. 전 페이지 유효 JSON-LD(100% JSON-LD, Microdata/RDFa 없음).

| 페이지 | @types |
|---|---|
| / | EducationalOrganization, WebSite, FAQPage(7Q), ItemList(8트랙) |
| /career | EducationalOrganization, WebSite |
| /track/frontend-advanced | EduOrg, WebSite, Course(**hasCourseInstance 결측**), FAQPage(8Q), BreadcrumbList |
| /track/{backend-spring,fullstack,ai,data,product-design,it-founder} | EduOrg, WebSite, Course(+CourseInstance blended/ISO 날짜), FAQPage, BreadcrumbList |
| /llms.txt | n/a(text/plain) |

채점 요약(정규화 82): Organization+`parentOrganization`(→코드잇)+`sameAs`5 가점, Course(provider/offers/teaches/inLanguage) 6/7 트랙 완전, FAQPage(8페이지)·ItemList·BreadcrumbList 일관 가점. 감점: **`Person`(강사/저자) 스키마 전무(High)**, frontend-advanced `hasCourseInstance` 결측, `sameAs` 에 Wikipedia/Wikidata 없음, `speakable`·`WebSite.SearchAction` 부재, `courseMode:"blended"` 비표준 케이싱, 홈·career BreadcrumbList 부재, provider 노드 로고 불일치(sprint-logo vs codeit-logo, 동일 @id).

### Platform Optimization (85/100)

10개 고정 URL 의 on-page 신호만(raw SSR). KR 현지화(네이버/구글-KR 가중). 원시 84.5 → **85**.

| 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|
| 한국어 콘텐츠 | 8 | 8 | 10페이지 전부 한국어 |
| html lang/og:locale | 7 | 4 | `html lang=ko` 전 페이지 O, **`og:locale` 전 페이지 부재** |
| AI Overview/Briefing 추출 블록 | 12 | 9 | 트랙 자기완결 답변·정량 stat. 홈/career 허브 얇음 |
| FAQ/구조화 Q&A | 12 | 12 | 전 페이지 FAQPage, 답변 가시 HTML 렌더(JSON-LD 전용 아님) |
| FAQPage/Course/Org JSON-LD valid+SSR | 12 | 12 | SSR 확정, parentOrganization→코드잇 포함, JSON 파싱 클린 |
| 비교/리스트(Perplexity 친화) | 10 | 6 | `<ul>`/`<li>` 다수이나 **`<table>`·`<ol>` 0개**(비교표·번호 절차 없음) |
| 헤딩 계층 | 8 | 5 | h1→h2→h3 무결손이나 콘텐츠 길이 대비 헤딩 밀도 낮음(대부분 `<li>/<div>`) |
| 신선도/날짜 | 8 | 6 | `datePublished`+기수일정. 가시 `dateModified`/“최종 업데이트” 없음 |
| llms.txt 크롤러 피딩 | 6 | 6 | 유효 llms.txt, 링크 전부 resolve |
| OG/Twitter 카드 | 5 | 5 | og:title/description/image + twitter:card(트랙 summary_large_image). og:type 없음 |
| SSR/크롤 가능 텍스트 | 7 | 7 | 전 페이지 SSR, FAQ 가시 텍스트 |
| 모바일 viewport | 3 | 3 | viewport-fit=cover |
| canonical/hreflang | 2 | 1.5 | self-canonical O, hreflang 부재(단일 로케일 허용) |
| **합계** | **100** | **84.5 → 85** | |

**서피스별:** 네이버 AI Briefing = **HIGH**(한국어·blog.naver sameAs·국비지원·FAQ·정량 stat). Google AIO/Gemini = **HIGH**(SSR+FAQPage/Course/Org 스키마·KR). Perplexity/ChatGPT/Bing = **MED–HIGH/MED**(엔티티 그래프·llms.txt 강점, 비교표·외부 엔티티(Wikipedia/Wikidata) 한계).

---

## Discovery (composite 점수 미반영)

규칙상 고정 `brandSources` 외 새로 발견한 소스/커뮤니티는 **점수에 넣지 않고 여기에만 기록**한다.

- **Facebook** `facebook.com/codeit.kr` — HTTP 200, sprint·parent `sameAs` 동시 포함(모회사 공식). 고정 리스트 외.
- **모회사 `www.codeit.kr/#organization` 자체 그래프** — 200, 자체 EducationalOrganization JSON-LD(나무위키 sameAs 포함). 모회사 엔티티 앵커.
- **법인정보** `(주) 코드잇`, 사업자등록 `313-86-00797`, 통신판매업 제2019-서울중구-1034호, 대표 강영훈·이윤수, 서울 중구 청계천로 100 시그니쳐타워, 02-2289-2902 — 일부 트랙 푸터.
- **CEO 사실** 강영훈 CEO, 누적 투자액 218억, 연매출 300억, 포브스 30 under 30 (가시 본문).
- 미확인 KR 커뮤니티(OKKY·블라인드·커리어리·네이버 카페) — 본 회차 미점검(이번 fetch 에 미노출).

---

## Quick Wins (This Week)

1. **헤드라인 통계를 일반 텍스트로 노출** — 홈 취업률/완주율/수강생 수를 디지트-스피너 외에 plain text(“2025년 취업률 71%”)로 병기(인용가능성+신뢰성 동시 회복).
2. **환불/운영규정 정책 페이지 신설 + 사이트-와이드 푸터 링크**.
3. **법인정보 푸터를 전 페이지 SSR** — 홈·`/career` 우선(최고 트래픽인데 현재 결측).
4. `frontend-advanced` Course 에 `hasCourseInstance`(courseMode/startDate/endDate) 추가 — 타 6개 트랙과 정합.
5. `og:locale=ko_KR` 전 페이지 추가, `llms-full.txt` 생성.

## 30-Day Action Plan

### Week 1: 신뢰성(E-E-A-T) — 최우선
- [ ] 환불·운영규정 정책 페이지 작성·푸터 링크.
- [ ] 법인 식별정보 푸터 전 페이지 SSR 표준화(홈·career 포함).
- [ ] 헤드라인 통계 plain-text 병기 + 산출 방법론(모집단/연도/“취업” 정의)·출처 명시.

### Week 2: 엔티티 그라운딩
- [ ] 모회사 **코드잇 Wikidata 아이템 생성**(언어무관 핵심) + 한국어 위키백과 문서화 추진.
- [ ] 생성 후 Organization `sameAs` 에 Wikipedia/Wikidata 추가.

### Week 3: 스키마/전문성
- [ ] 실명 강사 `Person` 스키마(jobTitle/worksFor/sameAs/knowsAbout) + Course `instructor` 연결.
- [ ] FAQ 답변·코스 요약에 `speakable`, `WebSite.SearchAction` 추가.

### Week 4: 인용가능성/플랫폼
- [ ] 트랙 비교표(`<table>`: 가격/기간/직무/국비지원)·지원 절차 `<ol>` 추가.
- [ ] 트랙/홈 도입부 “X는 ~이다” 정의문 추가, 슬로건 H2 를 질문형으로 전환, llms.txt 에 헤드라인 통계 인라인.

---

## Appendix: Pages Analyzed (고정 auditUrls)

| # | URL | HTTP | SSR | 비고 |
|---|---|---|---|---|
| 1 | https://sprint.codeit.kr/ | 200 | Y | Org/WebSite/FAQPage(7Q)/ItemList(8). 헤드라인 통계 디지트-스피너 |
| 2 | https://sprint.codeit.kr/career | 200 | Y | Org/WebSite. 고용사 실명, 법인정보 푸터 결측 |
| 3 | https://sprint.codeit.kr/track/frontend-advanced | 200 | Y | Course(hasCourseInstance 결측), FAQPage(8Q), Breadcrumb |
| 4 | https://sprint.codeit.kr/track/backend-spring | 200 | Y | Course(+instance 26.07.01–27.01.28), FAQPage, 법인정보 푸터 SSR |
| 5 | https://sprint.codeit.kr/track/fullstack | 200 | Y | Course(+instance), FAQPage, 법인정보 푸터 SSR |
| 6 | https://sprint.codeit.kr/track/ai | 200 | Y | Course(+instance), FAQPage(12Q), 법인정보 푸터 SSR |
| 7 | https://sprint.codeit.kr/track/data | 200 | Y | Course(+instance), FAQPage, 사람인 9,777건 |
| 8 | https://sprint.codeit.kr/track/product-design | 200 | Y | Course(+instance), FAQPage, Breadcrumb |
| 9 | https://sprint.codeit.kr/track/it-founder | 200 | Y | Course(+instance), FAQPage, 1인기업 36% |
| 10 | https://sprint.codeit.kr/llms.txt | 200 | n/a | 유효 llms.txt(text/plain, 1,816B) |

**Technical signal files:** robots.txt 200 · sitemap.xml 200 · server-sitemap.xml 200 · llms.txt 200 · llms-full.txt **404**.
