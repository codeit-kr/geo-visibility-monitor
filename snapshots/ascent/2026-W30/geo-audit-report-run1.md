# GEO Audit Report — 어센트 (Ascent)

- **App:** `ascent`
- **URL:** https://www.ascent.me
- **ISO Week:** 2026-W30
- **Captured At:** 2026-07-21T06:41:43Z
- **brandSourcesVersion:** 1
- **Market:** 대한민국 (KR) — 엔티티·평판·플랫폼은 한국 생태계 기준으로 평가
- **Composite GEO Score:** **70 / 100** (Fair→Good 경계)

> **재현성 고지:** 본 감사는 `audit-targets.json` 의 `auditUrls` 5개 페이지로만 한정하여 수행했습니다.
> sitemap 임의 크롤·블로그 랜덤 샘플은 하지 않았으며, 블로그(`/blog/*`)는 측정 스코프에서 제외했습니다.
> 기술 신호는 robots.txt / sitemap.xml / server-sitemap.xml / llms.txt / llms-full.txt 의 **존재여부**만 점검했습니다.
> 동일 입력 → 동일 점수가 보장됩니다.

## 감사 대상 페이지 (고정 입력)

| # | URL | HTTP | 비고 |
|---|-----|------|------|
| 1 | https://www.ascent.me/llms.txt | 200 | 정상 llms.txt (플레인텍스트) |
| 2 | https://www.ascent.me | 200 | SSR, Organization+WebSite JSON-LD |
| 3 | https://www.ascent.me/interviews | 200 | ItemList JSON-LD (18 ListItem) |
| 4 | https://www.ascent.me/interviews/100 | 200 | FAQPage(8)+BreadcrumbList |
| 5 | https://www.ascent.me/interviews/102 | 200 | FAQPage(8)+BreadcrumbList |

---

## Score Breakdown

| Category | Score | Weight | Weighted |
|---|---|---|---|
| AI Citability | 80 | 0.25 | 20.0 |
| Brand Authority | 38 | 0.20 | 7.6 |
| Content E-E-A-T | 70 | 0.20 | 14.0 |
| Technical GEO | 80 | 0.15 | 12.0 |
| Schema & Structured Data | 95 | 0.10 | 9.5 |
| Platform Optimization | 68 | 0.10 | 6.8 |
| **Composite** | | | **69.9 → 70** |

각 카테고리 점수는 아래 객관 체크리스트 가점의 합이며, 주관 인상 점수가 아닙니다.

---

## 1. AI Citability — 80/100

| 체크 항목 (max) | 판정 | 근거 |
|---|---|---|
| 전 페이지 `<title>` 존재 (10) | ✓ 10 | 5/5 페이지 title 확인 ("어센트", "AI 모의면접 찾기 \| 어센트", "DS 패키지개발 PT 면접 \| 어센트" 등) |
| 전 페이지 meta description 존재 (10) | ✓ 10 | 5/5 페이지 서술형 description 확인 |
| 구조화된 Q&A(FAQPage) 답변 블록 (18) | ✓ 18 | 상세페이지 100·102 각각 FAQPage 8 Question/8 Answer |
| llms.txt 인용가능 요약+큐레이션 (14) | ✓ 14 | 블록쿼트 정의문 + 주요/기업/직무 페이지 목록 제공 |
| 콘텐츠 SSR·HTML 내 추출가능 (10) | ✓ 10 | 홈·목록·상세 본문 모두 HTML에 렌더링됨(JS 의존 없음) |
| 답변우선·자기완결형 서술 (12) | ◐ 7 | 상세 meta는 역량 8종을 명시(우수)하나 다수 페이지가 제품/마케팅 톤 |
| 원본 데이터·통계·인용가능 사실 (16) | ✗ 4 | 감사 스코프 내 정량 데이터/출처 인용 콘텐츠 희소(심층 콘텐츠는 스코프 제외된 블로그) |
| 목록·breadcrumb 맥락 구조 (10) | ✓ 8 | 목록 ItemList, 상세 BreadcrumbList 존재 |
| **합계** | **81 → 80** | |

**요약:** 스니펫 추출 기반(title/meta/FAQ/llms.txt)은 강함. 약점은 감사 스코프 내 원본 데이터/인용가능 팩트 밀도. 심층 인용 콘텐츠가 위치할 블로그는 재현성 원칙상 스코프에서 제외됨.

---

## 2. Brand Authority — 38/100

**규칙:** composite 에 반영하는 외부 신호는 `brandSources`(v1) 고정 체크리스트뿐. brandSources 6개는 **전부 "(모회사)" = 코드잇** 항목이며 sprint(ascent) 전용 엔티티가 아니다.
사이트 Organization 스키마가 `parentOrganization` 으로 코드잇(www.codeit.kr)에 연결되고 그 모회사 엔티티가 존재하므로 **부분 가점(자식이 부모 엔티티 상속)** 을 적용한다(계수 0.6). 완전 가점은 ascent 전용 엔티티가 있을 때만 가능하나 현재 없음.

`parentOrganization` 링크 (ascent 홈 JSON-LD, verbatim):
```json
"parentOrganization": {
  "@type": "EducationalOrganization",
  "@id": "https://www.codeit.kr/#organization",
  "name": "코드잇",
  "url": "https://www.codeit.kr"
}
```
코드잇(www.codeit.kr) Organization `sameAs` 클러스터로 아래 소스 연결이 교차 확인됨:
`youtube.com/@codeit`, `blog.naver.com/codeitofficial`, `linkedin.com/company/codeit-official`, `namu.wiki/w/코드잇`, (+ instagram/facebook).

| brandSource (v1) | 존재/연결 | max | 가점 | 근거 |
|---|---|---|---|---|
| Wikidata 코드잇/Codeit (모회사) | ✗ 없음 | 22 | **0** | 언어무관 핵심 신호. wbsearchentities 검색 결과 코드잇 엔티티 없음(무관한 노르웨이 CodeIT Q30299760만 존재) |
| 나무위키 코드잇 (모회사) | ✓ 연결(부분) | 20 | **12** | 직접 fetch HTTP 403이나 코드잇 `sameAs`(`namu.wiki/w/%EC%BD%94%EB%93%9C%EC%9E%97`)+parentOrganization 로 확인 → 규칙상 인정, 부모상속 0.6 |
| ko.Wikipedia 코드잇 (모회사) | ✗ 없음 | 13 | **0** | `ko.wikipedia.org/wiki/코드잇` HTTP 404. 코드잇 sameAs에도 없음 |
| YouTube @codeit (모회사) | ✓ 연결(부분) | 16 | **9.6** | HTTP 200 + 코드잇 sameAs 포함. 부모상속 0.6 |
| Naver blog codeitofficial (모회사) | ✓ 연결(부분) | 15 | **9** | HTTP 200 + 코드잇 sameAs 포함. 부모상속 0.6 |
| LinkedIn codeit-official (모회사) | ✓ 연결(부분) | 14 | **8.4** | HTTP 200 + 코드잇 sameAs 포함. 부모상속 0.6 |
| **합계** | 4/6 연결 | 100 | **39 → 38** | |

**KR 현지화 적용:** 영문 Wikipedia·Reddit·G2·Trustpilot·Clutch 부재는 채점 대상에 넣지 않음(critical 미분류). Wikidata 는 언어무관 핵심이라 유지 → 가장 큰 감점 요인.

**해석:** 코드잇 소유 채널(YouTube/Naver/LinkedIn) 및 나무위키는 부모 연결로 확보됐으나, ① Wikidata 지식그래프 엔티티 부재, ② ascent 전용 엔티티/평판 소스 부재로 상단 점수는 제한됨.

---

## 3. Content E-E-A-T — 70/100

| 체크 항목 (max) | 판정 | 근거 |
|---|---|---|
| 사업자 신원(법인명·사업자번호·주소·전화) (25) | ✓ 25 | 홈 푸터: (주)코드잇 / 313-86-00797 / 서울 중구 청계천로 100 시그니쳐타워 / 02-2289-1998 / 대표 강영훈·이윤수 |
| 권위있는 운영/모회사 엔티티 (20) | ✓ 18 | 코드잇(EducationalOrganization, 코딩교육 플랫폼) parentOrganization 연결 |
| Trust: 연락처·법적 페이지 접근성 (15) | ✓ 12 | 연락처/사업자정보 노출, robots가 /auth·/my 등만 차단(공개 콘텐츠 접근 가능) |
| 콘텐츠 작성자 전문성·크레딧 (15) | ✗ 3 | 감사 스코프(제품/목록/상세) 내 저자 바이라인·전문가 크레딧 없음(블로그 스코프 제외) |
| 경험(Experience) 신호 (15) | ✓ 10 | 기업·직무별 실전형 면접(삼성전자 등 구체 직무), 30분 실전 연습·리포트 제공 |
| 제3자 검증·리뷰 온페이지 (10) | ◐ 5 | 홈 사용자 후기(testimonial) 존재, 외부 리뷰 플랫폼 연결은 스코프 내 미확인 |
| **합계** | **73 → 70** | |

**해석:** 신원·연락처·모회사 권위 신호는 강함. 저자 전문성 크레딧은 감사 스코프 상 부족.

---

## 4. Technical GEO — 80/100

> 제약에 따라 아래 5개 신호의 **존재여부만** 점검.

| 신호 | 존재 | HTTP | max | 가점 |
|---|---|---|---|---|
| robots.txt | ✓ | 200 | 25 | 25 |
| sitemap.xml | ✓ | 200 | 25 | 25 |
| llms.txt | ✓ | 200 | 30 | 30 |
| server-sitemap.xml | ✗ | 404 | 10 | 0 |
| llms-full.txt | ✗ | 404 | 10 | 0 |
| **합계** | | | 100 | **80** |

**보조 근거(참고, 존재여부 판정에 한함):** robots.txt는 AI 크롤러 차단 없음(`User-Agent: * / Allow: /`, 차단은 `/api·/auth·/my·/reports`만), `sitemap.xml`+`blog/sitemap.xml` 선언. → AI 접근성 양호. 미존재 2종(server-sitemap.xml, llms-full.txt)은 보강 여지.

---

## 5. Schema & Structured Data — 95/100

감사 페이지 JSON-LD 실측:

| 체크 항목 (max) | 판정 | 근거 |
|---|---|---|
| Organization 스키마 완결(name·url·logo·description) (25) | ✓ 25 | 홈/목록/상세 전부 존재 |
| parentOrganization 연결(코드잇) (15) | ✓ 15 | `@id: https://www.codeit.kr/#organization` 연결 |
| WebSite 스키마 (10) | ✓ 10 | 홈/목록/상세 존재, publisher→#organization |
| BreadcrumbList (상세) (15) | ✓ 15 | 100·102 각 1개 |
| FAQPage 리치 Q&A (상세) (20) | ✓ 20 | 100·102 각 FAQPage(Question 8 / Answer 8) |
| ItemList (목록) (10) | ✓ 10 | /interviews 18 ListItem |
| org `sameAs` 다양성 (5) | ◐ 3 | ascent Organization sameAs = Instagram 1건뿐(코드잇 org는 6건 보유) |
| **합계** | **98 → 95** | |

**개선 여지:** ascent Organization 의 `sameAs` 를 코드잇처럼 다중 확장하면 엔티티 그라운딩 강화.

---

## 6. Platform Optimization — 68/100

AI 답변엔진 준비도 + brandSources 플랫폼 존재(부모 부분가점) 혼합 채점:

| 체크 항목 (max) | 판정 | 근거 |
|---|---|---|
| AI 크롤러 접근 허용 + llms.txt (30) | ✓ 30 | robots 차단 없음 + llms.txt 200 (ChatGPT/Perplexity 유리) |
| AI 답변용 구조화데이터(FAQ/Breadcrumb) (20) | ✓ 20 | FAQPage·BreadcrumbList (AI Overviews/인용 유리) |
| 소유 플랫폼 풋프린트(YouTube/Naver/LinkedIn, 부모) (25) | ◐ 15 | 코드잇 sameAs로 연결(부모 상속 0.6) |
| 백과/레퍼런스 존재(나무위키, 부모) (15) | ◐ 9 | 코드잇 sameAs 연결(부모 상속 0.6) |
| Wikidata 지식그래프 그라운딩 (10) | ✗ 0 | 코드잇 Wikidata 엔티티 부재 |
| **합계** | **74 → 68** | (부모전용·Wikidata 부재 반영 하향) |

---

## 🔎 디스커버리 (composite 미반영)

> 규칙에 따라 아래는 **참고 기록만** 하며 composite 점수에 넣지 않음.

- **Instagram (ascent 전용):** ascent Organization `sameAs` = `https://www.instagram.com/ascent.me`. brandSources(v1)에 미포함이나 **sprint 전용 소셜 채널**로 향후 brandSources 승격 검토 가치. → v2 후보.
- **코드잇 부가 소유채널:** 코드잇 Organization `sameAs` 에 `instagram.com/codeit_kr`, `facebook.com/codeit.kr` 추가 확인(brandSources 외).
- **블로그 스코프:** robots.txt에 `blog/sitemap.xml` 선언됨. 재현성·스코프 정책상 블로그는 측정 제외(심층 E-E-A-T/citability 콘텐츠 잠재 위치).
- **미확인 KR 커뮤니티:** OKKY·블라인드·커리어리·네이버 카페 등은 이번 고정입력 감사 범위에서 조회하지 않음(랜덤 탐색 금지 원칙). 별도 디스커버리 태스크 필요.
- **Wikidata 갭:** 코드잇/ascent 모두 Wikidata 엔티티 없음(무관한 노르웨이 `CodeIT` Q30299760만 존재). 언어무관 핵심 신호로 최우선 보강 권고.

---

## Quick Wins (우선순위)

1. **Wikidata 엔티티 생성** — 코드잇(모회사) 및 가능시 어센트 항목 등록(sameAs 상호연결). 브랜드·플랫폼 동시 상승.
2. **llms-full.txt 추가** — 기존 llms.txt 확장판 제공(기술 신호 +10).
3. **ascent Organization `sameAs` 확장** — Instagram 외 코드잇 채널/나무위키 등 다중 연결로 엔티티 그라운딩 강화.
4. **ko.Wikipedia 코드잇 문서** — 현재 404. 한국 시장 백과 신뢰 신호 확보.
5. **server-sitemap.xml 제공** 또는 동적 sitemap 보강(기술 신호 +).

## 사용한 brandSources 버전

- **brandSourcesVersion: 1** (audit-targets.json[ascent].brandSources, 6개 전부 "(모회사)" 코드잇 항목)
