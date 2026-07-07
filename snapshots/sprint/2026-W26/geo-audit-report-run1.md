# GEO 감사 리포트 — 코드잇 스프린트 (sprint)

- **대상 URL**: https://sprint.codeit.kr
- **ISO 주차**: 2026-W26
- **capturedAt**: 2026-06-23T10:10:22Z
- **brandSourcesVersion**: 2
- **감사 모드**: 재현성 고정(고정 입력 / 객관 신호 체크리스트 / KR 현지화)

> 본 감사는 재현성을 위해 아래 **고정 입력**만 사용했다. sitemap 임의 크롤·블로그 랜덤 샘플 없음 → 동일 입력 = 동일 점수.
> 각 카테고리 점수는 주관 인상이 아니라 **객관 신호 체크리스트의 가점 합**이며, 항목별 근거를 남긴다.

## 고정 입력 (auditUrls — 10건)

| # | URL | HTTP | SSR | 단어수(약) | 주요 스키마 |
|---|---|---|---|---|---|
| 1 | https://sprint.codeit.kr/ | 200 | ✅ | 198KB HTML | EducationalOrganization(@graph)+WebSite, FAQPage, ItemList |
| 2 | https://sprint.codeit.kr/career | 200 | ✅ | ~449 | EducationalOrganization+WebSite |
| 3 | https://sprint.codeit.kr/track/frontend-advanced | 200 | ✅ | ~2,228 | Course+Offer, FAQPage, BreadcrumbList |
| 4 | https://sprint.codeit.kr/track/backend-spring | 200 | ✅ | ~4,713 | Course+Offer+CourseInstance, FAQPage, BreadcrumbList |
| 5 | https://sprint.codeit.kr/track/fullstack | 200 | ✅ | ~4,241 | Course+Offer+CourseInstance, FAQPage, BreadcrumbList |
| 6 | https://sprint.codeit.kr/track/ai | 200 | ✅ | ~4,947 | Course+Offer+CourseInstance, FAQPage, BreadcrumbList |
| 7 | https://sprint.codeit.kr/track/data | 200 | ✅ | ~3,408 | Course+Offer+CourseInstance, FAQPage, BreadcrumbList |
| 8 | https://sprint.codeit.kr/track/product-design | 200 | ✅ | ~3,842 | Course+Offer+CourseInstance, FAQPage, BreadcrumbList |
| 9 | https://sprint.codeit.kr/track/it-founder | 200 | ✅ | ~3,979 | Course+Offer+CourseInstance, FAQPage, BreadcrumbList |
| 10 | https://sprint.codeit.kr/llms.txt | — | — | — | **파일 미존재**(HTML 페이지로 응답, 실제 llms.txt 아님) |

---

## 종합 점수

**Composite GEO Score: 69 / 100 (Fair)**

가중식: `citability·0.25 + brand·0.20 + eeat·0.20 + technical·0.15 + schema·0.10 + platform·0.10`

| 카테고리 | 점수 | 가중치 | 가중점 |
|---|---|---|---|
| Citability (인용가능성) | 84 | 0.25 | 21.00 |
| Brand (브랜드 권위) | 21 | 0.20 | 4.20 |
| E-E-A-T | 74 | 0.20 | 14.80 |
| Technical (기술) | 75 | 0.15 | 11.25 |
| Schema (구조화 데이터) | 88 | 0.10 | 8.80 |
| Platform (플랫폼) | 92 | 0.10 | 9.20 |
| **합계** | | | **69.25 → 69** |

**한 줄 요약**: 온사이트 GEO 기반(스키마·인용가능성·플랫폼 연결)은 매우 강하나, **외부 엔티티 그라운딩(Wikidata·위키백과 부재)**이 종합 점수를 끌어내리는 단일 최대 병목이다.

---

## 카테고리별 체크리스트 근거

### 1) Citability — 84/100
| 신호 (객관) | 결과 | 가점/배점 |
|---|---|---|
| 모든 감사 페이지 SSR(텍스트 추출 가능) | ✅ 10/10 200 OK + 본문 텍스트 존재 | 16/16 |
| 핵심 페이지 ≥6/8 가 1,500단어 초과 | ✅ 7/8 (career만 ~449) | 12/12 |
| 홈 FAQPage Q&A 블록 | ✅ 7개 Q&A | 10/10 |
| 전 트랙 페이지 FAQPage Q&A | ✅ 7/7 트랙 | 12/12 |
| 페이지당 단일 명확 H1 | ✅ | 8/8 |
| 자기완결형 답변 텍스트(인용 단위) | ✅ FAQ 답변 독립적 | 12/12 |
| 정량 주장/통계 존재 | ✅ 취업률·만족도 수치 | 8/8 |
| 엔티티 정의/요약 블록 | ✅ Organization description | 6/6 |
| 온페이지 날짜/신선도 신호 | ❌ 본문 게시일 없음(sitemap lastmod만 존재) | 0/8 |
| llms.txt 추출 가이드 | ❌ 미존재 | 0/8 |

**소계 84.** 근거: 깊은 SSR 본문 + 구조화 FAQ로 인용 적합성 우수. 감점은 온페이지 날짜 부재와 llms.txt 부재.

### 2) Brand — 21/100  *(composite 반영은 brandSources 고정 체크리스트만)*
브랜드 권위 하위집합 = 지식/평판 소스 4종. KR 현지화 적용: 영문 위키백과 부재는 critical 제외·가중↓, **Wikidata는 언어무관 핵심이라 유지**.

| brandSources 항목 | 유형 | 검증 방법 | 결과 | 가점/배점 |
|---|---|---|---|---|
| Wikidata: 코드잇/Codeit (모회사) | 지식그래프(언어무관·핵심) | wbsearchentities API (ko/en) | ❌ 해당 엔티티 없음 (en "CodeIT"=노르웨이 Q30299760 무관) | 0/30 |
| namu.wiki/w/코드잇 (모회사) | KR 지식위키 | 직접 fetch 403 → **모회사 sameAs로 확인** | ⚠️ 부분(부모 엔티티 상속) www.codeit.kr sameAs에 `namu.wiki/w/코드잇` 존재 | 21/35 (0.6) |
| ko.wikipedia.org/wiki/코드잇 (모회사) | KR 백과 | 직접 fetch | ❌ 404 (문서 없음) | 0/20 |
| 잡플래닛: 코드잇 기업 페이지 | 평판 | 직접 fetch / search | ⚠️ 미검증(403 anti-bot, 스키마 sameAs 링크 없음) → 미가점 | 0/15 |

**소계 21.** 근거: namu.wiki만 모회사 sameAs 경유로 부분 인정. Wikidata·ko.위키백과 실측 부재 확인. 잡플래닛은 확인 불가로 보수적 미가점(아래 비고 참조).
- *비고*: 잡플래닛이 추후 확인되면 brand는 상승 여지. 재현성·객관성 원칙상 확인된 신호만 가점.
- *완전 가점 조건*: namu.wiki/Wikidata에 **sprint 전용 엔티티**가 존재할 때(현재는 모회사 코드잇 엔티티만 → 부분).

### 3) E-E-A-T — 74/100 (KR 현지화)
| 신호 | 결과 | 가점/배점 |
|---|---|---|
| 조직 정체성 + 설명(스키마+온페이지) | ✅ | 12/12 |
| 모회사 코드잇 기성 권위 | ✅ parentOrganization 연결 | 10/10 |
| 수강생 후기/경험담(Experience) | ✅ "수강생 후기" 섹션 | 12/12 |
| 출처 표기된 정량 성과 | ✅ 취업률 "2025년 고용24 기준·수강생 2,598명 대상" | 12/12 |
| 신뢰 해소형 투명 FAQ | ✅ | 10/10 |
| 정부지원 자격 신호(KR) | ✅ 훈련장려금·고용센터·HRD-Net | 10/10 |
| 명시적 강사/멘토 자격·약력(Person) | ⚠️ "전문 강사진·멘토" 언급뿐, 약력/Person 스키마 없음 | 4/12 |
| 감사 페이지 내 사업자/법적/연락처 정보 | ❌ 사업자등록번호·개인정보·약관 텍스트 미검출 | 0/8 |
| Wikidata 엔티티(권위) | ❌ 부재 | 0/8 |
| KR 외부 권위(namu.wiki via 모회사) | ⚠️ 부분 | 4/6 |

**소계 74.** 근거: 출처표기 통계 + 정부지원 신호 + 후기로 신뢰·경험 강함. 감점은 명시적 전문가 약력 부재와 감사 페이지 내 사업자/법적 정보 미검출(footer가 클라이언트사이드/별도 페이지 가능성 — auditUrls 한정 평가).

### 4) Technical — 75/100  *(robots.txt / sitemap.xml / server-sitemap.xml / llms.txt / llms-full.txt 존재여부만 점검)*
| 신호 | 결과 | 가점/배점 |
|---|---|---|
| robots.txt 존재 + 전 AI 크롤러 허용(GPTBot/ClaudeBot/PerplexityBot/Google-Extended 차단 없음) | ✅ `User-agent: *` Disallow는 /admin,/become 만 | 30/30 |
| sitemap.xml 존재 | ✅ (URL 2건) | 25/25 |
| server-sitemap.xml 존재 | ✅ (URL 8건, 트랙) | 20/20 |
| llms.txt 존재 | ❌ 파일 미존재(HTML 응답) | 0/15 |
| llms-full.txt 존재 | ❌ HTTP 404 | 0/10 |

**소계 75.** 근거: 크롤러 접근·이중 사이트맵(robots에 둘 다 선언)은 우수. llms.txt/llms-full.txt 부재가 유일 감점.

### 5) Schema — 88/100
| 신호 | 결과 | 가점/배점 |
|---|---|---|
| 유효 JSON-LD 존재 | ✅ 홈 3블록 등 | 8/8 |
| Organization/EducationalOrganization | ✅ @id 보유 | 12/12 |
| sameAs | ✅ 5링크(youtube/instagram/facebook/naver/linkedin) | 8/8 |
| parentOrganization 유효 연결 | ✅ sprint→`www.codeit.kr/#organization`(@id 일치, 부모 실재) | 8/8 |
| WebSite 스키마 | ✅ | 4/4 |
| FAQPage | ✅ 홈+전 트랙 | 14/14 |
| Course | ✅ 전 트랙 | 14/14 |
| Offer + CourseInstance + VirtualLocation | ✅ 대부분 트랙 | 10/10 |
| BreadcrumbList | ✅ 트랙 | 6/6 |
| ItemList(트랙 목록) | ✅ 홈 | 4/4 |
| Person/강사 스키마 | ❌ | 0/6 |
| Review/AggregateRating 스키마 | ❌ | 0/6 |

**소계 88.** 근거: GEO 핵심 스키마(Org·FAQ·Course·Breadcrumb·parentOrganization) 폭넓게 구현. Person·Review 스키마 부재가 감점.

### 6) Platform — 92/100  *(brandSources 소셜/콘텐츠 플랫폼 4종, 연결여부 채점)*
| brandSources 항목 | 연결(sameAs) | 결과 | 가점/배점 |
|---|---|---|---|
| youtube.com/@codeit | ✅ sprint sameAs | 연결 | 25/25 |
| blog.naver.com/codeitofficial | ✅ sprint sameAs | 연결 | 25/25 |
| Instagram @codeit.kr, @codeit_sprint | ⚠️ sameAs에 `instagram.com/codeit_kr`만(=@codeit.kr 계열); @codeit_sprint 미연결 | 부분 | 17/25 |
| linkedin.com/company/codeit-official | ✅ sprint sameAs | 연결 | 25/25 |

**소계 92.** 근거: 4개 플랫폼 중 3개 완전 연결, instagram은 2개 핸들 중 1개만 sameAs 연결. (연결=스키마 sameAs 기준, 계정 실시간 검증은 미수행.)

---

## 디스커버리 (composite 미반영 — 참고용)

본 감사 중 **brandSources 고정 체크리스트 외**로 발견된 신호. 점수에 넣지 않음.

- **facebook.com/codeit.kr** — sprint·모회사 sameAs에 존재하나 brandSources 체크리스트엔 없음 → 디스커버리로만 기록.
- **모회사 sameAs 구조** — `www.codeit.kr/#organization` sameAs에 `namu.wiki/w/코드잇` 직접 포함(자식 sprint 엔티티 그라운딩에 유리). brand는 부분 가점으로 이미 반영, 추가 가점 없음.
- **Instagram @codeit_sprint** — brandSources엔 명시되나 사이트 스키마 sameAs에는 미연결(연결 추가 시 platform 상향 여지).
- **커뮤니티(OKKY·블라인드·커리어리·네이버 카페 등)** — 본 재현성 모드는 임의 검색을 수행하지 않음(WebSearch 미사용). 이번 실행에서 능동 발견 없음. 차기 디스커버리 후보로만 기록.

---

## 우선 조치 (점수 영향 큰 순)

1. **Wikidata 엔티티 생성/연결** (brand·eeat 동시 상향, 언어무관 핵심) — 코드잇(모회사) Q-item 생성 + sprint를 `subsidiary`/`part of`로 연결, 양방향 `official website`.
2. **ko.위키백과 / namu.wiki에 sprint 전용 또는 모회사 문서 보강** — sprint 전용 엔티티 확보 시 brand 부분→완전 가점.
3. **llms.txt / llms-full.txt 신설** — technical·citability 동시 상향. 트랙·career·FAQ 구조 요약 제공.
4. **온페이지 날짜/저자(강사) 신호 + Person·Review 스키마** — citability·eeat·schema 동시 상향.
5. **감사 페이지에 사업자/법적·연락처 정보 노출(SSR)** — eeat 신뢰 신호 보강.
6. **Instagram @codeit_sprint를 sameAs에 추가** — platform 보강.

---

## 부록: 기술 신호 원자료

```
robots.txt (존재):
  User-agent: *
  Disallow: /admin
  Disallow: /become
  Host: https://sprint.codeit.kr
  Sitemap: https://sprint.codeit.kr/sitemap.xml
  Sitemap: https://sprint.codeit.kr/server-sitemap.xml
  → AI 크롤러 차단 지시어 없음(전면 허용)

sitemap.xml         : 존재 (URL 2건: /, /career)
server-sitemap.xml  : 존재 (URL 8건: 트랙들, lastmod 2026-06-23)
llms.txt            : 미존재 (HTML 페이지로 응답)
llms-full.txt       : 미존재 (HTTP 404)
```

원자료(부모 엔티티 검증):
```
sprint Organization @id        : https://sprint.codeit.kr/#organization
  parentOrganization @id       : https://www.codeit.kr/#organization   ← 부모 @id와 정확히 일치
www.codeit.kr Organization 실재 : ✅ EducationalOrganization "코드잇"
  부모 sameAs                   : youtube/@codeit, instagram/codeit_kr, facebook/codeit.kr,
                                  blog.naver/codeitofficial, linkedin/codeit-official,
                                  namu.wiki/w/코드잇  ← namu 부분 인정 근거
```

*brandSourcesVersion: 2 기준으로 채점함.*
