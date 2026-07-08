import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Privacy Policy | Khamare Clarke",
  description: "How Khamare Clarke collects, uses, and protects your personal data. UK GDPR compliant.",
  alternates: { canonical: "https://khamareclarke.com/privacy-policy" },
  openGraph: {
    title: "Privacy Policy | Khamare Clarke",
    description: "How Khamare Clarke collects, uses, and protects your personal data.",
    url: "https://khamareclarke.com/privacy-policy",
    siteName: "Khamare Clarke",
    locale: "en_GB",
    type: "website",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-br from-[#0a0a0a] via-[#121212] to-[#1a1a1a]">
      <Navbar />

      <article className="relative z-10 max-w-3xl mx-auto px-6 py-24 text-white w-full">
        <div className="mb-10">
          <span className="inline-block border border-[#ffb700] text-[#ffb700] text-xs font-bold px-4 py-1 rounded-full tracking-widest uppercase bg-black/30 mb-6">
            Legal
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">Privacy Policy</h1>
          <p className="text-white/50 text-sm">Last updated: July 2025</p>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-10 text-white/80 leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Who this covers</h2>
            <p>
              This policy covers how Khamare Clarke (trading as an individual SEO and AI systems consultant,
              based in Stoke-on-Trent, England) handles personal data collected through khamareclarke.com.
              Contact: <a href="mailto:systems@khamare.com" className="text-[#ffb700] hover:underline">systems@khamare.com</a>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">What data is collected and why</h2>

            <h3 className="text-base font-semibold text-white/90 mb-2 mt-5">Contact form</h3>
            <p>
              When you submit the contact or enquiry form, your name, email address, phone number, and message
              are collected. This data is used solely to respond to your enquiry. The legal basis is legitimate
              interest: you have initiated contact about a potential business relationship.
            </p>

            <h3 className="text-base font-semibold text-white/90 mb-2 mt-5">Booking</h3>
            <p>
              Strategy call bookings are handled through LeadConnector (GoHighLevel). When you book, your
              data is processed by LeadConnector under their own privacy policy. Booking data is used to
              schedule and follow up on your call.
            </p>

            <h3 className="text-base font-semibold text-white/90 mb-2 mt-5">Analytics</h3>
            <p>
              Google Analytics 4 is used to understand how visitors use the site (pages viewed, time on site,
              general location, device type). IP addresses are anonymised. No cross-site tracking is performed.
              The legal basis is legitimate interest in understanding site performance.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">What is not done with your data</h2>
            <ul className="list-disc list-inside space-y-1 text-white/80">
              <li>Your data is not sold to any third party.</li>
              <li>Your data is not shared with advertisers.</li>
              <li>You will not be added to a marketing list without your explicit consent.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Third-party processors</h2>
            <p>The following services process data as part of operating this site:</p>
            <ul className="list-disc list-inside space-y-1 text-white/80 mt-2">
              <li><strong className="text-white">LeadConnector / GoHighLevel</strong> — booking and CRM</li>
              <li><strong className="text-white">Google Analytics 4</strong> — anonymised usage analytics</li>
              <li><strong className="text-white">Vercel</strong> — website hosting (data processed in transit)</li>
            </ul>
            <p className="mt-3">
              Each processor operates under their own terms and privacy policies, which apply to data they hold.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">How long data is kept</h2>
            <p>
              Enquiry and contact data is retained for as long as there is an active business relationship or
              ongoing correspondence, and for up to two years after the last contact. Analytics data is retained
              at the default GA4 retention period (14 months).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Your rights under UK GDPR</h2>
            <p>You have the right to:</p>
            <ul className="list-disc list-inside space-y-1 text-white/80 mt-2">
              <li>Access the personal data held about you</li>
              <li>Request correction of inaccurate data</li>
              <li>Request deletion of your data</li>
              <li>Object to processing based on legitimate interest</li>
              <li>Request restriction of processing</li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email{" "}
              <a href="mailto:systems@khamare.com" className="text-[#ffb700] hover:underline">systems@khamare.com</a>.
              Requests will be responded to within 30 days.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Cookies</h2>
            <p>
              This site uses cookies for analytics (Google Analytics 4). No advertising or tracking cookies
              are set beyond this. You can disable cookies in your browser settings at any time.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Changes to this policy</h2>
            <p>
              If this policy changes materially, the "last updated" date above will be revised. Continued use
              of the site after a change constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">Contact</h2>
            <p>
              For any privacy-related question or request:{" "}
              <a href="mailto:systems@khamare.com" className="text-[#ffb700] hover:underline">systems@khamare.com</a>
            </p>
            <p className="mt-2">
              You also have the right to lodge a complaint with the Information Commissioner&apos;s Office (ICO)
              at <span className="text-white/60">ico.org.uk</span> if you believe your data has been handled unlawfully.
            </p>
          </section>

        </div>
      </article>

      <Footer />
    </main>
  );
}
