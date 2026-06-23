# GEO Audit Report: 코드잇 스프린트 (Codeit Sprint)

**Audit Date:** 2026-06-23
**capturedAt:** 2026-06-23T03:59:17Z
**isoWeek:** 2026-W26
**App:** sprint
**URL:** https://sprint.codeit.kr
**Business Type:** EdTech / 코딩 부트캠프 (국비지원 KDT)
**Locale:** Korean (KR) — 한국 시장 서비스
**brandSourcesVersion:** 2
**Pages Analyzed:** 10 (고정 `auditUrls`)

> **재현성 고지 (Reproducibility).** 이 감사는 `audit-targets.json` 의 `sprint` 항목에 고정된 입력만 사용했습니다.
> 감사 대상 페이지는 그 항목의 `auditUrls` 10개로 한정했고(sitemap 임의 크롤·블로그 랜덤 샘플 없음),
> 기술 신호는 robots.txt / sitemap.xml / server-sitemap.xml / llms.txt / llms-full.txt 의 **존재 여부**만 점검했으며,
> 각 카테고리 점수는 주관 인상이 아니라 아래 **객관 신호 체크리스트의 가점 합**으로 산정했습니다. 동일 입력 = 동일 점수.
> composite 외부 신호는 그 항목의 고정 `brandSources` (v2) 체크리스트만 반영합니다.

---

## Executive Summary

**Overall GEO Score: 73/100 (Fair — 상위권)**

코드잇 스프린트는 **기술 인프라(95)·스키마(90)·플랫폼 준비도(83)** 가 매우 탄탄합니다. JSON-LD 가
홈/트랙 전 페이지에 일관되게 깔려 있고(EducationalOrganization·WebSite·FAQPage·Course·BreadcrumbList·Offer),
robots.txt 가 모든 AI 크롤러를 허용하며 llms.txt 가 표준을 따릅니다. 사이트 Organization 스키마는
`parentOrganization` 으로 모회사 **코드잇(www.codeit.kr)** 에 연결되고, 모회사 엔티티가 자체 스키마로 실재함을
확인했습니다.

가장 큰 격차는 **브랜드 권위(38)** 입니다. 독립적 엔티티 그라운딩이 약합니다 — **Wikidata(KR) 부재,
한국어 위키백과 문서 부재**. 나무위키·소셜 채널은 모회사(코드잇) 자산을 `sameAs`·`parentOrganization` 으로
상속해 **부분 가점**만 받습니다(스프린트 전용 엔티티 미존재). E-E-A-T(65) 는 정부 출처(고용24) 기반 통계와
실명 취업 후기로 강점이 있으나, **강사/멘토 개인 자격·바이오 부재**와 일부 후기 익명화가 감점 요인입니다.

### Score Breakdown

| Category | Score | Weight | Weighted |
|---|---|---|---|
| AI Citability | 84/100 | 25% | 21.00 |
| Brand Authority | 38/100 | 20% | 7.60 |
| Content E-E-A-T | 65/100 | 20% | 13.00 |
| Technical GEO | 95/100 | 15% | 14.25 |
| Schema & Structured Data | 90/100 | 10% | 9.00 |
| Platform Optimization | 83/100 | 10% | 8.30 |
| **Overall GEO Score** | | | **73.15 → 73** |

`composite = round(citability·0.25 + brand·0.20 + eeat·0.20 + technical·0.15 + schema·0.10 + platform·0.10)`

### W25→W26 변동 (직전 스냅샷 대비)

| | composite | citability | brand | eeat | technical | schema | platform |
|---|---|---|---|---|---|---|---|
| 직전(17:12:03Z) | 77 | 84 | 52 | 75 | 92 | 83 | 83 |
| 금회(03:59:17Z) | **73** | 84 | **38** | **65** | **95** | **90** | 83 |

> 변동은 시장 변화가 아니라 **객관 재검증** 결과입니다. brand·eeat 하락은 Wikidata/ko.wikipedia 부재와
> 강사 자격 부재를 신호 체크리스트로 엄격 반영한 것이고, technical/schema 상승은 raw HTML 의 JSON-LD 와
> robots/sitemap 신호를 직접 검증해(마크다운 변환에서 누락되던 `<script ld+json>` 포함) 정확히 가점한 결과입니다.

---

## Category Deep Dives (객관 신호 체크리스트)

각 표의 가점 합 = 카테고리 점수. ✓=충족, ◐=부분, ✗=미충족.

### Technical GEO — 95/100

> 점검 범위: robots.txt / sitemap.xml / server-sitemap.xml / llms.txt / llms-full.txt **존재 여부**만 (지시 제약).

| 신호 | 상태 | 근거 | 배점 | 가점 |
|---|---|---|---|---|
| robots.txt 존재·정상 | ✓ | `User-agent: *` + `Host:` + 2개 `Sitemap:` 선언, 200 | 25 | 25 |
| AI 크롤러 허용(미차단) | ✓ | GPTBot/ClaudeBot/PerplexityBot/Google-Extended 차단 룰 **없음**; `Disallow` 는 `/admin`,`/become` 뿐 | 25 | 25 |
| sitemap.xml 존재 | ✓ | 유효 XML, 2 URL, robots 에 선언됨 | 20 | 20 |
| server-sitemap.xml 존재 | ✓ | 유효 XML, 8 URL(트랙), robots 에 선언됨 | 15 | 15 |
| llms.txt 존재·표준 준수 | ✓ | H1 `코드잇 스프린트` + blockquote 요약 + 섹션 링크(부트캠프 트랙/취업 지원/회사), 200 | 10 | 10 |
| llms-full.txt 존재 | ✗ | HTTP 404 | 5 | 0 |
| **합계** | | | **100** | **95** |

### Schema & Structured Data — 90/100

> raw HTML 의 `<script type="application/ld+json">` 직접 파싱(WebFetch 마크다운 변환은 JSON-LD 누락 → curl 로 검증).

| 신호 | 상태 | 근거 | 배점 | 가점 |
|---|---|---|---|---|
| Organization 스키마 완전성 | ✓ | `EducationalOrganization` `@id=…/#organization`, name·url·logo·description 전부 존재 | 15 | 15 |
| sameAs ≥4 | ✓ | 5개: YouTube·Instagram(codeit_kr)·Facebook·Naver blog·LinkedIn | 10 | 10 |
| parentOrganization 연결 | ✓ | → `코드잇` `@id=https://www.codeit.kr/#organization` (전 페이지) | 10 | 10 |
| WebSite 스키마 | ✓ | 전 페이지 존재 | 10 | 10 |
| BreadcrumbList | ✓ | 7개 트랙 페이지 모두 | 10 | 10 |
| Course 스키마 | ✓ | 7개 트랙 페이지 모두 1개씩 | 10 | 10 |
| Offer 스키마 | ✓ | 7개 트랙 페이지 모두(가격/모집) | 10 | 10 |
| FAQPage 스키마 | ✓ | 홈(7 Q&A) + 트랙 전부(8 Q&A) | 15 | 15 |
| Review/AggregateRating | ✗ | 후기·만족도 카피는 있으나 구조화 마크업 없음 | 5 | 0 |
| Person(강사/멘토) 스키마 | ✗ | 없음 | 5 | 0 |
| **합계** | | | **100** | **90** |

검증된 `@type` 분포 — 홈: EducationalOrganization·WebSite·FAQPage(7×Question/Answer)·ItemList(8×ListItem)·ImageObject.
트랙(frontend-advanced 등 7종 동일): Course·BreadcrumbList·Offer·FAQPage·EducationalOrganization(+parentOrganization).

### AI Citability — 84/100

| 신호 | 상태 | 근거 | 배점 | 가점 |
|---|---|---|---|---|
| FAQ/Q&A 추출 블록(스키마+가시) | ✓ | FAQPage 스키마 + 가시 Q&A(홈 7, 트랙 8) | 18 | 18 |
| SSR(HTML 내 본문 추출 가능) | ✓ | 카피·후기·FAQ·통계 라벨 모두 정적 HTML 에 존재 | 12 | 12 |
| llms.txt 추출 보조 | ✓ | 표준 구조로 핵심 페이지 안내 | 10 | 10 |
| 헤딩 위계(단일 H1 + H2/H3) | ✓ | 홈 H1 1·H2 ~8·H3 ~3 | 10 | 10 |
| 정의형/선언형 답변 패시지 | ✓ | "코드잇 스프린트는 실무 중심의 IT 취업 부트캠프입니다" 등 자기완결 정의 | 12 | 12 |
| 출처 표기 통계의 추출성 | ◐ | "2025년 고용24 기준" 출처는 있으나 **표시 숫자 마스킹**으로 값 추출 곤란 | 16 | 8 |
| 검증가능 고유명/성과 | ◐ | 홈은 실명+성과(김하늘 외, 미래에셋증권 합격) ✓ / career 는 익명(주**, 홍**) | 12 | 8 |
| 자기완결 리스트·표 vs 홍보문 | ◐ | ItemList·섹션 구조 ◐, 다수 캐러셀·마케팅 카피 | 10 | 6 |
| **합계** | | | **100** | **84** |

### Content E-E-A-T — 65/100

> KR 현지화: 영문 위키/Reddit/G2/Trustpilot/Clutch 부재는 critical 미분류·가중치↓ (Wikidata 는 언어무관 핵심으로 유지).

| 신호 | 상태 | 근거 | 배점 | 가점 |
|---|---|---|---|---|
| 강사/멘토 실명 자격·바이오 | ✗ | 개인 자격·경력·바이오 없음(에듀 신뢰 핵심 격차) | 15 | 0 |
| 전문성 신호(멘토 제도/커리큘럼) | ◐ | "현직자 멘토", 수강생 멘토 평가 제도 언급(무명) | 10 | 8 |
| 제3자 권위 통계 출처 | ◐ | 홈: **고용24(정부)** 기준 수료율/취업률 ✓ / career: 내부 기준 | 15 | 13 |
| 실명·검증가능 후기/성과 | ◐ | 홈 실명+성과 ✓ / career 익명 처리 | 15 | 11 |
| 채용 파트너 권위 | ✓ | Toss·Coupang·KakaoPay·LG CNS·현대오토에버·컬리·미래에셋 등 20+ | 12 | 12 |
| 조직 정체성/법적 투명성 | ◐ | Organization 스키마 + parent 연결 / about·사업자 정보 명시 약함 | 12 | 9 |
| 콘텐츠 신선도/날짜 | ◐ | sitemap `lastmod`, 2025 데이터 참조 | 10 | 8 |
| 독립 엔티티 인식(Wikidata/위키) | ◐ | 부재(KR 가중치↓); namu 는 모회사 sameAs 로 일부 보완 | 11 | 4 |
| **합계** | | | **100** | **65** |

### Platform Optimization — 83/100

> 한국 생태계 기준. 엔진별 준비도 + AI 표면이 인용/학습하는 채널 존재.

| 신호 | 상태 | 근거 | 배점 | 가점 |
|---|---|---|---|---|
| AI 크롤러 접근(전 봇 허용) | ✓ | robots 차단 없음 → AIO/ChatGPT/Perplexity/Gemini/Bing 수집 가능 | 20 | 20 |
| AI Overviews 대비 구조화(FAQ/스키마) | ✓ | FAQPage·Course·Offer 풍부 | 18 | 18 |
| ChatGPT/Perplexity 대비 llms.txt | ✓ | 표준 llms.txt | 10 | 10 |
| KR 표면(Naver) 존재 — Naver blog | ◐ | blog.naver.com/codeitofficial 라이브+sameAs(모회사); namu/wiki 부재로 Naver 지식 보강 약함 | 14 | 11 |
| YouTube 존재(Gemini/Google 인용) | ◐ | @codeit 라이브+sameAs(모회사) | 10 | 8 |
| 전 엔진 SSR 크롤 가능성 | ✓ | 정적 HTML 본문 | 12 | 12 |
| 크로스엔진 엔티티 그라운딩(Wikidata/위키) | ✗ | 부재(Gemini/AIO/Bing 엔티티 인식 약화; KR 가중치↓) | 16 | 4 |
| **합계** | | | **100** | **83** |

### Brand Authority — 38/100

> **composite 반영 외부 신호는 `brandSources` (v2) 고정 체크리스트뿐.** 각 소스의 존재/연결로 채점.
> "(모회사)" 표기 = 코드잇 parent 엔티티. 사이트 Org 스키마가 `parentOrganization` 으로 코드잇(www.codeit.kr)에
> 연결되고 **그 모회사 엔티티가 실재함을 확인**(www.codeit.kr 자체 `EducationalOrganization` 스키마, `@id …/#organization`)
> → 자식이 부모 엔티티 상속으로 **부분 가점**. 완전 가점은 스프린트 전용 엔티티가 있을 때만.

| # | brandSource (v2) | 상태 | 검증 근거 | 배점 | 가점 |
|---|---|---|---|---|---|
| 1 | Wikidata: 코드잇/Codeit (모회사) | ✗ | `wbsearchentities` 결과 KR 코드잇 엔티티 **없음**(`Codeit` = Q30299760 "CodeIT, Norway" 무관 기업). **언어무관 핵심** → 실가중 격차 | 22 | 0 |
| 2 | namu.wiki/w/코드잇 (모회사) | ◐ | 직접 fetch 403이나, **모회사 코드잇 `sameAs` 에 `namu.wiki/w/코드잇` 명시** + `parentOrganization` 연결로 확인(직접 fetch 불필요 규칙 적용) → 부분 | 16 | 10 |
| 3 | ko.wikipedia/wiki/코드잇 (모회사) | ✗ | MediaWiki API `pages` → `"missing"`(문서 부재) | 12 | 0 |
| 4 | blog.naver.com/codeitofficial | ◐ | 200 라이브 + 스프린트·모회사 양쪽 `sameAs` 연결(모회사 채널) → 부분 | 12 | 9 |
| 5 | youtube.com/@codeit | ◐ | 200 라이브 + `sameAs` 연결(모회사) → 부분 | 10 | 8 |
| 6 | Instagram @codeit.kr, @codeit_sprint | ◐ | `sameAs` 에 `instagram.com/codeit_kr`(모회사) 연결 / **스프린트 전용 @codeit_sprint 는 sameAs 미연결** → 부분 | 10 | 5 |
| 7 | linkedin.com/company/codeit-official | ◐ | 200 라이브 + `sameAs` 연결(모회사) → 부분 | 8 | 6 |
| 8 | 잡플래닛: 코드잇 기업 페이지 | ✗ | 403(봇 차단) + 어떤 `sameAs` 에도 **미연결** → 연결 규칙으로 확인 불가, 보수적 미가점(존재 추정되나 객관 검증·연결 불가) | 10 | 0 |
| | **합계** | | | **100** | **38** |

**해석.** 소유 채널(YouTube·Instagram·Naver blog·LinkedIn)과 모회사 엔티티 그래프는 `sameAs`/`parentOrganization`
으로 잘 연결돼 있으나, **독립 제3자 엔티티 그라운딩(Wikidata·ko.wikipedia)이 비어** 있어 AI 의 엔티티 인식·인용
근거가 약합니다. brandSources v2 가 대부분 모회사(모회사) 소스로 구성돼 있어 설계상 **부분 가점 상한**이 적용됩니다
(스프린트 전용 엔티티 생성 전까지).

---

## 디스커버리 (Discovery — composite 점수 미반영)

> 이번 감사 중 실제로 관측됐으나 `brandSources` (v2) 고정 체크리스트에 **없는** 소스/채널. 기록만 하고 점수엔 넣지 않음.

- **Facebook 페이지** `https://www.facebook.com/codeit.kr` — 사이트 Organization `sameAs` 에 존재하나 brandSources v2 미포함 → composite 제외, 차기 버전 후보.
- **스프린트 전용 Instagram `@codeit_sprint`** — brandSources 에 명시돼 있으나 사이트 `sameAs` 에는 `@codeit_kr`(모회사)만 연결됨. 스프린트 전용 핸들을 사이트 `sameAs` 에 추가하면 #6 가점 상향 가능.
- **소유 블로그** `https://sprint.codeit.kr/blog/...` — 콘텐츠 자산(외부 권위 아님). 다수 글 관측(예: 백엔드 신입 취업 토론, IT 창업 풀스택 가이드 등). citability/E-E-A-T 보강용.
- **이벤트/세미나 페이지** `…/events/*/register` (AI 4기 커리어 세미나, IF 3기 설명회, 프로덕트디자이너 8기 세미나) — 리드 표면, 권위 신호 아님.
- **모회사 코드잇 본진** `https://www.codeit.kr` — parent 엔티티(자체 스키마). 본 감사 대상(스프린트)의 부모로 상속 채점에 사용, 독립 점수 대상 아님.
- 지시에 예시된 OKKY·블라인드·커리어리·네이버 카페 등은 이번 고정 입력·관측 범위에서 **직접 확인되지 않음**(추정 기재하지 않음). 차기 디스커버리에서 별도 조사 권장.

---

## Quick Wins (우선순위)

1. **Wikidata 엔티티 생성**(코드잇/Codeit, KR EdTech) — 언어무관 핵심 그라운딩. brand·platform·eeat 동시 개선. 가장 높은 ROI.
2. **한국어 위키백과 `코드잇` 문서** 작성/확보 — 제3자 권위 + Naver/AI 표면 지식 보강.
3. **`llms-full.txt` 추가** — 유일하게 빠진 기술 신호(technical 5점 회수).
4. **스프린트 전용 `@codeit_sprint` 를 사이트 `sameAs` 에 추가**, 가능하면 **잡플래닛·나무위키 링크도 `sameAs` 에 명시**(연결 검증 가능해져 brand 가점).
5. **Review/AggregateRating + Person(강사/멘토) 스키마** 추가 — 이미 보유한 후기·멘토 정보를 구조화(schema +10, eeat 보강).
6. **career 페이지 통계 비마스킹 + 후기 실명/출처화**, 강사·멘토 **실명 자격·바이오** 노출(citability·eeat 직접 상승).

---

## Appendix: Pages Analyzed (고정 auditUrls 10)

| # | URL | 핵심 신호 |
|---|---|---|
| 1 | https://sprint.codeit.kr/ | EducationalOrganization(+parentOrg,sameAs×5)·WebSite·FAQPage(7)·ItemList; SSR; 고용24 통계·실명 후기 |
| 2 | https://sprint.codeit.kr/career | EducationalOrganization·WebSite; 채용 파트너 20+; 후기 익명·통계 내부기준 |
| 3 | https://sprint.codeit.kr/track/frontend-advanced | Course·BreadcrumbList·Offer·FAQPage(8)·EducationalOrganization(+parentOrg) |
| 4 | https://sprint.codeit.kr/track/backend-spring | 〃 (동일 스키마 셋) |
| 5 | https://sprint.codeit.kr/track/fullstack | 〃 |
| 6 | https://sprint.codeit.kr/track/ai | 〃 |
| 7 | https://sprint.codeit.kr/track/data | 〃 |
| 8 | https://sprint.codeit.kr/track/product-design | 〃 |
| 9 | https://sprint.codeit.kr/track/it-founder | 〃 |
| 10 | https://sprint.codeit.kr/llms.txt | 표준 준수 llms.txt(H1+blockquote+섹션 링크) |

**기술 신호 점검 결과:** robots.txt ✓ | sitemap.xml ✓(2) | server-sitemap.xml ✓(8) | llms.txt ✓(표준) | llms-full.txt ✗(404)

**brandSourcesVersion:** 2
