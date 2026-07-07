# GEO Audit Report: 코드잇 스프린트 (Codeit Sprint)

**Audit Date:** 2026-07-07
**capturedAt:** 2026-07-07T01:35:06Z
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
> 이전 주차 점수를 앵커로 사용하지 않았습니다(delta-context 미사용). 본문의 "전주 대비" 언급은 점수 앵커가 아니라 관측된 객관 신호 변화의 사실 기록입니다.

---

## Executive Summary

**Overall GEO Score: 79/100 (Good)**

코드잇 스프린트는 **기술 인프라(92)·플랫폼(91)·구조화 데이터(87)** 가 매우 강하다. 10개 고정 페이지 전부 SSR 로 제공되고(빈 JS 셸 없음) AI 크롤러가 전부 허용되며, `EducationalOrganization`→`parentOrganization`(코드잇)→`Course`+`CourseInstance`+`Offer`/`FAQPage`/`BreadcrumbList` 그래프가 전 트랙에 유효한 JSON-LD 로 심겨 있다. 이번 회차에는 (a) `frontend-advanced` 트랙의 `hasCourseInstance` 가 채워졌고, (b) 운영사 법인 식별정보(사업자등록번호·대표·주소·통신판매신고)가 감사 페이지 푸터에 노출됐으며, (c) `html lang=ko`·OG/Twitter 카드가 head 에서 **객관 확인**되어 스키마·E-E-A-T·플랫폼 신호가 함께 개선됐다. 가장 큰 취약점은 여전히 **브랜드 권위(52)** 로, 모회사 코드잇의 **한국어 위키백과·Wikidata 엔티티가 부재**하고 스프린트 전용 엔티티는 어떤 플랫폼에도 없다.

### Score Breakdown

| Category | Score | Weight | Weighted |
|---|---|---|---|
| AI Citability | 84/100 | 25% | 21.00 |
| Brand Authority | 52/100 | 20% | 10.40 |
| Content E-E-A-T | 82/100 | 20% | 16.40 |
| Technical GEO | 92/100 | 15% | 13.80 |
| Schema & Structured Data | 87/100 | 10% | 8.70 |
| Platform Optimization | 91/100 | 10% | 9.10 |
| **Overall GEO Score** | | | **79.40 → 79** |

`composite = round(84·0.25 + 52·0.20 + 82·0.20 + 92·0.15 + 87·0.10 + 91·0.10) = round(79.4) = 79`

---

## Critical Issues (Fix Immediately)

KR 현지화 기준상 **critical 등급 이슈는 없음.** (영문 Wikipedia/Reddit/G2/Trustpilot/Clutch 부재는 규칙에 따라 critical 로 분류하지 않고 가중치를 낮춤. Wikidata 는 언어무관 핵심이라 가중치 유지.)

## High Priority Issues

1. **모회사 코드잇의 한국어 위키백과 문서 부재** — `ko.wikipedia.org/wiki/코드잇` 직접 조회 결과 **HTTP 404**. 한국어 위키백과는 KR 시장에서 핵심 엔티티 근거이며(영문 위키와 달리 down-weight 대상 아님), AI 엔티티 그라운딩의 큰 공백.
2. **모회사 코드잇의 Wikidata 아이템 부재** — `wbsearchentities`(ko/en) 결과 관련 항목 0건(무관한 `Q30299760 CodeIT(Norway)` 만 존재). Wikidata 는 언어무관 핵심 신호로 가중치를 유지했으며, 부재는 `sameAs` 엔티티 링크의 최상위 근거를 잃는 것.
3. **스프린트 전용 엔티티 부재** — 브랜드 신호는 전부 모회사(코드잇) 채널 상속에 의존. 스프린트 전용 위키/엔티티가 없어 브랜드 카테고리 완전 가점 불가.

## Medium Priority Issues

1. **Organization `sameAs` 에 Wikipedia/Wikidata 미포함** — AI 엔티티 링킹 최강 신호 부재(엔티티 자체가 없으니 선결과제는 High #1·#2).
2. **환불·보증 정책 미노출** — 감사 페이지 푸터에 사업자등록번호·대표·주소·통신판매신고는 노출됐으나, 환불/보증 정책 및 성과통계 산출 방법론(모집단/연도)은 여전히 감사 페이지에서 확인 불가.
3. **스프린트 전용 IG `@codeit_sprint` 미확인** — `sameAs` 는 모회사 핸들 `instagram.com/codeit_kr` 만 확정. 체크리스트의 스프린트 전용 핸들 검증 불가.
4. **ItemList·llms.txt 의 `/track/frontend` 참조** — 고정 감사셋(`frontend-advanced`)과 별개 URL. llms.txt 상 "프론트엔드 엔지니어 양성 과정"으로 별도 트랙일 개연이 있으나(단기심화와 구분), 감사셋 밖이라 본 회차 미점검.

## Low Priority Issues

1. `WebSite` 에 `SearchAction`(사이트링크 검색창) 없음.
2. FAQ 답변/코스 요약에 `speakable` 속성 없음.
3. 명시적 `Content-Security-Policy` 헤더 부재(그 외 보안 헤더는 양호).
4. `#organization` 동일 @id 에서 로고 불일치(org 블록 `codeit-logo.png` vs Course.provider `sprint-logo.png`).
5. `llms-full.txt` 부재(404) — `llms.txt` 는 존재.
6. `og:locale` 명시 태그 미검증(`html lang=ko` 는 확정).

---

## Category Deep Dives

### AI Citability (84/100)

객관 체크리스트 가점 합. 10개 고정 URL 모두 실 텍스트가 SSR 로 추출 가능(빈 JS 셸 없음).

| # | 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|---|
| 1 | 독립 인용가능 정량 블록 | 15 | 14 | "취업률 71%", "완주율 84–86%", "비전공자 60%" 등 트랙 전반 일관(ai/data 페이지 `71%`·`80%` 확인). 출처/방법론 약함 −1 |
| 2 | 질문형 헤딩(쿼리 매칭) | 10 | 7 | 실제 FAQ 질문 다수("학업 또는 직장과 병행이 가능한가요?", "훈련장려금은 어떻게 지급되나요?") vs 슬로건성 H2 혼재 |
| 3 | 상단 정의/요약 문장 | 10 | 6 | H1 은 서술적이나 "X는 ~이다" 정의 패턴 적고 도입부가 홍보성 |
| 4 | 사실 리스트·표(커리큘럼/트랙/성과/가격) | 20 | 19 | 주차별 커리큘럼·정가표(₩22,687,500)·성과 리스트 매우 추출 친화 |
| 5 | 고유명사·구체 수치 | 15 | 15 | 정확한 학비·기수일정·기간·툴·고용사(토스·쿠팡·카카오페이·네이버·미래에셋) |
| 6 | FAQ형 콘텐츠 | 10 | 8 | "자주 묻는 질문" 홈+트랙, 실 Q→A (Question/Answer JSON-LD 다수) |
| 7 | 구조화 llms.txt 요약 | 10 | 9 | 유효 llms.txt(H1+요약 blockquote+섹션 링크+성과수치 기준 안내). 헤드라인 통계 인라인 수치 부재 −1 |
| 8 | 낮은 부풀림 비율 | 10 | 6 | 트랙=사실 위주(양호), 홈/career=홍보 부풀림으로 희석 |
| | **합계** | **100** | **84** | |

- **강한 인용 예시:** `/track/ai` "학비 ₩22,687,500(국비지원), 훈련장려금 지급"; `/track/backend-spring` 주차별 커리큘럼·기수일정.
- **약한 예시:** `/`(홈) 슬로건성 H2(사실 밀도 낮음).

### Brand Authority (52/100)

composite 반영은 **`brandSources` (version 2) 고정 8개 소스의 존재/연결 여부**만. "(모회사)" 항목은 코드잇(parent) 엔티티이며,
사이트 Organization 스키마가 `parentOrganization` 으로 코드잇(`www.codeit.kr`)에 연결되어 있고 **그 모회사 엔티티가 존재하면 부분 가점**(자식이 부모 상속).
완전 가점은 스프린트 전용 엔티티가 있을 때만. 이번 회차 엔티티 그라운딩 상황은 전주와 **동일**(Wikidata·ko.wiki 부재, sameAs 세트 동일).

| # | 고정 소스 | 가능 | 가점 | 존재/연결 근거 | 완전/부분 |
|---|---|---|---|---|---|
| 1 | namu.wiki/w/코드잇 (모회사) | 15 | 8 | 직접 fetch **403**(규칙상 불이익 없음). `parentOrganization`→코드잇(`www.codeit.kr/#organization`) 연결 확정으로 모회사 인정. 스프린트 전용 엔티티 아님 | 부분 |
| 2 | ko.wikipedia/코드잇 (모회사) | 15 | 0 | 직접 조회 **404** — 모회사 문서 부재. 한국어 위키는 KR 핵심(down-weight 대상 아님) → 상속할 엔티티 없음 | 없음 |
| 3 | Wikidata 코드잇/Codeit (모회사) | 15 | 0 | `wbsearchentities`(ko/en) 관련 0건. 언어무관 핵심 → 가중치 유지, 엔티티 없어 가점 불가 | 없음 |
| 4 | blog.naver.com/codeitofficial | 10 | 9 | Org `sameAs` 에 **정확히 동일 핸들** 포함 → 존재·연결 확정 | 부분(모회사 채널) |
| 5 | youtube.com/@codeit | 15 | 13 | `sameAs` 포함 + 직접 조회 **HTTP 200** 확정. 구독/조회수 JS-gated 미확인 −2 | 준-완전 |
| 6 | Instagram @codeit.kr, @codeit_sprint | 10 | 7 | `sameAs` 에 `instagram.com/codeit_kr` 확정. 스프린트 전용 `@codeit_sprint` 미확인 | 부분 |
| 7 | linkedin/company/codeit-official | 10 | 10 | Org `sameAs` 에 동일 URL 확정(연결 확정). 직접 fetch 는 LinkedIn 봇차단 **HTTP 999**(부재 아님, 규칙상 불이익 없음) | 완전(연결 기준) |
| 8 | 잡플래닛: 코드잇 기업 페이지 | 10 | 5 | 직접 미확인. 법인 `(주) 코드잇`(사업자등록 313-86-00797) 실재 → 잡플래닛 페이지 개연 높으나 본 회차 미확인 | 부분 |
| | **합계** | **100** | **52** | | |

`8 + 0 + 0 + 9 + 13 + 7 + 10 + 5 = 52`

**Organization schema 연결 (원본 SSR HTML 직접 파싱, 권위 근거):**
- 엔티티 `EducationalOrganization` `@id: https://sprint.codeit.kr/#organization`, name `코드잇 스프린트`, logo `codeit-images.codeit.com/logo/codeit-logo.png`.
- `sameAs`: `youtube.com/@codeit`, `instagram.com/codeit_kr`, `facebook.com/codeit.kr`, `blog.naver.com/codeitofficial`, `linkedin.com/company/codeit-official`.
- `parentOrganization`: `{ "@type":"EducationalOrganization", "@id": "https://www.codeit.kr/#organization", "name": "코드잇", "url": "https://www.codeit.kr" }` — **확정**. 자식(sprint)이 모회사(코드잇) 엔티티 상속 근거. 나무위키 직접 403 이어도 이 연결로 모회사 인정(직접 fetch 불필요).
- Wikipedia/Wikidata 링크는 `sameAs` 에 없음(해당 엔티티 자체 부재).

### Content E-E-A-T (82/100)

| 축 | 가능 | 가점 | 핵심 근거 |
|---|---|---|---|
| Experience | 25 | 20 | 실명 수료생 성과, 1인칭 후기, 트랙별 실제 프로젝트. 학생 포트폴리오 이미지 미확인 −, 일부 후기 익명화 − |
| Expertise | 25 | 22 | 트랙별 실명 강사+이력, 주차별 커리큘럼·정확한 기술용어. CEO 다중 트랙 중복 노출로 트랙별 전문성 희석 − |
| Authoritativeness | 25 | 18 | KDT/고용노동부/내일배움카드 전 트랙, 고용사 30+(토스·쿠팡·카카오페이·네이버·미래에셋·LG). 외부 평판 링크(잡플래닛/네이버 후기) 부재 −, 운영사 권위 페이지 감사셋 내 부재 − |
| Trustworthiness | 25 | 22 | HTTPS, 정량 성과(취업률 71%/완주율 84–86%), 투명 학비·국비지원 내역, 신선한 기수일정. **이번 회차: 운영사 법인 식별정보(사업자등록번호 313-86-00797·대표·주소 서울 중구 청계천로·통신판매신고)가 감사 페이지 푸터에 노출됨(전주 미노출 공백 해소).** 환불정책·통계 산출 방법론 여전히 미노출 −3 |
| **합계** | **100** | **82** | |

### Technical GEO (92/100)

기술 신호는 5개 파일 **존재 여부**만 점검(규칙). 정규화 점수 96/104 → **92**.

| 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|
| HTTPS/TLS | 8 | 8 | HTTP/2 TLS, HTTP→HTTPS 301 강제 |
| HSTS | 4 | 4 | `strict-transport-security: max-age=31536000` |
| robots.txt 존재 | 6 | 6 | 200, 유효, 양 sitemap 참조 |
| AI 크롤러 허용 | 8 | 8 | `User-agent:*` 가 `/admin`,`/become` 만 차단. GPTBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot 전부 허용 |
| sitemap.xml | 6 | 6 | 200 |
| server-sitemap.xml | 4 | 4 | 200 |
| llms.txt | 6 | 6 | 200, 유효 포맷 |
| llms-full.txt | 3 | 0 | **404 (부재)** |
| SSR(실 HTML) | 20 | 20 | 9개 HTML 페이지 전부 풀 SSR(JSON-LD 포함), CSR 빈 셸 아님 |
| canonical | 6 | 6 | 9개 HTML 전부 `rel=canonical`(자기참조 확인) |
| meta robots noindex 아님 | 6 | 6 | noindex/차단 X-Robots-Tag 없음 |
| viewport | 4 | 4 | `width=device-width, initial-scale=1` 확인 |
| structured data 존재 | 5 | 5 | Course/FAQPage/BreadcrumbList 전 페이지 |
| 보안 헤더 | 8 | 7 | nosniff/SAMEORIGIN/Referrer-Policy/Permissions-Policy O, CSP 부재 −1 |
| 클린 URL | 4 | 4 | 소문자·하이픈·계층(`/track/<slug>`) |
| 10개 페이지 200 | 6 | 6 | 전부 HTTP 200 |
| **합계** | **104 → 100 정규화** | **96 → 92** | |

**5-File 존재표:** robots.txt 200 · sitemap.xml 200 · server-sitemap.xml 200 · llms.txt 200 · **llms-full.txt 404**.

### Schema & Structured Data (87/100)

원본 SSR HTML 직접 파싱. 정규화 94/108 → **87**. 전 페이지 유효 JSON-LD(100% JSON-LD, Microdata/RDFa 없음).

| 페이지 | @types |
|---|---|
| / | EducationalOrganization, WebSite, FAQPage(7 Q&A), ItemList(8 트랙), ImageObject |
| /career | EducationalOrganization(×2), WebSite, ImageObject |
| /track/frontend-advanced | EduOrg(×3), WebSite, Course, **CourseInstance**, Offer, VirtualLocation, FAQPage(11 Q&A), BreadcrumbList |
| /track/{backend-spring,fullstack,ai,data,product-design,it-founder} | EduOrg, WebSite, Course, **CourseInstance**, Offer, VirtualLocation, FAQPage, BreadcrumbList |
| /llms.txt | n/a(text/plain) |

- **이번 회차 개선:** `frontend-advanced` 에 `hasCourseInstance`(`courseMode:"blended"`, `startDate:2026-08-24`, `endDate:2026-10-23`) + `Offer` + `VirtualLocation` 확정 → 7개 트랙 전부 Course 인스턴스 정합(전주 결측 항목 해소).
- 주요 가점: Organization(+sameAs 5 + `parentOrganization`→코드잇), Course(name/description/provider/offers/hasCourseInstance), FAQPage(Question/Answer), BreadcrumbList, WebSite, ItemList.
- 감점(잔존): `sameAs` 에 Wikipedia/Wikidata 없음(엔티티 부재), `SearchAction`·`speakable` 부재, ItemList `/track/frontend` 참조(감사셋 외), `#organization` 로고 불일치(org `codeit-logo.png` vs Course.provider `sprint-logo.png`).

### Platform Optimization (91/100)

10개 고정 URL 의 on-page 신호만. KR 현지화(네이버/구글-KR 가중). 이번 회차 head 태그(`html lang`·OG·Twitter)를 원본 HTML 에서 **객관 확인**함.

| 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|
| 한국어 콘텐츠 | 8 | 8 | 10페이지 전부 한국어 |
| html lang/og:locale | 7 | 6 | `<html lang="ko">` 9개 HTML 전부 확정. `og:locale` 명시 태그는 미검출 −1 |
| AI Overview/Briefing 추출 블록 | 12 | 10 | 직답 FAQ + 정량 stat 블록 |
| FAQ/구조화 Q&A | 12 | 11 | 전 페이지 "자주 묻는 질문"(Question/Answer JSON-LD) |
| FAQPage/Course/Org JSON-LD | 12 | 11 | 전 페이지 유효·SSR |
| 비교/리스트(Perplexity 친화) | 10 | 10 | 트랙 비교·리스트, ItemList 8 트랙 |
| 헤딩 계층 | 8 | 6 | 단일 H1+논리적 H2/H3, 슬로건 H2 일부 |
| 신선도/날짜 | 8 | 7 | 기수일정·CourseInstance startDate/endDate. publish/modified 타임스탬프는 아님 |
| llms.txt 크롤러 피딩 | 6 | 6 | 유효 llms.txt |
| OG/Twitter 카드 | 5 | 5 | `og:title`/`og:description`/`og:image` + `twitter:card`/`title`/`description`/`image` **확정** |
| SSR/크롤 가능 텍스트 | 7 | 7 | 전 페이지 SSR |
| 모바일 viewport | 3 | 3 | `width=device-width` 확정 |
| canonical/hreflang | 2 | 1 | canonical 확정, hreflang 신호 없음 −1 |
| **합계** | **100** | **91** | |

**서피스별:** 네이버 AI Briefing/Perplexity/Google AIO = 강함(비교표·FAQ·SSR·llms.txt·확정 lang/OG). ChatGPT/Gemini/Bing = 중상(스키마·엔티티 보강, off-page 엔티티가 한계).

---

## Discovery (composite 점수 미반영)

규칙상 고정 `brandSources` 외 새로 발견한 소스/커뮤니티는 **점수에 넣지 않고 여기에만 기록**한다.

- **Facebook** `facebook.com/codeit.kr` — 모회사 공식 페이지(Org `sameAs`). 고정 리스트 외.
- **실제 IG 핸들 `@codeit_kr`** — `sameAs` 의 실 핸들(체크리스트의 `@codeit.kr` 와 표기 상이).
- **Sprint 블로그/기타 트랙** — llms.txt 에 `/track/frontend`(프론트엔드 엔지니어 양성 과정)가 `frontend-advanced` 와 별개로 존재. 고정 감사셋 밖.
- **법인정보** `(주) 코드잇`, 사업자등록 `313-86-00797`, 서울 중구 청계천로, 통신판매업 신고 — 이번 회차 **스프린트 감사 페이지 푸터에서 직접 확인**(전주 대비 노출 개선).
- 미확인 KR 커뮤니티(OKKY·블라인드·커리어리·네이버 카페) — 본 회차 WebSearch 미사용으로 점검 안 함.

---

## Quick Wins (This Week)

1. `og:locale=ko_KR` 명시 태그 추가(현재 `html lang=ko` 만 확정) — 플랫폼 신호 마감.
2. `llms-full.txt` 생성 — 현재 404, `llms.txt` 와 함께 풀 본문 제공.
3. `#organization` 로고 불일치 해소(동일 @id 에 단일 로고: org `codeit-logo.png` vs provider `sprint-logo.png`).
4. `WebSite.SearchAction` 추가 + FAQ 답변/코스 요약에 `speakable` 속성 추가.
5. 환불·보증 정책과 성과통계(취업률 71%) 산출 방법론(모집단/연도)을 감사 대상 페이지에 노출(E-E-A-T 신뢰성 잔여 감점 해소).

## 30-Day Action Plan

### Week 1: 엔티티 그라운딩 (최우선)
- [ ] 모회사 **코드잇 Wikidata 아이템 생성**(언어무관 핵심) + 한국어 위키백과 문서화 추진.
- [ ] Wikidata/위키백과 생성 후 Organization `sameAs` 에 추가.

### Week 2: 신뢰성(E-E-A-T) 마감
- [ ] 취업률 71%·완주율 등 핵심 통계의 **산출 방법론·기준(모집단/연도) 명시**.
- [ ] 환불·보증 정책 페이지를 감사 대상 페이지 푸터에서 접근 가능하게 노출(법인 식별정보는 이미 노출됨).

### Week 3: 스키마/플랫폼
- [ ] FAQ 답변·코스 요약에 `speakable` 추가, `WebSite.SearchAction` 추가.
- [ ] `og:locale=ko_KR` 보강, `#organization` 로고 단일화.

### Week 4: 인용가능성
- [ ] 트랙/홈 도입부에 "X는 ~이다" **정의·요약 문장** 추가, 슬로건 H2 를 질문형으로 전환.
- [ ] llms.txt 에 헤드라인 통계 스냅샷(취업률/완주율 수치) 인라인 추가.

---

## Appendix: Pages Analyzed (고정 auditUrls)

| # | URL | HTTP | SSR | 비고 |
|---|---|---|---|---|
| 1 | https://sprint.codeit.kr/ | 200 | Y | Org/WebSite/FAQPage(7)/ItemList(8) |
| 2 | https://sprint.codeit.kr/career | 200 | Y | Org/WebSite, 법인정보 푸터 노출 |
| 3 | https://sprint.codeit.kr/track/frontend-advanced | 200 | Y | Course(+CourseInstance/Offer) — 결측 해소 |
| 4 | https://sprint.codeit.kr/track/backend-spring | 200 | Y | Course(+CourseInstance) |
| 5 | https://sprint.codeit.kr/track/fullstack | 200 | Y | Course(+CourseInstance) |
| 6 | https://sprint.codeit.kr/track/ai | 200 | Y | Course(+CourseInstance) |
| 7 | https://sprint.codeit.kr/track/data | 200 | Y | Course(+CourseInstance) |
| 8 | https://sprint.codeit.kr/track/product-design | 200 | Y | Course(+CourseInstance) |
| 9 | https://sprint.codeit.kr/track/it-founder | 200 | Y | Course(+CourseInstance) |
| 10 | https://sprint.codeit.kr/llms.txt | 200 | n/a | 유효 llms.txt(text/plain) |

**Technical signal files:** robots.txt 200 · sitemap.xml 200 · server-sitemap.xml 200 · llms.txt 200 · llms-full.txt **404**.
