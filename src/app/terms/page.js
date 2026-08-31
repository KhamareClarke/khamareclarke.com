import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Terms of Service | Khamare Clarke",
  description: "Terms governing services provided by Khamare Clarke: SEO, AI search, and digital systems.",
  alternates: { canonical: "https://khamareclarke.com/terms" },
  openGraph: {
    title: "Terms of Service | Khamare Clarke",
    description: "Terms governing services provided by Khamare Clarke.",
    url: "https://khamareclarke.com/terms",
    siteName: "Khamare Clarke",
    locale: "en_GB",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <main className="flex min-h-screen flex-col bg-[#0a0a0a]">
      <Navbar />

      <article className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-white w-full">
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-6 h-4">
            <span className="h-[2px] w-10 shrink-0 bg-gradient-to-r from-transparent to-primary -translate-y-[7px]" aria-hidden="true" />
            <p className="text-xs font-semibold tracking-[0.18em] uppercase gold-text leading-none whitespace-nowrap">
              Legal
            </p>
            <span className="h-[2px] w-10 shrink-0 bg-gradient-to-l from-transparent to-primary -translate-y-[7px]" aria-hidden="true" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Terms of Service</h1>
          <p className="text-white/50 text-sm">Last updated: July 2025</p>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-10 text-white/80 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Who these terms apply to</h2>
            <p>
              These terms govern services provided by Khamare Clarke (individual consultant, Stoke-on-Trent,
              England) to clients who have agreed to a service engagement. By engaging Khamare Clarke, you
              accept these terms. Questions:{" "}
              <a href="mailto:systems@khamare.com" className="text-[#ffb700] hover:underline">systems@khamare.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Services</h2>
            <p>
              Services include but are not limited to: local SEO, AI search optimisation, Google Business
              Profile management, AI receptionist and lead response systems, Google Ads management, website
              development, and CRM and email marketing. The exact scope of each engagement is confirmed in a
              written agreement before work begins.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Contract terms and payment</h2>
            <p>
              <strong className="text-white">Get Found</strong> packages operate on a rolling monthly basis
              from day one. <strong className="text-white">Run The Area</strong> and{" "}
              <strong className="text-white">Own The Market</strong> packages have a six-month initial term,
              after which they continue on a rolling monthly basis. Prices shown on this site are starting
              prices; the exact figure for your engagement is confirmed in your quote.
            </p>
            <p className="mt-3">
              Payment terms, invoicing schedules, and cancellation conditions are set out in the individual
              client agreement. Invoices are due on the date stated. Late payment may result in work being
              paused until the account is settled.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">The ranked-or-refunded guarantee</h2>
            <p>
              The guarantee referenced on this site applies where explicitly included in the written client
              agreement. The full conditions, qualifying criteria, timeframes, and remedy are set out in that
              agreement. The guarantee does not apply to services not explicitly covered, to results outside
              agreed scope, or where a client has not fulfilled their obligations (such as providing required
              access, content, or approvals).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Client responsibilities</h2>
            <p>
              You agree to provide timely access, logins, content, and approvals as reasonably required.
              Delays caused by your side may affect timelines. You are responsible for ensuring that any
              information or assets you provide do not infringe third-party rights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Intellectual property</h2>
            <p>
              Content, strategies, and systems created during an engagement remain the property of Khamare
              Clarke until full payment is received, at which point ownership of deliverables agreed in
              writing transfers to you. This does not include underlying tools, frameworks, or proprietary
              systems developed independently. Websites built as part of a package are transferred to client
              ownership on completion of the agreed term, as stated in the individual agreement.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Results and liability</h2>
            <p>
              SEO, AI search, and digital marketing involve third-party platforms (Google, OpenAI, and others)
              that change their algorithms and policies. Outcomes cannot be guaranteed beyond what is explicitly
              stated in a signed agreement. Khamare Clarke is not liable for algorithm changes, platform policy
              updates, or factors outside direct control.
            </p>
            <p className="mt-3">
              Liability is limited to the total fees paid in the three months preceding any claim. Khamare
              Clarke is not liable for indirect or consequential losses (lost revenue, lost contracts, lost
              data) arising from the services or the use of this website.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Confidentiality</h2>
            <p>
              Both parties agree to keep confidential any non-public information shared during the engagement.
              This does not prevent Khamare Clarke from using anonymised results or metrics in case studies,
              unless the client has requested otherwise in writing.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Termination</h2>
            <p>
              Either party may terminate a rolling monthly engagement by giving notice as specified in the
              client agreement (typically 30 days). Fixed-term agreements (six-month initial terms) may be
              terminated early only as stated in the agreement. Fees accrued up to the termination date remain
              payable.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Governing law</h2>
            <p>
              These terms and any disputes arising from them are governed by the law of England and Wales.
              Both parties agree to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Changes to these terms</h2>
            <p>
              These terms may be updated from time to time. The version in force at the time your engagement
              begins is the one that applies to that engagement, unless both parties agree in writing to adopt
              a later version.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Contact</h2>
            <p>
              <a href="mailto:systems@khamare.com" className="text-[#ffb700] hover:underline">systems@khamare.com</a>
            </p>
          </section>

        </div>
      </article>

      <Footer />
    </main>
  );
}
