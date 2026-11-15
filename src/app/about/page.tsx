import { siteConfig } from "@/config/site";
import { serviceCategories } from "@/content/services";
import { processSteps, whyUs } from "@/content/general";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { ContactCTA, TechStack } from "@/components/home/HomeSections";

export const metadata = pageMetadata({
  title: "About Us — Practical AI, Automation & Web Engineering",
  description: `${siteConfig.name} is a ${siteConfig.location.city}-based technology studio building AI agents, business automation and modern websites for businesses in India and worldwide.`,
  path: "/about",
});

const commitments = [
  { title: "We solve a measurable problem", body: "Before writing code we agree what the system should change — fewer manual steps, faster replies, more enquiries — and design for that outcome." },
  { title: "AI where it helps, rules where they're safer", body: "Not every step needs a language model. We combine AI with deterministic logic, verification and human approval where accuracy matters." },
  { title: "Honest about limits", body: "AI can be wrong. We build guardrails, fallbacks and human handoff, and we're upfront about what a system can and can't do." },
  { title: "Built to be maintained", body: "Clean code, documented workflows and monitoring, so your system keeps working long after launch." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        crumbs={[{ name: "About", path: "/about" }]}
        title={
          <>
            Practical technology for businesses that want to <span className="accent-serif text-gradient">grow</span>.
          </>
        }
        description={`${siteConfig.name} is a technology studio based in ${siteConfig.location.city}, ${siteConfig.location.country}. ${siteConfig.positioning}`}
      />

      <Section labelledBy="mission-heading" className="pt-0 sm:pt-0">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <p className="eyebrow">Our mission</p>
            <h2 id="mission-heading" className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-fg sm:text-4xl">
              Make intelligent automation accessible to every growing business.
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="space-y-5 text-lg leading-relaxed text-muted">
            <p>
              Large companies have teams of engineers automating their operations. Most startups, clinics, travel agencies, real estate firms and small businesses don&apos;t — so their people spend hours on work a well-designed system could handle.
            </p>
            <p>
              We exist to close that gap. We bring together AI agents, workflow automation and modern web development to build systems that answer customers, move information between tools and turn visitors into enquiries.
            </p>
          </Reveal>
        </div>
      </Section>

      <Section labelledBy="cap-heading" className="border-y border-white/[0.05] bg-surface/30">
        <SectionHeading id="cap-heading" eyebrow="Technical capabilities" title="Three disciplines, deeply integrated" />
        <div className="mt-12 grid gap-5 lg:grid-cols-3">
          {serviceCategories.map((c, i) => (
            <Reveal key={c.slug} delay={i * 0.06} className="card h-full p-7">
              <Icon name={c.icon} size={24} className="text-primary-bright" />
              <h3 className="mt-5 text-xl font-semibold text-fg">{c.title}</h3>
              <ul className="mt-5 space-y-2 text-sm text-muted">
                {c.capabilities.slice(0, 6).map((cap) => (
                  <li key={cap} className="flex gap-2">
                    <span className="mt-2 size-1 shrink-0 rounded-full bg-primary-bright" aria-hidden="true" /> {cap}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section labelledBy="approach-heading">
        <SectionHeading id="approach-heading" eyebrow="Our approach" title="How we solve business problems" description="Every engagement follows the same disciplined path, from understanding the problem to improving the live system." />
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {processSteps.map((s, i) => (
            <li key={s.title}>
              <Reveal delay={i * 0.05} className="card h-full p-6">
                <span className="font-mono text-xs text-primary-bright">0{i + 1}</span>
                <h3 className="mt-3 font-medium text-fg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      <Section labelledBy="commit-heading" className="border-y border-white/[0.05] bg-surface/30">
        <SectionHeading id="commit-heading" eyebrow="Our commitment" title="Practical AI, implemented responsibly" />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {commitments.map((c, i) => (
            <Reveal key={c.title} delay={(i % 2) * 0.06} className="card h-full p-7">
              <h3 className="text-lg font-medium text-fg">{c.title}</h3>
              <p className="mt-2 leading-relaxed text-muted">{c.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section labelledBy="why-heading">
        <SectionHeading id="why-heading" eyebrow="Why work with us" title="What you can expect" />
        <div className="mt-12 grid gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {whyUs.map((w, i) => (
            <Reveal key={w.title} delay={(i % 3) * 0.05}>
              <Icon name={w.icon} size={20} className="text-primary-bright" />
              <h3 className="mt-4 font-medium text-fg">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{w.body}</p>
            </Reveal>
          ))}
        </div>
      </Section>

      <TechStack />
      <ContactCTA />
    </>
  );
}
