import Link from "next/link";
import PageShell from "../components/PageShell";
import PageHero from "../components/ui/PageHero";
import SectionHeading from "../components/ui/SectionHeading";
import { Section } from "../components/ui/Section";
import { Container } from "../components/ui/Container";
import Card from "../components/ui/Card";

export default function SitemapPage() {
  const sitemapSections = [
    {
      title: "Main Pages",
      links: [
        { name: "Home", url: "/" },
        { name: "About", url: "/about" },
        { name: "Services", url: "/services" },
        { name: "Case Studies", url: "/case-studies" },
        { name: "Blog", url: "/blog" },
      ]
    },
    {
      title: "Special Offers",
      links: [
        { name: "Business Bundle", url: "/business-bundle" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "AI Chatbots for UK Trades", url: "/blog/ai-chatbots-save-uk-trades" },
        { name: "ROI-Driven Websites for SMEs", url: "/blog/roi-websites-uk-smes" },
      ]
    },
    {
      title: "Legal & Info",
      links: [
        { name: "Privacy Policy", url: "/privacy" },
        { name: "Terms of Service", url: "/terms" },
        { name: "Cookie Policy", url: "/cookies" },
        { name: "Sitemap", url: "/sitemap-page" },
      ]
    }
  ];

  return (
    <PageShell>
      <Section className="mt-0 pb-ds-4 page-top">
        <Container size="main">
          <PageHero
            eyebrow="Sitemap"
            title={
              <>
                Site <span className="gold-text">Navigation</span>
              </>
            }
            lede="Quick access to all pages and resources on khamareclarke.com"
          />

          {/* Sitemap Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {sitemapSections.map((section, index) => (
              <Card
                key={index}
                className="reveal"
                style={{ "--rv-delay": `${index * 110}ms` }}
              >
                {/* These four were <h2> before the migration and are <h2> again. They
                    are the page's primary groupings, so demoting them to <h3> left the
                    outline as h1 -> h3 x4 -> h2, and skipping a level is a real
                    accessibility fault. What actually needed fixing was the SIZE, not
                    the tag: ds-heading-2 is up to 60px and would wreck a four-column
                    card, so this uses ds-heading-3 (20-24px, weight 700) — the token in
                    the ladder that covers card titles — on a heading that keeps its h2. */}
                <h2 className="ds-heading-3 mb-6 text-primary">
                  {section.title}
                </h2>
                <ul className="space-y-3">
                  {section.links.map((link, idx) => (
                    <li key={idx}>
                      <Link
                        href={link.url}
                        className="text-muted hover:text-primary transition-colors duration-300 flex items-center gap-2 group"
                      >
                        <span className="text-primary group-hover:translate-x-1 transition-transform duration-300">→</span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>

          {/* Quick Links */}
          <Card
            className="reveal mt-16 text-center p-8 md:p-12"
            style={{ "--rv-delay": "200ms" }}
          >
            <SectionHeading id="need-help" align="center">
              Need Help Finding <span className="gold-text">Something?</span>
            </SectionHeading>
            <p className="reveal text-muted mb-8 max-w-2xl mx-auto" style={{ "--rv-delay": "200ms" }}>
              Can&apos;t find what you&apos;re looking for? Get in touch and I&apos;ll help you out.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center bg-primary hover:bg-primary-hover text-[#222] font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-primary"
            >
              Contact Me →
            </Link>
          </Card>

          {/* XML Sitemap Link */}
          <div className="reveal mt-12 text-center" style={{ "--rv-delay": "200ms" }}>
            <p className="text-muted mb-4">
              Looking for the XML sitemap for search engines?
            </p>
            <a
              href="/sitemap.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-hover transition-colors duration-300 underline"
            >
              View XML Sitemap
            </a>
          </div>
        </Container>
      </Section>
    </PageShell>
  );
}
