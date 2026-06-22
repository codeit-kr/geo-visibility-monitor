# GEO Audit Report: 코드잇 스프린트 (Codeit Sprint)

**Audit Date:** 2026-06-22
**capturedAt:** 2026-06-22T16:21:46Z
**isoWeek:** 2026-W26
**App:** sprint
**URL:** https://sprint.codeit.kr
**Business Type:** EdTech / 코딩 부트캠프 (국비지원 KDT)
**Locale:** Korean (KR) — 한국 시장 서비스
**brandSourcesVersion:** 1

> **재현성 고지 (Reproducibility).** 이 감사는 `audit-targets.json` 의 `sprint` 항목에 고정된 입력만 사용했습니다.
> 감사 대상 페이지는 그 항목의 `auditUrls` 10개로 한정했고(sitemap 임의 크롤·블로그 랜덤 샘플 없음),
> 기술 신호는 robots.txt / sitemap.xml / server-sitemap.xml / llms.txt / llms-full.txt 의 **존재 여부**만 점검했으며,
> composite 에 반영한 외부 신호는 `brandSources` (version 1) 고정 체크리스트 8개뿐입니다.
> 각 카테고리 점수는 주관 인상이 아니라 아래 **객관 신호 체크리스트의 가점 합**으로 산정했습니다 (동일 입력 = 동일 점수).

---

## Executive Summary

**Overall GEO Score: 62/100 (Fair)**

코드잇 스프린트는 우수한 기술적 기반(robots/sitemap/llms.txt 완비, Next.js SSR, 보안 헤더)과 강력한 구조화 데이터(전 트랙 Course·FAQPage·BreadcrumbList)를 갖추고 있습니다. 특히 풍부한 FAQ 코퍼스와 — 이전 감사 대비 개선된 — **통계 출처 표기(취업률 "2025년 고용24 기준", 만족도 "내부 기준·수강생 2,598명 대상")**, 푸터 사업자 정보(주소·통신판매업)는 AI 인용 가능성과 신뢰 신호를 끌어올립니다. 반면 **엔티티 그라운딩이 객관적으로 취약**합니다: 한국어 위키백과(404 확인), Wikidata 엔티티(부재 확인), 나무위키(접근 차단·미연결) 모두 composite 가점이 없습니다. Course 스키마의 `aggregateRating`·`instructor` 누락, /career 전용 스키마 부재, llms-full.txt 부재(404)가 다음 우선 과제입니다.

### Score Breakdown

| Category | Score | Weight | Weighted |
|---|---|---|---|
| AI Citability | 68/100 | 25% | 17.00 |
| Brand Authority | 38/100 | 20% | 7.60 |
| Content E-E-A-T | 65/100 | 20% | 13.00 |
| Technical GEO | 85/100 | 15% | 12.75 |
| Schema & Structured Data | 66/100 | 10% | 6.60 |
| Platform Optimization | 54/100 | 10% | 5.40 |
| **Overall GEO Score** | | | **62.35 → 62** |

`composite = round(citability·0.25 + brand·0.20 + eeat·0.20 + technical·0.15 + schema·0.10 + platform·0.10)`

---

## 점검한 고정 입력 (Fixed Inputs)

### auditUrls (10) — HTTP 상태

| # | URL | HTTP | 비고 |
|---|---|---|---|
| 1 | https://sprint.codeit.kr/ | 200 | 홈 198KB SSR / EduOrg·WebSite·FAQPage(7)·ItemList(8) |
| 2 | https://sprint.codeit.kr/career | 200 | 177KB / 전용 스키마 없음(EduOrg·WebSite만) |
| 3 | https://sprint.codeit.kr/track/frontend-advanced | 200 | Course(hasCourseInstance 없음)·FAQ(8)·Breadcrumb |
| 4 | https://sprint.codeit.kr/track/backend-spring | 200 | Course·CourseInstance·FAQ(9)·Breadcrumb |
| 5 | https://sprint.codeit.kr/track/fullstack | 200 | Course·CourseInstance·FAQ(13)·Breadcrumb |
| 6 | https://sprint.codeit.kr/track/ai | 200 | Course·CourseInstance·FAQ(12)·Breadcrumb |
| 7 | https://sprint.codeit.kr/track/data | 200 | Course·CourseInstance·FAQ(11)·Breadcrumb |
| 8 | https://sprint.codeit.kr/track/product-design | 200 | Course·CourseInstance·FAQ(9)·Breadcrumb |
| 9 | https://sprint.codeit.kr/track/it-founder | 200 | Course·CourseInstance·FAQ(11)·Breadcrumb |
| 10 | https://sprint.codeit.kr/llms.txt | 200 | 정상 well-formed (아래 기술 신호 참조) |

### 기술 신호 — 존재 여부만 점검 (5)

| 신호 | 존재 | 근거 |
|---|---|---|
| robots.txt | ✅ 200 | `User-agent: *` / `Disallow: /admin`, `/become` 만. 2개 Sitemap·Host 선언. AI 크롤러 차단 없음(전면 허용). |
| sitemap.xml | ✅ 200 | 2 URL (`/`, `/career`), `lastmod`+`priority 0.7` |
| server-sitemap.xml | ✅ 200 | 8 트랙 URL, `lastmod` 有 / `priority` 無 |
| llms.txt | ✅ 200 | H1 제목 + blockquote 설명 + H2 섹션(부트캠프 트랙·취업 지원·회사) + 마크다운 링크. 8 트랙+career+모회사 수록. `## Optional` 섹션 없음. |
| llms-full.txt | ❌ 404 | **HTTP 404** — 응답 바디는 SPA 앱셸 HTML(`<title>404: This page could not be found.</title>`). 실제 파일 부재(soft-200 아님, 확정 404). |

---

## Critical Issues (즉시)

**없음.** AI 크롤러 전면 차단·noindex·5xx·구조화 데이터 전무 등 critical 트리거 해당 사항 없음.
KR 현지화 원칙에 따라 영문 Wikipedia·Reddit·G2·Trustpilot·Clutch 부재는 critical 로 분류하지 않습니다(가중치 하향, 아래 Brand 참조). Wikidata 부재는 언어무관 핵심이라 가중치를 유지하되 critical 은 아닙니다.

## High Priority

1. **엔티티 그라운딩 부재** — ko.wikipedia/코드잇(404 확인), Wikidata 엔티티(부재 확인), 나무위키(미연결). 한국 AI 인용 신뢰도의 핵심 공백.
2. **Course 스키마 `aggregateRating`·`instructor` 누락** — 전 트랙 공통. 별점 리치결과·강사 엔티티 연결 불가.
3. **/career 전용 스키마 부재** — 핵심 차별점 페이지인데 `Service`/`EducationalOccupationalProgram`/`FAQPage` 없음.

## Medium Priority

4. **llms-full.txt 부재(404)** — 전체 본문 컨텍스트 제공 표준 미충족.
5. **CSP 헤더 부재** — 그 외 HSTS·X-Frame·X-Content-Type·Referrer·Permissions 는 present.
6. **본문 인용형 prose 부족** — 정량 사실 다수가 FAQ/그래픽에 갇혀 있고, 자기완결 문단 형태가 적음.
7. **hreflang 부재** — `hreflang="ko"`/`x-default` 없음.

## Low Priority

8. `twitter:card=summary` (→ `summary_large_image` 권장).
9. robots.txt `Content-Signal:` 디렉티브 부재 / AI 크롤러 명시 `Allow` 없음(현재 기본 허용).
10. frontend-advanced 트랙만 `hasCourseInstance` 누락.

---

## Category Deep Dives — 객관 체크리스트 근거

### AI Citability — 68/100

| # | 체크 항목 | Max | 획득 | 근거 |
|---|---|---|---|---|
| 1 | 홈 FAQPage 자기완결 Q&A | 10 | 10 | 7개 Q&A, `acceptedAnswer.text` 구체(출석률 80%·HRD-Net·훈련장려금) |
| 2 | 트랙 FAQ Q&A (≥6 페이지) | 10 | 10 | 8개 트랙 전부 9~13 Q&A |
| 3 | 답변 구체성(수치·절차·기간) | 12 | 10 | "월~금 9~19시, 주 45시간", "ZEP QR 출석", 정부지원 금액 명시 |
| 4 | 통계 밀도(정량 주장 ≥4) | 10 | 8 | 취업률·수료율·만족도·수강생 2,598명·정부지원 22,087,500원 등 |
| 5 | 통계 출처 표기 | 10 | 7 | "2025년 고용24 기준"(취업률), "내부 기준·수강생 2,598명 대상"(만족도) — `기준 보기 ⓘ` 툴팁 |
| 6 | FAQ 외 본문 자기완결 prose | 14 | 4 | 히어로/밸류 문구가 슬로건 위주("압도적 만족도") — 인용 부적합 |
| 7 | 헤딩 위계·스캔 가능 구조 | 12 | 6 | SSR 본문은 풍부하나 헤딩이 스타일 컴포넌트로 처리됨 |
| 8 | 비교·고유 주장 + 근거 | 8 | 5 | "온라인 부트캠프 만족도 1위" + 기준 툴팁 |
| 9 | llms.txt 구조 요약(추출 보조) | 8 | 5 | well-formed 요약 제공(단 full-text 부재) |
| 10 | 페이지 내 정의형 자기완결 인트로 | 6 | 3 | 정의는 llms.txt 에만 명확, 페이지는 슬로건 중심 |
| | **합계** | **100** | **68** | |

**Top 인용 후보:** 홈 FAQ "수료 후 취업 지원", "훈련장려금 지급(출석률 80%·HRD-Net)", data 트랙 실시간 수업/출석 인증 절차.
**약점:** FAQ를 벗어난 본문 prose 가 마케팅 슬로건 위주라 자기완결 인용 단위가 적음.

### Brand Authority — 38/100  *(KR 현지화 가중 · brandSources v1 고정 8개만 반영)*

> KR 원칙: 영문 위키·Reddit·G2·Trustpilot·Clutch 부재는 critical 아님·가중치 하향. **Wikidata 는 언어무관 핵심이라 가중치 유지.** composite 외 신호는 디스커버리에만 기록.

| # | brandSource (v1) | 가중 | 획득 | 판정 / 근거 |
|---|---|---|---|---|
| 1 | namu.wiki/코드잇 | 18 | 0 | ⚠ 검증불가 — curl/WebFetch **HTTP 403**(봇 차단). 사이트 `sameAs` 미연결. 확정 존재 신호 없음 → 미가점 |
| 2 | ko.wikipedia/코드잇 | 18 | 0 | ❌ 부재 확정 — **HTTP 404**("없는 문서") |
| 3 | Wikidata 코드잇/Codeit 엔티티 | 16 | 0 | ❌ 부재 확정 — `wbsearchentities` ko/en 결과 없음(유일 'CodeIT'=노르웨이 Q30299760, 무관) |
| 4 | blog.naver/codeitofficial | 12 | 12 | ✅ 존재(HTTP 200) + 사이트 `sameAs` 연결 |
| 5 | youtube/@codeit | 12 | 12 | ✅ 존재(HTTP 200, 739KB) + `sameAs` 연결 |
| 6 | Instagram @codeit.kr / @codeit_sprint | 8 | 6 | ~부분 — 로그인 월. 사이트는 `@codeit_kr`(변형 핸들) 연결. 지정 `@codeit.kr`/`@codeit_sprint` 미확인 |
| 7 | linkedin/codeit-official | 8 | 8 | ✅ 존재(HTTP 200, 307KB) + `sameAs` 연결 |
| 8 | 잡플래닛 코드잇 기업 페이지 | 8 | 0 | ⚠ 검증불가 — **HTTP 403**(봇 차단). `sameAs` 미연결 → 미가점 |
| | **합계** | **100** | **38** | |

**해석:** 소셜 인프라(YouTube·LinkedIn·Naver 블로그)는 사이트 `sameAs` 로 명확히 연결되어 견고. 그러나 **최고 가중의 엔티티 그라운딩 3종(나무위키·ko.위키백과·Wikidata)이 모두 가점 0** 이라 점수를 크게 끌어내립니다. namu.wiki·잡플래닛은 봇 차단으로 "부재 확정"이 아니라 "검증 불가"이며, 재현성·객관성 원칙상 미확인은 미가점 처리했습니다(존재 확인 시 +18/+8 상향 여지).

### Content E-E-A-T — 65/100

| 차원 | Max | 획득 | 근거 |
|---|---|---|---|
| Experience | 25 | 15 | 수강생 성과·실무 프로젝트(라인·당근·카카오 등 실기업 데이터) 언급. 단 졸업생 실명·기수·프로필 링크 등 검증 메타 부족 |
| Expertise | 25 | 17 | 강사 이력 공개(고려대·연세대, 전 카카오/네이버/토스/KT/LG). 단 `Person` 스키마·개별 강사 프로필 페이지 없음 |
| Authoritativeness | 25 | 17 | **통계 출처 표기 개선**(취업률 "고용24 기준", 만족도 "내부 기준 n=2,598"), `parentOrganization`(코드잇), 채용 기업명 인용 |
| Trustworthiness | 25 | 16 | HTTPS·canonical·**푸터 NAP**(주소 "서울특별시 중구 청계천로 100 시그니쳐타워"·통신판매업)·약관/개인정보. 단 고객센터 전화·리뷰 집계·aggregateRating 부재 |
| | **100** | **65** | |

### Technical GEO — 85/100

| # | 체크 항목 | Max | 획득 | 근거 |
|---|---|---|---|---|
| 1 | robots.txt 존재·AI 전면 허용 | 20 | 20 | 200 / `/admin`·`/become` 만 차단 / AI 크롤러 차단 없음 |
| 2 | sitemap.xml 존재 | 12 | 12 | 200 / 2 URL + lastmod + priority |
| 3 | server-sitemap.xml 존재 | 13 | 13 | 200 / 8 트랙 URL |
| 4 | llms.txt 존재·well-formed | 20 | 20 | 200 / H1·blockquote·H2·링크 구조 |
| 5 | llms-full.txt 존재 | 15 | 0 | ❌ HTTP 404 |
| 6 | HTTPS + HSTS | 6 | 6 | `strict-transport-security: max-age=31536000` |
| 7 | SSR(본문 HTML 포함) | 6 | 6 | Next.js, 홈 198KB·트랙 0.7~2.3MB 본문 인라인, `vary: rsc,...` |
| 8 | canonical + 핵심 보안 헤더 | 8 | 8 | canonical 有 / X-Frame·X-Content-Type·Referrer·Permissions present (**CSP 부재**는 감점 사유로 별도 기록) |
| | **합계** | **100** | **85** | |

**AI 크롤러:** robots.txt 가 `User-agent: *` 전면 허용이라 GPTBot·OAI-SearchBot·ChatGPT-User·ClaudeBot·PerplexityBot·Google-Extended·CCBot·Bytespider 등 모두 기본 허용 상속(개별 명시 디렉티브·`Content-Signal:` 없음).

### Schema & Structured Data — 66/100

| # | 체크 항목 | Max | 획득 | 근거 |
|---|---|---|---|---|
| 1 | EduOrg + sameAs + parentOrganization | 14 | 14 | 전 페이지 EducationalOrganization, sameAs 5종, parentOrganization 코드잇 |
| 2 | WebSite 스키마 | 5 | 5 | 전 페이지 |
| 3 | Course 스키마(전 트랙) | 15 | 15 | 8 트랙 전부 Course(name·description·url·teaches·datePublished·inLanguage) |
| 4 | Course.offers(price/currency/availability) | 8 | 8 | `Offer{price, priceCurrency, availability}` |
| 5 | Course.provider | 5 | 5 | provider 노드 존재 |
| 6 | Course.hasCourseInstance(일정/장소) | 7 | 6 | 7/8 트랙 `CourseInstance{courseMode,startDate,endDate,location=VirtualLocation}` (frontend-advanced 누락) |
| 7 | Course.aggregateRating | 12 | 0 | ❌ 전 트랙 누락 |
| 8 | Course.instructor(Person) | 10 | 0 | ❌ 전 트랙 누락 |
| 9 | FAQPage(홈+트랙) | 8 | 8 | 홈 7 + 트랙 9~13 Q&A |
| 10 | BreadcrumbList(트랙) | 5 | 5 | 전 트랙 |
| 11 | Course image/educationalLevel/timeRequired/credential | 6 | 0 | ❌ Course 객체 레벨 image·educationalLevel·timeRequired·occupationalCredentialAwarded 없음 |
| 12 | /career 전용 스키마 | 5 | 0 | ❌ EduOrg·WebSite·ImageObject 만, Service/EduOccProgram/FAQ 없음 |
| | **합계** | **100** | **66** | |

### Platform Optimization — 54/100  *(한국 생태계 기준)*

| # | 체크 항목 | Max | 획득 | 근거 |
|---|---|---|---|---|
| 1 | AI 크롤러 접근(robots 전면 허용) | 15 | 15 | AI 차단 없음 |
| 2 | llms.txt 존재·well-formed | 12 | 12 | 200 |
| 3 | llms-full.txt 존재 | 8 | 0 | ❌ 404 |
| 4 | 답변엔진용 구조화 콘텐츠(FAQPage) | 15 | 15 | 홈+전 트랙 FAQPage |
| 5 | 엔티티 그라운딩(위키백과/Wikidata/나무위키) | 25 | 0 | ❌ 3종 모두 가점 0 — 인용 신뢰도 핵심 공백 |
| 6 | KR 플랫폼 신호(Naver 블로그 연결·KR 로케일) | 10 | 7 | Naver 블로그 `sameAs` 연결·`lang=ko`·국비지원 콘텐츠. 단 나무위키 부재 |
| 7 | AI Overviews 리치결과 신호(aggregateRating/review) | 10 | 0 | ❌ 없음 |
| 8 | SSR + clean canonical(전 엔진 인덱싱) | 5 | 5 | SSR + canonical |
| | **합계** | **100** | **54** | |

| AI 플랫폼 | 준비도 | 핵심 이슈 |
|---|---|---|
| Google AI Overviews | 보통 | FAQ 有, Course `aggregateRating` 부재로 별점 스니펫 미적격 |
| ChatGPT 웹검색 | 보통 | SSR·llms.txt 양호, 엔티티 확인(위키/Wikidata) 부재 |
| Perplexity | 보통 | 크롤 가능, 권위 3rd-party 인용 빈약 |
| Google Gemini | 낮음~보통 | hreflang 부재·작성자 E-E-A-T 신호 약함 |
| Bing Copilot | 낮음~보통 | 접근 양호, 전용 신호 없음 |
| 한국 AI (Naver AI Briefing / CLOVA) | 보통~낮음 | Naver 블로그 연결, 나무위키 부재 |

---

## 디스커버리 (Discovery) — composite 미반영

> 아래는 이번 감사에서 **새로 관찰**되었으나 `brandSources` v1 고정 체크리스트에 없으므로 **composite 점수에 넣지 않은** 신호입니다. 차기 `brandSourcesVersion` 검토용으로만 기록합니다.

- **사이트 `sameAs` 에 있으나 brandSources 미수록:** `facebook.com/codeit.kr`, Instagram 핸들이 지정값 `@codeit.kr` 가 아니라 **`@codeit_kr`** 로 실제 연결됨(핸들 불일치 — v2 에서 정정 검토).
- **지정값 `@codeit_sprint` 인스타그램:** 사이트 `sameAs` 에 없음(존재 미확인).
- **정부/공신력 레퍼런스:** 취업률 "**고용24**"(government employment portal) 기준 표기, 훈련장려금 "**HRD-Net**" 안내, 국비지원(내일배움카드/KDT) 맥락 — 제3자 권위 신호 후보.
- **검증 불가(봇 차단)로 미가점 처리된 고정 소스:** namu.wiki(403), 잡플래닛(403) — 존재가 확인되면 각각 가점 상향 여지(이번엔 객관·재현성 원칙상 0).
- **커뮤니티(미점검·후보):** OKKY·블라인드·커리어리·네이버 카페 등 한국 개발자 커뮤니티는 이번 감사에서 **점검하지 않았으며** composite 에 미반영. 차기 버전에서 KR 평판 신호로 편입 검토 가능.

---

## Quick Wins (이번 주)

1. **Course 스키마에 `aggregateRating` 추가** — 내부 만족도(n=2,598) 데이터를 별점/리뷰수로 매핑. 별점 리치결과 해금.
2. **Course 스키마에 `instructor`(Person) 추가** — 이미 공개된 강사 이력을 `Person`+LinkedIn `sameAs` 로 구조화.
3. **/llms-full.txt 생성** — 전 커리큘럼·통계·FAQ·강사 이력 전문 포함(현재 404).
4. **/career 페이지 스키마 추가** — `FAQPage` + `Service`/`EducationalOccupationalProgram`.
5. **robots.txt `Content-Signal:` + AI 크롤러 명시 `Allow`** 추가, `hreflang="ko"`/`x-default` 추가.

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

### Week 3 — 엔티티 그라운딩(최우선 공백)
- [ ] **Wikidata 엔티티 생성**(언어무관 핵심) + 사이트 `sameAs` 에 추가
- [ ] 한국어 위키백과 "코드잇" 독립 문서 제안
- [ ] 나무위키 "코드잇/코드잇 스프린트" 문서 정비 및 연결

### Week 4 — 플랫폼·평판 증폭
- [ ] 잡플래닛 기업 페이지 정비·리뷰 확보, 사이트 연결
- [ ] Naver AI Briefing 노출 겨냥 KR 장문 콘텐츠(KDT 가이드 등)
- [ ] Instagram 핸들 정합성 정리(`@codeit_kr` ↔ brandSources)

---

## Appendix: Methodology

- **고정 입력:** `audit-targets.json` → `sprint` (isoWeek 2026-W26, capturedAt 2026-06-22T16:21:46Z). auditUrls 10개만 점검, sitemap 임의 크롤·블로그 랜덤 샘플 없음.
- **기술 신호:** robots.txt / sitemap.xml / server-sitemap.xml / llms.txt / llms-full.txt 존재 여부 + auditUrls 응답에서 직접 관측된 HTTPS/헤더/SSR/canonical.
- **채점:** 카테고리별 객관 신호 체크리스트의 가점 합(위 표). composite 가중식 = citability·0.25 + brand·0.20 + eeat·0.20 + technical·0.15 + schema·0.10 + platform·0.10, 반올림.
- **brandSources:** version 1 고정 8개의 존재/연결만 composite 반영. 그 외 발견 소스는 디스커버리 섹션 한정.
- **KR 현지화:** 엔티티 그라운딩·평판·플랫폼을 한국 생태계 기준 평가. 영문 Wikipedia/Reddit/G2/Trustpilot/Clutch 부재는 critical 미분류·가중치 하향. Wikidata 는 언어무관 핵심으로 가중치 유지.
