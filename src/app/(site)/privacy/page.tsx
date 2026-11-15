import { siteConfig } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";

export const metadata = pageMetadata({
  title: "Privacy Notice",
  description: `How ${siteConfig.name} handles information submitted through this website.`,
  path: "/privacy",
});

/* PLACEHOLDER — a plain-language starting point. Have it reviewed for your jurisdiction (e.g. India's DPDP Act, GDPR for EU clients) before launch. */
export default function PrivacyPage() {
  return (
    <>
      <PageHero crumbs={[{ name: "Privacy", path: "/privacy" }]} title="Privacy notice" description="How we handle the information you share with us through this website." />
      <Section className="pt-0 sm:pt-0">
        <div className="prose-body max-w-3xl space-y-10 text-[15px] leading-relaxed text-muted">
          <div>
            <h2 className="mb-3 text-xl font-semibold text-fg">What we collect</h2>
            <p>When you submit the enquiry form we receive the details you provide: your name, business name, email address, WhatsApp number, the service you&apos;re interested in, your budget range and your project description.</p>
            <p>If you use the AI assistant demo, the messages you type are sent to our server to generate a reply. When a live AI model is enabled, messages are processed by our AI provider to produce the response. Please don&apos;t share sensitive personal information in the demo.</p>
          </div>
          <div>
            <h2 className="mb-3 text-xl font-semibold text-fg">How we use it</h2>
            <p>We use enquiry details only to respond to you, discuss your project and prepare proposals. We don&apos;t sell your information or use it for unrelated marketing without your consent.</p>
          </div>
          <div>
            <h2 className="mb-3 text-xl font-semibold text-fg">Storage & third parties</h2>
            <p>Enquiries are stored in our private content management system (Sanity) and may also be delivered to our business inbox through an email provider. Access is limited to people who need it to respond to you.</p>
            <p>The project estimator runs in your browser. Its summary is kept only in your browser session until you choose to send it with an enquiry.</p>
          </div>
          <div>
            <h2 className="mb-3 text-xl font-semibold text-fg">Your choices</h2>
            <p>
              You can ask us to access, correct or delete your information at any time by emailing{" "}
              <a href={`mailto:${siteConfig.contact.email}`} className="text-primary-bright hover:underline">{siteConfig.contact.email}</a>.
            </p>
          </div>
        </div>
      </Section>
    </>
  );
}
