// src/app/blog/test-yourself-chatgpt-seo/page.js
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import CTAButton from "../../components/CTAButton";

export const metadata = {
  title: "Test It Yourself: Ask ChatGPT Who Does SEO in Your Area",
  description:
    "Open ChatGPT, Gemini, and Perplexity. Type your service and city. See who appears. This is your AI visibility score — and here is what determines it.",
  alternates: {
    canonical: "https://khamareclarke.com/blog/test-yourself-chatgpt-seo",
  },
  openGraph: {
    title: "Test It Yourself: Ask ChatGPT Who Does SEO in Your Area",
    description:
      "Open ChatGPT, Gemini, and Perplexity. Type your service and city. See who appears. This is your AI visibility score — and here is what determines it.",
    url: "https://khamareclarke.com/blog/test-yourself-chatgpt-seo",
    type: "article",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Test It Yourself: Ask ChatGPT Who Does SEO in Your Area.",
  description:
    "Open ChatGPT, Gemini, and Perplexity. Type your service and city. See who appears. This is your AI visibility score — and here is what determines it.",
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
    "@id": "https://khamareclarke.com/blog/test-yourself-chatgpt-seo",
  },
};

export default function TestYourselfChatgptSeo() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="flex min-h-screen flex-col bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-0 left-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-[#ffb700]/5 blur-3xl gradient-blob" />
          <div className="absolute bottom-0 right-1/4 h-64 w-64 md:h-96 md:w-96 rounded-full bg-white/3 blur-3xl" />
        </div>

        <Navbar />

        <article className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-white">
          <div className="mb-6">
            <Link href="/blog" className="text-[#ffb700] text-sm font-semibold hover:underline">
              &larr; Back to Resource Hub
            </Link>
          </div>

          <span className="inline-block bg-[#ffb700] text-[#222] font-bold py-1 px-3 rounded-full text-xs uppercase tracking-wider mb-6">
            AI Search
          </span>

          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-white leading-tight">
            Test It Yourself: Ask ChatGPT Who Does SEO in Your Area.
          </h1>

          <p className="text-[#ADB7BE] text-sm mb-10">
            By{" "}
            <Link href="/about" className="text-[#ffb700] hover:underline">
              Khamare Clarke
            </Link>{" "}
            &middot; August 2025 &middot; 8 min read
          </p>

          <p className="text-[#ADB7BE] text-lg leading-relaxed mb-8">
            You can do this right now, before you finish reading this post. Open a new tab.
            Go to ChatGPT. Type:
          </p>

          <div className="bg-[#1a1a1a] border border-[#ffb700]/30 rounded-xl p-6 mb-8 font-mono text-[#ffb700]">
            &ldquo;Who are the best [your service] companies in [your city]?&rdquo;
          </div>

          <p className="text-[#ADB7BE] leading-relaxed mb-6">
            Then do the same on Gemini and Perplexity. You will get an answer. It will mention
            specific businesses. Read it carefully, because what you are looking at is not a
            chatbot&apos;s opinion. It is a commercial ranking. It reflects who has AI visibility
            in your market, and AI visibility is increasingly where high-intent buyers start their
            search.
          </p>

          <p className="text-[#ADB7BE] leading-relaxed mb-10">
            If your business appears, that is a signal worth understanding and strengthening. If
            your business does not appear and your competitors do, you have a concrete gap to close.
            Either way, the three minutes this test takes will tell you more about your current
            market position than most quarterly reports.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-12">
            Step-by-step: how to run the test properly
          </h2>

          <h3 className="text-xl font-semibold text-[#ffb700] mb-3 mt-8">
            Step 1: Set up three tabs
          </h3>

          <p className="text-[#ADB7BE] leading-relaxed mb-4">
            Open the following in separate tabs:
          </p>

          <ul className="list-disc pl-6 text-[#ADB7BE] space-y-2 mb-8">
            <li>
              <span className="text-white font-semibold">ChatGPT</span> (chatgpt.com) &mdash; the
              most widely used generative AI platform. Use GPT-4o if you have access; the base
              model otherwise.
            </li>
            <li>
              <span className="text-white font-semibold">Gemini</span> (gemini.google.com) &mdash;
              Google&apos;s generative AI. This is particularly important because Google&apos;s AI
              Overviews in search results draw on similar data. Understanding your Gemini visibility
              gives you a proxy for AI Overview presence.
            </li>
            <li>
              <span className="text-white font-semibold">Perplexity</span> (perplexity.ai) &mdash;
              a retrieval-augmented search engine that cites sources in real time. Perplexity shows
              you both the answer and where it came from, which makes it uniquely useful for
              understanding what content is being cited.
            </li>
          </ul>

          <h3 className="text-xl font-semibold text-[#ffb700] mb-3 mt-8">
            Step 2: Run the right queries
          </h3>

          <p className="text-[#ADB7BE] leading-relaxed mb-4">
            Do not just ask one question. Run several variations that reflect how a real buyer
            thinks:
          </p>

          <ul className="list-disc pl-6 text-[#ADB7BE] space-y-3 mb-8">
            <li>&ldquo;Who does roofing in Stoke-on-Trent?&rdquo;</li>
            <li>&ldquo;Best roofing companies near me&rdquo; (with location enabled)</li>
            <li>&ldquo;Recommend a reliable roofer in Staffordshire&rdquo;</li>
            <li>&ldquo;Who should I call for an emergency roof repair in the Midlands?&rdquo;</li>
          </ul>

          <p className="text-[#ADB7BE] leading-relaxed mb-10">
            The variation matters because different phrasing activates different retrieval pathways.
            A business that appears on the first query but not the fourth has partial AI visibility.
            Full AI visibility means appearing consistently across query variants, across platforms.
          </p>

          <h3 className="text-xl font-semibold text-[#ffb700] mb-3 mt-8">
            Step 3: Note who appears and where their citations come from
          </h3>

          <p className="text-[#ADB7BE] leading-relaxed mb-6">
            On Perplexity, you can see the source links. Click them. The sources will typically be:
            directory listings (Checkatrade, Yell, TrustATrader), local news articles, review
            platforms, the business&apos;s own website, or specialist trade publications. This tells
            you exactly where AI citation authority comes from in your market.
          </p>

          <p className="text-[#ADB7BE] leading-relaxed mb-6">
            On ChatGPT and Gemini, you will not always see explicit citations, but the underlying
            mechanism is similar: the models surface businesses that have a strong, consistent
            presence in the text data they were trained on, combined with current web retrieval
            where RAG is active.
          </p>

          <p className="text-[#ADB7BE] leading-relaxed mb-10">
            Record which businesses appear across all three platforms and all query variants. That
            list is your competitive AI visibility benchmark.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-12">
            What does appearing in AI answers actually mean commercially?
          </h2>

          <p className="text-[#ADB7BE] leading-relaxed mb-6">
            In traditional search, appearing in position 1 on Google for a high-intent keyword is
            valuable because users click on it. The click-through rate at position 1 is documented
            at around 27% on average (First Page Sage, 2024), meaning roughly one in four people
            who see the result click through.
          </p>

          <p className="text-[#ADB7BE] leading-relaxed mb-6">
            In generative AI, the dynamics are different. AI answers often do not generate a direct
            click. The user reads the answer, sees the business name recommended, and then separately
            searches for that business or calls directly. The commercial effect is a branded search
            attribution gap: you are driving conversion activity that appears in your direct or
            branded traffic, not in AI referral traffic. Most analytics setups do not capture this
            correctly.
          </p>

          <p className="text-[#ADB7BE] leading-relaxed mb-6">
            What appearing in AI answers does mean concretely:
          </p>

          <ul className="list-disc pl-6 text-[#ADB7BE] space-y-3 mb-10">
            <li>
              Your business is named at the moment a buyer is actively in the consideration phase.
              That is the highest-value moment in the customer journey.
            </li>
            <li>
              Being cited by an AI system carries implicit endorsement. Most users do not question
              why an AI recommended a specific business. They treat it as a credible shortlist.
            </li>
            <li>
              Consistent AI citation builds brand recall. A buyer who sees your business named
              across ChatGPT and Perplexity and then searches Google and finds you in the map pack
              has had three touchpoints before making contact. Conversion rates from that kind of
              multi-touchpoint exposure are significantly higher than from a single search result.
            </li>
          </ul>

          <h2 className="text-2xl font-bold text-white mb-4 mt-12">
            What does not appearing mean?
          </h2>

          <p className="text-[#ADB7BE] leading-relaxed mb-6">
            It means your competitors who do appear are receiving the implicit endorsement you are
            not. In a local service market with three or four serious competitors, the one that
            appears in AI recommendations consistently has a structural advantage in the discovery
            phase of the customer journey.
          </p>

          <p className="text-[#ADB7BE] leading-relaxed mb-6">
            It also means your entity data is insufficient. AI systems build their understanding
            of local businesses from entity consistency: whether your business name, address, phone
            number, and service description appear consistently across the web. Inconsistent NAP
            data, thin or absent third-party mentions, missing structured data, and low review
            volume all contribute to poor AI entity recognition.
          </p>

          <p className="text-[#ADB7BE] leading-relaxed mb-10">
            The businesses that appear in AI recommendations are almost always those with: strong
            Google Business Profile signals, high review volume and recency, consistent directory
            listings, authoritative mentions on third-party sites, and well-structured website
            content that directly answers common service queries.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-12">
            How is AI visibility actually built?
          </h2>

          <p className="text-[#ADB7BE] leading-relaxed mb-6">
            This is where the technical discipline of{" "}
            <Link href="/blog/seo-didnt-die-it-expanded" className="text-[#ffb700] hover:underline">
              Generative Engine Optimisation (GEO)
            </Link>{" "}
            sits. GEO is not a single tactic. It is a combination of:
          </p>

          <h3 className="text-xl font-semibold text-[#ffb700] mb-3 mt-8">
            Entity consistency across the web
          </h3>

          <p className="text-[#ADB7BE] leading-relaxed mb-6">
            Every directory, review platform, and third-party mention of your business should have
            identical name, address, phone number, and website URL. Inconsistencies create entity
            disambiguation problems for AI systems trying to identify which &ldquo;Clarke Roofing&rdquo;
            is in Stoke and which is in Derby. Entity confusion means citation frequency drops.
          </p>

          <h3 className="text-xl font-semibold text-[#ffb700] mb-3 mt-8">
            Structured data implementation
          </h3>

          <p className="text-[#ADB7BE] leading-relaxed mb-6">
            Schema markup (JSON-LD) tells search engines and AI crawlers exactly what your business
            is, what services it provides, where it operates, and what its authority signals are.
            LocalBusiness schema, Service schema, FAQ schema, and Review schema all contribute to
            the structured entity profile that AI systems pull from.
          </p>

          <p className="text-[#ADB7BE] leading-relaxed mb-6">
            This is not optional infrastructure for AI visibility. It is foundational. A site without
            well-implemented structured data is giving AI systems less to work with than a site that
            has it. In a competitive local market, that gap translates directly to citation frequency.
          </p>

          <h3 className="text-xl font-semibold text-[#ffb700] mb-3 mt-8">
            Citation in authoritative content
          </h3>

          <p className="text-[#ADB7BE] leading-relaxed mb-6">
            A 2024 study by Seer Interactive found that brands mentioned in authoritative third-party
            content were more likely to appear in AI-generated answers than brands present only on
            their own domains. This means your presence in local news, trade publications, case study
            features, and high-authority directories is an active AI visibility signal.
          </p>

          <p className="text-[#ADB7BE] leading-relaxed mb-6">
            Getting mentioned in a Staffordshire business directory, a local construction industry
            publication, or a case study on a supplier&apos;s website all contribute to the web of
            citations that AI systems use to assess entity authority. This is a form of off-site SEO
            that has always mattered for Google rankings and now matters for AI visibility too.
          </p>

          <h3 className="text-xl font-semibold text-[#ffb700] mb-3 mt-8">
            Content that directly answers generative queries
          </h3>

          <p className="text-[#ADB7BE] leading-relaxed mb-6">
            Generative AI answers are built by assembling relevant content from across the web.
            If your website has a page that directly answers &ldquo;what is the average cost of
            roof repair in Stoke-on-Trent?&rdquo;, that page is a candidate for citation when
            someone asks ChatGPT the same question. If your site does not have that content, you
            are not a candidate.
          </p>

          <p className="text-[#ADB7BE] leading-relaxed mb-10">
            This is why content strategy for GEO is different from traditional keyword-driven
            content strategy. You are not writing for a keyword. You are writing for a question
            format that a generative system will encounter from real users, and you are structuring
            your answer so that an AI system can cleanly extract and cite it.
          </p>

          <h2 className="text-2xl font-bold text-white mb-4 mt-12">
            What does the test tell you to do?
          </h2>

          <p className="text-[#ADB7BE] leading-relaxed mb-6">
            If you ran the test at the top of this post, you now have a real data point on your AI
            visibility position. Here is how to interpret what you found:
          </p>

          <ul className="list-disc pl-6 text-[#ADB7BE] space-y-3 mb-10">
            <li>
              <strong className="text-white">You appeared consistently across all three platforms:</strong>{" "}
              Your entity data is in reasonable shape. The work is to understand why you appeared,
              systematise it, and expand it to more query variants.
            </li>
            <li>
              <strong className="text-white">You appeared on one platform but not the others:</strong>{" "}
              You have partial AI visibility. The gap is likely entity consistency and structured data.
              You are in the system but not with enough signal strength to surface reliably.
            </li>
            <li>
              <strong className="text-white">You did not appear on any platform:</strong>{" "}
              Your entity data is thin or inconsistent, your structured data is absent or minimal,
              and your third-party citation profile is insufficient. This is the starting point for
              a GEO engagement.
            </li>
          </ul>

          <p className="text-[#ADB7BE] leading-relaxed mb-10">
            The test takes two minutes. Costs nothing. If you want to know your current AI Visibility
            Score in more detail, including a breakdown of where your entity data is inconsistent
            and which citations you are missing in your specific market, that is a conversation I
            run in the 30-minute call below.
          </p>

          <div className="mt-16 p-8 bg-[#1a1a1a] border border-[#ffb700]/30 rounded-2xl text-center">
            <p className="text-white font-bold text-xl mb-2">
              Want to know your current AI Visibility Score?
            </p>
            <p className="text-[#ADB7BE] mb-2">Two minutes. Costs nothing.</p>
            <p className="text-[#ADB7BE] mb-6">
              Book a free 30-minute call. No obligation. We will run your AI visibility audit
              live on the call and show you exactly where you stand and what to fix first.
            </p>
            <CTAButton eventLabel="blog_chatgpt_seo_cta" caption="No pitch deck. No obligation.">
              Book Your Free Strategy Call
            </CTAButton>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10">
            <p className="text-[#ADB7BE] text-sm mb-4">Related reading:</p>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/blog/seo-didnt-die-it-expanded" className="text-[#ffb700] hover:underline">
                  They Told You SEO Was Dead. It Didn&apos;t Die &mdash; It Expanded.
                </Link>
              </li>
              <li>
                <Link href="/blog/ai-agent-standard-as-phone-number" className="text-[#ffb700] hover:underline">
                  Within Five Years, an AI Agent Will Be as Standard as a Phone Number.
                </Link>
              </li>
              <li>
                <Link href="/blog/wordpress-real-ceiling" className="text-[#ffb700] hover:underline">
                  The Real Ceiling on Your WordPress Site
                </Link>
              </li>
            </ul>
          </div>
        </article>

        <Footer />
      </main>
    </>
  );
}
