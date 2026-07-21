# GEO Audit Report: 어센트 (Ascent)

**App:** `ascent`
**URL:** https://www.ascent.me
**ISO Week:** 2026-W30
**Captured At:** 2026-07-21T06:41:41Z
**brandSourcesVersion:** 1
**Pages Analyzed:** 5 (고정 `auditUrls` — sitemap 임의 크롤 / 블로그 랜덤 샘플 없음)
**Market:** 한국 (KR 현지화 채점)
**Entity model:** child(어센트) → parentOrganization → 코드잇(www.codeit.kr). brandSources 전 항목이 **모회사(코드잇)** 엔티티.

---

## Executive Summary

**Overall GEO Score: 67/100 (Fair, 상단)**

어센트는 잘 구조화된 `llms.txt`, 심층 페이지의 자기완결형 **FAQPage**, 안정적 canonical, 완전 개방된 AI 크롤러 접근으로 **citability·기술 신호가 강하다**. 스키마는 Organization/WebSite/ItemList/BreadcrumbList/FAQPage 가 유효하게 깔려 있으나 **SearchAction·Product/Offer·풍부한 sameAs 가 부재**해 상단이 눌린다. 가장 큰 공백은 **독립 엔티티 그라운딩**이다: 어센트 전용 Wikidata/위키백과/나무위키 문서가 없고, 브랜드 권위는 전적으로 모회사 코드잇에서 **parentOrganization 상속(부분 가점)** 에 의존한다. E-E-A-T 는 조직 신뢰는 있으나 **개별 저자(Person)·datePublished·후기 스키마**가 없어 낮다.

### Score Breakdown

| Category | Score | Weight | Weighted |
|---|---|---|---|
| AI Citability | 85/100 | 25% | 21.25 |
| Brand Authority | 53/100 | 20% | 10.60 |
| Content E-E-A-T | 57/100 | 20% | 11.40 |
| Technical GEO | 74/100 | 15% | 11.10 |
| Schema & Structured Data | 74/100 | 10% | 7.40 |
| Platform Optimization | 50/100 | 10% | 5.00 |
| **Overall GEO Score** | | | **66.75 → 67** |

> 채점 원칙: 각 카테고리 점수는 주관 인상이 아니라 아래 **객관 신호 체크리스트의 가점 합**이다. composite 에 반영한 외부 신호는 이 항목의 고정 `brandSources` (v1) 뿐이며, 새로 발견한 커뮤니티·소스는 "디스커버리" 섹션에만 기록했다.
>
> **모회사 상속 규칙:** brandSources 전부 "(모회사)" 표기 → 코드잇 엔티티. 사이트 Organization 이 `parentOrganization` 으로 www.codeit.kr 에 연결되고 그 모회사 엔티티가 존재하므로 **부분 가점**(자식이 부모 상속). 어센트 **전용** 엔티티는 부재하므로 **완전 가점은 없다**. 나무위키는 직접 fetch 403 이나 parentOrganization·코드잇 sameAs 체인으로 확인 → 인정(직접 fetch 불필요).

---

## Category Deep Dives (체크리스트 근거)

### AI Citability — 85/100

| 신호 | 배점 | 획득 | 근거 |
|---|---|---|---|
| `llms.txt` 존재 & 잘 구조화(H1+요약+섹션 링크) | 20 | 19 | `/llms.txt` 200. `# 어센트 (Ascent)` H1 + 요약 + 서비스/면접 카테고리 섹션 링크. ascent·codeit·면접서비스 모두 서술 |
| 추출형 Q&A(FAQPage) 심층 페이지 존재 | 20 | 17 | `/interviews/100`·`/interviews/102` 각 8문항 FAQPage. 자기완결형 답변(서비스 개요·진행방식·리포트·크레딧·환불 시점 등) |
| 헤딩 구조(H1 존재 비율) | 15 | 11 | HTML 4개 중 3개 H1≥1(홈/100/102). `/interviews` 목록 H1=0 (감점) |
| 자기완결형 구조 콘텐츠(ItemList/Breadcrumb + 설명) | 15 | 12 | `/interviews` 18-item ItemList, 상세 BreadcrumbList, 전 페이지 og/description 충실 |
| 안정적 canonical(인용 타깃) | 10 | 10 | HTML 4개 전부 canonical 존재(자기참조) |
| AI 크롤러 접근 | 15 | 15 | robots `User-agent: *` /api·/auth·/my·/reports 만 Disallow, AI 봇 미차단 + sitemap 2개 선언 |
| 편집형 롱폼 깊이 | 5 | 1 | 고정셋에 articles/블로그 없음(블로그는 측정 스코프 제외) — 카탈로그+FAQ 위주 |
| **합계** | | **85** | |

*재현성 주석:* 본문 랜덤 샘플링 금지 제약에 따라 citability 는 `auditUrls` 의 관측 가능한 신호(스키마/메타/헤딩/llms.txt)에 한정해 채점. 개별 문단 인용 적합도는 미측정.

### Brand Authority — 53/100

composite 반영 대상 = 고정 `brandSources` (v1) 6개, **전부 모회사(코드잇) 엔티티**. 어센트는 parentOrganization 연결로 **부분 상속 가점**(전용 엔티티 부재 → 완전 가점 없음).

| brandSource (모회사) | 배점 | 획득 | 판정·근거 |
|---|---|---|---|
| parentOrganization → 코드잇(www.codeit.kr) 연결 존재 | 15 | 15 | ✅ 전 HTML `@graph` Organization 이 `parentOrganization`(EducationalOrganization 코드잇, `codeit.kr/#organization`) 연결 → 상속 성립 |
| 나무위키 `/w/코드잇` (지식 그라운딩) | 15 | 11 | ✅ 인정(부분). 직접 fetch 403(봇 차단)이나 parentOrg + 코드잇 `sameAs` 체인으로 확인, 직접 fetch 불필요(규칙) |
| blog.naver.com/codeitofficial | 10 | 6 | ✅ 부분. 모회사 공식 네이버 블로그(코드잇 감사서 200 + sameAs 확인). 상속이라 부분 |
| youtube.com/@codeit | 10 | 6 | ✅ 부분. 모회사 공식 채널(코드잇 감사서 200 + sameAs 확인). 상속이라 부분 |
| linkedin.com/company/codeit-official | 10 | 7 | ✅ 부분. HTTP 200 확인(E-Learning, Seoul, 2017 설립). 상속이라 부분 |
| ko.wikipedia `/코드잇` | 15 | 0 | ❌ 부재. 페이지 404. KR 생태계 소스라 가중치는 낮췄으나 실질 공백 |
| Wikidata 코드잇/Codeit | 15 | 0 | ❌ 부재. `Special:Search` 결과 없음. **언어무관 핵심**이라 full 가중치 유지 → 감점 |
| 어센트 own 소셜(Instagram sameAs) | 10 | 8 | ✅ 어센트 자체 채널 `instagram.com/ascent.me` sameAs 연결(전용 신호) |
| **합계** | | **53** | |

**해석:** 모회사 코드잇 엔티티는 나무위키·네이버·YouTube·LinkedIn 으로 실재가 확인되고 parentOrganization 로 상속되나, (1) 상속이라 **부분 가점**, (2) 어센트 **전용** 엔티티 부재로 **완전 가점 불가**, (3) 언어무관 핵심 **Wikidata + ko.위키백과 동시 부재**가 상단을 크게 눌러 **53/100**.

### Content E-E-A-T — 57/100

| 신호 | 배점 | 획득 | 근거 |
|---|---|---|---|
| 조직 정체성/신뢰(Organization schema + 설명 + logo) | 20 | 19 | 전 페이지 Organization(name/url/logo/description/parentOrganization) 완비 |
| 저자 귀속(Person/author) | 20 | 4 | Person/author 전무. 면접 페이지 저자 미귀속 |
| 콘텐츠 최신성(datePublished) | 15 | 5 | 스키마 datePublished 없음. og 이미지 version 파라미터(`?v=…`)만 존재(약한 신호) |
| 경험/증거(후기·사례·리포트 근거) | 15 | 9 | FAQ 에 리포트·상위 퍼센타일·비언어 전달력 평가 등 경험적 서술 O, 그러나 Review/후기 스키마 부재 |
| 권위(공식 기관·모회사 연계) | 15 | 12 | parentOrganization → 코드잇(정착 EdTech) 연계, 실제 기업 시나리오(삼성전자 DS/DX) |
| 투명성(offers/가격/약관 신호) | 15 | 8 | FAQ 크레딧·충전·무료 크레딧·차감 시점·환불 성격 + 결제/미션 링크 명시. Offer/가격 스키마는 부재 |
| **합계** | | **57** | |

### Technical GEO — 74/100

제약: 기술 신호는 **아래 5개 파일 존재여부만** 점검(HTTP status).

| 파일 | ascent | 배점 | 획득 |
|---|---|---|---|
| robots.txt | 200 ✅ | 20 | 20 |
| sitemap.xml | 200 ✅ | 20 | 20 |
| server-sitemap.xml | 404 ❌ | 20 | 0 |
| llms.txt | 200 ✅ | 20 | 20 |
| llms-full.txt | 404 ❌ | 20 | 0 |
| **파일 소계** | | 100 | 60 |

보조 결정적 신호(고정 입력 `pages.json`): HTTPS 전 페이지 ✅, 전 `auditUrls` status 200 ✅, canonical 전 HTML ✅, `htmlLang=ko` 전 HTML ✅, robots AI 크롤러 미차단 + sitemap 2개 선언 ✅ → **+14 보정**. **최종 74/100.**
robots 는 `sitemap.xml` + `blog/sitemap.xml` 2개를 선언(블로그 sitemap 은 측정 스코프 제외).

### Schema & Structured Data — 74/100

| 신호 | 배점 | 획득 | 근거 |
|---|---|---|---|
| Organization(+ 설명/logo/parentOrganization) | 20 | 19 | 전 페이지 `#organization`, name/url/logo/description + parentOrganization(코드잇) |
| WebSite(+ SearchAction) | 15 | 9 | WebSite + publisher 존재, 그러나 `potentialAction`/SearchAction 부재(감점) |
| FAQPage | 15 | 14 | `/interviews/100`·`/102` 8문항 FAQPage, valid |
| BreadcrumbList | 10 | 10 | 상세 페이지 3단 breadcrumb |
| ItemList(카탈로그) | 10 | 9 | `/interviews` 18-item ItemList(position/name/url) |
| 서비스 Product/Offer/Course | 15 | 4 | 유료(크레딧) 면접 상품에 대한 Product/Offer/Service 스키마 부재 |
| sameAs 연결 | 10 | 4 | sameAs 1개(instagram)뿐 + parentOrganization. Wikidata/위키백과 미연결 |
| 유효성(valid=true) | 5 | 5 | 전 JSON-LD `valid:true` |
| **합계** | | **74** | |

미비: `/interviews/{id}` 유료 상품에 Product/Offer(가격·통화), 후기 존재 시 Review/aggregateRating, WebSite SearchAction 부재.

### Platform Optimization — 50/100

KR 생태계 기준. composite 반영은 `brandSources` 중 콘텐츠/소셜 플랫폼 소스(전부 모회사 → 상속 부분 가점).

| 플랫폼 | 배점 | 획득 | 판정·근거 |
|---|---|---|---|
| 어센트 own 소셜(Instagram @ascent.me) | 20 | 16 | ✅ 자체 채널 sameAs(유일한 전용 플랫폼 신호) |
| YouTube @codeit (모회사) | 15 | 9 | ✅ 부분(상속). 모회사 공식 채널 |
| 네이버 블로그 codeitofficial (모회사) | 15 | 9 | ✅ 부분(상속). KR 검색·AI 인용 핵심 채널 |
| LinkedIn codeit-official (모회사) | 10 | 7 | ✅ 부분(상속). 200 확인 |
| 나무위키 지식 그라운딩 (모회사, 체인 확인) | 15 | 9 | ✅ 부분(상속). parentOrg/sameAs 체인 |
| 엔티티 그라운딩(Wikidata/KO-Wiki) | 25 | 0 | ❌ 부재 → AI Overviews/Perplexity 개체 인식 약화 |
| **합계** | | **50** | |

강한 모회사 채널 상속 + 자체 Instagram 으로 50점. 어센트 **전용** 지식·엔티티 채널 부재와 언어무관 Wikidata 부재가 상단 캡을 제한.

---

## Prioritized Actions

**High**
1. **어센트 전용 엔티티 그라운딩 확보** — 현재 코드잇 상속(부분 가점)에만 의존. 어센트/Ascent Wikidata 엔티티(모회사 코드잇을 `parent organization` 으로 연결) 생성 후 홈 `sameAs` 에 `wikidata.org/wiki/Q…` 추가 → 부분→완전 가점 전환의 최단 경로.
2. **모회사 코드잇 Wikidata + 한국어 위키백과 문서** 확보/보강(현재 동시 부재, 언어무관 핵심). 확정 시 어센트 `sameAs` 및 parentOrganization 신뢰가 함께 상승.

**Medium**
3. `/interviews` 목록 페이지 H1 부여(현재 H1=0, citability 감점).
4. 유료 면접 상품에 **Product/Offer**(가격·통화·크레딧) 스키마 추가 → 상품 인용·리치 신호.
5. WebSite 에 **SearchAction**(`potentialAction`) 추가.
6. `llms-full.txt`(현 404) 발행 — 면접 카탈로그·FAQ 원문 포함.

**Low**
7. 면접/리포트 콘텐츠에 datePublished 및 실제 작성/감수 주체 Person(약력) 부여(E-E-A-T).
8. 후기 존재 시 Review/aggregateRating 스키마 추가.
9. `server-sitemap.xml`(현 404) 필요 시 발행(코드잇 계열 표준과 정합).

---

## 디스커버리 (composite 미반영 — 참고용)

> 아래는 고정 `brandSources` v1 밖에서 관찰/후속검증 대상으로 기록만 한다. 점수에 반영하지 않았다.

- **나무위키 직접 접근:** 직접 fetch 403(봇 차단). parentOrganization + 코드잇 `sameAs` 체인으로 존재 인정, 별도 fetch 불필요(규칙 준수).
- **네이버 블로그 직접 접근:** 도구 레벨에서 `blog.naver.com` fetch 불가. 모회사 코드잇 감사(2026-W30)에서 HTTP 200 + 코드잇 sameAs 로 확인된 자산이라 모회사 채널로 인정(상속).
- **YouTube @codeit:** 직접 fetch 결과 채널 메타 미표출(렌더링 한계). 모회사 감사에서 확인된 자산으로 인정(상속).
- **블로그 sitemap:** robots 가 `www.ascent.me/blog/sitemap.xml` 선언 → 별도 콘텐츠 자산이나 **블로그는 측정 스코프 제외**(커밋 3012aff 정책). 고정셋 밖.
- **어센트 전용 커뮤니티/평판(미확인, 미반영):** OKKY·블라인드·커리어리·네이버 카페(취업/면접 카페) 등에서의 "어센트 AI 모의면접" 언급은 향후 수동 또는 별도 파이프라인 검증 후, 확정 시 `brandSources` v2 편입 검토.
- WebSearch 도구 미승인으로 커뮤니티 언급의 정량 검증은 이번 실행에서 수행하지 않음.

---

## 재현성 노트

- 감사 대상은 이 항목의 5개 `auditUrls` 로 한정, sitemap 임의 크롤/블로그 랜덤 샘플 미수행 → 동일 입력=동일 점수.
- 기술 신호는 robots.txt / sitemap.xml / server-sitemap.xml / llms.txt / llms-full.txt **존재여부**만 점검(HTTP status: 200/200/404/200/404).
- 페이지 신호는 고정 스냅샷 `snapshots/ascent/2026-W30/pages.json`(capturedAt 2026-07-21T06:38:42Z) 기준.
- composite 외부 신호 = `brandSources` v1 만(전부 모회사 코드잇 엔티티). parentOrganization 상속 → 부분 가점, 어센트 전용 엔티티 부재 → 완전 가점 없음. 사용한 **brandSourcesVersion: 1**.
