import { Clock, Mail, MapPin, CalendarCheck } from "lucide-react";
import { siteConfig, whatsappLink } from "@/config/site";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { WhatsAppIcon } from "@/components/ui/Icon";
import { ContactForm } from "@/components/features/ContactForm";

export const metadata = pageMetadata({
  title: "Contact — Book a Free Consultation",
  description: `Tell us about your AI, automation or website project. Book a free consultation with ${siteConfig.name}, by enquiry form, email or WhatsApp.`,
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        crumbs={[{ name: "Contact", path: "/contact" }]}
        title={
          <>
            Let&apos;s talk about your <span className="accent-serif text-gradient">next</span> system.
          </>
        }
        description="Share a few details and we'll come back with thoughts, questions and a suggested next step. The first consultation is free."
      />
      <Section className="pt-0 sm:pt-0">
        <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr] lg:items-start">
          <Reveal>
            <ContactForm />
          </Reveal>
          <Reveal delay={0.08} className="space-y-4 lg:sticky lg:top-24">
            <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="card card-hover group flex items-start gap-4 p-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-emerald-400/10 text-emerald-300">
                <WhatsAppIcon size={20} />
              </span>
              <div>
                <p className="font-medium text-fg">WhatsApp</p>
                <p className="mt-0.5 text-sm text-muted">{siteConfig.contact.whatsapp.display}</p>
                <p className="mt-2 text-sm text-primary-bright group-hover:text-fg">Start a chat →</p>
              </div>
            </a>
            <a href={`mailto:${siteConfig.contact.email}`} className="card card-hover group flex items-start gap-4 p-6">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary-bright">
                <Mail className="size-5" aria-hidden="true" />
              </span>
              <div>
                <p className="font-medium text-fg">Email</p>
                <p className="mt-0.5 break-all text-sm text-muted">{siteConfig.contact.email}</p>
                <p className="mt-2 text-sm text-primary-bright group-hover:text-fg">Send an email →</p>
              </div>
            </a>
            <div className="card p-6">
              <p className="flex items-center gap-2 font-medium text-fg">
                <CalendarCheck className="size-4 text-primary-bright" aria-hidden="true" /> Free consultation
              </p>
              <ul className="mt-4 space-y-2.5 text-sm text-muted">
                <li>• Understand your goals and current process</li>
                <li>• Recommend the right approach (AI, automation, web)</li>
                <li>• Outline scope, timeline and next steps</li>
              </ul>
              <div className="mt-5 space-y-2 border-t border-white/[0.06] pt-5 text-sm text-muted">
                <p className="flex items-center gap-2"><Clock className="size-4" aria-hidden="true" /> {siteConfig.contact.hours}</p>
                <p className="flex items-center gap-2"><MapPin className="size-4" aria-hidden="true" /> {siteConfig.location.city}, {siteConfig.location.country}. Working with clients worldwide.</p>
              </div>
            </div>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
