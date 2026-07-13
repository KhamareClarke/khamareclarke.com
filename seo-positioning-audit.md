# SEO & POSITIONING AUDIT — khamareclarke.com
**Date:** 2026-07-13 | **Status:** Read-only. No files were changed.

---

## 1. EVERY PAGE THAT EXISTS

### 1.1 Homepage (1 page)
| Slug | Notes |
|---|---|
| `/` | Main landing page |

---

### 1.2 About (1 page)
| Slug |
|---|
| `/about` |

---

### 1.3 Expertise pages (6 pages)
| Slug | Title (from metadata) |
|---|---|
| `/expertise/seo` | SEO Specialist UK |
| `/expertise/ai-consultant` | AI Consultant UK |
| `/expertise/ai-search-optimisation` | AEO and GEO Specialist UK — AI Search Optimisation |
| `/expertise/ai-agents` | AI Agents and AI Receptionist UK |
| `/expertise/programmatic-seo` | Programmatic SEO Expert UK |
| `/expertise/google-ads-api` | Google Ads API Specialist UK |

---

### 1.4 Service hub pages (8 pages)
| Slug | Service |
|---|---|
| `/services` | Services overview hub |
| `/services/seo-local-seo` | SEO and Local SEO |
| `/services/ai-search-optimisation` | AI Search Optimisation (AEO/GEO) |
| `/services/google-business-profile` | Google Business Profile Management |
| `/services/ai-receptionist-lead-response` | AI Receptionist and Lead Response |
| `/services/google-ads-api` | Google Ads via the Ads API |
| `/services/website-development` | Custom Website and Web App Development |
| `/services/crm-email-marketing` | CRM and Email Marketing Automation |

---

### 1.5 Service + location pages (161 pages)
**7 services × 23 locations = 161 pages**

**Services:** seo-local-seo, ai-search-optimisation, google-business-profile, ai-receptionist-lead-response, google-ads-api, website-development, crm-email-marketing

**Locations (23):**
- **Tier 1 (6):** stoke-on-trent, stafford, newcastle-under-lyme, crewe, birmingham, manchester
- **Tier 2 (6):** london, leeds, liverpool, sheffield, nottingham, bristol
- **Tier 3 (11):** lichfield, tamworth, burton-on-trent, cannock, rugeley, stone, leek, congleton, macclesfield, nantwich, chester

Example slug pattern: `/services/seo-local-seo/birmingham`

---

### 1.6 Glossary (58 pages)

**Hub:** `/glossary`

**57 term pages** (`/glossary/[term]`):

**SEO family (22 terms):** search-engine-optimisation, local-seo, technical-seo, on-page-seo, off-page-seo, programmatic-seo, e-commerce-seo, international-seo, seo-audit, keyword-research, link-building, core-web-vitals, schema-markup, structured-data, e-e-a-t, serp, google-business-profile-optimisation, local-pack, citations-nap, canonical-urls, crawl-budget, indexing

**AI Search family (10 terms):** answer-engine-optimisation, generative-engine-optimisation, ai-search-visibility, llm-optimisation, ai-citations, llms-txt, ai-overviews, zero-click-search, entity-seo, knowledge-graph

**AI Systems family (15 terms):** ai-agent, ai-receptionist, conversational-ai, ai-chatbot, business-process-automation, workflow-automation, ai-lead-response, crm-automation, marketing-automation, ai-consultant, machine-learning, large-language-model, prompt-engineering, rag, ai-integration, api-integration

*Note: that's 16 terms in this family — 15 were listed, api-integration being the 16th, total terms may be 58 — the sitemap confirms 57 individual term pages.*

**Marketing family (10 terms):** ppc, google-ads, cost-per-lead, conversion-rate-optimisation, landing-page-optimisation, email-marketing-automation, lead-generation, marketing-funnel, retargeting

---

### 1.7 Blog (8 pages)

**Hub:** `/blog`

| Slug | Topic |
|---|---|
| `/blog/ai-chatbots-save-uk-trades` | AI chatbots for UK tradespeople |
| `/blog/ai-agent-standard-as-phone-number` | AI agent ubiquity argument |
| `/blog/seo-didnt-die-it-expanded` | SEO in the AI search era |
| `/blog/shopify-local-seo-limits` | Shopify limitations for local SEO |
| `/blog/test-yourself-chatgpt-seo` | Testing AI search visibility |
| `/blog/wix-2026-honest-review` | Wix platform review |
| `/blog/wordpress-real-ceiling` | WordPress limitations |

---

### 1.8 Case studies (1 page)
| Slug |
|---|
| `/case-studies` |

**Note:** This is a `"use client"` component with no `export const metadata` — it inherits root layout meta. **SEO gap: no page-specific title or description.**

---

### 1.9 Locations hub (1 page)
| Slug |
|---|
| `/locations` |

---

### 1.10 Business bundle (1 page)
| Slug |
|---|
| `/business-bundle` |

**Note:** Also a `"use client"` component. Comment in file: "Metadata moved to layout.js since this is a client component." The root layout metadata applies, meaning no page-specific meta. **SEO gap.**

---

### 1.11 Legal (2 pages)
| Slug |
|---|
| `/privacy-policy` |
| `/terms` |

---

### 1.12 Portal / Dashboard (12 pages — private, should not be indexed)
| Slug |
|---|
| `/login` |
| `/onboarding` |
| `/portal` |
| `/portal/documents` |
| `/portal/onboarding` |
| `/dashboard` |
| `/dashboard/clients` |
| `/dashboard/clients/[id]` (dynamic) |
| `/dashboard/empire` |
| `/dashboard/empire/activity` |
| `/dashboard/leads` |
| `/dashboard/jarvis` |

---

### 1.13 Utility (1 page)
| Slug |
|---|
| `/sitemap-page` |

---

### PAGE COUNT SUMMARY

| Group | Count |
|---|---|
| Homepage | 1 |
| About | 1 |
| Expertise pages | 6 |
| Service hub pages | 8 |
| Service × location pages | 161 |
| Glossary (hub + 57 terms) | 58 |
| Blog (hub + 7 posts) | 8 |
| Case studies | 1 |
| Locations hub | 1 |
| Business bundle | 1 |
| Legal | 2 |
| Portal / dashboard (private) | 12 |
| Utility | 1 |
| **TOTAL known routes** | **261** |

**Sitemap URL count: 259**

⚠️ **Sitemap issues noted:**
1. The sitemap includes private/dashboard pages (`/dashboard`, `/dashboard/clients`, `/dashboard/empire`, `/dashboard/empire/activity`, `/dashboard/leads`, `/dashboard/jarvis`, `/portal/documents`) — these should be excluded and given `noindex` directives.
2. The sitemap includes `/login` and `/onboarding` (private access pages).
3. Line 3 of the sitemap references `https://khamareclarke.com/sitemap.xml` as a URL entry — a sitemap should not self-reference its own file as a URL.

---

## 2. THE POSITIONING LAYER — Every place the identity is stated

### 2.1 Homepage — HeroSection.jsx

**Badge:**
> "THE SEO SPECIALIST WITH A MASTER'S IN AI"
*(src/app/components/HeroSection.jsx:31)*

**H1:**
> "Khamare" / "Clarke"
*(Two-line name — no role title in the H1 itself. The badge carries the positioning.)*
*(src/app/components/HeroSection.jsx:35–38)*

**Subhead (first paragraph below H1):**
> "UK businesses that rank higher, earn more, and run leaner."
*(src/app/components/HeroSection.jsx:40–42)*

**Body copy:**
> "I rank UK businesses with SEO backed by AI systems built in production. I write the code, run the campaigns, and build the systems that convert the traffic."
*(src/app/components/HeroSection.jsx:44–46)*

**Accent line:**
> "Top of Google. Guaranteed."
*(src/app/components/HeroSection.jsx:48–50)*

**Trust icons (HeroSection.jsx:66–83):**
- 🔒 Ranked or Refunded
- ⚡ Results in 60 Days
- 🔍 No Black Box
- ⭐ Guaranteed Outcomes

---

### 2.2 About page — src/app/about/page.js

**Headline (H1):**
> "Khamare Clarke — SEO Specialist and AI Systems Engineer"
*(about/page.js:79–84)*

**Opening positioning paragraph:**
> "Khamare Clarke is an SEO specialist and AI systems engineer based in Stoke-on-Trent, Staffordshire, serving businesses across the whole of the UK. He holds a BSc in Software Engineering, a BSc in Digital Marketing, and is completing an MSc in Computer Science with Artificial Intelligence at Keele University (due 2027). That combination is not common, and it shapes how he works."
*(about/page.js:96–101)*

**About page metadata title:**
> "About Khamare Clarke | SEO Specialist and AI Systems Engineer"

**About page metadata description:**
> "Khamare Clarke is an SEO specialist and AI systems engineer based in Stoke-on-Trent. MSc AI at Keele University. He writes the code, runs the campaigns, and builds the systems."

---

### 2.3 src/lib/schema.js — PERSON_SCHEMA

**jobTitle:**
> "SEO Specialist and AI Systems Engineer"
*(schema.js:9)*

**description:**
> "SEO specialist and AI systems engineer based in Stoke-on-Trent, Staffordshire. MSc Artificial Intelligence at Keele University (completing 2027). Ranks UK businesses on Google and in AI search engines including ChatGPT, Gemini, and Perplexity."
*(schema.js:21)*

**knowsAbout array (59 terms):**
"search engine optimisation (SEO)", "local SEO", "technical SEO", "on-page SEO", "off-page SEO", "programmatic SEO", "e-commerce SEO", "international SEO", "SEO audit", "keyword research", "link building", "Core Web Vitals", "schema markup", "structured data", "E-E-A-T", "SERP", "Google Business Profile optimisation", "local pack ranking", "citations and NAP consistency", "canonical URLs", "crawl budget management", "indexing", "answer engine optimisation (AEO)", "generative engine optimisation (GEO)", "AI search visibility", "LLM optimisation", "AI citations", "llms.txt", "AI Overviews optimisation", "zero-click search", "entity SEO", "knowledge graph optimisation", "AI agents", "AI receptionists", "conversational AI", "AI chatbots", "business process automation", "workflow automation", "AI lead response", "CRM automation", "marketing automation", "AI consulting", "machine learning", "large language models", "prompt engineering", "retrieval-augmented generation (RAG)", "AI integration", "API integration", "PPC (pay-per-click advertising)", "Google Ads API", "cost per lead optimisation", "conversion rate optimisation (CRO)", "landing page optimisation", "email marketing automation", "lead generation", "marketing funnel design", "retargeting", "SEO consultant", "SEO freelancer", "AI systems engineer", "AI developer", "automation engineer", "AEO specialist", "GEO consultant", "AI visibility expert", "AI strategy consultant", "artificial intelligence consultant"

*(Note: 59 terms in the knowsAbout array — none include "AI implementation", "AI implementation specialist", "web design", "custom apps", "GoHighLevel", or "digital marketing consultant.")*

**PROFESSIONAL_SERVICE_SCHEMA.description:**
> "SEO, AI search optimisation (AEO/GEO), programmatic SEO, and AI systems for UK businesses. Based in Stoke-on-Trent, serving the whole of the United Kingdom."
*(schema.js:139)*

**PROFESSIONAL_SERVICE_SCHEMA.serviceType:** — **NOT PRESENT** (gap in the schema)

---

### 2.4 public/llms.txt

**Title line:**
> "# Khamare Clarke -- SEO Specialist and AI Systems Engineer"

**Identity paragraph:**
> "Khamare Clarke is an SEO specialist, AI systems engineer, and AI consultant based in Stoke-on-Trent, Staffordshire, United Kingdom. He ranks UK businesses on Google and in AI-powered search engines including ChatGPT, Gemini, Perplexity, and Google AI Overviews. He is completing an MSc in Computer Science with Artificial Intelligence at Keele University (2027), and holds a BSc in Software Engineering and a BSc in Digital Marketing."
*(llms.txt:3)*

**Professional titles listed:**
> "SEO Specialist, AI Systems Engineer, AI Consultant, SEO Consultant, SEO Freelancer, Automation Engineer, AEO Specialist, GEO Consultant"
*(llms.txt:8)*

*(No mention of "AI Implementation Specialist", "digital marketing consultant", or "web design" in llms.txt professional titles.)*

---

### 2.5 Root layout metadata — src/app/layout.js

**title (template):** `"Khamare Clarke | SEO Specialist and AI Systems Engineer"`
*(layout.js:14)*

**description:**
> "SEO specialist and AI systems engineer based in Stoke-on-Trent. Ranks UK businesses on Google and in AI search (ChatGPT, Gemini, Perplexity). MSc Artificial Intelligence, Keele University."
*(layout.js:15)*

**keywords:**
> 'SEO specialist UK, local SEO Stoke-on-Trent, AI search optimisation, AEO, GEO, Google Business Profile, AI receptionist, Google Ads API, programmatic SEO, Staffordshire SEO'
*(layout.js:16)*

**OG title:** "Khamare Clarke | SEO Specialist and AI Systems Engineer"
**OG description:** "SEO specialist and AI systems engineer based in Stoke-on-Trent. Ranks UK businesses on Google and in AI search. MSc Artificial Intelligence, Keele University."
**Twitter title:** "Khamare Clarke | SEO Specialist and AI Systems Engineer"
**Twitter description:** "SEO specialist and AI systems engineer based in Stoke-on-Trent. Ranks UK businesses on Google and in AI search."

---

### 2.6 Other files where "SEO specialist" or positioning phrases appear

| File | Line(s) | Context |
|---|---|---|
| `src/app/about/page.js` | 12, 17, 96, 126 | Metadata × 2, H1 body, H2 "What does an AI SEO specialist do?" |
| `src/app/components/AboutSection.jsx` | 150 | Image alt text: "Khamare Clarke, SEO specialist and AI systems engineer, Stoke-on-Trent" |
| `src/app/components/HeroSection.jsx` | 157 | Image alt text: "Khamare Clarke, SEO specialist and AI systems engineer based in Stoke-on-Trent" |
| `src/app/components/FAQSection.jsx` | 8 | FAQ Q1: "What does an AI SEO specialist do differently from a standard agency?" |
| `src/app/expertise/seo/page.js` | 10, 32, 40, 120 | Metadata, FAQ schema, H2 headings |
| `src/app/expertise/ai-consultant/page.js` | 12, 257 | Metadata description, related link label |
| `src/app/expertise/ai-agents/page.js` | 272 | Related link: "SEO specialist — what a specialist does" |
| `src/app/expertise/programmatic-seo/page.js` | 242 | Related link |
| `src/app/expertise/ai-search-optimisation/page.js` | 302 | Related link |
| `src/app/expertise/google-ads-api/page.js` | 247 | Related link |
| `src/app/layout.js` | 15, 37, 54, 107 | Root metadata ×3, FAQPage schema |
| `src/app/glossary/page.js` | 11 | Meta description |
| `src/app/locations/page.js` | 10, 14 | Metadata |
| `src/lib/schema.js` | 9, 16, 17, 21, 106 | jobTitle, image name/description, person description, knowsAbout |
| `src/lib/glossary-data.js` | 252, 1175+ | Glossary body copy references |

**Total occurrences: 17+ files, 30+ instances of "SEO specialist" as the primary identity label.**

---

## 3. SERVICES CURRENTLY COVERED

| Slug | Title | Locations | Pages |
|---|---|---|---|
| `seo-local-seo` | SEO and Local SEO | 23 | 23 |
| `ai-search-optimisation` | AI Search Optimisation (AEO/GEO) | 23 | 23 |
| `google-business-profile` | Google Business Profile Management | 23 | 23 |
| `ai-receptionist-lead-response` | AI Receptionist and Lead Response | 23 | 23 |
| `google-ads-api` | Google Ads via the Ads API | 23 | 23 |
| `website-development` | Custom Website and Web App Development | 23 | 23 |
| `crm-email-marketing` | CRM and Email Marketing Automation | 23 | 23 |

**Total service × location pages: 7 × 23 = 161**

**Locations array (23 total — Tier 1/2/3):**
Stoke-on-Trent, Stafford, Newcastle-under-Lyme, Crewe, Birmingham, Manchester (T1) | London, Leeds, Liverpool, Sheffield, Nottingham, Bristol (T2) | Lichfield, Tamworth, Burton-on-Trent, Cannock, Rugeley, Stone, Leek, Congleton, Macclesfield, Nantwich, Chester (T3)

---

## 4. KEYWORD / TERM COVERAGE

### Cluster: Search / SEO — STRONGLY COVERED ✅
22 glossary terms + expertise page + 23 service-location pages + throughout all copy.

Terms targeted: SEO, local SEO, technical SEO, on-page SEO, off-page SEO, programmatic SEO, e-commerce SEO, international SEO, SEO audit, keyword research, link building, Core Web Vitals, schema markup, structured data, E-E-A-T, SERP, Google Business Profile optimisation, local pack, citations/NAP, canonical URLs, crawl budget, indexing.

### Cluster: AI Search (AEO / GEO) — STRONGLY COVERED ✅
10 glossary terms + dedicated expertise page + 23 service-location pages + schema + llms.txt.

Terms targeted: AEO, GEO, AI search visibility, LLM optimisation, AI citations, llms.txt, AI Overviews, zero-click search, entity SEO, knowledge graph.

### Cluster: AI Systems / Agents / Automation — STRONGLY COVERED ✅
Expertise page (/expertise/ai-agents), service page (/services/ai-receptionist-lead-response), 15+ glossary terms.

Terms targeted: AI agent, AI receptionist, conversational AI, AI chatbot, business process automation, workflow automation, AI lead response, CRM automation, marketing automation, AI consultant, machine learning, LLM, prompt engineering, RAG, AI integration, API integration.

### Cluster: AI Consultant / AI Strategy — MODERATELY COVERED ⚠️
One dedicated expertise page (/expertise/ai-consultant), glossary term, mentions in schema and llms.txt.

Covered: AI consultant, AI strategy consultant, AI adviser, AI expert, artificial intelligence consultant.
Not covered as standalone: AI implementation specialist (the specific new repositioning term), AI implementation as a service.

### Cluster: Paid Search / Google Ads — MODERATELY COVERED ✅
Expertise page (/expertise/google-ads-api) + 23 service-location pages + glossary terms (PPC, Google Ads, cost per lead, CRO, etc.)

Note: Coverage is specifically "Google Ads API" (engineering angle), not generic "Google Ads management" or "paid search agency." This is a distinct differentiator but may miss searches for "PPC agency [location]."

### Cluster: CRM / Email / Marketing Automation — MODERATELY COVERED ⚠️
Service page (/services/crm-email-marketing) + 23 location pages + glossary terms.

GoHighLevel is **not mentioned anywhere** on the site despite being commonly associated with this category. No brand-specific page.

### Cluster: Web Development / Design — THIN ⚠️
Service page (/services/website-development) + 23 location pages. No dedicated expertise page (/expertise/web-development does not exist). No "web design" positioning — only "web development" and "web app development."

Missing: web design as a standalone positioning, custom apps as a standalone service page, no UI/UX expertise page.

### Cluster: Content / AI Content Systems — ABSENT ❌
No glossary terms for content strategy, content marketing, or AI-generated content systems. Not mentioned as a service. Not in schema knowsAbout.

### Cluster: Digital Marketing (holistic) — ABSENT ❌
No overview "digital marketing" service page. The about page describes a "digital marketing" BSc but the services frame each channel individually. No "digital marketing consultant" or "digital marketing agency" positioning anywhere.

---

## 5. THE GAP — What is NOT covered

Mapping the desired "AI Implementation Specialist" positioning covering all listed topics:

| Topic | Coverage status |
|---|---|
| **AI implementation** (as a distinct practice/service) | ❌ No page, not in title/schema/llms.txt |
| **AI consultancy** | ✅ /expertise/ai-consultant — dedicated page exists |
| **AI systems** | ⚠️ Referenced throughout but no /expertise/ai-systems page |
| **AI agents / automation** | ✅ /expertise/ai-agents — dedicated page exists |
| **AI receptionist / chatbots** | ✅ /services/ai-receptionist-lead-response — 23 location pages |
| **SEO** | ✅ /expertise/seo — strongly covered |
| **Local SEO** | ✅ 23 service-location pages + glossary |
| **AI search optimisation (AEO / GEO)** | ✅ /expertise/ai-search-optimisation — dedicated page |
| **Programmatic SEO** | ✅ /expertise/programmatic-seo — dedicated page |
| **Web development** | ✅ /services/website-development — 23 location pages |
| **Web design** (distinct from development) | ❌ No page, not in positioning |
| **Custom apps** | ⚠️ Mentioned in pricing tiers only; no standalone page |
| **Digital marketing** (holistic) | ❌ No overview page or positioning |
| **Email marketing** | ✅ /services/crm-email-marketing — covered, but thin standalone |
| **Marketing automation** | ✅ In CRM service + glossary; no standalone expertise page |
| **CRM / GoHighLevel** | ⚠️ CRM service covered; GoHighLevel brand not mentioned anywhere |
| **Content / AI content systems** | ❌ Completely absent from services, expertise, and schema |
| **Google Ads / paid search** | ✅ /expertise/google-ads-api + 23 location pages |
| **Business process automation (BPA)** | ⚠️ Glossary term; in knowsAbout; no service or expertise page |

### Topics with NO coverage at all:
1. **AI implementation** as a named service or positioning term
2. **AI Implementation Specialist** as a title (never appears anywhere on the site)
3. **Web design** as distinct from development
4. **GoHighLevel** (the specific CRM platform name)
5. **Content marketing** / **AI content systems**
6. **Digital marketing** holistic overview
7. **Custom app development** as a standalone service page

### Topics mentioned only in passing (no dedicated page):
1. **Business process automation** — glossary term + knowsAbout only
2. **AI systems** as a standalone expertise — described in schema but no dedicated page
3. **Marketing automation** — inside the CRM service page, not its own page
4. **Custom apps** — referenced in "Own The Market" pricing tier description only
5. **AI strategy** — addressed within /expertise/ai-consultant but not as its own page

---

## 6. WHAT WOULD BREAK — Files requiring update for entity consistency

### 6.1 Files that MUST change for title/identity consistency

If the primary title shifts from "SEO Specialist and AI Systems Engineer" to "AI Implementation Specialist":

| File | What changes | Risk level |
|---|---|---|
| `src/lib/schema.js` | `PERSON_SCHEMA.jobTitle` — used on ALL pages via import | 🔴 HIGH — global entity signal |
| `src/lib/schema.js` | `PERSON_SCHEMA.description` | 🔴 HIGH — global entity signal |
| `src/lib/schema.js` | `PROFESSIONAL_SERVICE_SCHEMA.description` | 🔴 HIGH — global entity signal |
| `src/lib/schema.js` | Image `name` and `description` alt fields | 🟡 MEDIUM |
| `public/llms.txt` | Title line, identity paragraph, professional titles list | 🔴 HIGH — AI model entity signal |
| `src/app/layout.js` | metadata `title`, `description`, OG fields, Twitter fields, `keywords` | 🔴 HIGH — root metadata applied sitewide |
| `src/app/layout.js` | FAQPage schema — Q1 references "SEO specialist" | 🟡 MEDIUM |
| `src/app/about/page.js` | Page metadata title/description, H1, opening paragraph | 🔴 HIGH — /about is a key entity page |
| `src/app/components/HeroSection.jsx` | Badge text (line 31), body copy, image alt text | 🔴 HIGH — first impression on homepage |
| `src/app/components/AboutSection.jsx` | Image alt text (line 150) | 🟢 LOW |
| `src/app/components/FAQSection.jsx` | FAQ Q1 label (line 8) | 🟡 MEDIUM |
| `src/app/locations/page.js` | metadata description (references "SEO specialist") | 🟡 MEDIUM |
| `src/app/glossary/page.js` | meta description (references "SEO specialist and AI systems engineer") | 🟡 MEDIUM |

### 6.2 Pages currently ranking / indexed that must NOT be disturbed

These pages have dedicated H1s, metadata, and likely indexed positions for their target queries. **Do not change slugs, H1s, or metadata titles without traffic/ranking check first:**

| Page | Targeting | Risk if changed |
|---|---|---|
| `/expertise/seo` | "SEO specialist UK", "SEO specialist Stoke-on-Trent" | 🔴 HIGH — primary commercial page |
| `/expertise/ai-consultant` | "AI consultant UK" | 🔴 HIGH — growing search demand |
| `/expertise/ai-search-optimisation` | "AEO specialist UK", "GEO consultant" | 🔴 HIGH |
| `/expertise/ai-agents` | "AI receptionist UK", "AI agent UK" | 🔴 HIGH |
| `/expertise/programmatic-seo` | "programmatic SEO UK" | 🟡 MEDIUM |
| `/expertise/google-ads-api` | "Google Ads API specialist" | 🟡 MEDIUM |
| `/services/seo-local-seo/[location]` × 23 | "[location] SEO", "SEO [location]" | 🔴 HIGH — 23 location pages, main traffic source |
| `/services/ai-search-optimisation/[location]` × 23 | "AEO [location]", "AI search [location]" | 🟡 MEDIUM |
| `/glossary/*` × 57 | Long-tail definition queries | 🟢 LOW risk to change (definitions don't depend on title) |

### 6.3 Safe to add without disturbing existing rankings

- New expertise page: `/expertise/ai-implementation` — additive, no conflict
- New service page: `/services/ai-implementation` + location variants — additive
- Adding `"AI implementation"`, `"AI Implementation Specialist"` to `PERSON_SCHEMA.knowsAbout` — purely additive
- Adding `serviceType` to `PROFESSIONAL_SERVICE_SCHEMA` — additive
- Adding "AI Implementation Specialist" as an additional professional title in `llms.txt` alongside existing titles
- New blog posts targeting "AI implementation" cluster
- New glossary terms: "AI implementation", "digital marketing consultant"

### 6.4 Critical flags for the repositioning

1. **The badge "THE SEO SPECIALIST WITH A MASTER'S IN AI" is the single highest-visibility entity claim** on the site — it loads above the fold on the homepage. Changing it is the highest-impact and highest-risk single edit. Check whether the homepage is ranking for any "SEO specialist" queries before changing.

2. **schema.js is a single source of truth imported across all pages.** One change to `PERSON_SCHEMA.jobTitle` propagates to every page's JSON-LD. This is both a strength (consistency) and a concentration risk (one wrong edit affects 200+ pages simultaneously).

3. **The `knowsAbout` array has 59 terms but no mention of "AI implementation."** For AI models citing the site, this means the entity is not strongly associated with implementation services. This is the lowest-risk, highest-leverage gap to close — add it without removing anything.

4. **Dashboard pages are in the sitemap.** `/dashboard`, `/dashboard/clients`, `/dashboard/empire`, `/dashboard/empire/activity`, `/dashboard/leads`, `/dashboard/jarvis`, `/portal/documents`, `/login`, `/onboarding` — all appear in `public/sitemap.xml`. These will be crawled and may appear in search results. They should have `noindex` headers and be removed from the sitemap.

5. **`/case-studies` and `/business-bundle` are `"use client"` components with no `export const metadata`.** Both inherit the root layout meta, so they have the same title and description as the homepage. These are dedicated commercial pages that warrant their own metadata.

---

## SUMMARY SCORECARD

| Area | Status |
|---|---|
| SEO / Local SEO coverage | ✅ Excellent — 22 glossary terms, expertise page, 23 service-location pages |
| AI Search (AEO/GEO) coverage | ✅ Excellent — dedicated expertise + service + 23 locations |
| AI Agents / Receptionist coverage | ✅ Strong — expertise page + service + 23 locations |
| AI Consultant coverage | ✅ Good — dedicated expertise page exists |
| Web Development coverage | ⚠️ Service page only — no expertise page, no "web design" angle |
| CRM / Email / Automation | ⚠️ Service covered — GoHighLevel absent, no standalone automation expertise page |
| Google Ads coverage | ✅ Good — API-angle expertise + 23 locations |
| Digital marketing (holistic) | ❌ No overview page |
| AI implementation | ❌ Term absent from title, schema, llms.txt, and pages |
| Content / AI content systems | ❌ Completely absent |
| Schema entity consistency | ⚠️ Strong but missing `serviceType`; no `AI implementation` in knowsAbout |
| llms.txt positioning | ⚠️ Good foundation; missing "AI Implementation Specialist" title |
| Sitemap hygiene | ⚠️ Dashboard/private pages included; self-reference URL; /case-studies missing metadata |
