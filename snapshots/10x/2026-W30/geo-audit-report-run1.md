# GEO Audit Report: 코드잇 텐엑스 (Codeit 10x)

**App:** `10x`
**URL:** https://10x.codeit.kr
**ISO Week:** 2026-W30
**Captured At:** 2026-07-20T19:52:04Z
**brandSourcesVersion:** 1
**Pages Analyzed:** 9 (고정 `auditUrls` 세트 — sitemap 크롤/랜덤 샘플 미수행)
**Market:** 한국 (KR 현지화 채점)

---

## Executive Summary

**Overall GEO Score: 68/100 (Fair)**

코드잇 텐엑스는 전 과정 페이지에 Course + FAQPage + BreadcrumbList 구조화 데이터, 전 페이지 `htmlLang=ko`, 완전 개방(`Allow: /`) robots, 잘 구조화된 `llms.txt` 를 갖춰 **citability·schema·technical 은 견고**하다. 다만 텐엑스 **전용 외부 엔티티가 없어** 브랜드/플랫폼 신호는 모회사 코드잇에 의존한다. 사이트 Organization 스키마가 `parentOrganization` 으로 `www.codeit.kr(#organization)` 에 연결돼 있고 그 모회사 엔티티가 존재(나무위키 등)하므로 **모회사 소스는 부분 가점**했다(완전 가점은 텐엑스 전용 엔티티가 있을 때만).

### Score Breakdown

| Category | Score | Weight | Weighted |
|---|---|---|---|
| AI Citability | 84/100 | 25% | 21.0 |
| Brand Authority | 42/100 | 20% | 8.4 |
| Content E-E-A-T | 60/100 | 20% | 12.0 |
| Technical GEO | 84/100 | 15% | 12.6 |
| Schema & Structured Data | 86/100 | 10% | 8.6 |
| Platform Optimization | 50/100 | 10% | 5.0 |
| **Overall GEO Score** | | | **67.6 → 68** |

> composite 반영 외부 신호 = 이 항목 고정 `brandSources` v1 뿐. 전 항목이 "(모회사)" 표기 → `parentOrganization` 연결 + 모회사 엔티티 존재 시 **부분 가점** 규칙 적용.

---

## Category Deep Dives (체크리스트 근거)

### AI Citability — 84/100

| 신호 | 배점 | 획득 | 근거 |
|---|---|---|---|
| `llms.txt` 존재 & 잘 구조화 | 20 | 20 | `/llms.txt` 200, 2,800 bytes. `# 코드잇 텐엑스`, 요약 blockquote, 업무효율/콘텐츠/AI개발/회사 섹션. 모회사 링크 명시 |
| 추출형 Q&A(FAQPage) | 20 | 20 | **전 8개 과정** 페이지에 FAQPage |
| 헤딩 구조(H1 비율) | 15 | 15 | 전 HTML 페이지 H1≥1 |
| 자기완결형 구조 콘텐츠(Course + 설명) | 15 | 13 | 전 과정 Course + 상세 설명. 단 과정 페이지만(편집형 다양성 낮음) |
| 안정적 canonical | 10 | 9 | 전 HTML canonical 존재 |
| AI 크롤러 접근 | 15 | 15 | robots `Allow: /` 전면 개방 + sitemap 선언 |
| 편집형 롱폼 깊이 | 5 | 0 | articles/tutorials/blog 등 편집 콘텐츠 고정셋 내 없음 |
| **합계(정규화)** | | **84** | |

### Brand Authority — 42/100

`brandSources` v1 = 6개, **전부 "(모회사)"**. `parentOrganization → www.codeit.kr(#organization)` 연결 확인, 모회사 엔티티 존재 → **부분 가점** 원칙. (엔티티/권위 성격 소스)

| brandSource (모회사) | 판정 | 근거 |
|---|---|---|
| 나무위키 `/w/코드잇` | 🟡 부분 | 텐엑스 sameAs 엔 미포함이나 `parentOrganization` 로 모회사 상속. 모회사 홈 sameAs 에 namu 존재(직접 fetch 403이어도 인정) → 부분 가점 |
| ko.wikipedia `/코드잇` | ❌ | 모회사도 부재(404/API MISSING) → 상속 불가 |
| Wikidata 코드잇/Codeit | ❌ | 모회사도 부재(검색 결과 없음). **언어무관 핵심** → 감점 유지 |
| blog.naver.com/codeitofficial | ✅ | 200 + 텐엑스 홈 `sameAs` 에 직접 포함 |
| youtube.com/@codeit | ✅ | 200 + 텐엑스 홈 `sameAs` 에 직접 포함 |
| linkedin.com/company/codeit-official | ✅ | 200 + 텐엑스 홈 `sameAs` 에 직접 포함 |

**획득:** naver/youtube/linkedin 직접 연결(✅ 3) + namu 부분 상속(🟡) + ko-wiki/wikidata 부재(❌ 2). 전용 엔티티 부재 + 모회사 자체의 Wikidata/KO-위키 공백으로 상단 캡 제한 → **42/100** (완전 가점 아님).

### Content E-E-A-T — 60/100

| 신호 | 배점 | 획득 | 근거 |
|---|---|---|---|
| 조직 정체성/신뢰(Organization + parentOrganization) | 20 | 18 | EducationalOrganization + `parentOrganization`(코드잇) 상속, 설명/logo/sameAs |
| 저자 귀속(Person) | 20 | 6 | 개별 저자/강사 Person 스키마 부재 |
| 최신성(날짜 신호) | 15 | 11 | Course `offers.priceValidUntil`(2026-07) 등 날짜 신호 |
| 경험/증거(후기·사례) | 15 | 7 | 고정셋 내 reviews/cases 페이지 없음(과정 설명 내 서술만) |
| 권위/전문성 | 15 | 10 | "전문가 1:1 코칭" 등 서술 + 상세 커리큘럼(hasPart) |
| 투명성(offers/가격) | 15 | 8 | Course `offers` 가격·통화·재고·유효기간 명시 |
| **합계(정규화)** | | **60** | |

### Technical GEO — 84/100

제약: 아래 5개 파일 **존재여부만** 점검.

| 파일 | 10x | 배점 | 획득 |
|---|---|---|---|
| robots.txt | 200 ✅ | 20 | 20 |
| sitemap.xml | 200 ✅ | 20 | 20 |
| server-sitemap.xml | 404 ❌ | 20 | 0 |
| llms.txt | 200 ✅ | 20 | 20 |
| llms-full.txt | 404 ❌ | 20 | 0 |
| **파일 소계** | | 100 | 60 |

보조 결정적 신호(pages.json): HTTPS ✅, 전 `auditUrls` 200 ✅, canonical 전 HTML ✅, **전 페이지 htmlLang=ko** ✅(모회사보다 우수), robots 전면 개방 ✅ → +24 보정. **최종 84/100.**

### Schema & Structured Data — 86/100

| 신호 | 배점 | 획득 | 근거 |
|---|---|---|---|
| Organization/EducationalOrganization | 20 | 20 | `#organization` name/url/logo/description/sameAs |
| parentOrganization 연결 | 10 | 10 | `parentOrganization → www.codeit.kr#organization` (부모 상속 근거) |
| WebSite | 10 | 7 | WebSite 존재하나 **SearchAction(potentialAction) 부재**(모회사 대비 미비) |
| Course | 20 | 20 | 전 과정 Course(provider/offers/hasPart 커리큘럼) |
| FAQPage | 15 | 15 | 전 과정 FAQPage |
| BreadcrumbList | 10 | 10 | 전 과정 |
| Article/News | 10 | 0 | 편집 콘텐츠 없음(해당 없음) |
| sameAs | 5 | 4 | 5개 링크(namu 직접 미포함) |
| **합계(정규화)** | | **86** | |

### Platform Optimization — 50/100

KR 생태계. composite 반영 = `brandSources`(모회사) 중 콘텐츠/소셜.

| 플랫폼 | 판정 | 근거 |
|---|---|---|
| YouTube @codeit (모회사) | 🟡 부분 | 텐엑스 sameAs 에 직접 연결(모회사 공용 채널) |
| 네이버 블로그 (모회사) | 🟡 부분 | 텐엑스 sameAs 에 직접 연결 |
| 나무위키(지식 그라운딩, 모회사) | 🟡 부분 | parentOrganization 상속 |
| 텐엑스 전용 채널 | ❌ | 전용 YouTube/블로그/커뮤니티 부재 |
| 엔티티 그라운딩(Wikidata/KO-Wiki) | ❌ | 부재(모회사 포함) |

모회사 공용 채널 상속으로 절반 수준(50). 전용 플랫폼/엔티티 부재가 캡.

---

## Prioritized Actions

**High**
1. **모회사 Wikidata 엔티티 생성** 후, 텐엑스는 그 엔티티의 하위 브랜드로 연결(`subOrganizationOf`/`brand`). 언어무관 핵심 공백.
2. **텐엑스 WebSite 스키마에 SearchAction 추가**(모회사와 정합).

**Medium**
3. `server-sitemap.xml` 발행(현 404) — 동적 과정 페이지 색인 강화.
4. 과정 강사/코치 **Person 스키마 + 약력** 추가(E-E-A-T 저자 신호).
5. 텐엑스 수강 후기/사례 페이지 확보 후 `Review`/`aggregateRating`.
6. `llms-full.txt` 발행.

**Low**
7. 텐엑스 홈 `sameAs` 에 Instagram 등 모회사 공용 채널 명시 확대(현 5개).

---

## 디스커버리 (composite 미반영 — 참고용)

> 고정 `brandSources` v1 밖 관찰. 점수 미반영.

- **모회사 링크 명시:** `llms.txt` 및 Organization `parentOrganization` 가 `www.codeit.kr` 를 "(모회사)"로 명확히 선언 → 부모 엔티티 상속 근거로 활용(이번 채점 반영).
- **나무위키 직접 접근:** 403(봇 차단). 모회사 sameAs·parentOrganization 로 확인 인정, 별도 fetch 불필요(규칙 준수).
- **후속 검증 후보(미확인, 미반영):** 텐엑스 전용 언급이 있을 수 있는 KR 커뮤니티 — OKKY, 블라인드, 커리어리, 네이버 카페. 확정 시 `brandSources` v2(텐엑스 전용) 편입 검토.
- WebSearch 도구 미승인으로 커뮤니티 언급 정량 검증은 이번 실행 미수행.

---

## 재현성 노트

- 감사 대상은 9개 `auditUrls` 로 한정, 임의 크롤/랜덤 샘플 미수행 → 동일 입력=동일 점수.
- 기술 신호는 robots.txt / sitemap.xml / server-sitemap.xml / llms.txt / llms-full.txt **존재여부**만 점검(HTTP status).
- 페이지 신호는 `snapshots/10x/2026-W30/pages.json` 스냅샷 기준.
- composite 외부 신호 = `brandSources` v1(전부 모회사) → parentOrganization 연결·모회사 엔티티 존재로 **부분 가점**만. 사용한 **brandSourcesVersion: 1**.
