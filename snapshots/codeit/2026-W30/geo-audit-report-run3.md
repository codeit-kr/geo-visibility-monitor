# GEO 감사 리포트 — 코드잇 (codeit)

- **대상 URL**: https://www.codeit.kr
- **isoWeek**: 2026-W30 · **capturedAt**: 2026-07-20T19:51:59Z
- **brandSourcesVersion**: 1
- **입력 고정(재현성)**: 점검 대상 페이지는 항목의 `auditUrls` 24개로 한정(sitemap 임의 크롤·블로그 랜덤 샘플 금지). 페이지 신호는 커밋된 `snapshots/codeit/2026-W30/pages.json`(고정 캡처) 사용. 기술 신호는 robots.txt / sitemap.xml / server-sitemap.xml / llms.txt / llms-full.txt **존재여부만** 점검. 외부 브랜드 신호는 항목의 `brandSources` 고정 체크리스트만 composite 반영.
- **현지화**: 한국 시장 기준. 영문 Wikipedia·Reddit·G2·Trustpilot·Clutch 부재는 critical 미분류·가중치 하향, Wikidata(언어무관 핵심)는 유지.

## 종합 점수

| 카테고리 | 가중치 | 점수 |
|---|---|---|
| **Composite** | — | **80** |
| Citability | 0.25 | 69 |
| Brand | 0.20 | 62 |
| E-E-A-T | 0.20 | 92 |
| Technical | 0.15 | 90 |
| Schema | 0.10 | 91 |
| Platform | 0.10 | 89 |

> composite = 69·0.25 + 62·0.20 + 92·0.20 + 90·0.15 + 91·0.10 + 89·0.10 = **79.9 → 80**

관측된 커버리지(고정 입력): HTML 페이지 23 · 콘텐츠 페이지 22 · 강의류 페이지 13 · meta description 커버리지 21.7% · h1 커버리지 91.3% · rich schema 커버리지(콘텐츠) 68.2% · FAQ 커버리지(강의류) 23.1% · title 100% · htmlLang 43.5% · canonical 100% · JSON-LD 전부 valid.

---

## Citability — 69 / 100

AI(ChatGPT·Claude·Perplexity·Gemini)가 페이지를 인용/발췌하기 쉬운 정도. 객관 신호 가점 합.

| 항목 | 배점 | 근거 | 획득 |
|---|---|---|---|
| C1 llms.txt 존재·구조화 | 18 | `/llms.txt` 200, 서비스·카테고리·로드맵을 헤딩+항목설명으로 구조화 | 18.0 |
| C2 meta description 커버리지 ×18 | 18 | 23개 HTML 중 5개만 description(홈·kdc 3종·tutorial) = 21.7% | 3.9 |
| C3 h1 커버리지 ×12 | 12 | 21/23 페이지 h1≥1. 누락: `/explore`, `/tutorials/...`(0개) | 11.0 |
| C4 rich 추출형 schema 커버리지 ×22 | 22 | 콘텐츠 22개 중 15개가 Course/FAQ/NewsArticle 보유 = 68.2%(teams 5개는 Breadcrumb만, `/reviews`·`/explore`는 Org만) | 15.0 |
| C5 강의류 FAQ Q&A ×12 | 12 | 강의류 13개 중 3개(kdc)만 FAQPage = 23.1%. paths 10개는 FAQ 없음 | 2.8 |
| C6 서술형 title ×10 | 10 | 전 페이지 title 보유(100%) | 10.0 |
| C7 날짜 있는 에디토리얼 | 8 | NewsArticle datePublished 존재(`/articles`, `/tutorials`) | 8.0 |

**개선 우선순위**: (1) `/paths/*`·`/explore`·`/reviews`·`/teams/*`에 meta description 채우기(가장 큰 감점), (2) `/paths/*`에 FAQPage 추가, (3) `/explore`·`/tutorials` h1 보강.

## Brand — 62 / 100

composite 반영 외부 신호 = `brandSources`(v1) 고정 체크리스트뿐. 각 소스 존재/연결 여부로 채점. 한국 생태계 가중.

| brandSource | 배점 | 판정 | 근거 | 획득 |
|---|---|---|---|---|
| 나무위키 /w/코드잇 | 20 | ✅ 인정 | 직접 fetch 403이나 사이트 Organization `sameAs`에 `namu.wiki/w/코드잇` 링크 존재 → 연결 확인(직접 fetch 불필요) | 20.0 |
| Wikidata 코드잇/Codeit 엔티티 | 20 | ❌ 부재 | `wbsearchentities` 결과 한국 코드잇 엔티티 없음(검색 시 노르웨이 "CodeIT(Q30299760)"만). 언어무관 핵심이라 가중 유지 → 실질 공백 | 0.0 |
| ko.Wikipedia /wiki/코드잇 | 10 | ❌ 부재 | REST summary 404(문서 없음) | 0.0 |
| blog.naver.com/codeitofficial | 12 | ✅ | HTTP 200 + Organization `sameAs` 등재 | 12.0 |
| youtube.com/@codeit | 12 | ✅ | HTTP 200 + `sameAs` 등재 | 12.0 |
| Instagram @codeit.kr | 8 | ✅ | `sameAs`에 `instagram.com/codeit_kr`(브랜드 계정) 등재 | 8.0 |
| linkedin company/codeit-official | 10 | ✅ | HTTP 200 + `sameAs` 등재 | 10.0 |
| 잡플래닛 코드잇 기업 페이지 | 8 | ⚠️ 미확인 | 직접 fetch 403(봇 차단), `sameAs` 미포함 → 결정적 확인 불가 → 보수적 미가점 | 0.0 |

**획득 합 62 / 100.** 최대 리스크: **Wikidata 엔티티 부재**(엔티티 그라운딩의 언어무관 핵심). 나무위키가 KR 앵커를 상당 부분 보완하나, AI 엔진의 교차언어 그라운딩을 위해 Wikidata 항목 생성이 최우선. 다음으로 ko.Wikipedia 문서.

## E-E-A-T — 92 / 100

| 항목 | 배점 | 근거 | 획득 |
|---|---|---|---|
| Org 아이덴티티 완비(name/logo/description/sameAs) | 14 | EducationalOrganization 그래프 전 페이지 | 14.0 |
| 의미있는 description 커버리지 ×10 | 10 | 21.7%(위 C2와 동일 관측) | 2.2 |
| 저자/발행자 표기 | 10 | NewsArticle `author`(코드잇)+`publisher` 존재 | 10.0 |
| 리뷰/사회적 증거 표면 | 10 | `/reviews` 페이지 존재 | 10.0 |
| 검증형 AggregateRating 마크업 | 10 | `/reviews` JSON-LD `AggregateRating` ratingValue 4.9 / ratingCount 171,751 | 10.0 |
| 사례/고객 증거 | 10 | `/teams/cases`(기업 도입 사례) | 10.0 |
| 인증/자격 신호 | 12 | KDC 국비지원·내일배움카드·NCS 수료증·`offers`(price 50000) 등 정부 인증 과정 | 12.0 |
| 외부 엔티티 권위 | 12 | 나무위키 연결 등 확립된 엔티티 | 12.0 |
| 콘텐츠 폭/깊이 ×12 | 12 | 콘텐츠 22페이지(articles·tutorials·paths·teams) → 상한 | 12.0 |

**메모**: description 커버리지만 감점 요인. 나머지 신뢰 신호(정부 인증·검증 평점·사례·저자표기)는 KR 교육 도메인에서 매우 강함.

## Technical — 90 / 100 *(존재여부만 점검)*

| 파일 | 배점 | 상태 | 획득 |
|---|---|---|---|
| robots.txt | 25 | 200 | 25 |
| sitemap.xml | 30 | 200 | 30 |
| server-sitemap.xml | 15 | 200 | 15 |
| llms.txt | 20 | 200 | 20 |
| llms-full.txt | 10 | **404** | 0 |

**유일한 공백: `llms-full.txt` 부재.** (robots.txt는 관리자/동적 경로만 Disallow, AI 크롤러 차단 없음 — 참고용, 점수는 존재여부만 반영.)

## Schema — 91 / 100

| 항목 | 배점 | 근거 | 획득 |
|---|---|---|---|
| Org/EducationalOrganization 사이트와이드 | 18 | 전 페이지 | 18 |
| WebSite | 8 | 전 페이지 | 8 |
| sameAs 채워짐 | 14 | 6개 채널 | 14 |
| 강의 페이지 Course | 15 | 강의류 13개 전부 Course | 15 |
| FAQPage ×12(강의 커버리지) | 12 | kdc 3개만 → 23.1% | 2.8 |
| BreadcrumbList | 10 | kdc·paths·teams | 10 |
| Article/NewsArticle | 8 | articles·tutorials | 8 |
| AggregateRating/Review | 7 | `/reviews` | 7 |
| parentOrganization 링크 | 5 | 해당 없음(코드잇=모엔티티) | 0 |
| JSON-LD 전부 valid | 8 | 파싱·valid 100% | 8 |

**개선**: `/paths/*`에 FAQPage 추가 시 최대 +9점 여력.

## Platform — 89 / 100

Google AI Overviews·ChatGPT·Perplexity·Gemini·Bing Copilot 대응 객관 프록시.

| 항목 | 배점 | 근거 | 획득 |
|---|---|---|---|
| AI 크롤러 접근(robots AI 봇 미차단) | 20 | GPTBot/CCBot 등 Disallow 없음 | 20 |
| llms.txt 디스커버리 | 15 | 존재 | 15 |
| 답변엔진용 구조화데이터 ×20 | 20 | rich 커버리지 68.2% | 13.6 |
| 사이트맵 선언 | 10 | sitemap.xml + server-sitemap + inblog | 10 |
| KR/Naver + ko-lang 일관성 ×15 | 15 | 네이버 블로그 sameAs·한국어 콘텐츠, 단 htmlLang 43.5%만 명시 | 10.8 |
| 신선도/날짜 신호 | 10 | NewsArticle datePublished | 10 |
| canonical+https 일관성 ×10 | 10 | canonical 100% | 10 |

**개선**: 전 페이지 `<html lang="ko">` 명시(현재 43.5%)로 KR 표면 신뢰도↑.

---

## 디스커버리 (composite 점수 미반영)

`brandSources`(v1)에 없으나 이번 감사에서 확인/추정된 신호. **점수엔 넣지 않고 기록만** 한다(다음 brandSourcesVersion 후보).

- **robots.txt 추가 사이트맵**: `https://codeit-teams.inblog.io/sitemap.xml` — Teams 콘텐츠가 외부 inblog 도메인에 분산. 엔티티 통합/사이트맵 커버리지 관점 기록.
- **Facebook 페이지**: Organization `sameAs`에 `facebook.com/codeit.kr` 존재(brandSources 미등재). 브랜드 채널로 v2 편입 후보.
- **잡플래닛**: brandSources에 있으나 봇 차단(403)으로 결정적 확인 불가 → 존재 시 수동 확인 필요(현재 미가점).
- **미탐색 KR 커뮤니티**: OKKY·블라인드·커리어리·네이버 카페 등은 이번 고정 입력 범위 밖 → 별도 조사 시 브랜드 평판 신호로 검토(현 점수 무관).
- **엔티티 그라운딩 공백**: Wikidata·ko.Wikipedia 문서 부재 확인 — 생성 시 다음 주차 Brand 점수 직접 상승 여지(현재 Brand 62의 주 감점 요인).

## 방법론·재현성 노트

- 동일 `auditUrls` + 동일 `pages.json` 고정 캡처 + 동일 `brandSources`(v1) → **동일 입력 = 동일 점수**. 각 카테고리는 주관 인상이 아니라 위 체크리스트 가점 합.
- 기술 신호는 5개 파일 **존재여부만**(내용 품질은 리포트 서술에만 사용, 점수 미반영).
- 사용한 brandSourcesVersion: **1**.
