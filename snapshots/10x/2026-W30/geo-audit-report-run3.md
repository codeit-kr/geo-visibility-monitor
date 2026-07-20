# GEO 감사 리포트 — 코드잇 텐엑스 (10x)

- **대상 URL**: https://10x.codeit.kr
- **isoWeek**: 2026-W30 · **capturedAt**: 2026-07-20T19:51:59Z
- **brandSourcesVersion**: 1
- **입력 고정(재현성)**: 점검 대상 페이지는 항목의 `auditUrls` 9개로 한정(sitemap 임의 크롤·랜덤 샘플 금지). 페이지 신호는 커밋된 `snapshots/10x/2026-W30/pages.json`(고정 캡처) 사용. 기술 신호는 robots.txt / sitemap.xml / server-sitemap.xml / llms.txt / llms-full.txt **존재여부만** 점검. 외부 브랜드 신호는 항목의 `brandSources` 고정 체크리스트만 composite 반영.
- **현지화**: 한국 시장 기준. 영문 Wikipedia·Reddit·G2·Trustpilot·Clutch 부재는 critical 미분류·가중치 하향, Wikidata(언어무관 핵심)는 유지.
- **모회사 상속 규칙**: `brandSources`의 "(모회사)" 항목은 코드잇(parent) 엔티티다. 사이트 Organization 스키마가 `parentOrganization`으로 `www.codeit.kr`에 연결되고 그 모엔티티가 존재하면 **부분 가점**(자식이 부모 엔티티 상속). 완전 가점은 텐엑스 전용 엔티티가 있을 때만 — 현재 전용 엔티티 없음.

## 종합 점수

| 카테고리 | 가중치 | 점수 |
|---|---|---|
| **Composite** | — | **73** |
| Citability | 0.25 | 92 |
| Brand | 0.20 | 55 |
| E-E-A-T | 0.20 | 44 |
| Technical | 0.15 | 75 |
| Schema | 0.10 | 90 |
| Platform | 0.10 | 95 |

> composite = 92·0.25 + 55·0.20 + 44·0.20 + 75·0.15 + 90·0.10 + 95·0.10 = **73.3 → 73**

관측된 커버리지(고정 입력): HTML 페이지 8 · 콘텐츠 페이지 7 · 강의 페이지 7 · meta description 커버리지 100% · h1 커버리지 100% · rich schema 커버리지(콘텐츠) 100% · FAQ 커버리지(강의) 100% · title 100% · htmlLang 100% · canonical 100% · JSON-LD 전부 valid.

---

## Citability — 92 / 100

| 항목 | 배점 | 근거 | 획득 |
|---|---|---|---|
| C1 llms.txt 존재·구조화 | 18 | `/llms.txt` 200, 업무효율·수익화·서비스개발 섹션 + 과정별 설명 + "회사(모회사) 코드잇" 링크 | 18.0 |
| C2 meta description 커버리지 ×18 | 18 | 8개 HTML 전부 description = 100% | 18.0 |
| C3 h1 커버리지 ×12 | 12 | 전 페이지 h1 정확히 1개 = 100% | 12.0 |
| C4 rich 추출형 schema 커버리지 ×22 | 22 | 콘텐츠 7개 전부 Course+FAQ = 100% | 22.0 |
| C5 강의 FAQ Q&A ×12 | 12 | 강의 7개 전부 FAQPage = 100% | 12.0 |
| C6 서술형 title ×10 | 10 | 100% | 10.0 |
| C7 날짜 있는 에디토리얼 | 8 | NewsArticle/Article 없음(강의 랜딩만) | 0.0 |

**메모**: 페이지 단위 구조 품질은 만점급(설명·h1·Course·FAQ 100%). 유일 감점은 날짜 있는 에디토리얼 콘텐츠 부재 — 콘텐츠 **폭**은 강의 랜딩 8페이지로 좁음(품질↑, 폭↓).

## Brand — 55 / 100

composite 반영 외부 신호 = `brandSources`(v1) — **전 항목 "(모회사)"=코드잇 parent 엔티티**. 텐엑스 스키마의 `parentOrganization`→`www.codeit.kr` 연결 + 모엔티티 존재 시 상속 부분가점.

| brandSource (모회사) | 배점 | 판정 | 근거 | 획득 |
|---|---|---|---|---|
| 나무위키 /w/코드잇 | 25 | 🟡 부분(상속) | 텐엑스 `sameAs`엔 미직결, `parentOrganization`→코드잇, 코드잇 `sameAs`에 나무위키 존재 → 순수 상속(×0.6) | 15.0 |
| Wikidata 코드잇/Codeit | 22 | ❌ 부재 | 모엔티티(코드잇)의 Wikidata 항목 자체가 부재(노르웨이 CodeIT만 검색됨). 언어무관 핵심 유지 → 공백 | 0.0 |
| ko.Wikipedia /wiki/코드잇 | 13 | ❌ 부재 | 모엔티티 문서 404 | 0.0 |
| blog.naver.com/codeitofficial | 16 | ✅ | 텐엑스 Organization `sameAs`에 직접 등재 + HTTP 200 | 16.0 |
| youtube.com/@codeit | 14 | ✅ | 텐엑스 `sameAs` 직접 등재 + HTTP 200 | 14.0 |
| linkedin company/codeit-official | 10 | ✅ | 텐엑스 `sameAs` 직접 등재 + HTTP 200 | 10.0 |

**획득 합 55 / 100.** 소셜 채널은 텐엑스 스키마에 직접 연결돼 완전가점, 나무위키는 순수 상속이라 부분가점. **완전 가점은 텐엑스 전용 엔티티(나무위키/Wikidata 독립 항목)가 생길 때만** — 현재 없음. 모엔티티(코드잇)조차 Wikidata·ko.Wikipedia 부재라 상속으로도 그라운딩 상한이 낮음.

## E-E-A-T — 44 / 100

| 항목 | 배점 | 근거 | 획득 |
|---|---|---|---|
| Org 아이덴티티 완비 | 14 | EducationalOrganization + parentOrganization 그래프 | 14.0 |
| 의미있는 description 커버리지 ×10 | 10 | 100% | 10.0 |
| 저자/발행자 표기 | 10 | Article 없음 → 저자표기 없음 | 0.0 |
| 리뷰/사회적 증거 표면 | 10 | `/reviews` 등 사회적 증거 페이지 없음(auditUrls 내) | 0.0 |
| 검증형 AggregateRating 마크업 | 10 | AggregateRating/Review 마크업 없음 | 0.0 |
| 사례/고객 증거 | 10 | 사례 페이지 없음 | 0.0 |
| 인증/자격 신호 | 12 | 정부 인증 과정 아님. 전문가 1:1 코칭 언급(부분) | 6.0 |
| 외부 엔티티 권위 | 12 | 모엔티티(코드잇) 상속(×0.6) | 7.2 |
| 콘텐츠 폭/깊이 ×12 | 12 | 콘텐츠 7페이지(전부 강의 랜딩) → 7/12 | 7.0 |

**최대 리스크 카테고리.** 텐엑스는 신뢰 신호(독립 리뷰·AggregateRating·사례·저자표기·에디토리얼 깊이)가 대부분 부재하고 코드잇 권위에 의존. 개선: (1) 후기/성과 페이지 + Review/AggregateRating 마크업, (2) 강사·전문가 프로필(Person 스키마), (3) 사례/성과 콘텐츠.

## Technical — 75 / 100 *(존재여부만 점검)*

| 파일 | 배점 | 상태 | 획득 |
|---|---|---|---|
| robots.txt | 25 | 200 | 25 |
| sitemap.xml | 30 | 200 | 30 |
| server-sitemap.xml | 15 | **404** | 0 |
| llms.txt | 20 | 200 | 20 |
| llms-full.txt | 10 | **404** | 0 |

**공백: `server-sitemap.xml`, `llms-full.txt` 부재.** (robots.txt는 `Allow: /` 전면 허용 — 참고용, 점수는 존재여부만.)

## Schema — 90 / 100

| 항목 | 배점 | 근거 | 획득 |
|---|---|---|---|
| Org/EducationalOrganization 사이트와이드 | 18 | 전 페이지 | 18 |
| WebSite | 8 | 전 페이지 | 8 |
| sameAs 채워짐 | 14 | 5개 채널 | 14 |
| 강의 페이지 Course | 15 | 강의 7개 전부 Course(offers+hasCourseInstance+provider) | 15 |
| FAQPage ×12 | 12 | 강의 100% | 12 |
| BreadcrumbList | 10 | 전 강의 | 10 |
| Article/NewsArticle | 8 | 없음 | 0 |
| AggregateRating/Review | 7 | 없음 | 0 |
| parentOrganization 링크 | 5 | `parentOrganization`→코드잇 정상 연결 | 5 |
| JSON-LD 전부 valid | 8 | 100% | 8 |

**메모**: 강의 스키마는 offers/instance/provider까지 완비. 감점은 에디토리얼(Article)·평점(Review) 마크업 부재.

## Platform — 95 / 100

| 항목 | 배점 | 근거 | 획득 |
|---|---|---|---|
| AI 크롤러 접근 | 20 | robots `Allow: /`, AI 봇 차단 없음 | 20 |
| llms.txt 디스커버리 | 15 | 존재 | 15 |
| 답변엔진용 구조화데이터 ×20 | 20 | rich 커버리지 100% | 20 |
| 사이트맵 선언 | 10 | sitemap.xml | 10 |
| KR/Naver + ko-lang 일관성 ×15 | 15 | 네이버 블로그 sameAs·한국어 + htmlLang 100% | 15 |
| 신선도/날짜 신호 | 10 | Article 없음 → 부분 | 5 |
| canonical+https 일관성 ×10 | 10 | canonical 100% | 10 |

**메모**: 답변엔진 노출 기반(구조화·크롤러·llms.txt·ko-lang)은 최상급. 유일 감점은 날짜형 신선도 신호.

---

## 디스커버리 (composite 점수 미반영)

- **텐엑스 전용 엔티티 부재**: 나무위키/ko.Wikipedia/Wikidata에 "코드잇 텐엑스" 독립 항목 없음 → 현재 Brand는 모엔티티 상속 상한(부분가점)에 묶임. 전용 엔티티 생성 시 완전가점 전환 가능(기록만, 점수 무관).
- **Facebook 페이지**: 텐엑스 `sameAs`에 `facebook.com/codeit.kr`(코드잇 공유 채널) 존재, brandSources 미등재 → v2 후보.
- **Instagram**: 텐엑스 `sameAs`에 `instagram.com/codeit_kr` 존재(brandSources(10x)에는 미포함, codeit 항목엔 있음).
- **모엔티티 그라운딩 공백**: 코드잇 자체의 Wikidata·ko.Wikipedia 부재가 상속 상한을 낮춤 — 모회사 엔티티 확립이 텐엑스 Brand의 선행 조건.
- **미탐색 KR 커뮤니티**: OKKY·블라인드·커리어리·네이버 카페 등 고정 입력 범위 밖 → 별도 조사 대상(현 점수 무관).

## 방법론·재현성 노트

- 동일 `auditUrls` + 동일 `pages.json` 고정 캡처 + 동일 `brandSources`(v1) → **동일 입력 = 동일 점수**. 각 카테고리는 체크리스트 가점 합.
- 기술 신호는 5개 파일 **존재여부만**. "(모회사)" 브랜드 소스는 parentOrganization 연결·모엔티티 존재 확인 시 **부분가점**(직접 fetch 불필요), 완전가점은 전용 엔티티 존재 시.
- 사용한 brandSourcesVersion: **1**.
