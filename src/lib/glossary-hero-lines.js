/**
 * The two lines under the headline on every glossary term page.
 *
 * The hero formula on these pages is: the term as the display headline, a short gold
 * uppercase label, then a grey lede. On the pilot page the label and the lede came from
 * splitting that title's own clause at " and " — "What It Is" / "and Why It Matters" —
 * but that rule only works on 14 of the 72 titles. The other 58 have a single-clause
 * title with no " and " in it, and splitting those by rule left the lede starting on a
 * preposition ("Sits On", "Ranking For"), which reads as a mistake.
 *
 * So each term gets a written label instead. The label says what the page actually does
 * — defines, explains the mechanism, or argues why it matters — and the lede is the
 * title's own clause, kept verbatim, except on the 14 whose clause already divides, where
 * the lede is its second half so the phrase is not repeated.
 *
 * TO CHANGE A LINE: edit it here. Every string is plain text, one per term, keyed by the
 * term's slug. The page reads `label` into the gold line and `lede` into the grey one; if
 * a slug is missing the page falls back to the automatic split, so a new term can be
 * added to glossary-data.js without touching this file.
 */
export const GLOSSARY_HERO_LINES = {
  "search-engine-optimisation": { label: "What It Is", lede: "and Why It Matters" },
  "local-seo": { label: "How It Works", lede: "How UK Businesses Get Found in Local Search" },
  "technical-seo": { label: "Why It Matters", lede: "The Foundation Every Website Ranking Sits On" },
  "on-page-seo": { label: "What It Covers", lede: "What Happens on the Page That Affects Rankings" },
  "off-page-seo": { label: "How It Works", lede: "Building Authority Outside Your Website" },
  "programmatic-seo": { label: "How It Works", lede: "Scaling Search Visibility Without Scaling Effort" },
  "e-commerce-seo": { label: "What It Does", lede: "Getting Product Pages to Rank and Convert" },
  "international-seo": { label: "How It Works", lede: "Ranking in Multiple Countries and Languages" },
  "seo-audit": { label: "What It Finds", lede: "What a Full Site Review Finds and Fixes" },
  "keyword-research": { label: "What It Delivers", lede: "Finding the Terms Worth Ranking For" },
  "link-building": { label: "How It Works", lede: "How Backlinks Build Search Authority" },
  "core-web-vitals": { label: "What They Measure", lede: "Google's Page Experience Ranking Signals" },
  "schema-markup": { label: "What It Does", lede: "Telling Search Engines Exactly What Your Page Is" },
  "structured-data": { label: "How It Works", lede: "Machine-Readable Signals That Search Engines Act On" },
  "e-e-a-t": { label: "Why It Matters", lede: "The Quality Framework Behind Google's Content Assessments" },
  "serp": { label: "What You See", lede: "Understanding the Search Engine Results Page" },
  "google-business-profile-optimisation": { label: "What It Delivers", lede: "Turning a Listing Into a Lead Source" },
  "local-pack": { label: "What It Is", lede: "The Three Listings That Dominate Local Search" },
  "citations-nap": { label: "Why It Matters", lede: "The Consistency Signal That Affects Local Rankings" },
  "canonical-urls": { label: "What They Do", lede: "Telling Google Which Page Version to Index" },
  "crawl-budget": { label: "How It Works", lede: "How Google Decides Which Pages to Crawl and When" },
  "indexing": { label: "How It Works", lede: "How Google Stores Pages Before They Can Rank" },
  "answer-engine-optimisation": { label: "What It Is", lede: "Getting Cited in AI Search Answers" },
  "generative-engine-optimisation": { label: "What It Is", lede: "Visibility in AI-Generated Responses" },
  "ai-search-visibility": { label: "Why It Matters", lede: "Being Found Where AI Answers Come From" },
  "llm-optimisation": { label: "How It Works", lede: "Structuring Content for Large Language Model Retrieval" },
  "ai-citations": { label: "When They Happen", lede: "When AI Search Engines Reference Your Website" },
  "llms-txt": { label: "What It Is", lede: "A Plain-Text Briefing for AI Crawlers" },
  "ai-overviews": { label: "What They Are", lede: "Google's AI-Generated Answers at the Top of Search" },
  "zero-click-search": { label: "Why It Happens", lede: "When the Answer Lives on the Results Page" },
  "entity-seo": { label: "What It Is", lede: "Building Recognition Beyond Keywords" },
  "knowledge-graph": { label: "What It Is", lede: "Google's Map of Entities and Their Relationships" },
  "ai-agent": { label: "What It Does", lede: "An AI System That Acts, Not Just Responds" },
  "ai-receptionist": { label: "What It Handles", lede: "24/7 Enquiry Handling Without a Human Operator" },
  "conversational-ai": { label: "What It Is", lede: "Natural Language Dialogue at Scale" },
  "ai-chatbot": { label: "What It Is", lede: "and What Separates It From a Scripted Bot" },
  "business-process-automation": { label: "What It Removes", lede: "Removing the Manual Work From Repeatable Tasks" },
  "workflow-automation": { label: "How It Works", lede: "Triggering the Right Action at the Right Moment" },
  "ai-lead-response": { label: "Why Speed Matters", lede: "Responding to Every Enquiry in Seconds, Not Hours" },
  "crm-automation": { label: "What It Removes", lede: "Your Pipeline Running Without Manual Data Entry" },
  "marketing-automation": { label: "How It Works", lede: "Timely, Relevant Messages Without Manual Sending" },
  "ai-consultant": { label: "What They Do", lede: "and What to Expect From an Engagement" },
  "machine-learning": { label: "How It Learns", lede: "How AI Systems Learn From Data" },
  "large-language-model": { label: "What It Is", lede: "The Engine Behind Modern AI Tools" },
  "prompt-engineering": { label: "What It Does", lede: "Designing Inputs That Get the Right AI Output" },
  "rag": { label: "How It Works", lede: "Grounding AI in Your Own Data" },
  "ai-integration": { label: "What It Connects", lede: "Connecting AI to the Systems Your Business Already Uses" },
  "api-integration": { label: "How Systems Connect", lede: "How Business Software Systems Connect and Share Data" },
  "ppc": { label: "How It Works", lede: "How Pay-Per-Click Advertising Generates Immediate Lead Flow" },
  "google-ads": { label: "What It Is", lede: "The Platform Behind Google Search Advertising" },
  "cost-per-lead": { label: "What It Tells You", lede: "The Metric That Tells You Whether Marketing Is Working" },
  "conversion-rate-optimisation": { label: "What It Improves", lede: "Getting More From the Traffic You Already Have" },
  "landing-page-optimisation": { label: "What It Fixes", lede: "The Page That Turns Clicks Into Enquiries" },
  "email-marketing-automation": { label: "How It Runs", lede: "Sequences That Run Without Manual Sending" },
  "lead-generation": { label: "How It Works", lede: "Attracting and Capturing Enquiries From Potential Customers" },
  "marketing-funnel": { label: "The Stages", lede: "The Stages From First Awareness to Paying Client" },
  "retargeting": { label: "Why It Works", lede: "Staying in Front of Visitors Who Did Not Convert First Time" },
  "ai-implementation": { label: "What It Takes", lede: "Building AI Systems That Actually Produce Results" },
  "ai-adoption": { label: "Why It Stalls", lede: "Why Most Businesses Stall Before Getting Results" },
  "ai-readiness-assessment": { label: "What It Finds", lede: "Finding Where AI Produces the Most Return" },
  "ai-integration-strategy": { label: "What It Covers", lede: "Connecting AI to the Business Systems That Already Exist" },
  "ai-transformation": { label: "What Changes", lede: "What Changes When AI Is Built Into How a Business Operates" },
  "digital-marketing": { label: "The Full System", lede: "The Full System, Not a Single Channel" },
  "digital-marketing-strategy": { label: "What It Decides", lede: "Channel Selection and Sequencing for UK Businesses" },
  "lead-nurturing": { label: "What It Converts", lede: "Converting the Leads That Do Not Book on First Contact" },
  "web-design": { label: "What Separates It", lede: "What Separates a Site That Converts From One That Does Not" },
  "ux-design": { label: "Why It Matters", lede: "How the Experience a Website Creates Affects Rankings and Revenue" },
  "conversion-focused-web-design": { label: "What It Optimises", lede: "Design Decisions Made to Produce Enquiries" },
  "content-strategy": { label: "What It Decides", lede: "What Gets Published, Why, and in What Order" },
  "ai-content-generation": { label: "What It Is", lede: "and Why the Quality Gap Matters" },
  "content-automation": { label: "How It Scales", lede: "Producing Content at Scale Without Producing Noise" },
  "customer-journey-automation": { label: "What It Automates", lede: "Moving Every Lead From Enquiry to Booked Customer" },
};
