# GEO Audit Report: 코드잇 (Codeit)

**App:** `codeit`
**URL:** https://www.codeit.kr
**ISO Week:** 2026-W30
**Captured At:** 2026-07-20T19:52:04Z
**brandSourcesVersion:** 1
**Pages Analyzed:** 24 (fixed `auditUrls` set — no sitemap crawl / no random blog sampling)
**Market:** 한국 (KR 현지화 채점)

---

## Executive Summary

**Overall GEO Score: 78/100 (Good)**

코드잇은 사이트 전역 구조화 데이터(EducationalOrganization + WebSite + Course + FAQPage + BreadcrumbList)와 잘 정리된 `llms.txt`, 완전 개방된 AI 크롤러 접근을 갖춰 **기술·스키마·citability 신호가 매우 강하다**. 가장 큰 공백은 **엔티티 그라운딩**이다: 한국어 위키백과 문서와 Wikidata 엔티티가 모두 부재해 AI가 "코드잇"을 명확한 개체로 앵커링하기 어렵다(나무위키·LinkedIn·YouTube·네이버 블로그·Instagram 은 확인됨). E-E-A-T 는 조직 신뢰 신호는 탄탄하나 개별 저자(Person) 귀속이 약하다.

### Score Breakdown

| Category | Score | Weight | Weighted |
|---|---|---|---|
| AI Citability | 88/100 | 25% | 22.0 |
| Brand Authority | 60/100 | 20% | 12.0 |
| Content E-E-A-T | 72/100 | 20% | 14.4 |
| Technical GEO | 92/100 | 15% | 13.8 |
| Schema & Structured Data | 90/100 | 10% | 9.0 |
| Platform Optimization | 66/100 | 10% | 6.6 |
| **Overall GEO Score** | | | **77.8 → 78** |

> 채점 원칙: 각 카테고리 점수는 주관 인상이 아니라 아래 **객관 신호 체크리스트의 가점 합**이다. composite 에 반영한 외부 신호는 이 항목의 고정 `brandSources` (v1) 뿐이며, 새로 발견한 커뮤니티·소스는 "디스커버리" 섹션에만 기록했다.

---

## Category Deep Dives (체크리스트 근거)

### AI Citability — 88/100

| 신호 | 배점 | 획득 | 근거 |
|---|---|---|---|
| `llms.txt` 존재 & 잘 구조화(H1+요약+섹션 링크) | 20 | 20 | `/llms.txt` 200, 6,987 bytes. `# 코드잇`, blockquote 요약, 서비스/카테고리/로드맵 섹션 링크 정연 |
| 추출형 Q&A(FAQPage) 심층 페이지 존재 | 20 | 20 | KDC 3개 과정에 12+ 질문 FAQPage (환불·수강신청·수료조건 등 자기완결형 답변) |
| 헤딩 구조(H1 존재 비율) | 15 | 12 | 23개 HTML 중 21개 H1≥1. `/explore`·`/tutorials/...` H1=0 (감점) |
| 자기완결형 구조 콘텐츠(Course/Article + 설명) | 15 | 14 | 전 path 에 Course(설명 포함), articles/tutorial 에 NewsArticle |
| 안정적 canonical(인용 타깃) | 10 | 9 | 전 HTML 페이지 canonical 존재 |
| AI 크롤러 접근 | 15 | 15 | robots `User-agent: *` 관리자/앱 경로만 Disallow, AI 봇 차단 없음 + sitemap 선언 |
| 편집형 롱폼 깊이 | 5 | 3 | articles·tutorial·reviews 존재하나 고정셋 내 편집 콘텐츠 비중 낮음 |
| **합계** | | **88** | |

*재현성 주석:* 본문 랜덤 샘플링 금지 제약에 따라 citability 는 `auditUrls` 의 관측 가능한 신호(스키마/메타/헤딩/llms.txt)에 한정해 채점. 개별 문단 인용 적합도는 미측정.

### Brand Authority — 60/100

composite 반영 대상 = 고정 `brandSources` (v1) 8개. 존재/연결 여부로 채점. (엔티티/권위 성격 소스)

| brandSource | 판정 | 근거 |
|---|---|---|
| 나무위키 `/w/코드잇` | ✅ 인정 | 직접 fetch 403(봇 차단)이나 홈 Organization `sameAs` 에 `namu.wiki/w/코드잇` 포함 → 규칙에 따라 sameAs 연결로 인정 |
| ko.wikipedia `/코드잇` | ❌ 부재 | 페이지 404 + `ko.wikipedia` API `titles=코드잇` → MISSING. KR 생태계 소스라 실질 공백(단, critical 아님) |
| Wikidata 코드잇/Codeit 엔티티 | ❌ 부재 | `wbsearchentities` ko/en 검색 결과 없음(en "Codeit"=노르웨이 회사 Q30299760, 별개). **언어무관 핵심**이라 가중치 유지 → 감점 |
| blog.naver.com/codeitofficial | ✅ | HTTP 200 + `sameAs` 포함 |
| youtube.com/@codeit | ✅ | HTTP 200 + `sameAs` 포함 |
| Instagram @codeit.kr | ✅ | `sameAs` 에 `instagram.com/codeit_kr` 연결 |
| linkedin.com/company/codeit-official | ✅ | HTTP 200 + `sameAs` 포함 |
| 잡플래닛 코드잇 기업 페이지 | ⚠️ 미검증 | 직접 fetch 403(봇 차단), `sameAs` 미포함 → 검증 불가로 **가점 없음(보수적)** |

**획득:** 확인 5(namu/naver/youtube/instagram/linkedin) + 부재 2(ko-wiki/wikidata) + 미검증 1(잡플래닛). 강한 KR 앵커(namu.wiki)와 LinkedIn 존재는 가점, 그러나 언어무관 핵심 Wikidata 부재 + KO 위키백과 부재가 핵심 감점 → **60/100**.

### Content E-E-A-T — 72/100

| 신호 | 배점 | 획득 | 근거 |
|---|---|---|---|
| 조직 정체성/신뢰(Organization schema + 설명 + logo) | 20 | 20 | EducationalOrganization 전역, 설명·logo·sameAs 완비 |
| 저자 귀속(Person/author) | 20 | 9 | NewsArticle `author` 존재하나 값이 조직명("코드잇"), 개별 전문가 Person 부재 |
| 콘텐츠 최신성(datePublished) | 15 | 12 | articles datePublished(2024-11), Course `hasCourseInstance.startDate`(2026-07) 등 날짜 신호 |
| 경험/증거(후기·사례) | 15 | 13 | `/reviews`, `/teams/cases` 존재 (수강생/기업 사례) |
| 권위(공식 기관 연계) | 15 | 13 | KDC 국비지원(고용노동부/고용24) 연계, NCS 수료증 언급 |
| 투명성(offers/가격/약관 신호) | 15 | 5 | Course `offers`(가격·통화·재고) 명시, 환불 규정 FAQ 상세 |
| **합계** | | **72** | |

### Technical GEO — 92/100

제약: 기술 신호는 **아래 5개 파일 존재여부만** 점검.

| 파일 | codeit | 배점 | 획득 |
|---|---|---|---|
| robots.txt | 200 ✅ | 20 | 20 |
| sitemap.xml | 200 ✅ | 20 | 20 |
| server-sitemap.xml | 200 ✅ | 20 | 20 |
| llms.txt | 200 ✅ | 20 | 20 |
| llms-full.txt | 404 ❌ | 20 | 0 |
| **파일 소계** | | 100 | 80 |

보조 결정적 신호(고정 입력 pages.json): HTTPS 전 페이지 ✅, 전 `auditUrls` status 200 ✅, canonical 전 HTML ✅, robots AI 크롤러 미차단 ✅ → +12 보정. **최종 92/100.**
robots 는 sitemap.xml + server-sitemap.xml + 외부 `codeit-teams.inblog.io/sitemap.xml` 3개를 선언.

### Schema & Structured Data — 90/100

| 신호 | 배점 | 획득 | 근거 |
|---|---|---|---|
| Organization/EducationalOrganization | 20 | 20 | 전역 `#organization`, name/url/logo/description/sameAs |
| WebSite + SearchAction | 15 | 15 | `potentialAction` SearchAction(urlTemplate) 존재 |
| Course | 15 | 15 | 전 path·KDC 과정 Course(provider/offers/hasCourseInstance) |
| FAQPage | 15 | 15 | KDC 과정 다수 질문 FAQPage |
| BreadcrumbList | 10 | 10 | KDC·paths·teams 페이지 |
| Article/NewsArticle | 10 | 8 | articles·tutorial NewsArticle(headline/author/datePublished) |
| sameAs 연결 | 10 | 7 | 6개 링크(namu 포함), Wikidata/위키백과 미연결 |
| 유효성(valid=true) | 5 | 0(감점없음) | 전 JSON-LD `valid:true` |
| **합계(정규화)** | | **90** | |

미비: `/reviews` 에 aggregateRating/Review 스키마, 강의 Review 집계 스키마 부재.

### Platform Optimization — 66/100

KR 생태계 기준. composite 반영은 `brandSources` 중 콘텐츠/소셜 플랫폼 소스.

| 플랫폼 | 판정 | 근거 |
|---|---|---|
| YouTube @codeit | ✅ | 200 + sameAs |
| 네이버 블로그 codeitofficial | ✅ | 200 + sameAs (KR 검색·AI 인용 핵심 채널) |
| Instagram @codeit.kr | ✅ | sameAs 연결 |
| 나무위키(플랫폼적 지식 그라운딩) | ✅ | sameAs 연결(위 Brand 참조) |
| 엔티티 그라운딩(Wikidata/KO-Wiki) | ❌ | 부재 → AI Overviews/Perplexity 개체 인식 약화 |

강한 KR 소셜/지식 채널 존재로 66점. 언어무관 엔티티(Wikidata) 및 KO 위키백과 부재가 상단 캡을 제한.

---

## Prioritized Actions

**High**
1. **Wikidata 엔티티 생성** — 코드잇/Codeit(한국 온라인 코딩 교육 플랫폼) 항목 신규 등록 후 홈 `sameAs` 에 `wikidata.org/wiki/Q…` 추가. (언어무관 핵심, 현재 최대 공백)
2. **한국어 위키백과 문서** 확보/보강 후 `sameAs` 연결.

**Medium**
3. `/explore`, `/tutorials/...` 등 H1 누락 페이지에 명확한 H1 부여(citability).
4. `/reviews` 에 `Review`/`aggregateRating` 스키마 추가(E-E-A-T·리치 신호).
5. NewsArticle `author` 를 조직명 대신 실제 필자 Person(약력 포함)으로.
6. 기술 문서 확장: `llms-full.txt` 발행(현 404).

**Low**
7. `/articles`·`/explore`·paths 페이지 `htmlLang=ko` 명시(일부 누락).
8. 잡플래닛 기업 페이지 존재 시 `sameAs` 에 추가(현재 검증 불가).

---

## 디스커버리 (composite 미반영 — 참고용)

> 아래는 고정 `brandSources` v1 밖에서 관찰/후속검증 대상으로 기록만 한다. 점수에 반영하지 않았다.

- **나무위키 직접 접근:** 직접 fetch 403(봇 차단). 홈 `sameAs` 링크로 존재 인정했고 별도 fetch 불필요(규칙 준수).
- **잡플래닛:** 직접/검색 fetch 403(봇 차단)으로 자동 검증 불가 → 미반영. 수동 확인 권장.
- **후속 검증 후보 KR 커뮤니티(미확인, 미반영):** OKKY, 블라인드, 커리어리, 네이버 카페(코딩/취준 카페). 이들에서의 코드잇 언급/평판은 향후 수동 또는 별도 파이프라인으로 검증 후, 확정 시 `brandSources` v2 편입 검토.
- **외부 sitemap:** robots 가 `codeit-teams.inblog.io/sitemap.xml`(기업 블로그) 선언 → 별도 콘텐츠 자산. 이번 고정셋 밖.
- WebSearch 도구 미승인으로 커뮤니티 언급의 정량 검증은 이번 실행에서 수행하지 않음.

---

## 재현성 노트

- 감사 대상은 이 항목의 24개 `auditUrls` 로 한정, sitemap 임의 크롤/블로그 랜덤 샘플 미수행 → 동일 입력=동일 점수.
- 기술 신호는 robots.txt / sitemap.xml / server-sitemap.xml / llms.txt / llms-full.txt **존재여부**만 점검(HTTP status).
- 페이지 신호는 고정 스냅샷 `snapshots/codeit/2026-W30/pages.json`(capturedAt 2026-07-20T19:09:53Z) 기준.
- composite 외부 신호 = `brandSources` v1 만. 사용한 **brandSourcesVersion: 1**.
