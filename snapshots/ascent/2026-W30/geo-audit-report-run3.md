# GEO Audit Report: 어센트 (Ascent)

**App:** `ascent`
**URL:** https://www.ascent.me
**ISO Week:** 2026-W30
**Captured At:** 2026-07-21T06:41:45Z
**brandSourcesVersion:** 1
**Pages Analyzed:** 5 (고정 `auditUrls` 세트 — sitemap 임의 크롤 / 블로그 랜덤 샘플 없음)
**Market:** 한국 (KR 현지화 채점)

---

## Executive Summary

**Overall GEO Score: 66/100 (Fair→Good)**

어센트는 목적에 맞는 **깔끔한 구조화 데이터(Organization+parentOrganization / WebSite / ItemList / FAQPage / BreadcrumbList)** 와 잘 정리된 `llms.txt`, 그리고 면접 상세 페이지의 **자기완결형 FAQ(8문항)** 로 citability·schema 신호가 강하다. 가장 큰 공백은 **엔티티/브랜드 그라운딩**이다: 어센트 전용 엔티티가 없고, 외부 앵커는 전부 **모회사(코드잇)** 신호를 `parentOrganization` 링크로 **상속(부분 가점)** 하는 형태다. 언어무관 핵심인 **Wikidata** 와 한국어 위키백과는 모회사 기준으로도 부재해 상단 캡을 제한한다. 기술은 robots/sitemap/llms.txt 는 갖췄으나 `server-sitemap.xml`·`llms-full.txt` 가 없다. E-E-A-T 는 고정셋 내에 저자(Person)·발행일·제3자 후기 스키마가 부재해 약하다.

### Score Breakdown

| Category | Score | Weight | Weighted |
|---|---|---|---|
| AI Citability | 84/100 | 25% | 21.0 |
| Brand Authority | 44/100 | 20% | 8.8 |
| Content E-E-A-T | 55/100 | 20% | 11.0 |
| Technical GEO | 72/100 | 15% | 10.8 |
| Schema & Structured Data | 82/100 | 10% | 8.2 |
| Platform Optimization | 58/100 | 10% | 5.8 |
| **Overall GEO Score** | | | **65.6 → 66** |

> 채점 원칙: 각 카테고리 점수는 주관 인상이 아니라 아래 **객관 신호 체크리스트의 가점 합**이다. composite 에 반영한 외부 신호는 이 항목의 고정 `brandSources` (v1) 뿐이며, 새로 발견한 커뮤니티·소스는 "디스커버리" 섹션에만 기록했다.

---

## Category Deep Dives (체크리스트 근거)

### AI Citability — 84/100

| 신호 | 배점 | 획득 | 근거 |
|---|---|---|---|
| `llms.txt` 존재 & 잘 구조화(H1+요약+섹션 링크) | 20 | 20 | `/llms.txt` 200, 6,750 bytes. `# 어센트 (Ascent)`, blockquote 요약, `## 주요 페이지`·`## 기업 면접` 섹션에 다수 링크 정연 |
| 추출형 Q&A(FAQPage) 심층 페이지 존재 | 20 | 18 | `/interviews/100`·`/interviews/102` 에 8문항 FAQPage(서비스 정의·크레딧·진행방식·리포트 등 자기완결형 답변). 단, home·`/interviews`(목록) 에는 FAQ 없음 |
| 헤딩 구조(H1 존재 비율) | 15 | 11 | HTML 4개 중 3개 H1≥1(home·/100·/102). `/interviews` 목록 페이지 H1=[] (감점) |
| 자기완결형 구조 콘텐츠(ItemList/FAQ/Breadcrumb + 설명) | 15 | 10 | 목록 페이지 ItemList(18개), 상세 페이지 FAQ+Breadcrumb+og description. Course/Article 등 롱폼 자기완결 콘텐츠는 고정셋에 없음 |
| 안정적 canonical(인용 타깃) | 10 | 10 | 전 HTML 페이지 canonical 존재(home·interviews·100·102) |
| AI 크롤러 접근 | 15 | 15 | robots `User-Agent: *` `Allow: /`, `/api /auth /my /reports` 만 Disallow, AI 봇 차단 없음 + sitemap 2개 선언 |
| 편집형 롱폼 깊이 | 5 | 0 | 블로그는 측정 스코프 제외(고정셋에 블로그 URL 없음). 면접 페이지는 구조형이며 편집 롱폼 아님 |
| **합계** | | **84** | |

*재현성 주석:* 본문 랜덤 샘플링 금지 제약에 따라 citability 는 `auditUrls` 5개의 관측 가능한 신호(스키마/메타/헤딩/llms.txt)에 한정해 채점. 개별 문단 인용 적합도는 미측정. 블로그(`/blog/*`)는 스코프에서 제외.

### Brand Authority — 44/100

composite 반영 대상 = 고정 `brandSources` (v1) 6개. **6개 모두 "(모회사)" 표기 = 코드잇(parent) 엔티티**다. 어센트 사이트 Organization 스키마가 `parentOrganization` 으로 **코드잇(www.codeit.kr)** 에 연결돼 있고(홈·목록·상세 전 페이지 확인), 그 모회사 엔티티가 실재하므로(코드잇 `sameAs` 에 namu.wiki·naver·youtube·linkedin·instagram·facebook 포함) **자식이 부모 엔티티를 상속 → 부분 가점**한다. 어센트 **전용 엔티티는 부재**하므로 완전 가점은 없다.

| brandSource (모회사) | 판정 | 근거 |
|---|---|---|
| 나무위키 `/w/코드잇` | ✅ 부분(상속) | 직접 fetch 403(봇 차단)이나 규칙에 따라 코드잇 `sameAs`(`namu.wiki/w/코드잇`) + 어센트 `parentOrganization`→codeit.kr 로 확인 → 직접 fetch 불필요. 상속 부분 가점 |
| ko.wikipedia `/코드잇` | ❌ 부재 | 페이지 404 + `ko.wikipedia` API `titles=코드잇` → `missing`. KR 생태계 소스이나 모회사 기준으로도 부재(단, critical 아님) |
| Wikidata 코드잇/Codeit 엔티티 | ❌ 부재 | `wbsearchentities` ko 검색 결과 `[]`. **언어무관 핵심**이라 가중치 유지 → 감점 |
| blog.naver.com/codeitofficial | ✅ 부분(상속) | HTTP 200 + 코드잇 `sameAs` 포함. parentOrganization 경유 상속 |
| youtube.com/@codeit | ✅ 부분(상속) | HTTP 200 + 코드잇 `sameAs` 포함. parentOrganization 경유 상속 |
| linkedin.com/company/codeit-official | ✅ 부분(상속) | HTTP 200 + 코드잇 `sameAs` 포함. parentOrganization 경유 상속 |

**획득:** 상속 확인 4(namu/naver/youtube/linkedin) — 전부 부분 가점 — + 부재 2(ko-wiki/Wikidata). 검증된 `parentOrganization` 연결로 강한 KR 앵커(namu)·소셜(naver/youtube/linkedin)을 부분 상속하나, **어센트 전용 엔티티 부재 + 언어무관 핵심 Wikidata 부재 + KO 위키백과 부재**로 상단 캡 제한 → **44/100**. (모회사 코드잇 자체 브랜드 점수 60 대비, 상속·부분 성격과 전용 엔티티 부재를 반영해 하향.)

### Content E-E-A-T — 55/100

| 신호 | 배점 | 획득 | 근거 |
|---|---|---|---|
| 조직 정체성/신뢰(Organization schema + 설명 + logo) | 20 | 20 | 전 페이지 `#organization`(name/url/logo/description/sameAs/parentOrganization). 설명이 서비스 정의를 명확히 서술 |
| 저자 귀속(Person/author) | 20 | 4 | 고정셋에 Article/author·Person 부재. 면접 상세도 저자 귀속 없음 |
| 콘텐츠 최신성(datePublished) | 15 | 4 | 고정셋에 datePublished 신호 없음(면접 페이지 날짜 미노출; og:image `?v=` 버전 파라미터만 관측) |
| 경험/증거(후기·사례·리포트) | 15 | 8 | 답변 분석 리포트·역량 평가 서술은 강하나, 제3자 후기/평점 스키마 부재 |
| 권위(공식 기관/기업 연계) | 15 | 11 | `parentOrganization`→코드잇(EducationalOrganization) 연계 + 실제 기업 직무 면접(삼성전자 등) 소재로 실무 신뢰 |
| 투명성(요금/무료/약관 신호) | 15 | 8 | FAQ 에 크레딧·무료 크레딧·차감 시점·충전/미션 링크 상세. offers 스키마는 부재 |
| **합계** | | **55** | |

### Technical GEO — 72/100

제약: 기술 신호는 **아래 5개 파일 존재여부만** 점검(HTTP status).

| 파일 | ascent | 배점 | 획득 |
|---|---|---|---|
| robots.txt | 200 ✅ | 20 | 20 |
| sitemap.xml | 200 ✅ | 20 | 20 |
| server-sitemap.xml | 404 ❌ | 20 | 0 |
| llms.txt | 200 ✅ | 20 | 20 |
| llms-full.txt | 404 ❌ | 20 | 0 |
| **파일 소계** | | 100 | 60 |

보조 결정적 신호(고정 입력 `pages.json`): HTTPS 전 페이지 ✅, 전 `auditUrls` status 200 ✅, canonical 전 HTML ✅, robots AI 크롤러 미차단 ✅ → **+12 보정. 최종 72/100.**
robots 는 `sitemap.xml` + `blog/sitemap.xml`(블로그 자산) 2개를 선언. `server-sitemap.xml`·`llms-full.txt` 부재가 파일 소계를 제한.

### Schema & Structured Data — 82/100

| 신호 | 배점 | 획득 | 근거 |
|---|---|---|---|
| Organization(+parentOrganization) | 20 | 20 | 전 페이지 `#organization`, name/url/logo/description/sameAs + `parentOrganization`→codeit.kr |
| WebSite + SearchAction | 15 | 8 | WebSite(`#website`, publisher 연결) 존재. `potentialAction`/SearchAction 부재 |
| FAQPage | 15 | 15 | 면접 상세(100·102) 8문항 FAQPage, `mainEntityOfPage` 명시 |
| BreadcrumbList | 10 | 10 | 면접 상세 3단계 Breadcrumb(홈→목록→면접) |
| ItemList(면접 카탈로그) | 10 | 10 | `/interviews` 18개 ListItem(position/name/url) |
| Article/NewsArticle | 5 | 0 | 고정셋에 편집 콘텐츠 스키마 부재 |
| sameAs / 엔티티 연결 | 15 | 9 | 어센트 자체 `sameAs`=Instagram 1개뿐. parentOrganization 링크는 있으나 Wikidata/위키백과 미연결 |
| 유효성(valid=true) | 10 | 10 | 전 JSON-LD `valid:true` |
| **합계(정규화)** | | **82** | |

미비: WebSite `SearchAction`, 면접에 대한 `Course`/`LearningResource` 또는 `Review`/`aggregateRating`, 어센트 전용 `sameAs`(엔티티 링크) 부재.

### Platform Optimization — 58/100

KR 생태계 기준. composite 반영은 `brandSources`(전부 모회사) 중 콘텐츠/소셜 플랫폼 소스를 `parentOrganization` 경유로 상속 채점.

| 플랫폼 | 판정 | 근거 |
|---|---|---|
| YouTube @codeit (모회사) | ✅ 부분(상속) | 200 + 코드잇 sameAs |
| 네이버 블로그 codeitofficial (모회사) | ✅ 부분(상속) | 200 + 코드잇 sameAs (KR 검색·AI 인용 핵심 채널) |
| LinkedIn codeit-official (모회사) | ✅ 부분(상속) | 200 + 코드잇 sameAs |
| Instagram @ascent.me (어센트 자체) | ✅ | 어센트 Organization `sameAs` 직접 연결(유일한 전용 채널) |
| 나무위키(지식 그라운딩, 모회사) | ✅ 부분(상속) | 코드잇 sameAs 경유(위 Brand 참조) |
| 엔티티 그라운딩(Wikidata/KO-Wiki) | ❌ | 부재 → AI Overviews/Perplexity 개체 인식 약화 |

모회사 KR 소셜/지식 채널을 상속(부분)하고 어센트 자체 Instagram 이 있어 58점. 어센트 **전용** 플랫폼 존재감(전용 YouTube/블로그/나무위키 문서) 부재 + 언어무관 엔티티(Wikidata)·KO 위키백과 부재가 상단 캡을 제한.

---

## Prioritized Actions

**High**
1. **어센트 전용 엔티티 그라운딩** — Wikidata 에 "어센트/Ascent(코드잇 운영 AI 모의면접)" 항목을 신규 등록하고, 코드잇(모회사) 엔티티와 `parent organization`(P749)/`subsidiary` 관계로 연결. 등록 후 홈 Organization `sameAs` 에 `wikidata.org/wiki/Q…` 추가 → 상속 부분 가점을 **완전 가점**으로 승격 가능.
2. **한국어 위키백과** — 모회사 코드잇 문서 확보/보강 후 어센트 섹션 포함, `sameAs` 연결.

**Medium**
3. `/interviews` 목록 페이지 **H1 부여**(현재 H1 없음 — citability 감점).
4. `server-sitemap.xml` 또는 동적 sitemap 발행 + `llms-full.txt` 발행(현 404 — technical 파일 소계 회복).
5. WebSite 스키마에 `potentialAction`(SearchAction) 추가.
6. 면접/리포트에 `Review`/`aggregateRating` 또는 `Course`/`LearningResource` 스키마 추가(E-E-A-T·schema 강화).

**Low**
7. 어센트 **전용 소셜 채널**(YouTube/네이버 블로그) 확보 및 `sameAs` 연결 → 모회사 상속 의존도 완화.
8. 콘텐츠에 `datePublished`/저자(Person) 신호 도입(E-E-A-T 최신성·저자 귀속).

---

## 디스커버리 (composite 미반영 — 참고용)

> 아래는 고정 `brandSources` v1 밖에서 관찰/후속검증 대상으로 기록만 한다. 점수에 반영하지 않았다.

- **나무위키 직접 접근:** 직접 fetch 403(봇 차단). 규칙에 따라 코드잇 `sameAs` + 어센트 `parentOrganization`→codeit.kr 연결로 존재 인정, 별도 fetch 불필요.
- **어센트 자체 Instagram(@ascent.me):** 어센트 Organization `sameAs` 에 직접 연결된 유일한 전용 채널. Brand/Platform 은 이번 회차엔 `brandSources`(모회사) 기준으로만 composite 채점했으므로 자체 Instagram 은 Platform 근거로만 참고.
- **코드잇(모회사) 추가 채널:** 코드잇 `sameAs` 에 `facebook.com/codeit.kr`, `instagram.com/codeit_kr` 도 관측 — `brandSources` v1 고정셋 밖이라 미반영.
- **블로그 자산:** robots 가 `www.ascent.me/blog/sitemap.xml` 선언 → 별도 콘텐츠 자산. 이번 고정셋(블로그 측정 스코프 제외) 밖.
- **후속 검증 후보 KR 커뮤니티(미확인, 미반영):** OKKY, 블라인드, 커리어리, 네이버 카페(취준/코딩 카페). 어센트/코드잇 언급·평판은 향후 수동 또는 별도 파이프라인 검증 후 확정 시 `brandSources` v2 편입 검토.
- WebSearch 도구는 이번 실행에서 사용하지 않음(커뮤니티 언급의 정량 검증 미수행).

---

## 재현성 노트

- 감사 대상은 이 항목의 5개 `auditUrls` 로 한정, sitemap 임의 크롤/블로그 랜덤 샘플 미수행 → 동일 입력=동일 점수.
- 기술 신호는 robots.txt / sitemap.xml / server-sitemap.xml / llms.txt / llms-full.txt **존재여부**만 점검(HTTP status): 200/200/404/200/404.
- 페이지 신호는 고정 스냅샷 `snapshots/ascent/2026-W30/pages.json`(capturedAt 2026-07-21T06:38:42Z) 기준.
- 브랜드/플랫폼 composite 외부 신호 = `brandSources` v1(6개, 전부 모회사) 만. 모회사 신호는 검증된 `parentOrganization`→codeit.kr 연결로 **부분 가점(상속)**; 전용 엔티티 부재로 완전 가점 없음.
- 사용한 **brandSourcesVersion: 1**.
