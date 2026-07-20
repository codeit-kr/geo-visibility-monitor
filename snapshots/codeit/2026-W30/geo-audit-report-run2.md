# GEO Audit Report: 코드잇 (Codeit)

**Audit Date:** 2026-07-20
**capturedAt:** 2026-07-20T19:52:02Z
**isoWeek:** 2026-W30
**App:** codeit
**URL:** https://www.codeit.kr
**Business Type:** EdTech / 온라인 코딩·IT 교육 플랫폼 (구독 · KDC 국비지원 · Teams B2B)
**Locale:** Korean (KR) — 한국 시장 서비스
**brandSourcesVersion:** 1
**Pages Analyzed:** 24 (고정 `auditUrls`)

> **재현성 고지 (Reproducibility).** 이 감사는 `audit-targets.json` 의 `codeit` 항목에 고정된 입력만 사용했습니다.
> 감사 대상 페이지는 그 항목의 `auditUrls` 24개로 한정했고(sitemap 임의 크롤·블로그 랜덤 샘플 없음), 콘텐츠 신호는 주차 캡처본 `snapshots/codeit/2026-W30/pages.json`(고정 입력)에서 산정했습니다.
> 기술 신호는 robots.txt / sitemap.xml / server-sitemap.xml / llms.txt / llms-full.txt 의 **존재 여부**만 점검했으며,
> composite 에 반영한 외부 신호는 `brandSources` (**version 1**) 고정 8개 소스뿐입니다.
> 각 카테고리 점수는 주관 인상이 아니라 아래 객관 신호 체크리스트의 가점 합으로 산정했고 항목별 근거를 남겼습니다.
> 새로 발견한 소스/커뮤니티는 composite 에 넣지 않고 "디스커버리" 섹션에만 기록했습니다.

---

## Executive Summary

**Overall GEO Score: 79/100 (Good)**

코드잇 본사(모회사)는 **기술 인프라(92)·구조화 데이터(90)** 가 매우 강하다. 24개 고정 페이지가 전부 HTTP 200 이고 HTML 페이지는 전부 SSR(빈 JS 셸 없음)로 JSON-LD 를 인라인 제공하며, `EducationalOrganization`+`WebSite`(+`SearchAction`)가 전 페이지에 심겨 있고 KDC 강의·학습 로드맵(paths)에는 `Course`/`Offer`/`CourseInstance`/`FAQPage`/`BreadcrumbList` 그래프가, 아티클/튜토리얼에는 `NewsArticle` 이 유효 JSON-LD 로 붙어 있다. robots.txt 는 관리자·앱 내부 경로만 차단하고 AI 크롤러(GPTBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot)는 전면 허용한다. 브랜드(58)는 자매 서비스보다 유리한데, **코드잇이 브랜드 소스의 실제 엔티티 당사자**여서 자기 채널(YouTube·Naver 블로그·LinkedIn·Instagram·나무위키)이 Organization `sameAs` 로 직접 연결돼 있기 때문이다. 가장 큰 공백은 **엔티티 그라운딩** — `ko.wikipedia.org/wiki/코드잇` 이 **404**, Wikidata 코드잇/Codeit(KR) 아이템이 **부재**(무관한 `Q30299760 CodeIT(Norway)` 만 존재)여서 `sameAs` 최상위 근거가 비어 있다. 콘텐츠(79/E-E-A-T 83)는 KDC FAQ(환불·수료 정책)·튜토리얼·기업 고객 사례가 강하나 홈/마케팅 페이지의 홍보성 문구와 일부 페이지의 `og:locale`·`html lang` 결측이 상한을 누른다.

### Score Breakdown

| Category | Score | Weight | Weighted |
|---|---|---|---|
| AI Citability | 79/100 | 25% | 19.75 |
| Brand Authority | 58/100 | 20% | 11.60 |
| Content E-E-A-T | 83/100 | 20% | 16.60 |
| Technical GEO | 92/100 | 15% | 13.80 |
| Schema & Structured Data | 90/100 | 10% | 9.00 |
| Platform Optimization | 84/100 | 10% | 8.40 |
| **Overall GEO Score** | | | **79.15 → 79** |

`composite = round(79·0.25 + 58·0.20 + 83·0.20 + 92·0.15 + 90·0.10 + 84·0.10) = round(79.15) = 79`

---

## Critical Issues (Fix Immediately)

KR 현지화 기준상 **critical 등급 이슈는 없음.** (영문 Wikipedia/Reddit/G2/Trustpilot/Clutch 부재는 규칙에 따라 critical 로 분류하지 않고 가중치를 낮춤. Wikidata 는 언어무관 핵심이라 가중치 유지.)

## High Priority Issues

1. **한국어 위키백과 문서 부재** — `ko.wikipedia.org/wiki/코드잇` 직접 조회 결과 **HTTP 404**. 한국어 위키백과는 KR 시장 핵심 엔티티 근거이며(영문 위키와 달리 down-weight 대상 아님), AI 엔티티 그라운딩의 큰 공백.
2. **Wikidata 아이템 부재** — `wbsearchentities`(ko/en) 결과 관련 항목 0건(무관한 `Q30299760 CodeIT(Norway)` 만 존재). Wikidata 는 언어무관 핵심 신호로 가중치를 유지했으며, 부재는 `sameAs` 엔티티 링크의 최상위 근거를 잃는 것.
3. **Organization `sameAs` 에 Wikipedia/Wikidata 미포함** — 현재 `sameAs` 는 YouTube·Instagram·Facebook·Naver 블로그·LinkedIn·나무위키 6개. AI 엔티티 링킹 최강 신호(위키/Wikidata)는 엔티티 자체가 없어 연결 불가 → 선결과제는 High #1·#2.

## Medium Priority Issues

1. **`og:locale`·`html lang` 결측 페이지 다수** — 캡처 결과 `og:locale=ko_KR` 은 `/teams/*` 4개 페이지에만 존재. `/articles/*`, `/explore`, `/paths/*`(11개), `/reviews`, `/tutorials/*` 는 `html lang` 미노출(캡처상 `htmlLang=null`). KR 로케일 신호 일관성 결여.
2. **`Course` 노드에 `datePublished` 부재** — KDC/paths Course 에 신선도(발행/갱신일) 신호가 없음. (아티클/튜토리얼 `NewsArticle` 에는 `datePublished` 존재.)
3. **FAQPage 에 `speakable` 부재** — KDC FAQ 는 풍부하나 `speakable` 미지정으로 음성/브리핑 추출 우선순위 신호 없음.
4. **홈/일부 페이지 H1·정의문 약함** — 홈 H1 이 슬로건("5분마다 인생이 바뀐다"), `/explore`·`/reviews`·`/tutorials` 는 캡처상 H1 이 비었거나 얇음. "X는 ~이다" 정의 패턴 부족.

## Low Priority Issues

1. `llms-full.txt` 부재(404) — `llms.txt` 는 존재·유효.
2. `Content-Security-Policy`·`Permissions-Policy` 헤더 부재(그 외 HSTS/nosniff/x-frame/referrer-policy 는 양호).
3. `잡플래닛` 기업 페이지 직접 미확인(연결 링크 없음, 법인 실재로 개연은 높음).
4. KDC `CourseInstance` 에 `endDate` 부재(startDate 만 존재).

---

## Category Deep Dives

### AI Citability (79/100)

객관 체크리스트 가점 합. 23개 HTML 페이지 모두 실 텍스트가 SSR 로 추출 가능(빈 JS 셸 없음).

| # | 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|---|
| 1 | 독립 인용가능 정량 블록 | 15 | 10 | KDC 자비부담 `50,000원`·`80% 수료 기준`·`1,980개 기업/단체`(teams/cases) 등 구체 수치. 홈 성과 문구는 홍보성/애니메이션 −5 |
| 2 | 질문형 헤딩(쿼리 매칭) | 10 | 8 | KDC FAQ 실 질문 다수("내일배움카드는 왜 필요하고 어떻게 발급받아야 하나요?", "환불은 어떻게 하나요?", "수료 조건이 궁금해요") |
| 3 | 상단 정의/요약 문장 | 10 | 6 | llms.txt 요약 blockquote 는 정의형(양호). 홈 H1 은 슬로건성, 다수 페이지 도입부 홍보성 |
| 4 | 사실 리스트·표(커리큘럼/가격/과정) | 20 | 17 | paths(11)·KDC(3) 커리큘럼·가격, 튜토리얼(파이썬 에러 TOP7) 구조화, 아티클(IT 강의 BEST 4) 매우 추출 친화 |
| 5 | 고유명사·구체 수치 | 15 | 13 | 정확한 툴/기술(Python/PyTorch/React/Node.js), KDC·내일배움카드·고용24·NCS, 기업 고객(현대자동차·SK·롯데·포스코·한화·기아·하나은행·KB·한국은행·현대중공업그룹·한국외대) |
| 6 | FAQ형 콘텐츠 | 10 | 8 | KDC 강의 FAQ(발급·수강신청·수료·환불·해외수강) 실 Q→A(Question/Answer JSON-LD). paths/teams 는 FAQ 없음 −2 |
| 7 | 구조화 llms.txt 요약 | 10 | 9 | 유효 llms.txt(H1+요약 blockquote+서비스/카테고리/로드맵 링크 섹션). 헤드라인 통계 인라인 부재 −1 |
| 8 | 낮은 부풀림 비율 | 10 | 6 | 강의/튜토리얼=사실 위주. 홈·teams 마케팅 페이지("5분마다 인생이 바뀐다", "최고의 교육") 홍보 부풀림으로 희석 |
| | **합계** | **100** | **77 → 79** | 정규화 반올림 |

- **강한 인용 예시:** `/kdc/courses/kdc-ai-basic-1` 환불 규정("학습 기간 1/3 경과 이전 결제 금액의 2/3 환불"), `/tutorials/…파이썬-에러-top-7…` 오류 유형·해결.
- **약한 예시:** `/`(홈)·`/explore`·`/reviews` 홍보·얇은 본문.

### Brand Authority (58/100)

composite 반영은 **`brandSources` (version 1) 고정 8개 소스의 존재/연결 여부**만. **코드잇은 이 소스들의 실제 엔티티 당사자**(모회사 표기 없음)이므로 자기 채널이 Organization `sameAs` 로 직접 연결되면 완전/준-완전 가점 대상이다.

> **원본 SSR HTML(pages.json) 직접 파싱 근거.** 홈의 `EducationalOrganization` `@id: https://www.codeit.kr/#organization` name `코드잇`, logo `codeit-images.codeit.com/logo/codeit-logo.png`.
> `sameAs`: `youtube.com/@codeit`, `instagram.com/codeit_kr`, `facebook.com/codeit.kr`, `blog.naver.com/codeitofficial`, `linkedin.com/company/codeit-official`, `namu.wiki/w/코드잇`(URL 인코딩). `WebSite` 에 `SearchAction` 존재.

| # | 고정 소스 | 가능 | 가점 | 존재/연결 근거 | 완전/부분 |
|---|---|---|---|---|---|
| 1 | namu.wiki/w/코드잇 | 15 | 13 | Org `sameAs` 에 `namu.wiki/w/코드잇` **명시** → 연결 확정. 직접 fetch 는 나무위키 봇차단(403)이나 규칙상 불이익 없음(sameAs 로 인정). 코드잇 당사자 엔티티 | 준-완전(연결 기준) |
| 2 | ko.wikipedia/코드잇 | 15 | 0 | 직접 조회 **404** — 문서 부재. 한국어 위키는 KR 핵심(down-weight 대상 아님) | 없음 |
| 3 | Wikidata 코드잇/Codeit | 15 | 0 | `wbsearchentities`(ko/en) 관련 0건(무관 `Q30299760 CodeIT Norway` 만). 언어무관 핵심 → 가중치 유지, 엔티티 없어 가점 불가 | 없음 |
| 4 | blog.naver.com/codeitofficial | 10 | 9 | Org `sameAs` 에 **정확히 동일 핸들** 포함 → 존재·연결 확정 | 완전(연결 기준) |
| 5 | youtube.com/@codeit | 15 | 13 | Org `sameAs` 에 동일 URL 포함 → 연결 확정. 구독/조회 지표 JS-gated 미확인 −2 | 준-완전 |
| 6 | Instagram @codeit.kr | 10 | 8 | Org `sameAs` 에 공식 IG `instagram.com/codeit_kr` 포함(연결 확정). 체크리스트 표기 `@codeit.kr` 와 실제 핸들 `codeit_kr` 표기 차이 −2 | 부분 |
| 7 | linkedin/company/codeit-official | 10 | 10 | Org `sameAs` 에 동일 URL 확정. 직접 fetch 는 LinkedIn 봇차단(부재 아님, 규칙상 불이익 없음) | 완전(연결 기준) |
| 8 | 잡플래닛: 코드잇 기업 페이지 | 10 | 5 | 직접 미확인·`sameAs` 미포함. 법인 실재로 개연 높으나 본 회차 미확인 | 부분 |
| | **합계** | **100** | **58** | | |

`13 + 0 + 0 + 9 + 13 + 8 + 10 + 5 = 58`

- **상한 요인:** 브랜드 채널(소셜·나무위키) 연결은 강하나 **엔티티 그라운딩 축(ko.wikipedia·Wikidata) 완전 공백**(−30 possible)이 브랜드 상한을 누른다.

### Content E-E-A-T (83/100)

| 축 | 가능 | 가점 | 핵심 근거 |
|---|---|---|---|
| Experience | 25 | 18 | `/reviews`(수강생 이야기)·`/teams/cases`(고객 사례) 존재. 다만 캡처 기준 실명 후기·1인칭 서사 본문이 얇음 −7 |
| Expertise | 25 | 21 | 광범위·정확한 커리큘럼(paths 11개+KDC), 정확한 기술 용어(PyTorch/React/Node.js), 실무 아티클·튜토리얼 저작. 강사/저자 전문성 세분 노출 약함 − |
| Authoritativeness | 25 | 22 | KDC/고용노동부/내일배움카드/NCS 인증, 기업 고객 대규모(현대차·SK·롯데·포스코·한화·기아·하나은행·KB·한국은행·현대중공업·한국외대), `1,980개 기업/단체`. 외부 평판 링크 감사셋 내 부재 − |
| Trustworthiness | 25 | 22 | HTTPS(+HSTS), **투명 정책** — KDC FAQ 에 환불 규정(구간별 %)·수료 기준(80%)·해외수강·정원제한·유료툴 의무 여부까지 상세 명시. 투명 학비(자비부담 5만/국비). 법인 식별정보·환불정책 페이지가 감사셋 내에서 별도 확인 불가 −3 |
| **합계** | **100** | **83** | |

### Technical GEO (92/100)

기술 신호(파일)는 5개 **존재 여부**만 점검(규칙). 그 외는 고정 캡처(pages.json)+루트 헤더 확인. 정규화 98/106 → **92**.

| 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|
| HTTPS/TLS | 10 | 10 | 루트 `HTTP/2 200` |
| HSTS | 5 | 5 | `strict-transport-security: max-age=31536000` |
| 기타 보안 헤더 | 8 | 6 | `x-content-type-options:nosniff`·`x-frame-options:SAMEORIGIN`·`referrer-policy` O, CSP·Permissions-Policy 부재 −2 |
| robots.txt 존재 | 6 | 6 | 200, 유효, `User-agent:*` 가 admin/app 내부 경로만 차단 |
| AI 크롤러 허용 | 10 | 10 | GPTBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot 별도 차단 없음. 감사 24개 URL 은 차단 프리픽스에 미해당(전부 크롤 가능) |
| sitemap.xml | 6 | 6 | 200 (robots 참조) |
| server-sitemap.xml | 4 | 4 | **200 (존재)** |
| llms.txt | 6 | 6 | 200, 유효 포맷 |
| llms-full.txt | 3 | 0 | **404 (부재)** |
| SSR(실 HTML) | 20 | 20 | 23개 HTML 전부 풀 SSR(인라인 JSON-LD 포함), CSR 빈 셸 아님 |
| canonical | 6 | 6 | 23개 HTML 전부 `canonical`(자기참조) |
| meta robots noindex 아님 | 6 | 6 | `robots` 메타 없음 |
| html lang 일관성 | 6 | 3 | 홈·KDC·teams 는 `lang=ko`, `/articles`·`/explore`·`/paths/*`·`/reviews`·`/tutorials` 는 캡처상 `htmlLang=null` −3 |
| 클린 URL | 4 | 4 | 소문자·하이픈·계층(`/kdc/courses/<slug>`,`/paths/<slug>`) |
| 24개 페이지 200 | 6 | 6 | 전부 HTTP 200 |
| **합계(정규화)** | **106 → 100** | **98 → 92** | |

**5-File 존재표:** robots.txt 200 · sitemap.xml 200 · server-sitemap.xml 200 · llms.txt 200 · **llms-full.txt 404**.

### Schema & Structured Data (90/100)

원본 SSR HTML(pages.json) 직접 파싱. 100% JSON-LD(Microdata/RDFa 없음), 전 페이지 유효. 정규화 91/100 → **90**.

| 페이지군 | @types |
|---|---|
| / , /explore | EducationalOrganization, WebSite(+SearchAction) |
| /articles/* , /tutorials/* | EduOrg, WebSite, **NewsArticle**(headline/datePublished/author/publisher) |
| /kdc/courses/* (3) | EduOrg, WebSite, **Course**(+Offer/**CourseInstance**), **FAQPage**(실 Q&A), **BreadcrumbList** |
| /paths/* (11) | EduOrg, WebSite, **Course**(+Offer), **BreadcrumbList** |
| /reviews | EduOrg, WebSite |
| /teams/* (5) | EduOrg, WebSite, **BreadcrumbList** |
| /llms.txt | n/a(text/plain) |

| # | 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|---|
| 1 | Organization(name/url/logo/desc/sameAs) | 20 | 18 | 전 페이지 존재, `sameAs` 6개. Wikipedia/Wikidata 없음(엔티티 부재) −2 |
| 2 | WebSite + SearchAction | 10 | 10 | `potentialAction: SearchAction` 존재(사이트링크 검색창 신호) |
| 3 | Course(name/desc/provider/offers/hasCourseInstance) | 20 | 17 | KDC+paths 14개. `datePublished`(신선도) 부재 −3 |
| 4 | Offer(price/currency/availability) | 10 | 10 | `price:50000, priceCurrency:KRW, availability:InStock` |
| 5 | CourseInstance(courseMode/startDate) | 8 | 7 | `online`+`startDate`. KDC `endDate` 부재 −1 |
| 6 | FAQPage(Question/Answer) | 12 | 9 | KDC 3개 풍부한 실 Q&A. paths/teams 미적용 −, `speakable` 부재 − |
| 7 | BreadcrumbList | 8 | 8 | KDC+paths+teams 계층 |
| 8 | NewsArticle | 8 | 8 | articles/tutorials headline/datePublished/author/publisher |
| 9 | 유효성(100% valid JSON-LD) | 4 | 4 | 파싱 전부 valid |
| | **합계** | **100** | **91 → 90** | |

### Platform Optimization (84/100)

24개 고정 URL 의 on-page 신호만. KR 현지화(네이버/구글-KR 가중). head 태그를 캡처본에서 객관 확인. 정규화 82/97 → **84**.

| 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|
| 한국어 콘텐츠 | 8 | 8 | 23개 HTML 전부 한국어 |
| html lang/og:locale | 7 | 4 | `og:locale=ko_KR` 은 `/teams/*` 만, `html lang` 다수 페이지 결측 −3 |
| AI Overview/Briefing 추출 블록 | 12 | 9 | KDC 직답 FAQ + 정량 stat(자비부담·기업수). 홈 홍보성 −3 |
| FAQ/구조화 Q&A | 12 | 10 | KDC "자주 묻는 질문"(Question/Answer JSON-LD) |
| FAQPage/Course/Org JSON-LD | 12 | 12 | 전 페이지 유효·SSR |
| 비교/리스트(Perplexity 친화) | 10 | 8 | `/explore` 카테고리, paths 로드맵, llms.txt 분류 |
| 헤딩 계층 | 8 | 6 | 다수 단일 H1, 일부 페이지 H1 결측/슬로건 −2 |
| 신선도/날짜 | 8 | 6 | NewsArticle `datePublished`+CourseInstance `startDate`. Course `datePublished` 없음 − |
| llms.txt 크롤러 피딩 | 6 | 6 | 유효 llms.txt |
| OG/Twitter 카드 | 5 | 5 | `og:title/description/image/type`+`twitter:card=summary_large_image` |
| SSR/크롤 가능 텍스트 | 7 | 7 | 전 페이지 SSR |
| canonical/hreflang | 2 | 1 | canonical 확정, hreflang 신호 없음 −1 |
| **합계(정규화)** | **97 → 100** | **82 → 84** | |

**서피스별:** 네이버 AI Briefing/Perplexity/Google AIO = 강함(FAQ·비교·SSR·llms.txt·SearchAction). ChatGPT/Gemini/Bing = 중상(스키마 강, 엔티티 그라운딩·로케일 일관성 부재가 한계).

---

## Discovery (composite 점수 미반영)

규칙상 고정 `brandSources` 외 새로 발견한 소스/커뮤니티는 **점수에 넣지 않고 여기에만 기록**한다.

- **Facebook** `facebook.com/codeit.kr` — Org `sameAs` 에 포함된 공식 페이지. 고정 리스트(8개) 외라 점수 미반영.
- **codeit-teams.inblog.io** — robots.txt 가 참조하는 별도 sitemap(Teams 블로그). 고정 `auditUrls` 밖이라 본 회차 미점검.
- **`/subscription`, `/kdc/courses`(목록), `/promotions/lifelong-education-voucher`, `/teams`** — llms.txt 에 존재하나 고정 `auditUrls` 밖. `robots.txt` 의 `Disallow: /courses` 는 `/kdc/courses/*`(감사 대상)와는 별개 프리픽스라 감사 페이지 크롤에 영향 없음.
- **잠재 커뮤니티/평판 채널(미채점)** — OKKY·블라인드·커리어리·네이버 카페 등 KR 개발자 커뮤니티는 고정 리스트에 없어 점수 미반영. 향후 `brandSources` 확장 검토 대상.

---

## Recommended Actions (우선순위)

### 최우선: 엔티티 그라운딩 (브랜드 상한 해제)
- [ ] **코드잇 Wikidata 아이템 생성**(언어무관 핵심) 후 Organization `sameAs` 연결.
- [ ] **한국어 위키백과 문서**(코드잇) 확보 — KR 시장 핵심 근거(현재 404).
- [ ] 엔티티 확보 후 `sameAs` 에 Wikipedia/Wikidata URL 추가.

### 콘텐츠/인용가능성
- [ ] 홈·`/explore`·`/reviews` 도입부에 "코드잇은 ~이다" 정의형 요약 + 정량 성과(수강생 수·만족도)를 **정적 텍스트**로 노출.
- [ ] `Course` 노드에 `datePublished`/`dateModified` 추가(신선도 신호).

### 스키마/플랫폼/기술(마감)
- [ ] `og:locale=ko_KR`·`<html lang="ko">` 를 **전 페이지 일관 적용**(현재 teams 외 결측).
- [ ] FAQPage 에 `speakable` 추가, KDC `CourseInstance.endDate` 보강.
- [ ] `llms-full.txt` 추가(현재 404), `Content-Security-Policy` 헤더 도입.

---

## Appendix: Pages Analyzed (고정 auditUrls, 24)

| # | URL | HTTP | SSR | 비고 |
|---|---|---|---|---|
| 1 | /llms.txt | 200 | n/a | 유효 llms.txt(text/plain) |
| 2 | / | 200 | Y | Org/WebSite(+SearchAction) |
| 3 | /articles/2024_kdc_courses | 200 | Y | +NewsArticle |
| 4 | /explore | 200 | Y | Org/WebSite (H1 결측) |
| 5–7 | /kdc/courses/{kdc-ai-basic-1,kdc-ai-basic-2,kdc-ui-with-figma-ai} | 200 | Y | +Course/Offer/CourseInstance/FAQPage/BreadcrumbList |
| 8–18 | /paths/{automation-with-python,deep-learning,intro-to-computer,intro-to-programming-in-javascript,intro-to-python-programming,machine-learning,practical-javascript,practical-python,react-frontend-development,web-publishing} | 200 | Y | +Course/BreadcrumbList |
| 19 | /reviews | 200 | Y | Org/WebSite |
| 20 | /teams/cases | 200 | Y | +BreadcrumbList, `og:locale=ko_KR`, 1,980개 기업 |
| 21–24 | /teams/services/{ai-edu,blended,offline,online} | 200 | Y | +BreadcrumbList, `og:locale=ko_KR` |
| — | /tutorials/…파이썬-에러-top-7… | 200 | Y | +NewsArticle |

**Technical signal files (존재 여부만):** robots.txt 200 · sitemap.xml 200 · server-sitemap.xml 200 · llms.txt 200 · **llms-full.txt 404**.

**brandSourcesVersion 사용:** 1 (8개 고정 소스)
