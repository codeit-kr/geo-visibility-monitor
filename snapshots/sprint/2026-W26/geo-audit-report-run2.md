# GEO Audit Report: 코드잇 스프린트 (Codeit Sprint)

**Audit Date:** 2026-06-23
**capturedAt:** 2026-06-23T10:10:18Z
**isoWeek:** 2026-W26
**App:** sprint
**URL:** https://sprint.codeit.kr
**Business Type:** EdTech / 코딩 부트캠프 (국비지원 KDT)
**Locale:** Korean (KR) — 한국 시장 서비스
**brandSourcesVersion:** 2
**Pages Analyzed:** 10 (고정 `auditUrls`)

> **재현성 고지 (Reproducibility).** 이 감사는 `audit-targets.json` 의 `sprint` 항목에 고정된 입력만 사용했습니다.
> 감사 대상 페이지는 그 항목의 `auditUrls` 10개로 한정했고(sitemap 임의 크롤·블로그 랜덤 샘플 없음),
> 기술 신호 파일 점검은 robots.txt / sitemap.xml / server-sitemap.xml / llms.txt / llms-full.txt 의 **존재 여부**로만 한정했으며,
> composite 에 반영한 외부 신호는 `brandSources` (**version 2**) 고정 체크리스트 8개뿐입니다.
> 각 카테고리 점수는 주관 인상이 아니라 아래 객관 신호 체크리스트의 가점 합으로 산정했고 항목별 근거를 남겼습니다.
> 이전 주차 점수를 앵커로 사용하지 않았습니다(delta-context 미사용). 모든 신호는 이번 회차에 라이브로 직접 검증했습니다.

---

## Executive Summary

**Overall GEO Score: 79/100 (Good)**

코드잇 스프린트는 **기술 인프라(96)·플랫폼 최적화(90)·구조화 데이터(87)** 가 최상위권이다. 10개 고정 페이지 전부 풀 SSR 로 제공되고(빈 JS 셸 없음), `robots.txt` 가 AI 크롤러(GPTBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot)를 전부 허용하며, `EducationalOrganization`→`parentOrganization`(코드잇)→`Course`/`FAQPage`/`BreadcrumbList`/`ItemList` 그래프가 유효한 JSON-LD 로 전 페이지에 심겨 있다. 이번 회차에 `<head>` 를 원본 HTML 로 직접 검증해 **`html lang="ko"`(전 페이지)·OG/Twitter 카드·canonical·viewport** 존재를 확정했고(이전 회차의 "미검증" 항목 해소), 그 결과 플랫폼·스키마·기술 점수가 상향됐다. **인용가능성(84)** 도 트랙별 주차 커리큘럼·정량 성과·비교표·`teaches[]` 배열 덕분에 높다.

가장 큰 취약점은 여전히 **브랜드 권위(52)** 다. 모회사 코드잇의 **한국어 위키백과 문서·Wikidata 아이템이 부재**하고(둘 다 KR/언어무관 핵심이라 down-weight 대상 아님), 스프린트 전용 엔티티는 어떤 플랫폼에도 없다. E-E-A-T(75)는 강사 이력·정부 인증·정량 성과가 우수하나, 운영사 법인 식별정보·환불정책·통계 산출 방법론이 감사 대상 페이지에 노출되지 않아 신뢰성에서 감점됐다.

### Score Breakdown

| Category | Score | Weight | Weighted |
|---|---|---|---|
| AI Citability | 84/100 | 25% | 21.00 |
| Brand Authority | 52/100 | 20% | 10.40 |
| Content E-E-A-T | 75/100 | 20% | 15.00 |
| Technical GEO | 96/100 | 15% | 14.40 |
| Schema & Structured Data | 87/100 | 10% | 8.70 |
| Platform Optimization | 90/100 | 10% | 9.00 |
| **Overall GEO Score** | | | **78.50 → 79** |

`composite = round(84·0.25 + 52·0.20 + 75·0.20 + 96·0.15 + 87·0.10 + 90·0.10) = round(78.5) = 79`

> **이전 회차 대비.** 점수 상승(77→79)은 새 사실이 아니라 **검증 깊이**의 차이다. 이번엔 원본 SSR HTML 의 `<head>` 를
> 직접 파싱해 `html lang=ko`·OG/Twitter·canonical·viewport 를 확정했고(이전엔 WebFetch 의 마크다운 변환이 `<head>`/`<script>` 를
> 제거해 "미검증" 으로 감점), 이에 따라 플랫폼(83→90)·스키마(83→87)·기술(92→96)을 정정했다. 브랜드(52)는 고정 체크리스트라 불변.

---

## Critical Issues (Fix Immediately)

KR 현지화 기준상 **critical 등급 이슈는 없음.** (영문 Wikipedia/Reddit/G2/Trustpilot/Clutch 부재는 규칙에 따라 critical 로 분류하지 않고 가중치를 낮춤.)

## High Priority Issues

1. **모회사 코드잇의 한국어 위키백과 문서 부재** — `ko.wikipedia.org/wiki/코드잇` 직접 조회 결과 **HTTP 404** (검색 API 도 무관 결과만). 한국어 위키백과는 KR 시장에서 핵심 엔티티 근거이며(영문 위키와 달리 down-weight 대상 아님), AI 엔티티 그라운딩의 큰 공백.
2. **모회사 코드잇의 Wikidata 아이템 부재** — `wbsearchentities`(ko) 0건, (en) 은 무관한 `Q30299760 CodeIT (Norway)` 만 존재. Wikidata 는 언어무관 핵심 신호로 가중치를 유지했으며, 부재는 `sameAs` 엔티티 링크의 최상위 근거를 잃는 것.
3. **운영사 법인 식별정보·신뢰 정책 미노출** — 감사 대상 페이지에 사업자등록번호/주소/연락처, 환불·보증 정책, 성과통계(취업률 등)의 산출 방법론·기준연도·모집단이 노출되지 않음(E-E-A-T 신뢰성 핵심 감점).

## Medium Priority Issues

1. **`hasCourseInstance` 누락 (frontend-advanced)** — 7개 트랙 중 `프론트엔드 단기심화` Course 만 `hasCourseInstance` 결측(JSON-LD 직접 확인). 나머지 6개 트랙은 보유.
2. **Organization `sameAs` 에 Wikipedia/Wikidata 미포함** — AI 엔티티 링킹 최강 신호 부재(엔티티 자체가 없으므로 선결과제는 High #1·#2).
3. **스프린트 전용 IG `@codeit_sprint` 미확인** — `sameAs` 는 모회사 핸들 `instagram.com/codeit_kr` 만 포함. 체크리스트의 스프린트 전용 핸들은 직접 조회 시 302(로그인 리다이렉트)로 존재 확정 불가.
4. **`ItemList` 의 `/track/frontend` 참조** — 홈 `ItemList`(8개) 가 고정 감사셋에 없는 `/track/frontend`(position 7) 를 포함. `llms.txt` 에는 `frontend` 와 `frontend-advanced` 가 별개 과정으로 존재하나, 감사셋과의 불일치는 stale 가능성.
5. **`og:locale` 미설정** — `html lang="ko"` 는 전 페이지 확정이나 `og:locale=ko_KR` 메타는 부재(플랫폼 로케일 항목 부분 감점).

## Low Priority Issues

1. `WebSite` 에 `SearchAction`(사이트링크 검색창) 없음.
2. FAQ 답변/코스 요약에 `speakable` 속성 없음.
3. 명시적 `Content-Security-Policy` 헤더 부재(그 외 보안 헤더 HSTS/nosniff/SAMEORIGIN/Referrer-Policy/Permissions-Policy 는 양호).
4. `#organization` 동일 @id 에서 로고 불일치(Org 블록 `codeit-logo.png` vs Course.provider `sprint-logo.png`).
5. `llms-full.txt` 부재(404) — `llms.txt` 는 존재.

---

## Category Deep Dives

### AI Citability (84/100)

객관 체크리스트 가점 합. 10개 고정 URL 모두 실 텍스트가 SSR 로 추출 가능(빈 JS 셸 없음, HTML 198KB–1.8MB).

| # | 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|---|
| 1 | 독립 인용가능 정량 블록 | 15 | 14 | 취업률·완주율·비전공자 비율 등 정량 stat 이 트랙 전반 일관. 출처/방법론 표기 약함 −1 |
| 2 | 질문형 헤딩(쿼리 매칭) | 10 | 7 | 실제 FAQ 질문 다수("비전공자도 따라올 수 있나요?", "훈련장려금은 어떻게 지급되나요?") vs 슬로건성 H2 혼재 |
| 3 | 상단 정의/요약 문장 | 10 | 6 | 도입부가 홍보성("압도적인 결과로 증명하는…"), "X는 ~이다" 정의 패턴 적음 |
| 4 | 사실 리스트·표(커리큘럼/트랙/성과/가격) | 20 | 19 | 주차별 커리큘럼·정가표·`teaches[]`(예: backend "Java·객체지향·Spring·JPA·RESTful API·대용량 트래픽") 매우 추출 친화 |
| 5 | 고유명사·구체 수치 | 15 | 15 | 정확한 학비(₩600,000 본인부담)·기수일정·기간(27/29/30주)·툴(Spring/JPA/Transformers/BERT)·고용사 |
| 6 | FAQ형 콘텐츠 | 10 | 8 | `FAQPage` 홈(7문항)+전 트랙, 실 Q→A |
| 7 | 구조화 llms.txt 요약 | 10 | 9 | 유효 llms.txt(H1+요약 blockquote+트랙/취업/회사 섹션 링크). 헤드라인 통계 인라인 부재 −1 |
| 8 | 낮은 부풀림 비율 | 10 | 6 | 트랙=사실 위주(양호), 홈/career=홍보 부풀림으로 희석 |
| | **합계** | **100** | **84** | |

- **강한 인용 예시:** `/track/ai` Course `teaches[]` 에 NLP/LLM 스택; `/track/backend-spring` "본인부담 ₩600,000" Offer.
- **약한 예시:** 홈/트랙 도입부 "압도적인 결과로 증명하는…"(슬로건, 사실 0).

### Brand Authority (52/100)

composite 반영은 **`brandSources` (version 2) 고정 8개 소스의 존재/연결 여부**만. "(모회사)" 항목은 코드잇(parent) 엔티티이며,
사이트 Organization 스키마가 `parentOrganization` 으로 코드잇(`www.codeit.kr/#organization`)에 연결되어 있고 **그 모회사 엔티티가 존재하면 부분 가점**(자식이 부모 상속).
완전 가점은 스프린트 전용 엔티티가 있을 때만. 새로 발견한 소스는 디스커버리에만 기록(점수 미반영).

| # | 고정 소스 | 가능 | 가점 | 존재/연결 근거 | 완전/부분 |
|---|---|---|---|---|---|
| 1 | namu.wiki/w/코드잇 (모회사) | 15 | 8 | 직접 fetch **403**(규칙상 불이익 없음). `parentOrganization`→코드잇(`www.codeit.kr/#organization`) 연결을 JSON-LD 로 확정 → 모회사 인정. 스프린트 전용 엔티티 아님 | 부분 |
| 2 | ko.wikipedia/코드잇 (모회사) | 15 | 0 | 직접 조회 **404**, 검색 API 무관 결과만 → 모회사 문서 부재. 한국어 위키는 KR 핵심(down-weight 대상 아님) → 상속할 엔티티 없음 | 없음 |
| 3 | Wikidata 코드잇/Codeit (모회사) | 15 | 0 | `wbsearchentities` ko 0건, en 은 `Q30299760 CodeIT(Norway)` 만(무관). 언어무관 핵심 → 가중치 유지, 엔티티 없어 가점 불가 | 없음 |
| 4 | blog.naver.com/codeitofficial | 10 | 9 | Org `sameAs` 에 **정확히 동일 핸들** + 라이브 **200** → 존재·연결 확정 | 부분(모회사 채널) |
| 5 | youtube.com/@codeit | 15 | 13 | `sameAs` + 라이브 **200** 확정. 구독/조회수 JS-gated 미확인 −2 | 준-완전 |
| 6 | Instagram @codeit.kr, @codeit_sprint | 10 | 7 | `sameAs` 에 `instagram.com/codeit_kr`(모회사) 확정. `@codeit.kr`/`@codeit_sprint` 직접 조회 302(로그인) → 스프린트 전용 핸들 미확정 | 부분 |
| 7 | linkedin/company/codeit-official | 10 | 10 | `sameAs` + 라이브 **200** 확정 | 완전 |
| 8 | 잡플래닛: 코드잇 기업 페이지 | 10 | 5 | 직접 조회 **403**(미확정). 법인 `(주) 코드잇` 실재 → 페이지 개연 높으나 본 회차 미확인 | 부분 |
| | **합계** | **100** | **52** | | |

`8 + 0 + 0 + 9 + 13 + 7 + 10 + 5 = 52`

**Organization schema 연결 (원본 SSR HTML 직접 파싱, 권위 근거):**
- 엔티티 `EducationalOrganization` `@id: https://sprint.codeit.kr/#organization`, name `코드잇 스프린트`, logo `codeit-logo.png`.
- `sameAs`(5): `youtube.com/@codeit`, `instagram.com/codeit_kr`, `facebook.com/codeit.kr`, `blog.naver.com/codeitofficial`, `linkedin.com/company/codeit-official`.
- `parentOrganization`: `{ "@id": "https://www.codeit.kr/#organization", "name": "코드잇", "url": "https://www.codeit.kr" }` — **확정**. 자식(sprint)이 모회사(코드잇) 엔티티 상속 근거.
- Wikipedia/Wikidata 링크는 `sameAs` 에 없음(해당 엔티티 자체 부재).

### Content E-E-A-T (75/100)

| 축 | 가능 | 가점 | 핵심 근거 |
|---|---|---|---|
| Experience | 25 | 20 | 실명 수료생 성과·1인칭 후기·트랙별 실제 프로젝트. 학생 포트폴리오 이미지 미확인, 일부 후기 익명화 − |
| Expertise | 25 | 22 | 트랙별 실명 강사+이력, 주차별 커리큘럼·정확한 기술용어(`teaches[]` 검증). CEO 가 다수 트랙에 중복 노출되어 트랙별 전문성 희석 − |
| Authoritativeness | 25 | 18 | KDT/고용노동부/내일배움카드, 고용사 30+(토스·쿠팡·카카오페이 등), 장관상. 외부 평판 링크(잡플래닛/네이버 후기) 부재 −, 운영사 권위 페이지 감사셋 내 부재 − |
| Trustworthiness | 25 | 15 | HTTPS·HSTS, 정량 성과, 투명 학비·국비지원 내역, 신선한 기수일정. **사업자등록번호/주소/연락처·환불정책·통계 산출 방법론 미노출** −10 |
| **합계** | **100** | **75** | |

### Technical GEO (96/100)

규칙: 기술 신호 **파일 존재 점검은 5개 파일(robots/sitemap/server-sitemap/llms.txt/llms-full.txt)의 존재 여부로만** 한정(임의 파일 탐색 없음). 그 외 항목은 고정 `auditUrls` 의 HTTP 응답·SSR HTML 에서만 도출. 정규화 100/104 → **96**.

| 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|
| HTTPS/TLS | 8 | 8 | HTTPS 강제, 라이브 200 |
| HSTS | 4 | 4 | `strict-transport-security: max-age=31536000` (헤더 확인) |
| robots.txt 존재 | 6 | 6 | **200**, 유효, 양 sitemap 참조 |
| AI 크롤러 허용 | 8 | 8 | `User-agent: *` 가 `/admin`,`/become` 만 Disallow. GPTBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot 전부 허용 |
| sitemap.xml | 6 | 6 | **200**, 유효 XML, lastmod |
| server-sitemap.xml | 4 | 4 | **200**, 8개 트랙 URL+lastmod |
| llms.txt | 6 | 6 | **200**, 유효 포맷 |
| llms-full.txt | 3 | 0 | **404 (부재)** |
| SSR(실 HTML) | 20 | 20 | 9개 HTML 전부 풀 SSR(JSON-LD 포함, 198KB–1.8MB), CSR 빈 셸 아님 |
| canonical | 6 | 6 | 9개 HTML 전부 `rel=canonical` (head 직접 확인) |
| meta robots noindex 아님 | 6 | 6 | noindex 없음, 차단 X-Robots-Tag 없음 |
| viewport | 4 | 4 | 9개 전부 `name="viewport"` (head 확인) |
| structured data 존재 | 5 | 5 | Course/FAQPage/BreadcrumbList/Org 전 페이지 |
| 보안 헤더 | 8 | 7 | nosniff/SAMEORIGIN/Referrer-Policy/Permissions-Policy 확인 O, **CSP 부재 −1** |
| 클린 URL | 4 | 4 | 소문자·하이픈·계층(`/track/<slug>`) |
| 10개 URL 200 | 6 | 6 | 9개 HTML + llms.txt 전부 HTTP 200 |
| **합계** | **104 → 100 정규화** | **100 → 96** | |

**5-File 존재표:** robots.txt **200** · sitemap.xml **200** · server-sitemap.xml **200** · llms.txt **200** · llms-full.txt **404**.

### Schema & Structured Data (87/100)

원본 SSR HTML 직접 파싱. 100% JSON-LD(Microdata/RDFa 없음), 전 블록 파싱 성공. 정규화 94/108 → **87**.

| 페이지 | @types |
|---|---|
| / | EducationalOrganization(+sameAs5,+parentOrganization), WebSite(+publisher), FAQPage(7문항), ItemList(8 트랙) |
| /career | EducationalOrganization, WebSite |
| /track/frontend-advanced | EduOrg, WebSite, Course(**hasCourseInstance 결측**, +offers/teaches/datePublished/inLanguage=ko), FAQPage, BreadcrumbList |
| /track/{backend-spring,fullstack,ai,data,product-design,it-founder} | EduOrg, WebSite, Course(+hasCourseInstance/offers/teaches), FAQPage, BreadcrumbList |
| /llms.txt | n/a(text/plain) |

| 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|
| Organization 스키마(유효) | 12 | 12 | `EducationalOrganization` 전 HTML 페이지 |
| Org `sameAs`(소셜) | 8 | 7 | 5개 소셜 링크 ✓, Wikipedia/Wikidata 미포함 −1 |
| `parentOrganization` 링크 | 6 | 6 | →코드잇 `www.codeit.kr/#organization` ✓ |
| Course 스키마 | 12 | 12 | 7개 트랙, name/description/provider/offers/teaches ✓ |
| `hasCourseInstance` | 8 | 7 | 6/7 트랙 보유, frontend-advanced 결측 −1 |
| FAQPage | 12 | 12 | 홈 + 7개 트랙 ✓ |
| BreadcrumbList | 8 | 8 | 7개 트랙 ✓ |
| WebSite(+publisher) | 6 | 6 | 전 페이지 ✓ |
| ItemList | 6 | 5 | 8개 트랙; stale `/track/frontend` 참조 −1 |
| JSON-LD 포맷 | 6 | 6 | 100% JSON-LD ✓ |
| WebSite `SearchAction` | 4 | 0 | 부재 |
| `speakable` | 4 | 0 | 부재 |
| Offer/가격 디테일 | 8 | 7 | `offers`+price 존재, 부분 |
| 일관 @id/로고 | 4 | 2 | Org `codeit-logo` vs Course.provider `sprint-logo` 불일치 −2 |
| 스키마 내 로케일(inLanguage) | 4 | 4 | Course `inLanguage: "ko"` ✓ |
| **합계** | **108 → 100 정규화** | **94 → 87** | |

### Platform Optimization (90/100)

10개 고정 URL 의 on-page 신호만. KR 현지화(네이버/구글-KR 가중). 이번 회차에 `<head>` 원본 직접 검증으로 lang/OG/Twitter/viewport 항목 정정.

| 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|
| 한국어 콘텐츠 | 8 | 8 | 10페이지 전부 한국어 |
| html lang / og:locale | 7 | 5 | **`html lang="ko"` 전 페이지 확정** ✓; `og:locale` 부재 −2 |
| AI Overview/Briefing 추출 블록 | 12 | 10 | 직답 FAQ + 정량 stat 블록 |
| FAQ/구조화 Q&A | 12 | 11 | 전 페이지 `FAQPage` |
| FAQPage/Course/Org JSON-LD | 12 | 11 | 전 페이지 유효·SSR(직접 검증) |
| 비교/리스트(Perplexity 친화) | 10 | 10 | 트랙 비교표·`teaches[]`·`ItemList` |
| 헤딩 계층 | 8 | 6 | 단일 H1+논리적 H2/H3, 슬로건 H2 일부 |
| 신선도/날짜 | 8 | 7 | 기수일정·`datePublished`(스키마). 가시적 publish/modified 타임스탬프는 아님 |
| llms.txt 크롤러 피딩 | 6 | 6 | 유효 llms.txt(200) |
| OG/Twitter 카드 | 5 | 5 | **`og:title`+`twitter:card` 전 페이지 확정** ✓ |
| SSR/크롤 가능 텍스트 | 7 | 7 | 전 페이지 SSR |
| 모바일 viewport | 3 | 3 | **viewport 전 페이지 확정** ✓ |
| canonical/hreflang | 2 | 1 | canonical 전 페이지 ✓, hreflang 없음 −1 |
| **합계** | **100** | **90** | |

**서피스별:** 네이버 AI Briefing/Perplexity/Google AIO = 강함(비교표·FAQ·SSR·llms.txt·lang=ko). ChatGPT/Gemini/Bing = 중상(스키마·엔티티·OG 보강 확정, off-page 엔티티가 한계).

---

## Discovery (composite 점수 미반영)

규칙상 고정 `brandSources` 외 새로 발견한 소스/커뮤니티는 **점수에 넣지 않고 여기에만 기록**한다.

- **Facebook** `facebook.com/codeit.kr` — 모회사 공식 페이지(Org `sameAs`). 고정 리스트 외.
- **실제 IG 핸들 `@codeit_kr`** — `sameAs` 의 실 핸들(체크리스트 표기 `@codeit.kr` 와 상이).
- **Sprint `frontend` 트랙** `sprint.codeit.kr/track/frontend` — `llms.txt`·홈 `ItemList` 에 존재하나 고정 감사셋(frontend-advanced)엔 없음.
- **`llms.txt` 의 모회사 명시** — "회사" 섹션에 `코드잇 (Codeit) — 온라인 코딩 교육 플랫폼 (모회사)" 로 parent 관계를 텍스트로도 노출.
- 미확인 KR 커뮤니티(OKKY·블라인드·커리어리·네이버 카페 등) — 본 회차 점검 안 함(점수 무관, 디스커버리 기록만).

---

## Quick Wins (This Week)

1. `frontend-advanced` Course 에 `hasCourseInstance`(courseMode/startDate/endDate) 추가 — 타 6개 트랙과 정합.
2. `llms-full.txt` 생성 — 현재 404, `llms.txt` 와 함께 풀 본문 제공.
3. 홈 `ItemList` 의 `/track/frontend` 참조 정합성 점검(감사셋과 불일치 해소 또는 frontend 트랙 정식 편입).
4. `#organization` 로고 불일치 해소(동일 @id 단일 로고).
5. 운영사 법인정보(사업자등록번호/주소/연락처)·환불정책을 감사 대상 페이지 푸터에 노출(E-E-A-T 신뢰성).

## 30-Day Action Plan

### Week 1: 엔티티 그라운딩 (최우선)
- [ ] 모회사 **코드잇 Wikidata 아이템 생성**(언어무관 핵심) + 한국어 위키백과 문서화 추진.
- [ ] 생성 후 Organization `sameAs` 에 Wikidata/위키백과 URL 추가.

### Week 2: 신뢰성(E-E-A-T) 보강
- [ ] 취업률·완주율 등 핵심 통계의 **산출 방법론·기준(모집단/연도) 명시**.
- [ ] 환불·보증 정책 페이지 노출, 운영사 식별정보 푸터 표준화.

### Week 3: 스키마/플랫폼
- [ ] FAQ 답변·코스 요약에 `speakable` 추가, `WebSite.SearchAction` 추가, `og:locale=ko_KR` 보강.
- [ ] CSP 헤더 도입.

### Week 4: 인용가능성
- [ ] 트랙/홈 도입부에 "X는 ~이다" **정의·요약 문장** 추가, 슬로건 H2 를 질문형으로 전환.
- [ ] `llms.txt` 에 헤드라인 통계 스냅샷(취업률/완주율) 인라인 추가, `llms-full.txt` 동반 제공.

---

## Appendix: Pages Analyzed (고정 auditUrls)

| # | URL | HTTP | SSR | JSON-LD @types |
|---|---|---|---|---|
| 1 | https://sprint.codeit.kr/ | 200 | Y | EduOrg, WebSite, FAQPage, ItemList(8) |
| 2 | https://sprint.codeit.kr/career | 200 | Y | EduOrg, WebSite |
| 3 | https://sprint.codeit.kr/track/frontend-advanced | 200 | Y | EduOrg, WebSite, Course(**hasCourseInstance 결측**), FAQPage, BreadcrumbList |
| 4 | https://sprint.codeit.kr/track/backend-spring | 200 | Y | EduOrg, WebSite, Course(+instance), FAQPage, BreadcrumbList |
| 5 | https://sprint.codeit.kr/track/fullstack | 200 | Y | EduOrg, WebSite, Course(+instance), FAQPage, BreadcrumbList |
| 6 | https://sprint.codeit.kr/track/ai | 200 | Y | EduOrg, WebSite, Course(+instance), FAQPage, BreadcrumbList |
| 7 | https://sprint.codeit.kr/track/data | 200 | Y | EduOrg, WebSite, Course(+instance), FAQPage, BreadcrumbList |
| 8 | https://sprint.codeit.kr/track/product-design | 200 | Y | EduOrg, WebSite, Course(+instance), FAQPage, BreadcrumbList |
| 9 | https://sprint.codeit.kr/track/it-founder | 200 | Y | EduOrg, WebSite, Course(+instance), FAQPage, BreadcrumbList |
| 10 | https://sprint.codeit.kr/llms.txt | 200 | n/a | 유효 llms.txt(text/plain) |

**Technical signal files:** robots.txt **200** · sitemap.xml **200** · server-sitemap.xml **200** · llms.txt **200** · llms-full.txt **404**.

**brandSources used:** `brandSourcesVersion: 2` (8개 고정 소스, 위 Brand Authority 표 참조).
