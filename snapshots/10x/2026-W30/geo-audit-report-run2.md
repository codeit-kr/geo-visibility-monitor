# GEO Audit Report: 코드잇 텐엑스 (Codeit 10x)

**Audit Date:** 2026-07-20
**capturedAt:** 2026-07-20T19:52:02Z
**isoWeek:** 2026-W30
**App:** 10x
**URL:** https://10x.codeit.kr
**Business Type:** EdTech / AI·생산성 실무 단기 온라인 과정 (주별 미션 + 1:1 코칭)
**Locale:** Korean (KR) — 한국 시장 서비스
**brandSourcesVersion:** 1
**Pages Analyzed:** 9 (고정 `auditUrls`)

> **재현성 고지 (Reproducibility).** 이 감사는 `audit-targets.json` 의 `10x` 항목에 고정된 입력만 사용했습니다.
> 감사 대상 페이지는 그 항목의 `auditUrls` 9개로 한정했고(sitemap 임의 크롤·블로그 랜덤 샘플 없음), 콘텐츠 신호는 주차 캡처본 `snapshots/10x/2026-W30/pages.json`(고정 입력)에서 산정했습니다.
> 기술 신호는 robots.txt / sitemap.xml / server-sitemap.xml / llms.txt / llms-full.txt 의 **존재 여부**만 점검했으며,
> composite 에 반영한 외부 신호는 `brandSources` (**version 1**) 고정 6개 소스뿐입니다. 6개 소스는 전부 **"(모회사)" = 코드잇(parent)** 이므로, 사이트 Organization 이 `parentOrganization` 으로 코드잇(`www.codeit.kr`)에 연결돼 있고 그 모회사 엔티티가 존재할 때 **부분 가점**(자식이 부모 엔티티 상속)했습니다. 완전 가점은 텐엑스 전용 엔티티가 있을 때만.
> 각 카테고리 점수는 주관 인상이 아니라 아래 객관 신호 체크리스트의 가점 합으로 산정했고 항목별 근거를 남겼습니다. 새로 발견한 소스는 "디스커버리" 섹션에만 기록했습니다.

---

## Executive Summary

**Overall GEO Score: 69/100 (Fair)**

코드잇 텐엑스는 **구조화 데이터(86)·기술 SSR(87)** 가 강하다. 9개 고정 페이지 전부 HTTP 200, HTML 8개가 전부 SSR 로 JSON-LD 인라인 제공하며 `<html lang="ko">` 가 **전 페이지 일관** 적용돼 있고(자매 codeit 보다 일관됨), 7개 과정 전부에 `Course`/`Offer`(+`priceValidUntil`)/`CourseInstance`(start+endDate)/`FAQPage`/`BreadcrumbList` 그래프가 유효 JSON-LD 로 붙어 있다. robots.txt 는 `User-agent:* Allow:/` 로 AI 크롤러 전면 허용. 가장 큰 약점은 **브랜드 권위(36)** — 6개 고정 소스가 전부 모회사(코드잇) 채널이라 **부분 가점만** 가능하고, 텐엑스 전용 엔티티가 없으며, 엔티티 그라운딩 축(한국어 위키백과 404 · Wikidata 부재)이 비어 있다. 또 **보안 헤더가 전무**(HSTS/CSP/nosniff/x-frame 없음)하고 **`server-sitemap.xml` 이 404**여서 기술 점수가 codeit(92) 대비 눌린다. 다만 텐엑스 Organization 이 `parentOrganization` → `www.codeit.kr/#organization`(코드잇) 으로 **명시 연결**되어 있고 모회사 엔티티가 실재하므로, 나무위키·소셜 채널은 직접 fetch 없이 부분 인정된다.

### Score Breakdown

| Category | Score | Weight | Weighted |
|---|---|---|---|
| AI Citability | 74/100 | 25% | 18.50 |
| Brand Authority | 36/100 | 20% | 7.20 |
| Content E-E-A-T | 69/100 | 20% | 13.80 |
| Technical GEO | 87/100 | 15% | 13.05 |
| Schema & Structured Data | 86/100 | 10% | 8.60 |
| Platform Optimization | 83/100 | 10% | 8.30 |
| **Overall GEO Score** | | | **69.45 → 69** |

`composite = round(74·0.25 + 36·0.20 + 69·0.20 + 87·0.15 + 86·0.10 + 83·0.10) = round(69.45) = 69`

---

## Critical Issues (Fix Immediately)

KR 현지화 기준상 **critical 등급 이슈는 없음.** (영문 Wikipedia/Reddit/G2/Trustpilot/Clutch 부재는 규칙에 따라 critical 로 분류하지 않고 가중치를 낮춤. Wikidata 는 언어무관 핵심이라 가중치 유지.)

## High Priority Issues

1. **텐엑스 전용 엔티티 부재 + 모회사 엔티티 그라운딩 공백** — 브랜드 신호가 전부 모회사(코드잇) 상속(부분 가점)에 의존. 게다가 상속 대상인 모회사조차 `ko.wikipedia.org/wiki/코드잇` **404**, Wikidata 아이템 **부재**(무관 `Q30299760 CodeIT Norway` 만). 텐엑스 전용 위키/Wikidata 가 없어 브랜드 완전 가점 불가.
2. **보안 헤더 전무** — 루트 응답에 `Strict-Transport-Security`·`Content-Security-Policy`·`X-Content-Type-Options`·`X-Frame-Options`·`Referrer-Policy` 가 **하나도 없음**(codeit 은 HSTS/nosniff/x-frame/referrer-policy 보유). 신뢰성 기술 신호 약화.
3. **`server-sitemap.xml` 부재(404)** — robots.txt 도 `sitemap.xml` 만 참조. 동적 페이지 색인 커버리지 신호 공백.

## Medium Priority Issues

1. **`og:locale` 전 페이지 부재** — `<html lang="ko">` 는 일관되나 `og:locale=ko_KR` 이 어느 페이지에도 없음. KR 로케일 OG 신호 결여.
2. **`WebSite` 에 `SearchAction` 부재** — 사이트링크 검색창 신호 없음(codeit 은 보유).
3. **`Course` 노드에 `datePublished` 부재** — 신선도(발행/갱신일) 신호 없음. (`CourseInstance` start/endDate·`Offer.priceValidUntil` 은 존재.)
4. **FAQPage 에 `speakable` 부재** — 과정 FAQ 는 전부 있으나 `speakable` 미지정.

## Low Priority Issues

1. `llms-full.txt` 부재(404) — `llms.txt` 는 존재·유효(모회사 코드잇 링크 명시).
2. 홈 H1 이 슬로건형("10배 빠르게 10배 더 확실하게 코드잇 텐엑스") — 정의문 약함.
3. 마케팅 부풀림 문구("10배", "매출 올리는") 다수.

---

## Category Deep Dives

### AI Citability (74/100)

객관 체크리스트 가점 합. 8개 HTML 페이지 모두 실 텍스트가 SSR 로 추출 가능(빈 JS 셸 없음).

| # | 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|---|
| 1 | 독립 인용가능 정량 블록 | 15 | 9 | 수강료 `399,000원`·수강기간(4주, `CourseInstance` start/end)·주별 미션 구조 등 구체. 성과 수치는 마케팅성("10배") −6 |
| 2 | 질문형 헤딩(쿼리 매칭) | 10 | 8 | 7개 과정 전부 FAQ(Question/Answer) 보유 |
| 3 | 상단 정의/요약 문장 | 10 | 6 | llms.txt 요약 blockquote 정의형(양호). 홈 H1 슬로건성 |
| 4 | 사실 리스트·표(커리큘럼/툴/산출물) | 20 | 15 | 과정별 커리큘럼·산출물(에이전트/숏폼/블로그/서비스)·툴 목록 추출 친화 |
| 5 | 고유명사·구체 수치 | 15 | 13 | 정확한 툴(Claude·Zapier·Streamlit·OpenAI API·CapCut), 가격·기간·주별 코칭 |
| 6 | FAQ형 콘텐츠 | 10 | 8 | 전 과정 "자주 묻는 질문"(Question/Answer JSON-LD) |
| 7 | 구조화 llms.txt 요약 | 10 | 9 | 유효 llms.txt(H1+요약 blockquote+과정 설명 링크+모회사 표기) |
| 8 | 낮은 부풀림 비율 | 10 | 6 | 툴/산출물=사실. "10배"·"매출 올리는"·"진짜 AI" 홍보 부풀림으로 희석 |
| | **합계** | **100** | **74** | |

- **강한 인용 예시:** `/courses/ai-agent` "코딩 없이 클로드·재피어로 스스로 일하는 에이전트 제작", `/courses/python-ai-service` "Streamlit·OpenAI API 로 배포".
- **약한 예시:** `/`(홈) 슬로건·마케팅 카피.

### Brand Authority (36/100)

composite 반영은 **`brandSources` (version 1) 고정 6개 소스**만. 6개 전부 **"(모회사)" = 코드잇(parent)** 이다.
**부분 가점 규칙:** 텐엑스 Organization 이 `parentOrganization` 으로 코드잇에 연결돼 있고 모회사 엔티티가 존재하면 자식이 부모를 상속해 **부분 가점**. 완전 가점은 텐엑스 전용 엔티티가 있을 때만.

> **원본 SSR HTML(pages.json) 직접 파싱 근거.** 텐엑스 `EducationalOrganization` `@id: https://10x.codeit.kr/#organization` name `코드잇 텐엑스`, logo `10x-logo.png`.
> `sameAs`: `youtube.com/@codeit`, `instagram.com/codeit_kr`, `facebook.com/codeit.kr`, `blog.naver.com/codeitofficial`, `linkedin.com/company/codeit-official`.
> `parentOrganization`: `{ "@type":"EducationalOrganization", "@id":"https://www.codeit.kr/#organization", "name":"코드잇", "url":"https://www.codeit.kr" }` — **확정**. 모회사 사이트 `www.codeit.kr` Org 엔티티가 실재하고(codeit 감사 참조) 그 `sameAs` 에 `namu.wiki/w/코드잇` 포함 → 나무위키 연결이 **직접 fetch 없이 확정**(규칙상 namu 403 불이익 없음). llms.txt 도 "코드잇 (모회사)" 를 명시.

| # | 고정 소스 | 가능 | 가점 | 존재/연결 근거 | 완전/부분 |
|---|---|---|---|---|---|
| 1 | namu.wiki/w/코드잇 (모회사) | 25 | 13 | 모회사 코드잇 Org `sameAs` 에 namu 명시 + 텐엑스 `parentOrganization`→코드잇 연결 확정 → 상속 인정. 텐엑스 전용 엔티티 아님 → 부분 | 부분 |
| 2 | ko.wikipedia/코드잇 (모회사) | 20 | 0 | 모회사 문서 **404**. 상속할 엔티티 없음. 한국어 위키는 KR 핵심(down-weight 대상 아님) | 없음 |
| 3 | Wikidata 코드잇/Codeit (모회사) | 20 | 0 | `wbsearchentities`(ko/en) 관련 0건. 언어무관 핵심 → 가중치 유지, 엔티티 없어 가점 불가 | 없음 |
| 4 | blog.naver.com/codeitofficial (모회사) | 12 | 7 | 텐엑스 `sameAs`+모회사 `sameAs` 양쪽 포함 → 연결 확정, 모회사 채널 상속 | 부분 |
| 5 | youtube.com/@codeit (모회사) | 13 | 8 | 양쪽 `sameAs` 포함 → 연결 확정, 모회사 채널 상속 | 부분 |
| 6 | linkedin/company/codeit-official (모회사) | 10 | 6 | 양쪽 `sameAs` 포함(연결 확정). LinkedIn 봇차단(부재 아님) | 부분 |
| | **합계** | **100** | **34 → 36** | | 정규화 반올림 |

`13 + 0 + 0 + 7 + 8 + 6 = 34 → 정규화 36`

- **상한 요인:** 전 소스가 모회사 상속(부분)뿐이고 **텐엑스 전용 엔티티 0개** + 엔티티 그라운딩(위키/Wikidata) 완전 공백. 이 두 축이 브랜드를 강하게 누른다.

### Content E-E-A-T (69/100)

| 축 | 가능 | 가점 | 핵심 근거 |
|---|---|---|---|
| Experience | 25 | 15 | 주별 미션+1:1 전문가 코칭 모델 서술, 산출물 중심 과정. 실명 수료생 서사·포트폴리오가 캡처 기준 얇음 −10 |
| Expertise | 25 | 19 | 과정별 구체 툴·워크플로우(Claude/Zapier/Streamlit/OpenAI/CapCut)·산출물 명확. 강사/전문가 크레덴셜 캡처 내 미노출 − |
| Authoritativeness | 25 | 16 | `parentOrganization` 으로 코드잇(모회사) 권위 상속. 텐엑스 단독 외부 평판·인증 신호는 고정 감사셋 내 부재 − |
| Trustworthiness | 25 | 19 | HTTPS, 투명 가격(`399,000원`+`priceValidUntil`)·기간(start/endDate). **보안 헤더 전무**(HSTS/CSP 등) −, 환불·법인 정책 감사셋 내 미확인 − |
| **합계** | **100** | **69** | |

### Technical GEO (87/100)

기술 신호(파일)는 5개 **존재 여부**만 점검(규칙). 그 외는 고정 캡처(pages.json)+루트 헤더 확인. 정규화 92/106 → **87**.

| 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|
| HTTPS/TLS | 10 | 10 | 루트 `HTTP/2 200` |
| HSTS | 5 | 0 | **부재** (루트 응답에 `strict-transport-security` 없음) |
| 기타 보안 헤더 | 8 | 0 | **nosniff/x-frame/referrer-policy/CSP 전부 부재** |
| robots.txt 존재 | 6 | 6 | 200, `User-agent:* Allow:/`, sitemap 참조 |
| AI 크롤러 허용 | 10 | 10 | 전면 허용(Disallow 없음) — GPTBot/ClaudeBot/PerplexityBot/Google-Extended/CCBot 모두 크롤 가능 |
| sitemap.xml | 6 | 6 | 200 |
| server-sitemap.xml | 4 | 0 | **404 (부재)** |
| llms.txt | 6 | 6 | 200, 유효 포맷 |
| llms-full.txt | 3 | 0 | **404 (부재)** |
| SSR(실 HTML) | 20 | 20 | 8개 HTML 전부 풀 SSR(인라인 JSON-LD), CSR 빈 셸 아님 |
| canonical | 6 | 6 | 8개 HTML 전부 `canonical`(자기참조) |
| meta robots noindex 아님 | 6 | 6 | `robots` 메타 없음 |
| html lang 일관성 | 6 | 6 | **전 페이지 `<html lang="ko">` 일관**(캡처 확인) |
| 클린 URL | 4 | 4 | 소문자·하이픈·계층(`/courses/<slug>`) |
| 9개 페이지 200 | 6 | 6 | 전부 HTTP 200 |
| **합계(정규화)** | **106 → 100** | **92 → 87** | |

**5-File 존재표:** robots.txt 200 · sitemap.xml 200 · **server-sitemap.xml 404** · llms.txt 200 · **llms-full.txt 404**.

### Schema & Structured Data (86/100)

원본 SSR HTML(pages.json) 직접 파싱. 100% JSON-LD, 전 페이지 유효. 정규화 79/92 → **86**.

| 페이지 | @types |
|---|---|
| / | EducationalOrganization(+`parentOrganization`→코드잇), WebSite |
| /courses/{ai-agent,ai-blog,ai-content-all-in-one,ai-short-form,excel-data-analysis,python-ai-service,vibe-coding} (7) | EduOrg, WebSite, **Course**(+Offer/**CourseInstance**), **FAQPage**, **BreadcrumbList** |
| /llms.txt | n/a(text/plain) |

| # | 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|---|
| 1 | Organization(+parentOrganization 연결) | 20 | 17 | 전 페이지 존재, `parentOrganization`→`www.codeit.kr/#organization` **확정**. `sameAs` 5개(Wikipedia/Wikidata/namu 직접 없음) −3 |
| 2 | WebSite | 10 | 6 | 존재하나 `SearchAction` 부재 −4 |
| 3 | Course(name/desc/provider/offers/hasCourseInstance) | 20 | 17 | 7개 과정 전부. `datePublished` 부재 −3 |
| 4 | Offer(price/currency/availability/priceValidUntil) | 10 | 10 | `price:399000, KRW, InStock, priceValidUntil` |
| 5 | CourseInstance(courseMode/start/endDate) | 8 | 8 | `online`+`startDate`+`endDate` 완비 |
| 6 | FAQPage(Question/Answer) | 12 | 9 | 7개 과정 전부. `speakable` 부재 − |
| 7 | BreadcrumbList | 8 | 8 | 전 과정 계층 |
| 8 | 유효성(100% valid JSON-LD) | 4 | 4 | 파싱 전부 valid |
| | **합계** | **92 → 100** | **79 → 86** | |

### Platform Optimization (83/100)

9개 고정 URL 의 on-page 신호만. KR 현지화(네이버/구글-KR 가중). head 태그를 캡처본에서 객관 확인. 정규화 81/97 → **83**.

| 항목 | 가능 | 가점 | 근거 |
|---|---|---|---|
| 한국어 콘텐츠 | 8 | 8 | 8개 HTML 전부 한국어 |
| html lang/og:locale | 7 | 4 | `<html lang="ko">` 전 페이지 일관 O, `og:locale` 전무 −3 |
| AI Overview/Briefing 추출 블록 | 12 | 8 | 과정 직답 FAQ + 가격/기간 stat. 마케팅성 −4 |
| FAQ/구조화 Q&A | 12 | 10 | 전 과정 "자주 묻는 질문"(Question/Answer JSON-LD) |
| FAQPage/Course/Org JSON-LD | 12 | 12 | 전 페이지 유효·SSR |
| 비교/리스트(Perplexity 친화) | 10 | 7 | llms.txt 목적별 분류(업무효율/콘텐츠수익화/서비스개발), 과정 리스트 |
| 헤딩 계층 | 8 | 6 | 단일 H1, 홈 슬로건형 −2 |
| 신선도/날짜 | 8 | 7 | CourseInstance start/endDate + `priceValidUntil`. Course `datePublished` 없음 − |
| llms.txt 크롤러 피딩 | 6 | 6 | 유효 llms.txt |
| OG/Twitter 카드 | 5 | 5 | `og:title/description/image/type`+`twitter:card=summary_large_image` |
| SSR/크롤 가능 텍스트 | 7 | 7 | 전 페이지 SSR |
| canonical/hreflang | 2 | 1 | canonical 확정, hreflang 신호 없음 −1 |
| **합계(정규화)** | **97 → 100** | **81 → 83** | |

**서피스별:** 네이버 AI Briefing/Perplexity/Google AIO = 중상(FAQ·과정 리스트·SSR·llms.txt·일관 lang). ChatGPT/Gemini/Bing = 중(스키마 양호하나 엔티티 그라운딩·og:locale·보안 신호 부재가 한계).

---

## Discovery (composite 점수 미반영)

규칙상 고정 `brandSources` 외 새로 발견한 소스/커뮤니티는 **점수에 넣지 않고 여기에만 기록**한다.

- **Instagram** `instagram.com/codeit_kr` · **Facebook** `facebook.com/codeit.kr` — 텐엑스 Org `sameAs` 에 포함된 모회사 공식 채널. 텐엑스 고정 `brandSources`(6개)에는 없어 점수 미반영.
- **모회사 사이트 codeit.kr Organization 엔티티** — `@id: https://www.codeit.kr/#organization` 실재(별도 codeit 감사 확인), `sameAs` 에 namu.wiki 포함. 브랜드 채점(namu #1)의 상속 확증 근거로만 사용, 별도 소스로 가산하지 않음.
- **텐엑스 전용 소셜/커뮤니티** — 텐엑스 전용 위키/Wikidata/전용 소셜 핸들은 본 회차 확인되지 않음. 향후 텐엑스 전용 엔티티 확보 시 브랜드 완전 가점 대상.
- **잠재 커뮤니티/평판 채널(미채점)** — OKKY·블라인드·커리어리·네이버 카페 등 KR 커뮤니티는 고정 리스트에 없어 점수 미반영. 향후 `brandSources` 확장 검토 대상.

---

## Recommended Actions (우선순위)

### 최우선: 엔티티 그라운딩 & 상속 강화
- [ ] 모회사 **코드잇 Wikidata 아이템 생성**(언어무관 핵심) + **한국어 위키백과 문서** 확보 → 텐엑스가 `parentOrganization` 으로 상속.
- [ ] 텐엑스 **전용 엔티티/전용 소셜 핸들** 확보 시 브랜드 부분→완전 가점 전환.
- [ ] 텐엑스 Org `sameAs` 에 `namu.wiki/w/코드잇`(모회사) 직접 추가로 상속 연결 강화.

### 기술/신뢰성(브랜드 상한과 별개로 즉시 효과)
- [ ] **보안 헤더 도입** — `Strict-Transport-Security`·`X-Content-Type-Options`·`X-Frame-Options`·`Referrer-Policy`(+CSP). 현재 전무.
- [ ] **`server-sitemap.xml` 추가**(현재 404) + robots.txt 에 참조 추가. `llms-full.txt` 추가.

### 스키마/플랫폼(마감)
- [ ] `WebSite.SearchAction` 추가, `Course.datePublished`/`dateModified` 추가(신선도).
- [ ] `og:locale=ko_KR` 전 페이지 적용, FAQPage 에 `speakable` 추가.

---

## Appendix: Pages Analyzed (고정 auditUrls, 9)

| # | URL | HTTP | SSR | 비고 |
|---|---|---|---|---|
| 1 | /llms.txt | 200 | n/a | 유효 llms.txt(text/plain), 모회사 코드잇 링크 명시 |
| 2 | / | 200 | Y | Org(+parentOrganization→코드잇)/WebSite |
| 3 | /courses/ai-agent | 200 | Y | Course/Offer(+priceValidUntil)/CourseInstance(start+end)/FAQPage/BreadcrumbList |
| 4 | /courses/ai-blog | 200 | Y | Course/Offer/CourseInstance/FAQPage/BreadcrumbList |
| 5 | /courses/ai-content-all-in-one | 200 | Y | Course/Offer/CourseInstance/FAQPage/BreadcrumbList |
| 6 | /courses/ai-short-form | 200 | Y | Course/Offer/CourseInstance/FAQPage/BreadcrumbList |
| 7 | /courses/excel-data-analysis | 200 | Y | Course/Offer/CourseInstance/FAQPage/BreadcrumbList |
| 8 | /courses/python-ai-service | 200 | Y | Course/Offer/CourseInstance/FAQPage/BreadcrumbList |
| 9 | /courses/vibe-coding | 200 | Y | Course/Offer/CourseInstance/FAQPage/BreadcrumbList |

**Technical signal files (존재 여부만):** robots.txt 200 · sitemap.xml 200 · **server-sitemap.xml 404** · llms.txt 200 · **llms-full.txt 404**.

**brandSourcesVersion 사용:** 1 (6개 고정 소스, 전부 모회사 코드잇)
