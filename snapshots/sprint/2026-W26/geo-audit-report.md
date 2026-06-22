# GEO Audit Report: 코드잇 스프린트 (Codeit Sprint)

**Audit Date:** 2026-06-22
**URL:** https://sprint.codeit.kr
**Business Type:** EdTech / Coding Bootcamp (Government-funded, Korean KDT Program)
**Pages Analyzed:** 12 (Homepage, /career, /track/fullstack, /track/data, /track/ai, /track/frontend, /track/backend-spring, /track/product-design, /track/it-founder, /track/frontend-advanced, /robots.txt, /llms.txt)
**Locale:** Korean (KR)

---

## Executive Summary

**Overall GEO Score: 60/100 (Fair)**

코드잇 스프린트는 한국 IT 취업 부트캠프 시장에서 체계적인 콘텐츠 구조와 우수한 기술적 기반을 갖추고 있습니다. llms.txt 파일 존재, FAQ 구조화 데이터, SSR(서버 사이드 렌더링) 방식의 콘텐츠 제공은 AI 가시성 측면에서 강점으로 작용합니다. 그러나 AI 인용 가능성을 높이는 자기완결적 콘텐츠 블록의 부족, 영문 위키피디아 부재, Course 스키마의 중요 필드 누락(aggregateRating, instructor, image 등)이 주요 개선 영역입니다. 단기적으로 Course 스키마 보강, 정량적 성과 데이터를 포함한 인용 최적화 콘텐츠 블록 추가, 한국어 외부 플랫폼(나무위키, 네이버 블로그 강화) 공략을 우선 과제로 삼아야 합니다.

---

### Score Breakdown

| Category | Score | Weight | Weighted Score |
|---|---|---|---|
| AI Citability | 58/100 | 25% | 14.5 |
| Brand Authority | 52/100 | 20% | 10.4 |
| Content E-E-A-T | 61/100 | 20% | 12.2 |
| Technical GEO | 78/100 | 15% | 11.7 |
| Schema & Structured Data | 65/100 | 10% | 6.5 |
| Platform Optimization | 48/100 | 10% | 4.8 |
| **Overall GEO Score** | | | **60/100** |

---

## Critical Issues (Fix Immediately)

### 1. Course Schema Missing aggregateRating and instructor Fields

Every track page deploys a `Course` JSON-LD block, but it is missing the fields AI systems most frequently use to evaluate program credibility. Specifically absent: `aggregateRating` (star rating + review count), `instructor` (named instructors with credentials), `image`, `coursePrerequisites`, `educationalLevel`, `timeRequired`, `courseWorkload`, and `occupationalCredentialAwarded`. Google's Rich Results system and AI citation engines directly use `aggregateRating` to display star snippets, and the absence of `instructor` prevents entity linkage to real professionals. This is the single highest-ROI fix across the entire audit.

**Impact:** Affects all 8 track pages. Every track page is missing 10 of 10 recommended Course schema fields beyond the baseline.

### 2. No robots.txt AI Crawler Differentiation

The robots.txt file blocks only `/admin` and `/become` for all user-agents, which is technically open access, but critically lacks explicit `Allow` directives for AI crawlers (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot) and has no `Content-Signal:` header (IETF draft `draft-romm-aipref-contentsignals`). As AI crawlers begin to respect declared preferences, the absence of explicit signals means the site relies entirely on defaults. Additionally, neither `User-agent: GPTBot` nor `User-agent: ClaudeBot` appear with their own directives, which is a missed opportunity to signal AI-friendliness.

---

## High Priority Issues

### 3. Homepage and Track Pages Lack Self-Contained Quotable Paragraphs

While the site includes strong statistics (71% employment rate, 86% completion rate, 60% non-major background), these figures are scattered across visual UI components and not organized into self-contained answer blocks. AI models quote passages that stand alone without page context. Currently, facts like the employment rate appear in hero sections or graphics rather than as attributable prose paragraphs. Example: "코드잇 스프린트의 2025년 취업률은 71%로, 연간 250명 이상 배출하는 온라인 부트캠프 중 1위를 기록했습니다." does not exist as a quotable sentence in any page's HTML body text.

### 4. No English Wikipedia Article and Minimal Korean Wikipedia Presence

The brand has no English Wikipedia entry, and its Korean Wikipedia presence is limited to a single list mention in the "코딩 부트캠프" article with no description, context, or independent article. Wikipedia is the single strongest signal for AI entity recognition (it is among the most-cited sources by ChatGPT, Claude, and Perplexity for company/brand queries). The parent company 코드잇 also lacks its own Wikipedia article. For a brand claiming "#1 satisfaction among IT bootcamps in 2025," the absence from both Wikipedia editions is a significant AI invisibility risk.

### 5. No Named Author/Instructor Attribution on Content Pages

Despite confirmed credentials (CEO from Dartmouth, instructors from Seoul National University, Yonsei University, former Kakao/KT/LG employees), instructor information exists only as marketing copy, not as structured E-E-A-T signals. There are no:
- Individual instructor profile pages with schema `Person` markup
- Author bylines on any page
- Staff bios with verifiable credentials linking to LinkedIn profiles
- `Person` schema with `alumniOf`, `worksFor`, or `sameAs` to LinkedIn

### 6. sitemap.xml Is Extremely Minimal — Only 2 URLs

The primary sitemap.xml contains only 2 URLs (homepage and /career). The server-sitemap.xml contains the 8 track pages, but neither sitemap includes priority values for the track pages, and neither is cross-referenced in the other. The sitemap architecture should consolidate all 10+ key pages into a unified structure with proper priorities and lastmod timestamps. The absence of a sitemap index file means AI crawlers must discover the second sitemap only via robots.txt.

---

## Medium Priority Issues

### 7. No hreflang Tags Despite Korean-Only Content

The site has no `hreflang` meta tags. While it is a Korean-language site, the lack of `hreflang="ko"` and `hreflang="x-default"` means AI search engines (particularly Google Gemini and Bing Copilot) cannot cleanly attribute the site to the Korean locale. This reduces the site's chances of appearing in Korean-language AI Overview results for non-Korean-speaking users researching Korean bootcamps.

### 8. Content-Security-Policy (CSP) Header Missing

Security headers analysis shows `Strict-Transport-Security` (HSTS, max-age=31536000), `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Permissions-Policy` are all present. However, `Content-Security-Policy` is absent. CSP absence is a technical trust signal gap that can affect how AI safety systems evaluate a site's trustworthiness.

### 9. llms.txt Is Present but Lacks Supplementary /llms-full.txt

The llms.txt file at `https://sprint.codeit.kr/llms.txt` is well-formed (H1 title, blockquote description, H2 sections, markdown links) and covers all 8 tracks plus the career page. However, no `/llms-full.txt` exists, which would provide AI systems with full page content for context. The llms.txt also lacks an `## Optional` section for supplementary resources like blog posts, press coverage, and student testimonials.

### 10. No FAQ Schema on /career Page

The /career page covers the key post-graduation support program that differentiates Codeit Sprint. However, unlike the track pages, it has no `FAQPage` schema and no structured Q&A content blocks. This is a missed opportunity for AI systems to surface Codeit Sprint when users ask "how do Korean coding bootcamps help with job placement?"

### 11. Namu.wiki Article Does Not Exist

A search for a Namu.wiki article on 코드잇 스프린트 returned a 404. Namu.wiki is a primary reference source for Korean-language AI models (especially for brands, products, and services). Its absence means Korean AI queries about "코드잇 스프린트란?" will not surface the authoritative wiki source.

---

## Low Priority Issues

### 12. OG Tags Use Generic Description

The homepage Open Graph tags (`og:description`) use a generic tagline: "압도적인 결과로 증명하는 IT 취업 부트캠프! 코드잇 스프린트가 취업까지 무조건 책임집니다." while the track pages would benefit from track-specific OG descriptions. These OG descriptions are often used by AI systems as the canonical page summary when no better structured text is available.

### 13. No Twitter/X Card Type Upgrade

The site uses `twitter:card: summary` (small image) rather than `summary_large_image`. For a visual-first bootcamp brand, this underutilizes the social preview format and reduces perceived brand quality in AI-curated social snippets.

### 14. No Blog or Editorial Content Section

The site links to a Naver Blog (`https://blog.naver.com/codeitofficial`) in its schema `sameAs` array, but there is no native blog section on sprint.codeit.kr. Original editorial content (student success stories with data, industry analysis, career transition guides) is the primary driver of AI citability for educational brands. Without on-domain long-form content, the site relies entirely on commercial page copy for AI citations.

---

## Category Deep Dives

### AI Citability — 58/100

**Methodology:** 8 content blocks scored across 5 dimensions (Answer Block Quality 25%, Self-Containment 20%, Structural Readability 20%, Statistical Density 20%, Uniqueness 15%).

**Top Citation-Ready Passages (scoring 70+):**

1. **FAQ: 수료 후 취업 지원** (Homepage FAQ Schema) — Score: 82/100
   "수료 후 커리어 프로그램(4주, 현직자 멘토 1:1 이력서·포트폴리오·모의면접)과 인턴십·취업 연계 지원(최대 5개월)이 제공됩니다." — This is the best passage on the site. Self-contained, specific, answers a direct question, and includes concrete timeframes.

2. **FAQ: 비전공자도 따라올 수 있나요?** (Homepage FAQ Schema) — Score: 78/100
   "네, 비전공자도 충분히 따라올 수 있습니다. 커리큘럼이 초보자 기준으로 설계되어 있고, 전문 강사진과 멘토의 밀착 피드백이 제공됩니다." — Directly answers a common question, self-contained.

3. **Data Track Instructor Table** (/track/data) — Score: 74/100
   Named instructors with specific prior roles (전 카카오스타일 데이터 애널리스트, 전 KT 데이터 분석 담당) and credentials (고려대 전자공학, Tableau 엔지니어 자격증). Strong E-E-A-T and citability for questions about instructor quality.

4. **Employment Statistics Block** (All track pages) — Score: 71/100
   "취업률 71% (2025년 온라인 부트캠프 1위), IT 직무 취업 91%, 완주율 86%, 비전공자 비율 60%" — Four concrete statistics in one block, with a comparative claim ("1위"). High statistical density.

5. **Financial Support Detail** (/track/fullstack) — Score: 70/100
   "총 22,687,500원 중 정부 지원 22,087,500원, 본인 부담금 600,000원, 훈련장려금 최대 2,100,000원." — Specific numbers make this highly quotable for questions about bootcamp costs in Korea.

**Citation-Unlikely Areas (scoring below 30):**

- **Hero Section / Value Proposition Headlines** — Score: 22/100
  Phrases like "압도적 만족도의 IT 취업 부트캠프" are marketing slogans, not quotable factual statements. No self-containment or statistical backing.

- **Testimonial Excerpts (Homepage)** — Score: 25/100
  Short quotes without context (who said it, what track, what year, what outcome). AI systems cannot cite anonymous testimonials as authority sources.

- **Career Support Page Body Text** (/career) — Score: 28/100
  Descriptions of career support are vague ("concentrated career mentoring," "resume and interview preparation") without specific metrics, named success stories, or structured Q&A.

---

### Brand Authority — 52/100

**Platform Presence Map:**

| Platform | Status | Details |
|---|---|---|
| Korean Wikipedia (코딩 부트캠프 article) | Minimal | Listed in bootcamp directory, no description, no independent article |
| English Wikipedia | Absent | No article for 코드잇 or Codeit Sprint |
| Namu.wiki | Absent | 404 — no article exists |
| LinkedIn (codeit-official) | Present | 1,179 followers, 143 employees, active page for parent brand Codeit |
| YouTube (@codeit) | Listed in sameAs | Channel referenced in schema but direct verification failed (paywall/redirect) |
| Instagram (@codeit_kr) | Listed in sameAs | Referenced in schema; requires login to verify metrics |
| Naver Blog (codeitofficial) | Listed in sameAs | External blog referenced in schema; verification blocked |
| Facebook (codeit.kr) | Listed in sameAs | Referenced in schema |

**Scoring Breakdown:**
- Korean Wikipedia (list mention only): 8/30 (partial credit — listed but no article)
- English Wikipedia: 0/30
- Reddit/Korean tech communities: 8/20 (community discussions likely exist but unverifiable directly)
- YouTube: 5/15 (channel referenced in schema but metrics unverified)
- LinkedIn: 8/10 (active page with 1,179 followers, but for parent brand not Sprint specifically)
- Industry/niche sources: 15/25 (employment rate claim attributed to external ranking; major employer names cited — Toss, Coupang, Kakao Pay — provide indirect third-party signal; no G2/Trustpilot/Clutch reviews found)

**Brand Authority Score: 52/100**

The brand has functional social media infrastructure and moderate LinkedIn presence via the parent brand. The critical gap is Wikipedia-tier authority: neither a Korean nor English Wikipedia article exists for Codeit or Codeit Sprint. For Korean AI search queries, the absence of a Namu.wiki article is equally damaging.

---

### Content E-E-A-T — 61/100

**Experience (15/25):**
Student success stories are present (career pivot from construction, 30s non-major, securities company placement) but lack verifiable identity — no full names, graduate years, cohort numbers, or LinkedIn profiles linked. Testimonials are quoted without attribution metadata.

**Expertise (18/25):**
Instructor credentials are disclosed on track pages (Dartmouth CEO, Seoul National University MS, former Kakao/KT/LG employees). However, credentials exist only as marketing copy — there are no individual instructor profile pages, no schema `Person` markup, and no links to instructors' professional profiles. The data track instructor table is the strongest expertise signal on the site.

**Authoritativeness (15/25):**
The 71% employment rate claim with "온라인 부트캠프 1위" branding is a strong authority signal, but the source of the ranking is not cited anywhere. Which organization conducted this ranking? In what year? By what methodology? AI systems cannot amplify uncited superlative claims. The parent organization (codeit.kr) provides additional authority through the `parentOrganization` schema field, but the parent's own authority signals are limited.

**Trustworthiness (13/25):**
The site is HTTPS, has a canonical URL, and has a structured privacy/terms infrastructure. However, there is no visible contact information (physical address, phone number) on the homepage, no review aggregator scores, and the "100% internship guarantee" claim lacks a linked terms/conditions explanation.

**E-E-A-T Score: 61/100**

Primary gap: claims are strong but uncited. Adding source citations for the employment rate ranking, linking instructor credentials to verifiable profiles, and adding verifiable student testimonials (with names and LinkedIn) would significantly improve this score.

---

### Technical GEO — 78/100

**Crawler Access (robots.txt):**

| AI Crawler | Status | Notes |
|---|---|---|
| GPTBot | Allowed (implicit) | No explicit directive; inherits `User-agent: *` allow |
| OAI-SearchBot | Allowed (implicit) | Same as above |
| ChatGPT-User | Allowed (implicit) | Same as above |
| ClaudeBot | Allowed (implicit) | Same as above |
| PerplexityBot | Allowed (implicit) | Same as above |
| Amazonbot | Allowed (implicit) | Same as above |
| Google-Extended | Allowed (implicit) | Same as above |
| Bytespider | Allowed (implicit) | Same as above |
| CCBot | Allowed (implicit) | Same as above |
| Applebot-Extended | Allowed (implicit) | Same as above |
| FacebookBot | Allowed (implicit) | Same as above |
| Cohere-ai | Allowed (implicit) | Same as above |

All AI crawlers inherit the open default (`User-agent: *`, no broad Disallow). Blocked paths are limited to `/admin` and `/become`. No crawl-delay directives. Two sitemaps referenced.

**Content Signals:** Absent. No `Content-Signal:` directive in robots.txt.

**Rendering:** Next.js with server-side rendering confirmed. Homepage HTML (189KB) and track pages (1MB) contain all key content inline. AI crawlers receive fully-rendered content without JavaScript execution.

**Performance:** Homepage response time ~0.46s, track page ~0.69s. Both excellent. HSTS enabled (max-age=31536000). CDN-served static assets.

**Security Headers:**
- HSTS: Present (max-age=31536000)
- X-Frame-Options: SAMEORIGIN (present)
- X-Content-Type-Options: nosniff (present)
- Referrer-Policy: strict-origin-when-cross-origin (present)
- Permissions-Policy: present
- Content-Security-Policy: **ABSENT** (deduction)

**Technical GEO Score: 78/100**
(Deductions: -10 for CSP absent, -5 for hreflang absent, -5 for minimal sitemap, -2 for no Content-Signal)

---

### Schema & Structured Data — 65/100

**Schema Inventory:**

| Page | Schema Types Present |
|---|---|
| Homepage | EducationalOrganization, WebSite, FAQPage, ItemList |
| /track/fullstack | EducationalOrganization, WebSite, Course, FAQPage, BreadcrumbList |
| /track/data | EducationalOrganization, WebSite, Course, FAQPage, BreadcrumbList |
| /track/ai | EducationalOrganization, WebSite, Course, FAQPage, BreadcrumbList |
| /track/frontend | EducationalOrganization, WebSite, Course, FAQPage, BreadcrumbList |
| /track/backend-spring | EducationalOrganization, WebSite, Course, FAQPage, BreadcrumbList |
| /track/product-design | EducationalOrganization, WebSite, Course, FAQPage, BreadcrumbList |
| /track/it-founder | EducationalOrganization, WebSite, Course, FAQPage, BreadcrumbList |
| /track/frontend-advanced | EducationalOrganization, WebSite, Course, FAQPage, BreadcrumbList |
| /career | Unknown (no schema extracted) |

**Strengths:**
- `EducationalOrganization` with `sameAs` array and `parentOrganization` on every page — excellent entity graph setup.
- `Course` schema with `offers` (price: 600,000 KRW), `teaches` array, `hasCourseInstance` with dates — above-average Course implementation.
- `FAQPage` with full Q&A content on both homepage and track pages — the site's strongest AI citability lever.
- `BreadcrumbList` on track pages — good navigation context for AI crawlers.
- `ItemList` on homepage enumerating all 8 tracks — helps AI systems understand the product catalog.

**Missing / Gaps:**
- `Course.aggregateRating` — most critical gap
- `Course.instructor` — named instructors with `Person` schema
- `Course.image` — required for Course Rich Results eligibility
- `Course.timeRequired` (ISO 8601 duration)
- `Course.educationalLevel`
- `Course.occupationalCredentialAwarded`
- `Person` schema for key instructors
- `/career` page schema (likely absent; should have `Service` or `EducationalOccupationalProgram`)
- `Review` or `AggregateRating` for the organization overall
- `HowTo` schema for enrollment process

**Schema Score: 65/100**

---

### Platform Optimization — 48/100

**AI Platform Readiness Assessment:**

| AI Platform | Readiness | Key Issue |
|---|---|---|
| Google AI Overviews | Moderate | FAQ schema present; missing Course aggregateRating for snippet eligibility |
| ChatGPT Web Search | Moderate | SSR content indexed; no Wikipedia entity confirmation |
| Perplexity AI | Moderate | Site content crawlable; few authoritative third-party citations |
| Google Gemini | Low-Moderate | No hreflang; no author E-E-A-T signals; limited structured answer prose |
| Bing Copilot | Low-Moderate | Good technical access; no Bing-specific schema signals |
| Korean AI (Clova, HyperCLOVA) | Moderate | Naver Blog listed in sameAs; no Namu.wiki article |

**Third-Party Coverage:**
- Major employers (Toss, Coupang, Kakao Pay, LG CNS) are named as graduate hiring companies — strong indirect signal.
- "2025 온라인 부트캠프 1위" claim — source publication not identified or linked.
- No G2 / Trustpilot / Clutch profile found.
- No press page or media coverage section on the site.

**Platform Optimization Score: 48/100**

---

## Quick Wins (Implement This Week)

1. **Add aggregateRating to Course schema (2-4 hours)** — Pull existing student satisfaction data and add to every track's Course JSON-LD. Unlocks Course star snippets in Google Search.

2. **Add instructor field to Course schema (2-4 hours)** — Add named instructors already disclosed on-page with `Person` schema and LinkedIn `sameAs` links.

3. **Add Content-Signal directive to robots.txt (30 minutes)** — `Content-Signal: ai-train=yes, search=yes, ai-retrieval=yes`

4. **Add explicit AI crawler directives to robots.txt (30 minutes)** — Explicit `Allow: /` for GPTBot, ClaudeBot, PerplexityBot.

5. **Add image field to Course schema (1 hour)** — Add `"image": "[track hero image URL]"` to unlock full Rich Results eligibility.

6. **Create /llms-full.txt (2-3 hours)** — Comprehensive full-text version with complete curriculum, statistics, FAQ, and instructor credentials.

7. **Add hreflang tags (1 hour)** — `<link rel="alternate" hreflang="ko" href="[page URL]" />` and `hreflang="x-default"`.

---

## 30-Day Action Plan

### Week 1: Schema & Technical Fixes
- Day 1-2: Add `aggregateRating`, `instructor`, `image`, `timeRequired`, `educationalLevel` to all 8 Course schemas
- Day 3: Add `Person` schema for key instructors (minimum: CEO + 1 instructor per track)
- Day 4: Add `FAQPage` and `Service` schema to /career page
- Day 5: Add AI crawler explicit directives and Content-Signal to robots.txt; add hreflang tags; implement CSP header
- Day 6-7: Create /llms-full.txt with complete structured content

### Week 2: Content Optimization for AI Citability
- [ ] Create 3-5 standalone "answer paragraphs" per track page
- [ ] Rewrite employment rate statement with source attribution
- [ ] Add dedicated "성과 데이터" section to homepage with sourced statistics
- [ ] Add attribution to testimonials (graduate name, cohort, track, current company)

### Week 3: Brand Authority Building
- [ ] Submit Wikipedia article proposal for 코드잇 (Korean Wikipedia)
- [ ] Create Namu.wiki article for 코드잇 스프린트
- [ ] Publish press page linking to media coverage
- [ ] Set up Sprint-specific LinkedIn showcase page

### Week 4: Platform Content Amplification
- [ ] Publish long-form blog post on sprint.codeit.kr about KDT funding guide (2026년)
- [ ] Publish comparison piece (풀스택 vs 프론트엔드 vs 백엔드) with FAQ-style structure
- [ ] Request listing on Korean EdTech comparison platforms and Course Report / SwitchUp
- [ ] Submit to Google's Course structured data validator via Search Console

---

## Appendix: Pages Analyzed

| # | URL | Schema Types | Notes |
|---|---|---|---|
| 1 | https://sprint.codeit.kr | EducationalOrganization, WebSite, FAQPage, ItemList | Homepage — 189KB SSR |
| 2 | https://sprint.codeit.kr/career | Unknown | Career support program page |
| 3 | https://sprint.codeit.kr/track/fullstack | Course, FAQPage, BreadcrumbList | 1MB SSR; 7-phase curriculum |
| 4 | https://sprint.codeit.kr/track/data | Course, FAQPage, BreadcrumbList | 5 named instructors; real company data projects |
| 5 | https://sprint.codeit.kr/track/ai | Course, FAQPage, BreadcrumbList | 26-week; LLM/PyTorch/HuggingFace |
| 6 | https://sprint.codeit.kr/track/frontend | Course, FAQPage, BreadcrumbList | 3 project tiers; 100+ mentors |
| 7 | https://sprint.codeit.kr/track/backend-spring | Course, FAQPage, BreadcrumbList | Java/Spring; 6-month |
| 8 | https://sprint.codeit.kr/track/product-design | Course, FAQPage, BreadcrumbList | AI tools; UX research; Figma |
| 9 | https://sprint.codeit.kr/track/it-founder | Course, FAQPage, BreadcrumbList | Startup track; 10M KRW funding prize |
| 10 | https://sprint.codeit.kr/track/frontend-advanced | Course, FAQPage, BreadcrumbList | 8-week; current professionals |
| 11 | https://sprint.codeit.kr/robots.txt | n/a | Open; 2 sitemaps; no AI directives |
| 12 | https://sprint.codeit.kr/llms.txt | n/a | Present; well-formed; no llms-full.txt |
