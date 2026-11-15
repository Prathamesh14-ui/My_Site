import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { serviceCategories } from "@/content/services";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/Reveal";
import { SubServiceGrid } from "@/components/services/ServiceBlocks";
import { ContactCTA } from "@/components/home/HomeSections";
import { siteConfig } from "@/config/site";

export const metadata = pageMetadata({
  title: "Services — AI Solutions, Business Automation & Web Development",
  description:
    "Custom AI agents, WhatsApp AI chatbots, RAG and LLM integrations, n8n workflow automation, CRM and calendar integrations, and high-performance Next.js websites.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        crumbs={[{ name: "Services", path: "/services" }]}
        title={
          <>
            Solutions for the problems that <span className="accent-serif text-gradient">slow</span> your business down.
          </>
        }
        description="We combine AI, automation and modern web development to remove repetitive work, respond to customers faster and turn more visitors into enquiries."
      >
        <div className="flex flex-wrap gap-3">
          {serviceCategories.map((c) => (
            <Link
              key={c.slug}
              href={`#${c.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-fg/85 transition-colors hover:border-primary/40 hover:text-fg"
            >
              <Icon name={c.icon} size={16} className="text-primary-bright" /> {c.title}
            </Link>
          ))}
        </div>
      </PageHero>

      {serviceCategories.map((cat, i) => (
        <Section key={cat.slug} id={cat.slug} labelledBy={`${cat.slug}-title`} className={i % 2 === 1 ? "border-y border-white/[0.05] bg-surface/30" : ""}>
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading id={`${cat.slug}-title`} eyebrow={`0${i + 1} · ${cat.eyebrow}`} title={cat.title} description={cat.intro} />
            <Reveal className="flex shrink-0 flex-wrap gap-3">
              <ButtonLink href={`/services/${cat.slug}`} variant="secondary" arrow>
                {cat.shortTitle} in depth
              </ButtonLink>
            </Reveal>
          </div>
          <div className="mt-12">
            <SubServiceGrid category={cat} />
          </div>
          <Reveal className="mt-8">
            <Link href={`${siteConfig.cta.primary.href}?service=${encodeURIComponent(cat.services[0].title)}`} className="inline-flex items-center gap-1.5 text-sm font-medium text-primary-bright hover:text-fg">
              Discuss a {cat.shortTitle.toLowerCase()} project — free consultation <ArrowUpRight className="size-4" aria-hidden="true" />
            </Link>
          </Reveal>
        </Section>
      ))}

      <ContactCTA />
    </>
  );
}
