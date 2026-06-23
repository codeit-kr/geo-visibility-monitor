# GEO 감사 리포트 — 코드잇 스프린트 (sprint)

- **대상 사이트:** https://sprint.codeit.kr
- **isoWeek:** 2026-W26
- **capturedAt:** 2026-06-23T10:10:19Z
- **brandSourcesVersion:** 2
- **시장/현지화:** 한국(KR) — 엔티티 그라운딩·평판·플랫폼은 한국 생태계 기준. 영문 Wikipedia/Reddit/G2/Trustpilot/Clutch 부재는 critical 미분류·가중치 하향. Wikidata 는 언어무관 핵심이라 가중치 유지.
- **재현성:** 감사 대상은 항목의 `auditUrls` 로 한정(sitemap 임의 크롤·블로그 랜덤 샘플 없음). 기술 신호는 robots.txt / sitemap.xml / server-sitemap.xml / llms.txt / llms-full.txt 의 **존재여부만** 점검. 각 카테고리 점수는 객관 신호 체크리스트의 가점 합.

---

## 종합 점수

**Composite GEO Score: 74 / 100 (Fair → Good 경계)**

가중식: `citability×0.25 + brand×0.20 + eeat×0.20 + technical×0.15 + schema×0.10 + platform×0.10`

| 카테고리 | 점수 | 가중치 | 가중 점수 |
|---|---|---|---|
| AI Citability | 80 | 0.25 | 20.00 |
| Brand Authority | 48 | 0.20 | 9.60 |
| Content E-E-A-T | 73 | 0.20 | 14.60 |
| Technical GEO | 85 | 0.15 | 12.75 |
| Schema & Structured Data | 90 | 0.10 | 9.00 |
| Platform Optimization | 80 | 0.10 | 8.00 |
| **Composite** | | | **73.95 → 74** |

**한 줄 요약:** 기술·스키마 기반은 매우 견고하고(SSR, 풀 JSON-LD, AI 크롤러 개방, llms.txt) FAQ·Course·Offer 스키마로 AI 인용 적합성도 높다. 최대 병목은 **브랜드 외부 엔티티 권위(48)** — 한국어 Wikidata 항목 부재, ko.Wikipedia 부재, 나무위키는 sprint 전용이 아닌 **모회사(코드잇) 엔티티 상속(부분 가점)**에 머문다.

---

## 감사 대상 페이지 (auditUrls — 고정 입력)

| # | URL | HTTP | JSON-LD | 비고 |
|---|---|---|---|---|
| 1 | https://sprint.codeit.kr/ | 200 | 3블록 | EducationalOrg+WebSite / FAQPage(7) / ItemList(8트랙) |
| 2 | https://sprint.codeit.kr/career | 200 | 2블록 | Org+WebSite만(스키마 얇음, FAQ/Breadcrumb 없음) |
| 3 | https://sprint.codeit.kr/track/frontend-advanced | 200 | 2블록 | Course+Offer+FAQ(8)+Breadcrumb |
| 4 | https://sprint.codeit.kr/track/backend-spring | 200 | 2블록 | Course+CourseInstance+Offer+FAQ(9) |
| 5 | https://sprint.codeit.kr/track/fullstack | 200 | 2블록 | Course+CourseInstance+Offer+FAQ(13) |
| 6 | https://sprint.codeit.kr/track/ai | 200 | 2블록 | Course+CourseInstance+Offer+FAQ(12) |
| 7 | https://sprint.codeit.kr/track/data | 200 | 2블록 | Course+CourseInstance+Offer+FAQ(11) |
| 8 | https://sprint.codeit.kr/track/product-design | 200 | 2블록 | Course+CourseInstance+Offer+FAQ(9) |
| 9 | https://sprint.codeit.kr/track/it-founder | 200 | 2블록 | Course+CourseInstance+Offer+FAQ(11), **meta description 누락** |
| 10 | https://sprint.codeit.kr/llms.txt | 200 | — | 유효한 llms.txt(기술 신호로 점검) |

---

## 카테고리별 체크리스트 근거

### 1) Technical GEO — 85 / 100

> 제약에 따라 **5개 파일의 존재여부**만으로 채점(주관 인상 배제). robots 항목은 유효성+AI 크롤러 개방 포함.

| 신호 | 배점 | 결과 | 근거 |
|---|---|---|---|
| robots.txt 존재·유효 + AI 크롤러 개방 | 20 | ✅ 20 | `User-agent: *`, `Disallow: /admin`, `/become` 만. GPTBot/ClaudeBot/PerplexityBot 등 차단 없음. `Host` + Sitemap 2건 선언 |
| sitemap.xml 존재·유효 | 20 | ✅ 20 | 유효한 `<urlset>`, 2 URL(홈, /career), lastmod 2026-06-23 |
| server-sitemap.xml 존재·유효 | 15 | ✅ 15 | 유효한 `<urlset>`, 8 URL(트랙 페이지), robots 에서 선언됨 |
| llms.txt 존재·유효 | 30 | ✅ 30 | H1 `코드잇 스프린트` + 요약 블록쿼트 + 트랙8/취업지원/회사 링크섹션. 모회사 링크 포함 |
| llms-full.txt 존재 | 15 | ❌ 0 | **HTTP 404 — 미존재** |
| **합계** | **100** | **85** | |

- 보조 관찰(가점 외): 전 페이지 HTTPS·SSR(원본 HTML 에 본문 텍스트 렌더). robots 의 Disallow 는 비공개 경로 한정으로 AI 가시성에 무해.
- **개선:** `llms-full.txt` 추가가 유일한 결손 신호.

### 2) Schema & Structured Data — 90 / 100

| 신호 | 배점 | 결과 | 근거 |
|---|---|---|---|
| 유효 JSON-LD 사이트 전역(파싱 성공) | 15 | ✅ 15 | 전 페이지 파싱 성공, `@graph`/`@id` 구조화 |
| EducationalOrganization(logo+description+url) | 10 | ✅ 10 | `#organization` 노드, 로고 ImageObject |
| sameAs | 8 | ✅ 8 | YouTube·Instagram·Facebook·Naver블로그·LinkedIn |
| parentOrganization 엔티티 연결 | 7 | ✅ 7 | `parentOrganization → https://www.codeit.kr/#organization`(코드잇) |
| WebSite 스키마 | 5 | ✅ 5 | publisher → #organization |
| FAQPage(핵심 페이지) | 12 | ✅ 11 | 홈+트랙7 = 8/9 페이지(career 누락) |
| Course(전 트랙) | 15 | ✅ 15 | 트랙 7/7 Course |
| CourseInstance | 6 | ✅ 5 | 6/7(frontend-advanced 누락) |
| Offer(가격) | 8 | ✅ 8 | 전 트랙 Offer |
| BreadcrumbList | 7 | ✅ 7 | 전 트랙 |
| Review/AggregateRating | 5 | ❌ 0 | 만족도·후기 텍스트 다수이나 **마크업 없음** |
| career 페이지 스키마 완성도 | 2 | ◐ 1 | Org+WebSite만 |
| **합계** | **100** | **90** | (반올림) |

- **개선:** ① 후기/만족도를 `Review`/`AggregateRating` 으로 마크업(인용 적합성·신뢰 동반 상승) ② career 에 FAQ/Breadcrumb 추가 ③ frontend-advanced 에 CourseInstance.

### 3) AI Citability — 80 / 100

| 신호 | 배점 | 결과 | 근거 |
|---|---|---|---|
| FAQ Q&A 인용성(자기완결 Q→A) | 24 | ✅ 24 | 홈7, 트랙 8~13개 Q&A(예: 훈련장려금·출석·병행가능 여부 직답) |
| 구체 수치/사실(취업·가격·기간) | 18 | ✅ 18 | 트랙당 %통계 9~17개, 가격(원) 4~8개 |
| 콘텐츠 깊이 | 18 | ◐ 13 | 트랙 2,228~4,924단어(우수) vs 홈 616·career 449(얇음) |
| 헤딩/패시지 구조(추출성) | 15 | ◐ 11 | 트랙 h2/h3 풍부, **career h2=0/h3=0**, 홈 h2=2 |
| 자기완결 정의/답변 패시지 | 12 | ✅ 10 | 커리큘럼·지원제도 단락이 맥락 독립적 |
| 메타 설명(스니펫) | 6 | ◐ 5 | 8/9 존재, **it-founder 누락** |
| 신선도 신호(KR 가중↓) | 5 | ◐ 2 | sitemap lastmod 존재, 가시적 게시일 없음 |
| **합계** | **100** | **80** | |

- **개선:** career 페이지에 헤딩 구조·FAQ·취업 성과 수치 보강, it-founder meta description 추가, 홈 본문 패시지화.

### 4) Content E-E-A-T — 73 / 100 (KR 현지화)

| 신호 | 배점 | 결과 | 근거 |
|---|---|---|---|
| Trust: 사업자/법적 고지 | 15 | ✅ 15 | 트랙 footer 통신판매(×3)·대표자·개인정보처리방침 |
| Authority: 정부 인증(고용노동부/KDT/내일배움/HRD-Net) | 20 | ✅ 20 | 트랙당 내일배움 7회·HRD-Net·고용센터·훈련장려금·K-디지털 — 강한 KR 신뢰/권위 신호 |
| Authority: 모회사(코드잇) 엔티티 연결 | 10 | ◐ 8 | parentOrganization 그래프 연결, 단 외부 백과 권위는 약함 |
| Expertise: 커리큘럼/강사·멘토 | 15 | ◐ 12 | 현직자 멘토(트랙당 11~15)·강사(5~12), 단 검증가능 약력/Person 스키마 없음 |
| Experience: 후기/수강생/만족도 | 15 | ◐ 12 | 만족도 21회·후기·수강생 다수, 단 1자 증언 위주 |
| Trust: 가격 투명성(Offer/환급·장려금) | 8 | ✅ 8 | Offer 스키마 + 장려금 안내 |
| 명시적 저자/검증 약력(Person 스키마) | 7 | ◐ 2 | 멘토·강사 마케팅 노출뿐, 구조화 약력 부재 |
| 독립 제3자 권위(Wikipedia/Wikidata/독립리뷰) | 10 | ◐ 3 | Wikidata 한국어 항목 부재(가중치 유지)·ko.Wikipedia 부재(KR 가중↓) |
| **합계(트랙 기준)** | **100** | **80 → 사이트 가중 73** | 홈·career 약세 반영 하향 |

- 사이트 가중: 트랙 7페이지는 강함(≈80), 홈 중간(≈65), career 약함(≈50). 가중 평균 후 ≈73.
- **개선:** ① 강사/멘토 검증 약력 + `Person` 스키마(저자 권위) ② 독립 제3자 인용원 확보(KR 미디어/대학 제휴 보도) ③ career 페이지에 신뢰 신호(법적 고지·성과 데이터) 보강.

### 5) Platform Optimization — 80 / 100 (KR 생태계 기준)

| 신호 | 배점 | 결과 | 근거 |
|---|---|---|---|
| AI 크롤러 개방 + SSR + robots 개방(기반) | 18 | ✅ 18 | 전 AI 크롤러 접근 가능, 본문 SSR |
| llms.txt(ChatGPT/Perplexity) | 10 | ✅ 10 | 유효 llms.txt |
| FAQ+스키마(Google AI Overviews / Naver AI Briefing) | 15 | ✅ 15 | 풍부한 FAQPage/Course |
| Naver 생태계 존재(블로그 등 KR 핵심) | 15 | ✅ 15 | blog.naver.com/codeitofficial(200) |
| YouTube(영상 표면) | 10 | ◐ 8 | @codeit(200) |
| 나무위키 KR 지식그래프(모회사) | 12 | ◐ 10 | 코드잇 항목 존재(부모 sameAs 확인), sprint 전용 아님 |
| 정부/권위 KR 디렉터리(HRD-Net/KDT 등재) | 10 | ◐ 8 | KDT 인증 → HRD-Net 노출 |
| Wikidata/Wikipedia 그라운딩 | 10 | ◐ 2 | Wikidata 한국어 항목 부재(가중치 유지) |
| **합계** | **100** | **86 → 80** | 엔티티 그라운딩 격차·커뮤니티 권위 보통 반영 하향 |

- **개선:** Wikidata 한국어 `코드잇`(나아가 스프린트) 항목 생성이 다수 LLM 그라운딩에 최대 레버리지.

### 6) Brand Authority — 48 / 100 (composite 반영 = brandSources 고정 체크리스트만)

> composite 외부 신호는 **이 항목의 brandSources(v2) 체크리스트뿐**. "(모회사)" 표기는 코드잇(parent) 엔티티 — 사이트 Organization 이 `parentOrganization`(www.codeit.kr)으로 연결되고 그 모회사 엔티티가 존재하면 **부분 가점**. 완전 가점은 sprint 전용 엔티티 존재 시에만. 나무위키 직접 fetch 403 이어도 코드잇 sameAs·parentOrganization 으로 확인되면 인정.

| brandSource | 배점 | 결과 | 근거/판정 |
|---|---|---|---|
| namu.wiki/w/코드잇 (모회사) | 20 | ◐ 12 (부분) | 직접 fetch 403. **그러나 코드잇(parent) Organization `sameAs` 에 `namu.wiki/w/코드잇` 포함 + sprint→parentOrganization 연결 확인 → 모회사 엔티티 상속 부분 가점.** sprint 전용 항목 없음 → 완전가점 불가 |
| ko.wikipedia 코드잇 (모회사) | 10 | ❌ 0 | `ko.wikipedia.org/wiki/코드잇` HTTP 404 — 미존재 (KR 가중치 하향 적용된 배점) |
| Wikidata 코드잇/Codeit (모회사) | 20 | ❌ 0 | 한국어 `코드잇` 엔티티 부재. 검색 결과 `Q30299760 = CodeIT(노르웨이)`로 **별개 회사**. Wikidata 는 언어무관 핵심이라 가중치 유지 → 결손 영향 큼 |
| blog.naver.com/codeitofficial | 12 | ✅ 12 | HTTP 200 + sprint `sameAs` 연결 |
| youtube.com/@codeit | 10 | ✅ 10 | HTTP 200 + sprint `sameAs` 연결 |
| Instagram @codeit.kr, @codeit_sprint | 8 | ◐ 6 | sprint `sameAs` 에 `instagram.com/codeit_kr` 연결(존재). `@codeit_sprint` 는 미연결 → 부분 |
| linkedin.com/company/codeit-official | 8 | ✅ 8 | HTTP 200 + sprint `sameAs` 연결 |
| 잡플래닛 코드잇 기업 페이지 | 12 | ❌ 0 | 직접 조회 HTTP 403(봇 차단)으로 **미확인**, sameAs/parentOrganization 연결도 없음 → 가점 없음(미검증) |
| **합계** | **100** | **48** | |

- **핵심 격차:** Wikidata 한국어 엔티티 부재(20점 중 0) + ko.Wikipedia 부재가 브랜드 점수의 절반 이상을 잠식. AI 엔티티 인식의 최대 레버리지.
- **개선 우선순위:** ① Wikidata 한국어 `코드잇` 항목 생성·정비(언어무관 핵심) ② ko.Wikipedia 문서 ③ sprint 전용 엔티티(나무위키/Wikidata) 확보 시 부분→완전 가점 전환 ④ 잡플래닛 페이지를 sprint/codeit `sameAs` 에 연결해 검증 경로 확보.

---

## 디스커버리 (composite 점수 미반영 — 기록 전용)

감사 중 새로 발견한 소스·연결·커뮤니티. **점수에 넣지 않음.** brandSources 차기 버전 검토용.

- **Facebook:** `facebook.com/codeit.kr` 가 사이트 `sameAs` 에 존재하나 brandSources v2 체크리스트에는 미포함.
- **Instagram @codeit_sprint:** brandSources 에 명시되었으나 사이트 `sameAs`·실데이터에서 미연결/미확인(스프린트 전용 핸들 가설).
- **모회사 codeit.kr Organization:** `EducationalOrganization @id=https://www.codeit.kr/#organization`, `sameAs` = YouTube·Instagram(codeit_kr)·Facebook·Naver블로그·LinkedIn·**namu.wiki/w/코드잇**. sprint 의 parentOrganization 과 `@id` 정합 → 엔티티 그래프 일관.
- **Wikidata 오탐 주의:** `Codeit` 검색 시 `Q30299760(CodeIT, 노르웨이 오슬로)` 노출 — 한국 코드잇과 **동명이인(별개 법인)**. 엔티티 정비 시 혼동·오연결 주의.
- **KR 개발자 커뮤니티(미점검·차기 후보):** OKKY, 블라인드, 커리어리, 네이버 카페 — LLM 의 KR 평판 그라운딩에 영향 가능. 디스커버리로만 기록.
- **정부 디렉터리:** KDT/내일배움카드 인증 → HRD-Net 훈련과정 등재(권위 디렉터리). 차기 brandSources 후보로 검토 가치.

---

## 우선순위 액션 (영향 큰 순)

1. **Wikidata 한국어 `코드잇` 엔티티 생성·정비** — 브랜드·플랫폼·EEAT 동시 상승(언어무관 핵심, 노르웨이 동명 엔티티와 분리).
2. **후기/만족도 → `Review`/`AggregateRating` 스키마 마크업** — 스키마·신뢰·인용 적합성 동반 상승.
3. **강사·멘토 검증 약력 + `Person` 스키마** — EEAT 저자 권위.
4. **career 페이지 보강** — FAQ/Breadcrumb 스키마, 헤딩 구조, 취업 성과 수치(citability+schema+eeat).
5. **`llms-full.txt` 추가 + it-founder meta description** — 기술·citability 결손 메움.
6. **ko.Wikipedia 문서 + 잡플래닛 페이지 sameAs 연결** — 브랜드 검증 경로 확장.

---

## 방법론 메모

- 모든 점수는 위 체크리스트의 **객관 가점 합**(주관 인상 배제). robots/sitemap/server-sitemap/llms/llms-full 은 존재여부만 점검.
- 입력 고정: `auditUrls`(9 페이지 + llms.txt 신호)만 점검, sitemap 임의 크롤·블로그 랜덤 샘플 없음 → 동일 입력 = 동일 점수.
- KR 현지화: 영문 Wikipedia/Reddit/G2/Trustpilot/Clutch 부재는 critical 미분류·가중치 하향. Wikidata 가중치 유지.
- 사용한 brandSources 체크리스트 버전: **brandSourcesVersion = 2**.
