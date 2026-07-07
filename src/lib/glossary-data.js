export const GLOSSARY_FAMILIES = [
  { id: "seo", label: "SEO", description: "Core concepts in search engine optimisation for UK businesses." },
  { id: "ai-search", label: "AI Search", description: "How AI-powered search engines find, cite, and rank content in 2025." },
  { id: "ai-systems", label: "AI Systems", description: "AI agents, automation, and the systems that run business operations." },
  { id: "marketing", label: "Marketing", description: "Paid and performance marketing concepts that drive measurable lead flow." },
];

export const GLOSSARY_TERMS = [

  // ─── SEO FAMILY ───────────────────────────────────────────────────────────

  {
    slug: "search-engine-optimisation",
    title: "Search Engine Optimisation",
    abbr: "SEO",
    family: "seo",
    badge: "SEO",
    metaTitle: "What is Search Engine Optimisation? | Khamare Clarke",
    metaDescription: "Plain-English definition of search engine optimisation (SEO): what it is, why it matters for UK businesses, and how it works in practice.",
    h1: "Search Engine Optimisation: What It Is and Why It Matters",
    definition: "Search engine optimisation (SEO) is the practice of improving a website so it appears higher in unpaid search results on engines like Google. It works by making a site more relevant, authoritative, and technically accessible to both search engine crawlers and the people using them.",
    whyItMatters: [
      "For a UK business, organic search is often the single largest source of inbound enquiries. A business that ranks on page one for its core services receives a continuous flow of qualified visitors without paying for each click. A business on page two receives a fraction of that traffic regardless of how good its product or service is.",
      "SEO compounds over time in a way that paid advertising does not. A well-optimised page can hold its position for months or years. A paid ad disappears the moment the budget stops. The cost per lead from organic search typically falls as rankings improve, while the cost per lead from paid search stays flat or rises as competition increases.",
    ],
    howKhamareApplies: [
      "The approach here covers three layers simultaneously: technical SEO (crawlability, site speed, structured data, Core Web Vitals), on-page optimisation (content relevance, keyword targeting, internal linking), and local SEO (Google Business Profile, citations, map pack positioning). These are not treated as separate projects but as a single integrated system.",
      "Monthly work is reported in plain English: which rankings moved, which pages gained traffic, what was done. No dashboards requiring interpretation. The work is done directly, not delegated to a junior team, which removes the feedback loop delays that agency models introduce.",
    ],
    faq: [
      { q: "How long does SEO take to produce results?", a: "For local SEO with Google Business Profile work, visible movement can appear within weeks. For competitive organic rankings, three to six months is a realistic window. Timelines depend on domain authority, competition level, and the technical state of the site at the start. Any specialist who guarantees a specific ranking by a specific date is either targeting uncompetitive terms or overpromising." },
      { q: "What is the difference between SEO and paid search?", a: "Paid search (PPC) puts an advertisement at the top of results and charges per click. SEO earns organic positions that do not carry a cost per click. The distinction matters commercially: organic positions compound over time and produce a falling cost per lead, whereas paid positions require continuous spend to maintain. Most businesses benefit from both, with SEO as the long-term foundation and paid search for immediate volume." },
      { q: "Does SEO still work in 2025 with AI search engines?", a: "Yes, with an important expansion. Traditional SEO targets Google's organic results. AI search optimisation (AEO and GEO) targets the answer panels in ChatGPT, Gemini, Perplexity, and Google AI Overviews. The technical foundations overlap significantly: well-structured content, authoritative entity signals, and clean schema markup serve both. Businesses that invest in SEO now are also building the foundation for AI search visibility." },
    ],
    expertisePage: "/expertise/seo",
    servicePage: "/services/seo-local-seo",
    relatedTerms: ["local-seo", "technical-seo"],
  },

  {
    slug: "local-seo",
    title: "Local SEO",
    abbr: null,
    family: "seo",
    badge: "SEO",
    metaTitle: "What is Local SEO? | Khamare Clarke",
    metaDescription: "Local SEO explained for UK businesses: how it works, what it covers, and why Google Business Profile management is central to local search visibility.",
    h1: "Local SEO: How UK Businesses Get Found in Local Search",
    definition: "Local SEO is the practice of optimising a business's online presence to appear in search results tied to a specific geographic area, such as searches for 'plumber Stoke-on-Trent' or 'accountant near me'. It covers Google Business Profile management, local citation building, review strategy, and location-specific content on the website.",
    whyItMatters: [
      "Most local searches have strong commercial intent. Someone searching for a roofer, a solicitor, or a restaurant near them is usually ready to make a decision. Appearing in the local map pack (the three business listings shown above organic results) for these searches puts a business in front of people at the moment they are choosing, not browsing.",
      "The map pack is a distinct ranking system from organic results. A business can rank well in map pack results without having a strong organic presence, and vice versa. This means local SEO work on Google Business Profile and citations can produce fast, visible results even for businesses with newer websites.",
    ],
    howKhamareApplies: [
      "Local SEO work here starts with a full audit of the Google Business Profile: completeness, category selection, photo volume and recency, review velocity, Q&A section, and consistency of the business name, address, and phone number across the web. These are the signals Google uses to determine map pack eligibility and position.",
      "Citation building ensures the business appears consistently across the directories and data aggregators that Google cross-references. Review strategy sets up an automated request sequence so that satisfied customers are asked at the right moment, building the review volume and recency that are direct ranking signals in local search.",
    ],
    faq: [
      { q: "What is the local map pack?", a: "The local map pack is the block of three business listings, with a map, that Google displays at the top of search results for queries with local intent. It is separate from organic results and is powered by Google Business Profile data, proximity, relevance, and prominence signals rather than purely by website authority." },
      { q: "How important are Google reviews for local SEO?", a: "Reviews are a direct ranking signal in the map pack. Volume, recency, and average rating all influence position. A business with a consistently growing number of recent positive reviews will typically outperform a business with more total reviews that are years old. Automated review request systems are one of the highest-leverage local SEO tools for small businesses." },
      { q: "Can a business rank locally without a website?", a: "Yes, to a degree. A well-optimised Google Business Profile can rank in the map pack without a strong website. However, organic results require a website, and website content is one of the signals Google uses to assess relevance for map pack rankings. A business with both a strong GBP and a well-optimised website will consistently outperform a business relying on only one." },
    ],
    expertisePage: "/expertise/seo",
    servicePage: "/services/seo-local-seo",
    relatedTerms: ["google-business-profile-optimisation", "local-pack"],
  },

  {
    slug: "technical-seo",
    title: "Technical SEO",
    abbr: null,
    family: "seo",
    badge: "SEO",
    metaTitle: "What is Technical SEO? | Khamare Clarke",
    metaDescription: "Technical SEO defined: the site speed, crawlability, and structured data work that lets Google index and rank a website correctly. UK business guide.",
    h1: "Technical SEO: The Foundation Every Website Ranking Sits On",
    definition: "Technical SEO is the work done to a website's code, architecture, and server configuration to make it easy for search engine crawlers to access, understand, and index. It covers site speed, crawlability, structured data, mobile usability, HTTPS, and canonical URL management.",
    whyItMatters: [
      "Technical SEO is not visible to users but it determines whether all other SEO work succeeds or fails. A website with excellent content but slow load times, broken crawl paths, or duplicate pages will not rank as well as it should. Google cannot rank pages it cannot reliably access and understand.",
      "Technical issues compound silently. A misconfigured canonical tag can cause Google to index the wrong version of a page for months. A render-blocking script can suppress Core Web Vitals scores across an entire site. A missing XML sitemap can leave new pages undiscovered for weeks. These issues do not produce error messages -- they simply suppress rankings.",
    ],
    howKhamareApplies: [
      "Technical SEO work starts with a full crawl of the site to surface crawl errors, redirect chains, duplicate content, missing or conflicting canonical tags, and pages blocked from indexing. Each issue is prioritised by its likely ranking impact and fixed directly in code, not handed to a separate developer.",
      "For sites built on Next.js (the framework used on this site), technical SEO benefits from static-site generation: pages are pre-rendered as HTML, served instantly from a CDN, and indexed without JavaScript rendering overhead. This is a structural advantage over platforms that rely on client-side rendering.",
    ],
    faq: [
      { q: "What is the difference between technical SEO and on-page SEO?", a: "Technical SEO addresses how a site is built and served: speed, crawlability, indexability, structured data. On-page SEO addresses what a page says and how it is written: keyword relevance, heading structure, internal links, meta tags. Both are necessary; technical SEO creates the conditions in which on-page work can have its effect." },
      { q: "How does site speed affect SEO rankings?", a: "Site speed is a confirmed ranking signal, and Google's Core Web Vitals are used as a ranking factor for mobile search. Beyond rankings, slow pages lose users: the proportion of visitors who leave without engaging rises sharply as page load time increases beyond two to three seconds. Speed improvements affect both rankings and conversion rates simultaneously." },
      { q: "What is structured data and why does it matter for technical SEO?", a: "Structured data is code (usually JSON-LD format) added to a page that tells search engines explicitly what the page contains: a business, a product, a FAQ, an article, a person. It powers rich results in Google search (star ratings, FAQ dropdowns, event details) and is increasingly used by AI search engines to identify citable entities and answers." },
    ],
    expertisePage: "/expertise/seo",
    servicePage: "/services/seo-local-seo",
    relatedTerms: ["core-web-vitals", "schema-markup"],
  },

  {
    slug: "on-page-seo",
    title: "On-Page SEO",
    abbr: null,
    family: "seo",
    badge: "SEO",
    metaTitle: "What is On-Page SEO? | Khamare Clarke",
    metaDescription: "On-page SEO explained: the content, headings, meta tags, and internal linking that make individual pages rank for their target terms.",
    h1: "On-Page SEO: What Happens on the Page That Affects Rankings",
    definition: "On-page SEO refers to the optimisation of individual web pages to rank higher in search results, covering the content, heading structure, meta title, meta description, internal links, and keyword relevance of each page. Unlike technical SEO (which addresses the site as a whole) or off-page SEO (which addresses external signals), on-page SEO is entirely within the website owner's direct control.",
    whyItMatters: [
      "A page that does not clearly communicate its topic to Google will not rank for it, regardless of the site's authority or the quality of the technical setup. On-page SEO is how a page signals relevance: through its title, headings, body content, and the context provided by internal links from other pages on the site.",
      "On-page SEO also directly affects AI search visibility. Generative AI engines scan page content to extract citable answers. A page that answers questions directly and unambiguously in its first paragraph is more likely to be quoted as a source than a page that buries the answer in dense prose.",
    ],
    howKhamareApplies: [
      "On-page work here covers: rewriting meta titles and descriptions to match search intent, restructuring headings to reflect the questions a page should answer, improving content depth so pages cover their topic comprehensively, adding internal links that signal the relationship between related pages, and formatting content for both human readers and AI crawlers.",
      "For programmatic SEO campaigns (service and location pages), on-page templates are designed to produce genuinely useful, unique content at scale rather than thin pages that repeat the same paragraph with a place name swapped in. Each location introduces local context specific to that area.",
    ],
    faq: [
      { q: "What is a meta title and why does it matter?", a: "The meta title is the text that appears as the clickable headline in a search result. Google uses it as a primary signal of what a page is about. A well-written meta title includes the target keyword, communicates what the page offers, and gives a searcher a reason to click. Google sometimes rewrites meta titles it considers misleading or off-topic." },
      { q: "How many times should a keyword appear on a page?", a: "There is no optimal keyword density figure. The question is whether the content discusses the topic comprehensively and uses natural language that a reader would recognise as authoritative. A page that forces a keyword into every paragraph performs worse than a page that covers the topic thoroughly in plain prose. The goal is topical relevance, not keyword frequency." },
      { q: "What is the difference between on-page SEO and content marketing?", a: "On-page SEO optimises existing pages to rank for their target terms. Content marketing creates new pages or assets to capture additional search demand. The two work together: content marketing expands the topics a site covers, and on-page SEO ensures each piece of content is structured to rank for its intended terms. A content strategy without on-page optimisation produces pages that do not rank; on-page work without a content strategy optimises a limited number of pages." },
    ],
    expertisePage: "/expertise/seo",
    servicePage: "/services/seo-local-seo",
    relatedTerms: ["keyword-research", "technical-seo"],
  },

  {
    slug: "off-page-seo",
    title: "Off-Page SEO",
    abbr: null,
    family: "seo",
    badge: "SEO",
    metaTitle: "What is Off-Page SEO? | Khamare Clarke",
    metaDescription: "Off-page SEO explained: link building, brand mentions, and external signals that build a website's authority and influence its search rankings.",
    h1: "Off-Page SEO: Building Authority Outside Your Website",
    definition: "Off-page SEO refers to actions taken outside a website to improve its search engine rankings, primarily through acquiring backlinks (links from other websites pointing to the site), brand mentions, and signals that indicate the site's authority and trustworthiness to search engines. Google treats backlinks from credible external sites as votes of confidence in the linked site's relevance and authority.",
    whyItMatters: [
      "Two websites with similar content and similar technical setups will be separated in rankings primarily by their off-page authority. A site with more high-quality backlinks from relevant, trusted sources will outrank one without them. This is the basis of Google's original PageRank algorithm and remains a central ranking signal.",
      "For local businesses, off-page signals include local directory citations, mentions in local news and trade publications, and links from business associations or industry bodies. These local signals are particularly important for map pack rankings, where prominence is one of the three main factors Google assesses.",
    ],
    howKhamareApplies: [
      "Off-page work is integrated with content strategy: producing genuinely useful content (guides, data, commentary) that earns links naturally over time, combined with targeted outreach to relevant publications and directories. For local businesses, citation building and local PR are the primary off-page levers.",
      "Link building is evaluated for quality, not volume. A single link from a credible industry publication is worth more than a hundred links from low-authority directories. The approach here avoids techniques that can result in manual penalties: buying links, link exchanges, or mass directory submissions.",
    ],
    faq: [
      { q: "What is a backlink and why does it help SEO?", a: "A backlink is a hyperlink on one website that points to another. Search engines treat these as signals of credibility: if a well-regarded website links to a page, it is implicitly endorsing that page as a useful source. The authority passed through a backlink varies based on the linking site's own authority, the relevance of the linking page to the linked page's topic, and whether the link is followed or marked as no-follow." },
      { q: "What is the difference between off-page SEO and link building?", a: "Link building is the largest component of off-page SEO but not the only one. Off-page SEO also includes brand mentions without a link, social signals, reviews on third-party platforms, and unlinked citations in industry publications. For local SEO specifically, directory citations (consistent mentions of business name, address, and phone number) are a distinct off-page signal separate from editorial backlinks." },
      { q: "Can bad backlinks hurt a website's rankings?", a: "Yes. A pattern of low-quality, irrelevant, or clearly manipulated backlinks can result in a manual penalty from Google or an algorithmic demotion. If a site has acquired problematic links in the past (through previous agencies or link schemes), a disavow process can signal to Google to ignore those links. Auditing the existing link profile is a standard part of any technical SEO engagement." },
    ],
    expertisePage: "/expertise/seo",
    servicePage: "/services/seo-local-seo",
    relatedTerms: ["link-building", "citations-nap"],
  },

  {
    slug: "programmatic-seo",
    title: "Programmatic SEO",
    abbr: null,
    family: "seo",
    badge: "SEO",
    metaTitle: "What is Programmatic SEO? | Khamare Clarke",
    metaDescription: "Programmatic SEO explained: generating hundreds of unique, indexable pages from structured data to capture long-tail search demand at scale.",
    h1: "Programmatic SEO: Scaling Search Visibility Without Scaling Effort",
    definition: "Programmatic SEO is the practice of generating large numbers of unique, optimised web pages automatically from a structured data source, rather than writing each page by hand. It is used to capture long-tail search demand at scale, typically for businesses that need pages for every combination of service and location, product and attribute, or question and answer.",
    whyItMatters: [
      "A local service business covering ten service types across twenty areas would need 200 targeted landing pages to capture the specific searches people make for each combination. Writing and publishing 200 unique pages by hand is prohibitively slow. Programmatic SEO builds the template once and generates all 200 pages in a single build, each with unique content drawn from structured data.",
      "The key word is unique. Programmatic SEO done correctly produces pages that are genuinely different from each other, with local context, specific service detail, and structured data that reflects each combination. Done poorly, it produces thin doorway pages that Google devalues or removes from the index entirely. The difference is in the data quality and template design.",
    ],
    howKhamareApplies: [
      "This site uses programmatic SEO to generate 161 service-by-location pages across seven services and twenty-three UK locations. Each page is pre-rendered as static HTML at build time using Next.js, which means it is served instantly, indexed without JavaScript rendering overhead, and carries unique structured data for every combination.",
      "For clients, programmatic campaigns are built around a data model specific to their business: service types, areas served, unique local context, and the questions people ask in each location. The template produces pages that read as genuinely location-specific, not as the same content with a place name substituted.",
    ],
    faq: [
      { q: "What is the difference between programmatic SEO and regular SEO?", a: "Regular SEO optimises a fixed set of pages. Programmatic SEO generates the pages themselves from data, then optimises the template and data model rather than each page individually. The approach is appropriate when a business has a large number of similar but distinct combinations to target: services times locations, products times attributes, questions times topics." },
      { q: "Does programmatic SEO produce thin content?", a: "It can, if done carelessly. Google's guidance is clear that pages must be useful to the person reading them. A programmatic page that repeats the same paragraph with only a city name changed provides no unique value and will be treated as thin content. Programmatic SEO that works draws on a rich data model with unique local context, specific service detail, and structured content that answers the query rather than merely matching the keyword." },
      { q: "What platforms support programmatic SEO?", a: "Programmatic SEO requires the ability to generate pages from data, ideally as static HTML at build time. Next.js with getStaticPaths and getStaticProps (or generateStaticParams in the App Router) is well-suited to this. WordPress can approximate it with custom post types and templates. Platforms like Wix and Shopify have limited or no native support for programmatic page generation, which is one of their ceiling constraints for SEO-focused campaigns." },
    ],
    expertisePage: "/expertise/programmatic-seo",
    servicePage: "/services/programmatic-seo",
    relatedTerms: ["keyword-research", "on-page-seo"],
  },

  {
    slug: "e-commerce-seo",
    title: "E-Commerce SEO",
    abbr: null,
    family: "seo",
    badge: "SEO",
    metaTitle: "What is E-Commerce SEO? | Khamare Clarke",
    metaDescription: "E-commerce SEO explained: the product page, category page, and technical SEO work that drives organic traffic and sales for online shops.",
    h1: "E-Commerce SEO: Getting Product Pages to Rank and Convert",
    definition: "E-commerce SEO is the application of search engine optimisation specifically to online shops, covering product page optimisation, category page structure, faceted navigation management, product schema markup, and the technical challenges unique to large catalogues. The goal is to drive organic traffic from shoppers at each stage of the purchase journey.",
    whyItMatters: [
      "An online shop with thousands of product pages has thousands of potential entry points from search. Each well-optimised product page can rank for the specific queries shoppers use when they are close to buying. Category pages target broader terms. Blog content captures research-phase queries. Together they create an organic acquisition funnel that does not require continuous ad spend.",
      "E-commerce sites face specific technical SEO challenges that general sites do not: duplicate content from faceted navigation (filtering by colour, size, price creates multiple URLs for the same products), crawl budget consumption on large catalogues, and canonical tag management across product variants. These issues silently suppress rankings across large parts of the site if left unaddressed.",
    ],
    howKhamareApplies: [
      "E-commerce SEO work covers: product page optimisation for purchase-intent queries, category page structure and internal linking to distribute authority, canonical tag auditing across filtered navigation, product schema markup for rich results (star ratings, price, availability in search), and page speed work on product images (typically the primary load bottleneck on e-commerce sites).",
      "For businesses using Shopify, e-commerce SEO must work within the platform's architectural constraints: fixed URL structures, limited programmatic page generation, and partial canonical control on filtered pages. For businesses with the flexibility to use a headless or custom architecture, these constraints can be engineered around for significantly better results at scale.",
    ],
    faq: [
      { q: "How is e-commerce SEO different from regular SEO?", a: "E-commerce SEO faces challenges specific to large catalogues and product data: managing thousands of pages without duplicating content, handling faceted navigation that generates enormous numbers of URL variants, and applying product schema markup that enables rich results. The fundamentals (technical health, content relevance, authority) are the same, but the scale and specific problem set differ significantly from a brochure or service site." },
      { q: "What is product schema and how does it help e-commerce rankings?", a: "Product schema is structured data (in JSON-LD format) added to product pages that tells Google explicitly about the product: name, price, availability, review rating, and other attributes. Google uses this to generate rich results in search, displaying price and star ratings directly in the search listing. Rich results typically receive higher click-through rates than standard listings, increasing organic traffic from the same ranking position." },
      { q: "Can Shopify rank well for competitive SEO terms?", a: "Shopify sites can rank for competitive terms, but the platform imposes constraints that limit what is achievable at scale. URL structures are fixed (products always at /products/, collections at /collections/). Programmatic page generation is not natively supported. Canonical handling on filtered pages is inconsistent across themes. For businesses whose growth depends on capturing a large volume of specific search queries, these constraints become significant over time." },
    ],
    expertisePage: "/expertise/seo",
    servicePage: "/services/seo-local-seo",
    relatedTerms: ["technical-seo", "schema-markup"],
  },

  {
    slug: "international-seo",
    title: "International SEO",
    abbr: null,
    family: "seo",
    badge: "SEO",
    metaTitle: "What is International SEO? | Khamare Clarke",
    metaDescription: "International SEO explained: hreflang tags, country targeting, and the technical setup that lets websites rank in multiple countries and languages.",
    h1: "International SEO: Ranking in Multiple Countries and Languages",
    definition: "International SEO is the practice of optimising a website to rank in multiple countries or languages, using hreflang tags, geotargeting signals, and localised content to ensure that users in each target market see the correct version of the site. It addresses both the technical signals that tell search engines which version of a page is intended for which audience, and the content requirements of genuinely serving different markets.",
    whyItMatters: [
      "Without correct international SEO setup, a website targeting both UK and US audiences may have both versions competing against each other in each market, or may show UK content to US searchers and vice versa. Hreflang tags tell Google which language and country version of a page to serve to which user, eliminating this confusion and ensuring each market sees the content intended for it.",
      "International SEO is not only for large businesses. A UK service business that also serves clients in Ireland, Australia, or the UAE needs to signal this clearly to search engines to capture that demand. A single English-language site serving multiple English-speaking markets still requires correct geotargeting to rank appropriately in each.",
    ],
    howKhamareApplies: [
      "International SEO work covers: implementing hreflang tags correctly across all language and country variants, setting up correct geotargeting in Google Search Console, auditing for content that is identical across markets (creating canonical issues), and advising on URL structure choices (subdirectories, subdomains, or separate domains) based on the client's specific market strategy.",
      "For UK businesses expanding to serve international clients, the work typically starts with market analysis: which countries generate search demand for the services offered, what the competitive landscape looks like in each, and whether the investment in localised content and technical setup is justified by the potential return.",
    ],
    faq: [
      { q: "What is an hreflang tag?", a: "An hreflang tag is an HTML attribute that tells search engines which language and region a specific page is intended for, and points to the equivalent page in other languages or regions. For example, a UK English page would have an hreflang tag pointing to its US English equivalent, and vice versa. Correct hreflang implementation prevents Google from treating language variants as duplicate content and ensures each version ranks in its intended market." },
      { q: "Do I need separate websites for each country I target?", a: "Not necessarily. The three main structures for international SEO are separate domains (uk.example.com vs us.example.com), subdirectories (example.com/uk/ vs example.com/us/), and subdomains (uk.example.com vs us.example.com). Subdirectories are generally recommended for businesses starting with international SEO because they consolidate domain authority rather than splitting it across separate domains. Separate domains may make sense when markets require very different branding or content strategies." },
      { q: "Can a UK business rank in Google.com for US searches?", a: "Yes, but it requires deliberate effort. Without geotargeting signals, Google will typically assume a UK-hosted site with UK-focused content is relevant to UK searchers. To rank in the US, the site needs either a US-specific subdirectory or subdomain with geotargeting set to the US in Search Console, or content that clearly addresses US-specific queries and includes US-relevant signals such as US pricing, US office addresses, or US-market case studies." },
    ],
    expertisePage: "/expertise/seo",
    servicePage: "/services/seo-local-seo",
    relatedTerms: ["technical-seo", "canonical-urls"],
  },

  {
    slug: "seo-audit",
    title: "SEO Audit",
    abbr: null,
    family: "seo",
    badge: "SEO",
    metaTitle: "What is an SEO Audit? | Khamare Clarke",
    metaDescription: "SEO audit explained: what it covers, what it finds, and how to turn its findings into ranking improvements for a UK website.",
    h1: "SEO Audit: What a Full Site Review Finds and Fixes",
    definition: "An SEO audit is a systematic review of a website to identify the technical, on-page, and off-page factors that are limiting its search engine rankings. It produces a prioritised list of issues and recommendations, covering crawlability, indexing, site speed, content quality, backlink profile, and structured data implementation.",
    whyItMatters: [
      "Most websites have accumulated SEO problems over time: pages that should not be indexed are, pages that should be indexed are not, canonical tags point in the wrong direction, structured data contains errors, and redirects have formed chains that slow crawlers down. None of these produce visible error messages. They simply suppress rankings silently.",
      "An audit is the starting point for any serious SEO engagement because it prioritises where effort will have the most impact. Fixing a crawl block on ten high-traffic pages is more valuable than optimising the meta titles on fifty low-traffic pages. Without an audit, SEO work risks being spent in the wrong places.",
    ],
    howKhamareApplies: [
      "An audit here covers six areas: technical health (crawlability, indexing, redirects, canonical tags, HTTPS), Core Web Vitals and page speed, on-page signals (title tags, heading structure, content depth, internal linking), local SEO signals (GBP completeness, citation consistency), backlink profile (toxic links, anchor text distribution), and structured data validity.",
      "The output is a prioritised action list, not a 200-page report. Issues are ranked by their likely impact on rankings, and the highest-impact fixes are completed first. Clients receive plain-English summaries of what was found and what was changed, not technical documentation that requires an SEO specialist to interpret.",
    ],
    faq: [
      { q: "How often should an SEO audit be done?", a: "A full technical audit is appropriate at the start of any new SEO engagement and after significant changes to a site (platform migrations, redesigns, major content restructuring). Ongoing monitoring of crawl errors, indexing status, and Core Web Vitals covers the interval between full audits. For most businesses, a comprehensive audit once or twice a year, with continuous monitoring in between, is sufficient." },
      { q: "What is the most common SEO problem found in audits?", a: "The most common issues are: pages that are accidentally blocked from indexing (via robots.txt or no-index tags added during development and never removed), canonical tag errors that tell Google to index the wrong version of a page, missing or incorrectly implemented structured data, and redirect chains that slow crawlers and dilute link authority. These issues are widespread because they are invisible in normal website use and are not flagged by standard analytics tools." },
      { q: "Can I do my own SEO audit?", a: "Tools like Google Search Console, Screaming Frog, and Ahrefs allow a website owner to run basic audits. Search Console shows indexing errors and Core Web Vitals data. Screaming Frog crawls the site and surfaces technical issues. The challenge is not the tools -- it is knowing which issues matter most, how to fix them in the site's specific technology stack, and whether what looks like an issue is actually causing a problem in that context. A professional audit adds the interpretation and prioritisation layer that tools cannot provide." },
    ],
    expertisePage: "/expertise/seo",
    servicePage: "/services/seo-local-seo",
    relatedTerms: ["technical-seo", "crawl-budget"],
  },

  {
    slug: "keyword-research",
    title: "Keyword Research",
    abbr: null,
    family: "seo",
    badge: "SEO",
    metaTitle: "What is Keyword Research? | Khamare Clarke",
    metaDescription: "Keyword research explained: how to find the terms your customers search for, assess their value, and use them to build an SEO content strategy.",
    h1: "Keyword Research: Finding the Terms Worth Ranking For",
    definition: "Keyword research is the process of identifying and evaluating the search terms that potential customers use when looking for products, services, or information relevant to a business, then using those terms to inform the content and structure of a website. It determines which pages to build, which terms to target on existing pages, and how to prioritise SEO effort across a site.",
    whyItMatters: [
      "Keyword research is the foundation of an SEO strategy because it connects the language a business uses about itself to the language its customers use when searching. These two sets of language are often different. A business that optimises its website for the terms its team uses internally, rather than the terms its customers actually search for, builds a site that ranks for nothing anyone is looking for.",
      "Keyword research also reveals intent. The same topic can be searched in ways that indicate very different intent: a person searching 'what is programmatic SEO' is researching, while a person searching 'programmatic SEO agency UK' is close to buying. Building pages that match the intent behind each query, not just the topic, is what produces traffic that converts rather than traffic that bounces.",
    ],
    howKhamareApplies: [
      "Keyword research here focuses on commercial and local intent: the specific terms a business's customers use when they are ready to enquire or buy, not the high-volume informational terms that attract researchers who will never become clients. For local businesses, this means mapping services to the geographic areas served and identifying the exact phrase patterns used in each location.",
      "The output feeds directly into page structure decisions: which pages to create, what to title them, how to structure their headings, and which related terms to cover within each page. For programmatic SEO campaigns, keyword research identifies the full matrix of service-plus-location combinations worth building pages for, ranked by search volume and competition.",
    ],
    faq: [
      { q: "What is search volume and how much does it matter?", a: "Search volume is the estimated number of times a keyword is searched per month. It matters, but not in isolation. A keyword with 100 monthly searches that indicates strong buying intent from a local audience is more valuable to a local service business than a keyword with 10,000 monthly searches from a national audience of researchers. Volume is one input into keyword prioritisation, alongside competition, intent, and the business's realistic ability to rank for a given term." },
      { q: "What is long-tail keyword research?", a: "Long-tail keywords are more specific, lower-volume search phrases that collectively make up the majority of search queries. 'SEO' is a head keyword. 'Local SEO for roofing companies Stoke-on-Trent' is a long-tail keyword. Long-tail terms are typically easier to rank for, have higher conversion rates (because they indicate more specific intent), and are the primary target of programmatic SEO campaigns." },
      { q: "How does AI search change keyword research?", a: "AI search engines do not process queries as keyword matches the way traditional search does. They interpret the intent behind a query and retrieve content that answers it, regardless of exact keyword matching. This shifts keyword research toward question mapping: identifying the questions a target audience asks, then building content that answers those questions clearly and authoritatively. The underlying research process is similar but the targeting mechanism is different." },
    ],
    expertisePage: "/expertise/seo",
    servicePage: "/services/seo-local-seo",
    relatedTerms: ["on-page-seo", "programmatic-seo"],
  },

  // ─── BATCH 2 PLACEHOLDER (terms 11-20) ───────────────────────────────────
];

export const GLOSSARY_BY_SLUG = Object.fromEntries(GLOSSARY_TERMS.map(t => [t.slug, t]));
