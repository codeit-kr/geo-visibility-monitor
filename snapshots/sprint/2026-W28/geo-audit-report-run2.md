# GEO Audit Report: 코드잇 스프린트 (Codeit Sprint)

**Audit Date:** 2026-07-07
**capturedAt:** 2026-07-07T01:35:07Z
**isoWeek:** 2026-W28
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
> 원본 SSR HTML 을 직접 파싱해 JSON-LD 를 확정했습니다(WebFetch 마크다운 변환이 `<head>`/`<script>` 를 제거하는 한계 회피).
> 이전 주차(W26) 점수를 앵커로 사용하지 않고 독립 재산정했으며, 참고용으로만 델타를 병기합니다.

---

## Executive Summary

**Overall GEO Score: 80/100 (Good)**

코드잇 스프린트는 **기술 인프라(92)·플랫폼(91)·구조화 데이터(88)** 가 최상위권이다. 10개 고정 페이지 전부 풀 SSR 이며 AI 크롤러가 모두 허용되고, `EducationalOrganization`→`parentOrganization`(코드잇)→`Course`(+`hasCourseInstance`/`Offer`)/`FAQPage`/`BreadcrumbList` 그래프가 전 트랙 페이지에 유효한 JSON-LD 로 심겨 있다. **인용가능성(84→85)** 은 트랙별 주차 커리큘럼·정량 성과·비교표에 더해 **성과 통계에 산출 방법론·모집단이 인라인 노출**(예: "2025년 고용24 기준 · 수강생 2,598명 대상")되며 상승했다. **E-E-A-T(75→82)** 도 크게 개선됐는데, 이전 회차의 큰 감점 사유였던 **운영사 법인 식별정보((주)코드잇·사업자번호 313-86-00797·대표·주소·통신판매업신고)가 푸터에 노출**되고 통계 출처가 명시됐기 때문이다. 가장 큰 취약점은 여전히 **브랜드 권위(52, 변동 없음)** 로, 모회사 코드잇의 **한국어 위키백과·Wikidata 엔티티가 부재**하고 스프린트 전용 엔티티는 어떤 플랫폼에도 없다(외부 엔티티 생태계는 W26 대비 무변화 → 브랜드 점수 유지).

### Score Breakdown

| Category | Score | Weight | Weighted | vs W26 |
|---|---|---|---|---|
| AI Citability | 85/100 | 25% | 21.25 | +1 |
| Brand Authority | 52/100 | 20% | 10.40 | 0 |
| Content E-E-A-T | 82/100 | 20% | 16.40 | +7 |
| Technical GEO | 92/100 | 15% | 13.80 | 0 |
| Schema & Structured Data | 88/100 | 10% | 8.80 | +5 |
| Platform Optimization | 91/100 | 10% | 9.10 | +8 |
| **Overall GEO Score** | | | **79.75 → 80** | +3 |

`composite = round(85·0.25 + 52·0.20 + 82·0.20 + 92·0.15 + 88·0.10 + 91·0.10) = round(79.75) = 80`

> **W26 → W28 사이 확인된 객관 개선 (근거 있는 상승 요인).**
> 1. `/track/frontend-advanced` Course 에 `hasCourseInstance`(courseMode:blended / startDate / endDate / VirtualLocation) **추가** — W26 medium 이슈 해소, 7개 트랙 전부 정합.
> 2. 전 트랙 Course 에 `datePublished`·`teaches`·`inLanguage` **보강** (신선도/스키마 풍부도).
> 3. `<html lang="ko">` **전 페이지 확정**(W26 미검증 → 확정).
> 4. OG/Twitter 카드(`og:title/description/image` + `twitter:card/title/description/image`) **전 페이지 확정**(W26 head 미검증).
> 5. 성과 통계에 **산출 방법론·모집단 인라인 노출**("2025년 고용24 기준 · 수강생 2,598명 대상").
> 6. **운영사 법인 식별정보 푸터 노출**((주)코드잇, 사업자번호 313-86-00797, 대표 강영훈·이윤수, 주소 서울 중구 청계천로 100 시그니쳐타워 동관 10층, 통신판매업신고).

---

## Critical Issues (Fix Immediately)

KR 현지화 기준상 **critical 등급 이슈는 없음.** (영문 Wikipedia/Reddit/G2/Trustpilot/Clutch 부재는 규칙에 따라 critical 로 분류하지 않고 down-weight.)

## High Priority Issues

1. **모회사 코드잇의 한국어 위키백과 문서 부재** — `ko.wikipedia.org/wiki/코드잇` 직접 조회 **HTTP 404**. 한국어 위키백과는 KR 시장 핵심 엔티티 근거(영문 위키와 달리 down-weight 대상 아님)이며 AI 엔티티 그라운딩의 최대 공백. (W26 대비 무변화)
2. **모회사 코드잇의 Wikidata 아이템 부재** — `wbsearchentities`(ko) 0건, (en) 은 무관한 `Q30299760 CodeIT(노르웨이)` 뿐. Wikidata 는 언어무관 핵심 신호로 가중치 유지하며, 부재는 `sameAs` 엔티티 링크의 최상위 근거 상실. (무변화)

## Medium Priority Issues

1. **Organization `sameAs` 에 Wikipedia/Wikidata 미포함** — AI 엔티티 링킹 최강 신호 부재(선결과제는 High #1·#2 엔티티 생성).
2. **스프린트 전용 IG `@codeit_sprint` 미확인** — `sameAs` 는 모회사 핸들 `instagram.com/codeit_kr` 만 확정. `brandSources` 의 스프린트 전용 핸들 검증 불가.
3. **ItemList 의 `/track/frontend` 참조** — 홈 `ItemList` 가 고정 감사셋의 `frontend-advanced` 외에 `/track/frontend` 도 참조(8개 URL). 고정 감사셋과 불일치하는 stale/중복 가능 URL. (무변화)
4. **환불·보증 정책 미노출** — 감사 대상 페이지 텍스트에 `환불` 관련 조항 0건. 법인 식별정보·통계 방법론은 노출됐으나 환불정책은 여전히 미노출(E-E-A-T 신뢰성 잔여 감점).

## Low Priority Issues

1. `WebSite` 에 `SearchAction`(사이트링크 검색창) 없음.
2. FAQ 답변/코스 요약에 `speakable` 속성 없음.
3. 명시적 `Content-Security-Policy` 헤더 부재(그 외 보안 헤더는 양호).
4. 동일 `#organization` @id 에서 로고 불일치(org 블록 `codeit-logo.png` vs `Course.provider` `sprint-logo.png`).
5. `og:locale` 명시 태그 부재(`<html lang="ko">` 는 전 페이지 존재로 부분 보완).
6. `llms-full.txt` 부재(404) — `llms.txt` 는 존재.

---

## Category Deep Dives

### AI Citability (85/100)

객관 체크리스트 가점 합. 10개 고정 URL 모두 실 텍스트가 SSR 로 추출 가능(빈 JS 셸 없음).

| # | 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|---|
| 1 | 독립 인용가능 정량 블록 | 15 | 15 | "취업률", "완주율" 등 정량 성과에 **방법론·모집단 인라인**("2025년 고용24 기준 · 수강생 2,598명 대상") → W26 −1 해소 |
| 2 | 질문형 헤딩(쿼리 매칭) | 10 | 7 | 실제 FAQ 질문 다수 vs 슬로건성 H2 혼재 |
| 3 | 상단 정의/요약 문장 | 10 | 6 | H1 은 서술적이나 "X는 ~이다" 정의 패턴 적고 도입부가 홍보성 |
| 4 | 사실 리스트·표(커리큘럼/트랙/성과/가격) | 20 | 19 | 주차별 커리큘럼·정가표·성과 리스트 매우 추출 친화 |
| 5 | 고유명사·구체 수치 | 15 | 15 | 정확한 학비·기수일정·기간·툴(Spring/PyTorch)·고용사(카카오페이·컬리·쿠팡) |
| 6 | FAQ형 콘텐츠 | 10 | 8 | "자주 묻는 질문" 홈+트랙, 실 Q→A (트랙당 9–13 Q/A) |
| 7 | 구조화 llms.txt 요약 | 10 | 9 | 유효 llms.txt(H1+요약 blockquote+섹션 링크). 헤드라인 통계 인라인 부재 −1 |
| 8 | 낮은 부풀림 비율 | 10 | 6 | 트랙=사실 위주(양호), 홈/career="압도적 만족도" 등 홍보 부풀림으로 희석 |
| | **합계** | **100** | **85** | |

- **강한 인용 예시:** `/track/frontend-advanced` "학비 ₩300,000, courseMode blended, 2026-08-24 개강"; 홈 "취업률 ⓘ 2025년 고용24 기준 · 수강생 2,598명 대상".
- **약한 예시:** 홈 "압도적 만족도 부트캠프"(슬로건, 사실 0).

### Brand Authority (52/100)

composite 반영은 **`brandSources` (version 2) 고정 8개 소스의 존재/연결 여부**만. "(모회사)" 항목은 코드잇(parent) 엔티티이며,
사이트 Organization 스키마가 `parentOrganization` 으로 코드잇(`www.codeit.kr`)에 연결되어 있고 **그 모회사 엔티티가 존재하면 부분 가점**(자식이 부모 상속).
완전 가점은 스프린트 전용 엔티티가 있을 때만. 나무위키 직접 fetch 403 이어도 `parentOrganization`·`sameAs` 로 확인되면 인정(직접 fetch 불필요).

| # | 고정 소스 | 가능 | 가점 | 존재/연결 근거 | 완전/부분 |
|---|---|---|---|---|---|
| 1 | namu.wiki/w/코드잇 (모회사) | 15 | 8 | 직접 fetch **403**(규칙상 불이익 없음). `parentOrganization`→코드잇(`www.codeit.kr/#organization`) 연결 확정으로 모회사 인정. 스프린트 전용 엔티티 아님 | 부분 |
| 2 | ko.wikipedia/코드잇 (모회사) | 15 | 0 | 직접 조회 **404** — 모회사 문서 부재. 한국어 위키는 KR 핵심(down-weight 대상 아님) → 상속할 엔티티 없음 | 없음 |
| 3 | Wikidata 코드잇/Codeit (모회사) | 15 | 0 | `wbsearchentities`(ko) 0건, (en) 무관한 `Q30299760`(노르웨이)뿐. 언어무관 핵심 → 가중치 유지, 엔티티 없어 가점 불가 | 없음 |
| 4 | blog.naver.com/codeitofficial | 10 | 9 | Org `sameAs` 에 **정확히 동일 핸들** 포함 + 직접 조회 **HTTP 200** → 존재·연결 확정 | 부분(모회사 채널) |
| 5 | youtube.com/@codeit | 15 | 13 | `sameAs` + 직접 조회 **HTTP 200** 확정. 구독/조회수 JS-gated 미확인 −2 | 준-완전 |
| 6 | Instagram @codeit.kr, @codeit_sprint | 10 | 7 | `sameAs` 에 `instagram.com/codeit_kr` 확정. 스프린트 전용 `@codeit_sprint` 미확인 | 부분 |
| 7 | linkedin/company/codeit-official | 10 | 10 | Org `sameAs` 에 포함(연결 확정). 직접 조회는 HTTP 999(LinkedIn 봇 차단)이나 W26 라이브 확정 이력 + sameAs 근거로 인정 | 완전 |
| 8 | 잡플래닛: 코드잇 기업 페이지 | 10 | 5 | 직접 조회 **403**(봇 차단). 법인 `(주) 코드잇` 실재 → 페이지 개연 높으나 본 회차 미확인 | 부분 |
| | **합계** | **100** | **52** | | |

`8 + 0 + 0 + 9 + 13 + 7 + 10 + 5 = 52` (외부 엔티티 생태계 W26 대비 무변화 → 점수 유지)

**Organization schema 연결 (원본 SSR HTML 직접 파싱, 권위 근거):**
- 엔티티 `EducationalOrganization` `@id: https://sprint.codeit.kr/#organization`, name `코드잇 스프린트`, url `https://sprint.codeit.kr`.
- `sameAs`: `youtube.com/@codeit`, `instagram.com/codeit_kr`, `facebook.com/codeit.kr`, `blog.naver.com/codeitofficial`, `linkedin.com/company/codeit-official`.
- `parentOrganization`: `{ "@id": "https://www.codeit.kr/#organization", "name": "코드잇", "url": "https://www.codeit.kr" }` — **확정**. 자식(sprint)이 모회사(코드잇) 엔티티 상속 근거.
- Wikipedia/Wikidata 링크는 `sameAs` 에 없음(해당 엔티티 자체 부재).

### Content E-E-A-T (82/100)

| 축 | 가능 | 가점 | 핵심 근거 |
|---|---|---|---|
| Experience | 25 | 20 | 실명·1인칭 수료생 후기("30대 비전공자 개발자 취업"), 트랙별 실제 프로젝트. 트랙 페이지 일부 후기 익명화("김** 님") −, 포트폴리오 이미지 미확인 − |
| Expertise | 25 | 22 | 트랙별 실명 강사+이력(예: "차성우 콘텐츠 PD 광운대 컴퓨터공학, 前 예거 SW Engineer"), 주차별 커리큘럼·정확한 기술용어. CEO 트랙 중복 노출로 트랙별 전문성 희석 − |
| Authoritativeness | 25 | 18 | KDT/고용노동부/내일배움카드 전 트랙, K-디지털 트레이닝 해커톤 **장관상**, 고용사 30+(카카오페이·컬리·쿠팡). 외부 평판 링크(잡플래닛/네이버 후기) 부재 − |
| Trustworthiness | 25 | 22 | HTTPS, 정량 성과에 **출처·모집단 명시**(2025 고용24·2,598명), 투명 학비·국비지원. **운영사 법인 식별정보 노출**((주)코드잇·사업자번호 313-86-00797·대표·주소·통신판매업신고). **환불정책 미노출 −3** |
| **합계** | **100** | **82** | |

> W26 대비 Trustworthiness 15→22: 법인 식별정보·통계 방법론 노출로 −10 감점 사유 중 2/3 해소. 잔여 감점은 환불정책 미노출.

### Technical GEO (92/100)

기술 신호는 5개 파일 **존재 여부**만 점검(규칙). 정규화 점수 96/104 → **92**. (W26 대비 기술 신호 무변화)

| 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|
| HTTPS/TLS | 8 | 8 | HTTP/2 TLS, HTTP→HTTPS 강제 |
| HSTS | 4 | 4 | `strict-transport-security: max-age=31536000` |
| robots.txt 존재 | 6 | 6 | 200, 유효, 양 sitemap 참조 |
| AI 크롤러 허용 | 8 | 8 | `User-agent:*` 가 `/admin`,`/become` 만 차단. GPTBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot 전부 허용(비차단) |
| sitemap.xml | 6 | 6 | 200 |
| server-sitemap.xml | 4 | 4 | 200 |
| llms.txt | 6 | 6 | 200, 유효 포맷 |
| llms-full.txt | 3 | 0 | **404 (부재)** |
| SSR(실 HTML) | 20 | 20 | 9개 HTML 페이지 전부 풀 SSR(JSON-LD 포함, 253KB–1.8MB), CSR 빈 셸 아님 |
| canonical | 6 | 6 | 9개 HTML 전부 `rel="canonical"` |
| meta robots noindex 아님 | 6 | 6 | noindex/차단 X-Robots-Tag 없음 |
| viewport | 4 | 4 | `name="viewport"` 확인 |
| structured data 존재 | 5 | 5 | Course/FAQPage/BreadcrumbList 전 트랙 페이지 |
| 보안 헤더 | 8 | 7 | nosniff/SAMEORIGIN/Referrer-Policy/Permissions-Policy O, **CSP 부재 −1** |
| 클린 URL | 4 | 4 | 소문자·하이픈·계층(`/track/<slug>`) |
| 10개 페이지 200 | 6 | 6 | 전부 HTTP 200 |
| **합계** | **104 → 100 정규화** | **96 → 92** | |

**5-File 존재표:** robots.txt 200 · sitemap.xml 200 · server-sitemap.xml 200 · llms.txt 200 · **llms-full.txt 404**.

### Schema & Structured Data (88/100)

원본 SSR HTML 직접 파싱. 전 트랙 페이지 유효 JSON-LD(100% JSON-LD, Microdata/RDFa 없음).

| 페이지 | @types |
|---|---|
| / | EducationalOrganization, WebSite, FAQPage(7 Q/A), ItemList(8 트랙) |
| /career | EducationalOrganization, WebSite |
| /track/frontend-advanced | EduOrg, WebSite, Course(**+hasCourseInstance +Offer +datePublished +teaches**), FAQPage(11), BreadcrumbList |
| /track/{backend-spring,fullstack,ai,data,product-design,it-founder} | EduOrg, WebSite, Course(+CourseInstance+Offer+datePublished+teaches), FAQPage(9–13), BreadcrumbList |
| /llms.txt | n/a(text/plain) |

**W26 대비 개선:** ① `frontend-advanced` `hasCourseInstance`(courseMode:blended/startDate:2026-08-24/endDate:2026-10-23/VirtualLocation) **결측→보유** — 7개 트랙 전부 정합. ② 전 트랙 Course 에 `datePublished`(예 2026-06-25)·`teaches`·`inLanguage` 보강.

주요 가점: Organization(+`sameAs`5 + `parentOrganization`→코드잇), Course(name/description/provider/offers/hasCourseInstance/teaches/datePublished), FAQPage, BreadcrumbList, WebSite. **잔여 감점:** `sameAs` 에 Wikipedia/Wikidata 없음(엔티티 부재), `SearchAction`·`speakable` 부재, ItemList `/track/frontend` stale 참조, `#organization` 로고 불일치(org `codeit-logo.png` vs Course.provider `sprint-logo.png`). → 정규화 **88**.

### Platform Optimization (91/100)

10개 고정 URL 의 on-page 신호만. KR 현지화(네이버/구글-KR 가중).

| 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|
| 한국어 콘텐츠 | 8 | 8 | 10페이지 전부 한국어 |
| html lang/og:locale | 7 | 6 | **`<html lang="ko">` 전 페이지 확정**(W26 3→6). `og:locale` 명시 태그는 부재 −1 |
| AI Overview/Briefing 추출 블록 | 12 | 10 | 직답 FAQ + 정량 stat 블록(방법론 포함) |
| FAQ/구조화 Q&A | 12 | 11 | 전 페이지 "자주 묻는 질문"(FAQPage 9–13 Q/A) |
| FAQPage/Course/Org JSON-LD | 12 | 12 | **전 트랙 유효·SSR·frontend-advanced 포함 완전 정합**(W26 11→12) |
| 비교/리스트(Perplexity 친화) | 10 | 10 | "타 부트캠프 vs 스프린트" 비교표 전 트랙 |
| 헤딩 계층 | 8 | 6 | 단일 H1+논리적 H2/H3, 슬로건 H2 일부 |
| 신선도/날짜 | 8 | 8 | Course `datePublished` + 기수 startDate/endDate·마감 D-day(W26 7→8) |
| llms.txt 크롤러 피딩 | 6 | 6 | 유효 llms.txt |
| OG/Twitter 카드 | 5 | 5 | **`og:title/description/image`+`twitter:card/title/description/image` 확정**(W26 2→5) |
| SSR/크롤 가능 텍스트 | 7 | 7 | 전 페이지 SSR |
| 모바일 viewport | 3 | 2 | viewport 확인 |
| canonical/hreflang | 2 | 0 | hreflang 신호 없음 |
| **합계** | **100** | **91** | |

**서피스별:** 네이버 AI Briefing/Perplexity/Google AIO = 강함(비교표·FAQ·SSR·llms.txt·명시 lang/OG). ChatGPT/Gemini/Bing = 중상(스키마·엔티티 보강 완료, off-page 모회사 위키 엔티티가 유일 한계).

---

## Discovery (composite 점수 미반영)

규칙상 고정 `brandSources` 외 새로 발견한 소스/커뮤니티는 **점수에 넣지 않고 여기에만 기록**한다.

- **Facebook** `facebook.com/codeit.kr` — 모회사 공식 페이지(Org `sameAs`). 고정 리스트 외.
- **Sprint 블로그** `sprint.codeit.kr/blog` — 자사 콘텐츠 채널(footer 링크).
- **실제 IG 핸들 `@codeit_kr`** — `sameAs` 의 실 핸들(체크리스트의 `@codeit.kr`/`@codeit_sprint` 와 표기 상이).
- **법인정보(신규 노출)** `(주) 코드잇`, 대표 **강영훈·이윤수**, 사업자등록 **313-86-00797**, 통신판매업신고 `...-서울중구-1034호`, 주소 서울특별시 중구 청계천로 100 시그니쳐타워 동관 10층 — 감사 페이지 footer 에서 확인(W26 대비 노출 개선). E-E-A-T 근거로는 사용했으나 외부 브랜드 신호가 아니므로 composite brand 에는 미반영.
- 미확인 KR 커뮤니티(OKKY·블라인드·커리어리·네이버 카페) — 본 회차 WebSearch 미사용으로 점검 안 함(재현성 유지).

---

## Quick Wins (This Week)

1. ItemList 의 stale `/track/frontend` 참조를 `/track/frontend-advanced` 로 정정(고정 감사셋 정합).
2. `#organization` 로고 불일치 해소(동일 @id 에 단일 로고 — org/Course.provider 통일).
3. 환불·보증 정책 페이지를 감사 대상 페이지 footer/약관에 노출(E-E-A-T 신뢰성 잔여 감점 해소).
4. `llms-full.txt` 생성 — 현재 404, `llms.txt` 와 함께 풀 본문 제공.
5. `WebSite.SearchAction` 추가, FAQ 답변·코스 요약에 `speakable` 추가.

## 30-Day Action Plan

### Week 1: 엔티티 그라운딩 (최우선·잔여 최대 공백)
- [ ] 모회사 **코드잇 Wikidata 아이템 생성**(언어무관 핵심) + 한국어 위키백과 문서화 추진.
- [ ] 생성 후 Organization `sameAs` 에 Wikidata/위키백과 URL 추가.

### Week 2: 신뢰성(E-E-A-T) 마무리
- [ ] 환불·보증 정책 명문화·노출(현재 미노출 잔여 항목).
- [ ] 트랙 페이지 익명 후기("김** 님")에 (동의 범위 내) 실명·성과 맥락 보강.

### Week 3: 스키마/플랫폼 정합
- [ ] ItemList `/track/frontend` 정정, 로고 통일.
- [ ] `og:locale=ko_KR` 명시 추가(`html lang=ko` 는 이미 존재), `SearchAction`·`speakable` 도입.

### Week 4: 인용가능성
- [ ] 트랙/홈 도입부에 "X는 ~이다" **정의·요약 문장** 추가, 슬로건 H2 를 질문형으로 전환.
- [ ] llms.txt 에 헤드라인 통계 스냅샷(취업률/완주율 + 출처·모집단) 인라인 추가.

---

## Appendix: Pages Analyzed (고정 auditUrls)

| # | URL | HTTP | SSR | 비고 |
|---|---|---|---|---|
| 1 | https://sprint.codeit.kr/ | 200 | Y | Org/WebSite/FAQPage(7)/ItemList(8), lang=ko, OG+Twitter |
| 2 | https://sprint.codeit.kr/career | 200 | Y | Org/WebSite, 취업지원 프로세스 |
| 3 | https://sprint.codeit.kr/track/frontend-advanced | 200 | Y | Course(+hasCourseInstance +Offer +datePublished), FAQ(11) |
| 4 | https://sprint.codeit.kr/track/backend-spring | 200 | Y | Course(+instance), FAQ(9) |
| 5 | https://sprint.codeit.kr/track/fullstack | 200 | Y | Course(+instance), FAQ(13) |
| 6 | https://sprint.codeit.kr/track/ai | 200 | Y | Course(+instance), FAQ(12) |
| 7 | https://sprint.codeit.kr/track/data | 200 | Y | Course(+instance), FAQ(11) |
| 8 | https://sprint.codeit.kr/track/product-design | 200 | Y | Course(+instance), FAQ(9) |
| 9 | https://sprint.codeit.kr/track/it-founder | 200 | Y | Course(+instance), FAQ(11) |
| 10 | https://sprint.codeit.kr/llms.txt | 200 | n/a | 유효 llms.txt(text/plain) |

**Technical signal files:** robots.txt 200 · sitemap.xml 200 · server-sitemap.xml 200 · llms.txt 200 · llms-full.txt **404**.

**External brand sources (brandSources v2):** namu.wiki 403(anti-bot) · ko.wikipedia 404 · Wikidata 0건 · naver blog 200 · youtube 200 · instagram codeit_kr(sameAs) · linkedin 999(anti-bot, sameAs-linked) · jobplanet 403(anti-bot).
