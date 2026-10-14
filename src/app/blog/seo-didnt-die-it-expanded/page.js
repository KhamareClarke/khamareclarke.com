// src/app/blog/seo-didnt-die-it-expanded/page.js
import Link from "next/link";
import PageShell from "../../components/PageShell";
import PageHero from "../../components/ui/PageHero";
import AchievementsSection from "../../components/AchievementsSection";
import SectionHeading from "../../components/ui/SectionHeading";
import CtaPanel from "../../components/ui/CtaPanel";
import { Section } from "../../components/ui/Section";
import { Container } from "../../components/ui/Container";
import CTAButton from "../../components/CTAButton";

export const metadata = {
  title: "SEO Didn't Die — It Expanded Into Four Disciplines",
  description:
    "Google rankings, AEO, GEO, and programmatic pages: SEO is one discipline with bigger territory. What UK businesses must do across all four layers right now.",
  alternates: {
    canonical: "https://khamareclarke.com/blog/seo-didnt-die-it-expanded",
  },
  openGraph: {
    title: "SEO Didn't Die — It Expanded Into Four Disciplines",
    description:
      "Google rankings, AEO, GEO, and programmatic pages: SEO is one discipline with bigger territory. What UK businesses must do across all four layers right now.",
    url: "https://khamareclarke.com/blog/seo-didnt-die-it-expanded",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "They Told You SEO Was Dead. It Didn't Die — It Expanded.",
  description:
    "Google rankings, AEO, GEO, and programmatic pages: SEO is one discipline with bigger territory. What UK businesses must do across all four layers right now.",
  datePublished: "2025-08-01",
  dateModified: "2025-08-01",
  author: {
    "@type": "Person",
    "@id": "https://khamareclarke.com/#person",
    name: "Khamare Clarke",
    url: "https://khamareclarke.com/about",
  },
  publisher: {
    "@type": "Person",
    "@id": "https://khamareclarke.com/#person",
    name: "Khamare Clarke",
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": "https://khamareclarke.com/blog/seo-didnt-die-it-expanded",
  },
};

export default function SeoDidntDie() {
  return (
    <PageShell
      schema={
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />
        </>
      }
    >
      <Section className="mt-0 pb-ds-4 page-top">
        <Container size="narrow">
          <article className="text-white">
            <div className="mb-6">
              <Link href="/blog" className="gold-text text-sm font-semibold hover:underline">
                &larr; Back to Resource Hub
              </Link>
            </div>

            <PageHero
              eyebrow="SEO Strategy"
              title="They Told You SEO Was Dead. It Didn't Die — It Expanded."
              size="compact"
            />

            {/* The trust strip that sits under the hero on the homepage. */}
            <AchievementsSection />

            <p className="text-muted text-sm mt-6 mb-10 reveal" style={{ "--rv-delay": "200ms" }}>
              By{" "}
              <Link href="/about" className="gold-text hover:underline">
                Khamare Clarke
              </Link>{" "}
              &middot; August 2025 &middot; 8 min read
            </p>

            <p className="text-muted text-lg leading-relaxed mb-10 reveal" style={{ "--rv-delay": "280ms" }}>
              Every year since roughly 2011, someone announces that SEO is dead. The channel varies:
              social media killed it, voice search killed it, featured snippets killed it, AI killed it.
              None of those predictions were correct. What actually happened is that the territory
              expanded. The game got harder, the surface area got bigger, and the people declaring it
              dead were mostly the ones who had stopped paying attention.
            </p>

            <p className="text-muted leading-relaxed mb-10 reveal" style={{ "--rv-delay": "360ms" }}>
              If you run a business in the UK and you want qualified traffic from search, you now operate
              across four distinct layers. This post maps each one. It also explains who benefits from
              the &ldquo;SEO is dead&rdquo; narrative and why you should not let it shape your strategy.
            </p>

            <SectionHeading className="mt-12">
              Who profits from telling you <span className="gold-text">SEO is dead</span>?
            </SectionHeading>

            <p className="text-muted leading-relaxed mb-6 reveal" style={{ "--rv-delay": "200ms" }}>
              Follow the incentive. Paid media agencies profit when you shift budget from organic to
              paid ads. Platform companies profit when you pay for visibility rather than earn it.
              Generalist consultants profit when you abandon a discipline that takes expertise and start
              fresh with whatever they happen to sell this year.
            </p>

            <p className="text-muted leading-relaxed mb-6 reveal" style={{ "--rv-delay": "280ms" }}>
              None of that means paid media is bad or that generalist consultants are all cynical. It
              means you should evaluate the claim on evidence, not rhetoric. The evidence is consistent:
              organic search continues to drive a substantial proportion of web traffic for businesses
              that invest in it properly. BrightEdge research published in 2024 found organic search
              remains the largest single driver of website traffic across industries, accounting for
              over 53% of all trackable traffic. Paid search accounts for roughly 15%.
            </p>

            <p className="text-muted leading-relaxed mb-10 reveal" style={{ "--rv-delay": "360ms" }}>
              SEO did not die. The ceiling on what counts as &ldquo;doing SEO&rdquo; rose. That is a
              different problem, and it has a different solution.
            </p>

            <SectionHeading className="mt-12">
              What are the four layers now?
            </SectionHeading>

            <h3 className="reveal text-xl font-semibold gold-text mb-3 mt-8" style={{ "--rv-delay": "120ms" }}>
              Layer 1: Traditional search rankings (Google, Bing)
            </h3>

            <p className="text-muted leading-relaxed mb-6 reveal" style={{ "--rv-delay": "200ms" }}>
              This is what most people mean when they say SEO: appearing in the blue-link results on
              Google. It still matters enormously. Google processes an estimated 8.5 billion searches
              per day (Internet Live Stats, 2024). The principles have not changed: technical health,
              content that matches genuine search intent, and authority built through quality backlinks
              and entity consistency. What has changed is the execution standard. Thin content and
              exact-match keyword stuffing have not worked for years. You need depth, specificity, and
              demonstrable expertise.
            </p>

            <p className="text-muted leading-relaxed mb-10 reveal" style={{ "--rv-delay": "280ms" }}>
              For local businesses, this layer includes Google Business Profile optimisation. That is
              not separate from SEO; it is a component of it. In 90 days of structured GBP optimisation
              for Upgrade Roofing Solutions, we delivered a 538% increase in Google Business Profile
              interactions, with over 30 qualified calls in the first two weeks. The mechanism was not
              mysterious: consistent entity data, accurate category selection, regular post cadence, and
              review response strategy. Layer one, executed properly.
            </p>

            <h3 className="reveal text-xl font-semibold gold-text mb-3 mt-8" style={{ "--rv-delay": "120ms" }}>
              Layer 2: Answer Engine Optimisation (AEO)
            </h3>

            <p className="text-muted leading-relaxed mb-6 reveal" style={{ "--rv-delay": "360ms" }}>
              Google&apos;s AI Overviews (formerly Search Generative Experience) now appear at the top
              of many search results pages and provide a direct answer before the user ever clicks a
              link. Bing Copilot does the same. These are answer engines layered on top of traditional
              search engines.
            </p>

            <p className="text-muted leading-relaxed mb-6 reveal" style={{ "--rv-delay": "200ms" }}>
              AEO is the practice of structuring your content so that these systems pull from it when
              generating answers. The mechanics differ from traditional ranking: you need clear
              question-and-answer structure, well-implemented schema markup (particularly FAQ, HowTo,
              and Article schema), and content that matches the specific phrasing of conversational
              queries. Being cited in an AI Overview does not always drive a click, but it does
              establish authority and keeps you visible at the moment a decision is forming.
            </p>

            <p className="text-muted leading-relaxed mb-10 reveal" style={{ "--rv-delay": "280ms" }}>
              This layer did not exist at scale three years ago. It exists now. Ignoring it means
              handing visibility to competitors who are paying attention. See more on this in the
              context of{" "}
              <Link href="/services" className="gold-text hover:underline">
                AI search optimisation
              </Link>
              .
            </p>

            <h3 className="reveal text-xl font-semibold gold-text mb-3 mt-8" style={{ "--rv-delay": "120ms" }}>
              Layer 3: Generative Engine Optimisation (GEO)
            </h3>

            <p className="text-muted leading-relaxed mb-6 reveal" style={{ "--rv-delay": "360ms" }}>
              GEO is distinct from AEO. AEO targets search engines that have AI bolted on.
              GEO targets the generative AI platforms themselves: ChatGPT, Gemini, Claude, and
              Perplexity. When someone asks ChatGPT &ldquo;who does the best roofing SEO in the
              Midlands?&rdquo;, GEO determines whether your business is mentioned.
            </p>

            <p className="text-muted leading-relaxed mb-6 reveal" style={{ "--rv-delay": "200ms" }}>
              These systems do not crawl the web in real time in the same way Google does. They are
              trained on data, and they update their knowledge through retrieval-augmented generation
              (RAG) by referencing current web sources. To be cited in generative AI answers, you need
              consistent entity data across the web (NAP consistency, structured data, authoritative
              mentions in content that AI training pulls from), plus content that directly addresses
              the question formats these systems handle.
            </p>

            <p className="text-muted leading-relaxed mb-10 reveal" style={{ "--rv-delay": "280ms" }}>
              A 2024 study by Seer Interactive found that branded content appearing on authoritative
              third-party sites was far more likely to be cited in AI-generated answers than content
              hosted only on a brand&apos;s own domain. Your presence on the wider web matters for
              this layer in ways it has not mattered before. Read the dedicated post on{" "}
              <Link href="/blog/test-yourself-chatgpt-seo" className="gold-text hover:underline">
                testing your own AI visibility
              </Link>{" "}
              to see exactly where you stand right now.
            </p>

            <h3 className="reveal text-xl font-semibold gold-text mb-3 mt-8" style={{ "--rv-delay": "120ms" }}>
              Layer 4: Programmatic SEO at scale
            </h3>

            <p className="text-muted leading-relaxed mb-6 reveal" style={{ "--rv-delay": "360ms" }}>
              Programmatic SEO is the engineering of large volumes of pages from structured data. A
              law firm wanting to rank for &ldquo;[practice area] solicitors in [town]&rdquo; across
              300 UK towns does not write 300 articles manually. It builds a system that generates
              them from a data template, each with unique, accurate local content, properly structured
              markup, and internal links that reinforce the site architecture.
            </p>

            <p className="text-muted leading-relaxed mb-6 reveal" style={{ "--rv-delay": "200ms" }}>
              This is engineering work, not content work. It requires control over your URL structure,
              your rendering pipeline, and your data sources. It is why platform-hosted sites (WordPress
              with a theme, Wix, Shopify) hit a ceiling that custom-built sites do not. The{" "}
              <Link href="/blog/wordpress-real-ceiling" className="gold-text hover:underline">
                post on WordPress
              </Link>
              ,{" "}
              <Link href="/blog/shopify-local-seo-limits" className="gold-text hover:underline">
                the one on Shopify
              </Link>
              , and the{" "}
              <Link href="/blog/wix-2026-honest-review" className="gold-text hover:underline">
                Wix assessment
              </Link>{" "}
              all cover where each platform caps and why.
            </p>

            <p className="text-muted leading-relaxed mb-10 reveal" style={{ "--rv-delay": "280ms" }}>
              Programmatic SEO is where the compounding gains live. A well-structured programmatic
              campaign can generate thousands of ranking pages from a single well-designed system. That
              is a different category of return than writing individual blog posts.
            </p>

            <SectionHeading className="mt-12">
              What does this mean practically for a UK business?
            </SectionHeading>

            <p className="text-muted leading-relaxed mb-6 reveal" style={{ "--rv-delay": "200ms" }}>
              It means you need to audit where you currently operate and where you are absent. Most UK
              SMEs are doing a partial version of Layer 1 and nothing on Layers 2, 3, or 4. That is
              not incompetence; it is a resource and awareness problem. The practitioners who declared
              SEO dead often did so because they were only paying attention to Layer 1, and Layer 1 is
              more competitive than it was in 2015. But competitive is not the same as over.
            </p>

            <p className="text-muted leading-relaxed mb-6 reveal" style={{ "--rv-delay": "280ms" }}>
              A practical starting point is this sequence:
            </p>

            <ol className="list-decimal pl-6 text-muted space-y-3 mb-10">
              <li className="reveal" style={{ "--rv-delay": "0ms" }}>
                <strong className="text-white">Audit your current Layer 1 position.</strong> What do
                you rank for? What are you close on? Which pages have technical issues that are
                suppressing visibility?
              </li>
              <li className="reveal" style={{ "--rv-delay": "90ms" }}>
                <strong className="text-white">Implement structured data for AEO.</strong> At minimum:
                Organisation schema, FAQ schema on relevant pages, and Article schema on content. This
                is table stakes for Layer 2 visibility.
              </li>
              <li className="reveal" style={{ "--rv-delay": "180ms" }}>
                <strong className="text-white">Test your Layer 3 (GEO) presence.</strong> Open
                ChatGPT, Gemini, and Perplexity. Ask who provides your service in your area.
                If your business does not appear, your entity data needs work.
              </li>
              <li className="reveal" style={{ "--rv-delay": "270ms" }}>
                <strong className="text-white">Assess whether your platform supports Layer 4.</strong>{" "}
                If you need 50+ location or service pages, your current platform may be the constraint.
              </li>
            </ol>

            <SectionHeading className="mt-12">
              Why the &ldquo;SEO is dead&rdquo; narrative is <span className="gold-text">actively harmful</span>
            </SectionHeading>

            <p className="text-muted leading-relaxed mb-6 reveal" style={{ "--rv-delay": "200ms" }}>
              Businesses that accept the narrative stop investing in organic visibility. Competitors
              who do not accept it continue to compound their advantage. By the time the first group
              notices the gap, the authority deficit is significant and takes months to recover.
            </p>

            <p className="text-muted leading-relaxed mb-6 reveal" style={{ "--rv-delay": "280ms" }}>
              The businesses I work with in Stoke-on-Trent and across the UK are not losing to global
              competition on Layer 1 local search. They are losing to local competitors who made
              consistent, unglamorous investments in technical SEO, structured data, and Google
              Business Profile maintenance. Those are not dead disciplines. They are the baseline.
            </p>

            <p className="text-muted leading-relaxed mb-10 reveal" style={{ "--rv-delay": "360ms" }}>
              The expansion into Layers 2, 3, and 4 is where the gap between early movers and late
              movers will compound over the next three years. The narrative that SEO is dead functions
              as a permission slip to stop moving. Do not take it.
            </p>

            <SectionHeading className="mt-12">
              The summary
            </SectionHeading>

            <p className="text-muted leading-relaxed mb-6 reveal" style={{ "--rv-delay": "200ms" }}>
              SEO is not dead. It is four disciplines now instead of one, and most businesses are
              operating on one of them. The opportunity gap is real and it is measurable. The firms
              that close it in the next 12 to 18 months will hold positions that cost late movers
              significantly more to challenge.
            </p>

            <p className="text-muted leading-relaxed mb-10 reveal" style={{ "--rv-delay": "280ms" }}>
              I write the code, run the campaigns, and build the systems. My background is in
              AI (MSc, Keele University, completing 2027) and applied SEO. If you want to understand
              where your business sits across all four layers, the call below is a good starting point.
            </p>

            <CtaPanel
              className="mt-16"
              heading={<>Book a free <span className="gold-text">30-minute call.</span> No obligation.</>}
              body="We will audit your current SEO layer coverage and identify the highest-leverage gaps."
            >
              <CTAButton eventLabel="blog_seo_expanded_cta" caption="Where to put the effort.">
                Book a Consultation
              </CTAButton>
            </CtaPanel>

            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-muted text-sm mb-4 reveal" style={{ "--rv-delay": "360ms" }}>Related reading:</p>
              <ul className="space-y-2 text-sm">
                <li className="reveal" style={{ "--rv-delay": "0ms" }}>
                  <Link href="/blog/wordpress-real-ceiling" className="gold-text hover:underline">
                    The Real Ceiling on Your WordPress Site
                  </Link>
                </li>
                <li className="reveal" style={{ "--rv-delay": "90ms" }}>
                  <Link href="/blog/shopify-local-seo-limits" className="gold-text hover:underline">
                    Shopify Is Built to Sell Products. That&apos;s Exactly Why It Struggles at Local SEO.
                  </Link>
                </li>
                <li className="reveal" style={{ "--rv-delay": "180ms" }}>
                  <Link href="/blog/wix-2026-honest-review" className="gold-text hover:underline">
                    Wix in 2026: Better Than Its Reputation, Still Behind the Ceiling.
                  </Link>
                </li>
                <li className="reveal" style={{ "--rv-delay": "270ms" }}>
                  <Link href="/blog/test-yourself-chatgpt-seo" className="gold-text hover:underline">
                    Test It Yourself: Ask ChatGPT Who Does SEO in Your Area.
                  </Link>
                </li>
                <li className="reveal" style={{ "--rv-delay": "360ms" }}>
                  <Link href="/blog/ai-agent-standard-as-phone-number" className="gold-text hover:underline">
                    Within Five Years, an AI Agent Will Be as Standard as a Phone Number.
                  </Link>
                </li>
              </ul>
            </div>
          </article>
        </Container>
      </Section>
    </PageShell>
  );
}
