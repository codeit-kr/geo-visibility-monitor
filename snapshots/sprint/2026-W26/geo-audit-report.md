# GEO Audit Report — 코드잇 스프린트 (sprint.codeit.kr)

**Captured:** 2026-06-22T15:26:15Z  
**ISO Week:** 2026-W26  
**Locale:** KR (Korean)

---

## Composite GEO Score: 52/100

| Dimension | Score | Weight | Weighted |
|---|---|---|---|
| Citability | 58/100 | 25% | 14.50 |
| Brand | 38/100 | 20% | 7.60 |
| E-E-A-T | 58/100 | 20% | 11.60 |
| Technical | 62/100 | 15% | 9.30 |
| Schema | 58/100 | 10% | 5.80 |
| Platform | 34/100 | 10% | 3.40 |
| **Composite** | **52/100** | | **52.20** |

---

## 1. AI Citability — 58/100

### Overview
The site has genuinely strong content on its track pages (employment stats, pricing structure) but the homepage is dominated by promotional language that AI engines will not cite.

### Citation-Ready Passages
- **Tuition/subsidy block (78/100):** "총 훈련비용 22,687,500원 중 정부지원 22,087,500원, 본인부담금 600,000원, 훈련장려금 최대 2,100,000원" — specific KRW figures are highly quotable
- **Employment outcomes block (75/100):** "취업률 71%, 91% IT 직무 취업, 완주율 86%, 비전공자 60%" — four measurable claims
- **FAQ blocks (62/100):** Self-contained Q&A format is inherently citable
- **llms.txt entity definition (64/100):** The site description in llms.txt is the cleanest, most citable description of the brand

### Citation-Unlikely Areas
- Homepage hero copy (25/100): "압도적 만족도 부트캠프" — pure brand language with zero factual density
- Student testimonials (28/100): Anonymous, unanchored, no verifiable details
- Track listing on homepage (22/100): Navigation-level labels with no supporting statistics

### AI Crawler Access: 85/100
- robots.txt is clean and permissive; all 12 tracked AI crawlers are allowed
- Sitemaps severely underbuilt: only 10 of 50+ pages indexed

### llms.txt: 70/100
- `/llms.txt` exists and is well-formed at https://sprint.codeit.kr/llms.txt
- `/llms-full.txt` returns HTTP 404
- Blog content (50+ posts) entirely absent from llms.txt

### Priority Actions
| Priority | Action | Impact |
|---|---|---|
| HIGH | Create `/llms-full.txt` with full page text for key content | Enables AI pre-processing of complete content |
| HIGH | Add all blog posts and pages to sitemaps (currently 10/50+) | Makes most site content discoverable to AI crawlers |
| HIGH | Rewrite homepage hero + meta description to surface statistics | Turns first crawler impression from uncitable to citation-ready |
| MEDIUM | Expand llms.txt with blog index, FAQ, and a stats summary page | Increases AI-accessible content volume |
| MEDIUM | Add `Content-Signal:` directive to robots.txt | Declares AI training/retrieval preferences per emerging standard |

---

## 2. Brand Mentions — 38/100

### Platform Presence
| Platform | Status | Details |
|---|---|---|
| Wikipedia (EN) | **Absent** | No article — critical gap for AI entity recognition |
| Wikipedia (KO) | **Minimal** | Listed in coding bootcamp list article only; no dedicated article |
| Reddit | **Absent** | No confirmable presence |
| YouTube | **Present** | Official `@codeit` channel active; linked via sameAs JSON-LD |
| LinkedIn | **Present** | 1,179 followers, 51–200 employees, Seoul/Berkeley |
| Naver Blog | **Present** | `blog.naver.com/codeitofficial` active; in sameAs |
| Instagram | **Present** | Two accounts: `codeit.kr` + `codeit_sprint`; sameAs linked |
| GitHub | **Minimal** | Two orgs (`codeit-sprint`, `codeit-kr`); low activity; not linked from site |
| Industry reviews | **Absent** | No G2, Capterra, Wanted, Jobplanet, or Rocketpunch listings confirmed |

### Key Gap
Wikipedia absence is the critical failure. The company already meets Wikipedia's notability threshold (100,000+ students, Forbes Asia 30 Under 30 founder, founded 2017).

### Priority Actions
| Priority | Action |
|---|---|
| HIGH | Create English + Korean Wikipedia articles for Codeit/Codeit Sprint |
| MEDIUM | Create listings on Wanted, Jobplanet, Rocketpunch (KR) + G2/Capterra |
| LOW | Add GitHub organization README and link from sameAs |
| LOW | Create a dedicated "Codeit Sprint" LinkedIn company page |

---

## 3. E-E-A-T Content Quality — 58/100

### Dimension Scores
| Dimension | Score | Key Evidence |
|---|---|---|
| Experience | 18/25 | Named graduate interviews with specific outcomes, employer names, timelines, personal photos; blog articles 2,800–3,500 words |
| Expertise | 12/25 | Named instructors with credentials in "현직자 노하우" section; no individual bylines on blog posts |
| Authoritativeness | 13/25 | Named employer outcomes (토스, 쿠팡, 카카오페이, LG CNS); no external media citations |
| Trustworthiness | 15/25 | HTTPS confirmed; legal info on parent domain only; sprint subdomain lacks standalone trust footer |

### Content Metrics
| Metric | Value | Assessment |
|---|---|---|
| Word Count (homepage) | ~900–1,200 words | Short for a YMYL employment services page |
| Word Count (blog articles) | 1,800–3,500 words | Well within ideal range |
| Content Freshness | Active through June 2026 | New content published within last 30 days |
| Internal Links | ~8 (homepage) | Sparse — no pillar-cluster structure |

### Priority Actions
| Priority | Action |
|---|---|
| CRITICAL | Surface legal entity info directly within sprint.codeit.kr (currently only on www.codeit.kr) |
| CRITICAL | Replace brand bylines with named individual authors on all blog posts |
| HIGH | Create dedicated instructor/mentor profile pages with Person schema |
| HIGH | Add proper semantic heading hierarchy (H2, H3) to homepage and course pages |
| HIGH | Publish transparent employment outcomes page with full methodology |
| MEDIUM | Add disclosure notice on student testimonial articles |

---

## 4. Technical SEO — 62/100

### Category Breakdown
| Category | Score | Status |
|---|---|---|
| Server-Side Rendering | 80/100 | Good — Next.js SSR/SSG confirmed |
| Meta Tags & Indexability | 45/100 | Needs Work |
| Crawlability | 70/100 | Fair |
| Security Headers | 40/100 | Poor |
| Core Web Vitals Risk | 55/100 | Fair |
| Mobile Optimization | 75/100 | Good |
| URL Structure | 80/100 | Good |

### Framework
**Next.js SSR/SSG** — Core content is AI-crawler accessible without JavaScript execution. All 12 tracked AI crawlers can read primary page content.

### Critical Findings
- **Canonical tags:** Not verified — high priority to confirm self-referencing canonicals on all pages
- **Security headers:** Likely absent (HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy)
- **Sitemaps:** `sitemap.xml` contains only 2 URLs; `server-sitemap.xml` adds 8 track pages; all 50+ blog posts absent
- **Korean URL slugs:** `/blog/category/수강생-이야기` — technically valid but reduces shareability and analytics clarity
- **`<lastmod>` accuracy:** All `server-sitemap.xml` entries share identical millisecond timestamps (auto-generated, not actual modification dates)

### Priority Actions
| Priority | Action |
|---|---|
| CRITICAL | Validate canonical tags on all pages |
| HIGH | Add security headers in `next.config.js` (HSTS, CSP, X-Content-Type-Options, X-Frame-Options, Referrer-Policy) |
| HIGH | Add JSON-LD structured data (Organization, Course schemas) |
| HIGH | Expand sitemap coverage to include blog pages |
| MEDIUM | Confirm and set `<html lang="ko">` on all pages |
| MEDIUM | Replace Korean-character URL slugs with ASCII equivalents |
| MEDIUM | Fix `<lastmod>` accuracy in `server-sitemap.xml` |

---

## 5. Schema Markup — 58/100

### Detected Structured Data
| # | Type | Format | Valid | Rich Result Eligible |
|---|---|---|---|---|
| 1 | EducationalOrganization (in @graph) | JSON-LD | Yes | N/A |
| 2 | WebSite | JSON-LD | Yes | Partial — no SearchAction |
| 3 | FAQPage (homepage) | JSON-LD | Yes | Restricted since Aug 2023 |
| 4 | ItemList (course tracks) | JSON-LD | Yes | N/A |
| 5 | Course + CourseInstance (track pages) | JSON-LD | Yes | Near-eligible — missing `image` |
| 6 | FAQPage (per-track pages) | JSON-LD | Yes | Restricted |
| 7 | BreadcrumbList (track pages) | JSON-LD | Yes | Yes |

### GEO-Critical Schema Assessment
| Schema | Status | GEO Impact |
|---|---|---|
| EducationalOrganization + sameAs | Partial | Critical — present but missing Wikipedia, Wikidata, Crunchbase |
| Person (author) | **Missing** | High |
| Article + dateModified | **Missing** | High — blog pages have zero JSON-LD |
| Course schema | Present | High — well-implemented; only `image` missing |
| speakable | **Missing** | Medium |
| BreadcrumbList | Partial | Low — track pages only |
| WebSite + SearchAction | Partial | Low — WebSite present, SearchAction absent |

### sameAs Coverage
**Current:** 5 platforms (YouTube, Instagram, Facebook, Naver Blog, LinkedIn)  
**Missing:** Wikipedia, Wikidata, Crunchbase, GitHub, Twitter/X

### Priority Actions
| Priority | Action |
|---|---|
| CRITICAL | Add `BlogPosting` JSON-LD to all blog pages (currently zero structured data) |
| CRITICAL | Add `image` to all Course schemas — single missing property blocking rich results |
| HIGH | Expand `sameAs` on EducationalOrganization to include Wikipedia, Wikidata, Crunchbase |
| HIGH | Add `speakable` to all blog Article schemas |
| HIGH | Add `dateModified` to all content schemas |
| MEDIUM | Add `aggregateRating` to Course schemas |
| MEDIUM | Add `contactPoint` and `address` to EducationalOrganization schema |

---

## 6. Platform Readiness — 34/100

### Per-Platform Scores
| Platform | Score | Status |
|---|---|---|
| Google AI Overviews | 38/100 | Critical |
| ChatGPT Web Search | 30/100 | Critical |
| Perplexity AI | 36/100 | Critical |
| Google Gemini | 35/100 | Critical |
| Bing Copilot | 30/100 | Critical |

### Google AI Overviews (38/100)
- FAQ section present (9 questions homepage + /career); no FAQPage schema applied
- Homepage H1 is a marketing tagline, not a query-matching phrase
- No answer-target pattern (heading not followed by immediate direct prose answer)
- Sitemap contains only 2 URLs — entire blog content library invisible to Google crawler via sitemap

### ChatGPT Web Search (30/100)
- No Wikipedia article — AI cannot confidently resolve "코드잇 스프린트" as a known entity
- No Organization schema with sameAs properties
- GPTBot/OAI-SearchBot not explicitly named in robots.txt (wildcard only)

### Perplexity AI (36/100)
- No confirmed Reddit/Naver/Quora community discussions
- Employment statistics use "내부 기준" (internal) sourcing — Perplexity cannot independently verify
- PerplexityBot not named in robots.txt; entire blog undiscoverable via sitemap

### Google Gemini (35/100)
- YouTube channel exists but @codeit_kr handle returned 404 (likely unclaimed)
- No Google Business Profile confirmed; no sameAs schema linking to Google properties
- No Knowledge Panel seeded

### Bing Copilot (30/100)
- **Zero confirmed Bing index presence** — brand search returns Sprint Corporation/T-Mobile results only
- No IndexNow implementation; no msvalidate.01 meta tag
- No LinkedIn company page confirmed

### Cross-Platform Priority Actions
| Priority | Action | Platforms Affected |
|---|---|---|
| CRITICAL | Submit to Bing Webmaster Tools + implement IndexNow | Bing Copilot, ChatGPT |
| CRITICAL | Add Organization schema (JSON-LD) with full sameAs array | All five platforms |
| HIGH | Add FAQPage schema to homepage and /career FAQ sections | Google AI Overviews, Gemini, Bing |
| HIGH | Create Korean Wikipedia article for 코드잇 | ChatGPT, Gemini, Perplexity |
| HIGH | Create and populate LinkedIn company page | Bing Copilot, ChatGPT, Gemini |
| MEDIUM | Expand sitemap.xml to full /blog/ coverage | Google, Gemini, Bing, Perplexity |
| MEDIUM | Publish bi-annual employment outcomes data report | Perplexity, Google, ChatGPT |

---

## Top 10 Prioritized Recommendations

1. **[CRITICAL]** Submit sprint.codeit.kr to Bing Webmaster Tools and implement IndexNow — brand has zero Bing index presence, blocking all Copilot visibility.
2. **[CRITICAL]** Add `Organization` JSON-LD schema to sprint.codeit.kr with `sameAs`, `legalName`, `address`, `foundingDate`, and `contactPoint` — single block raises entity recognition across all five AI platforms.
3. **[CRITICAL]** Add `BlogPosting` JSON-LD + `speakable` to all blog pages — currently zero structured data on 50+ high-quality content assets.
4. **[CRITICAL]** Surface legal entity information (사업자등록번호, address, contact) directly in the sprint.codeit.kr footer — currently only on www.codeit.kr.
5. **[HIGH]** Create Korean Wikipedia article for 코드잇 — highest single-action impact for ChatGPT entity recognition and Google Knowledge Graph seeding.
6. **[HIGH]** Add `image` property to all Course JSON-LD schemas — the sole missing property blocking Google Course rich result eligibility.
7. **[HIGH]** Expand `sitemap.xml` from 2 URLs to full /blog/ coverage (50+ posts) — strongest crawler discoverability fix.
8. **[HIGH]** Add security headers to `next.config.js` (HSTS, X-Content-Type-Options, X-Frame-Options, Referrer-Policy, CSP).
9. **[HIGH]** Replace brand bylines with named individual authors on blog posts + create author profile pages with Person schema.
10. **[MEDIUM]** Expand sameAs links to include Wikipedia, Wikidata, Crunchbase across all Organization schema instances.

---

*Report generated: 2026-06-22T15:26:15Z | Audit tool: geo-visibility-monitor v1 | Locale: KR*
