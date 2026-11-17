import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import { siteConfig, whatsappLink } from "@/config/site";
import { BrowserFrame, PhoneFrame, isPortrait } from "@/components/work/Screenshots";
import { cn } from "@/lib/utils";
import { industries, processSteps, technologies, whyUs } from "@/content/general";
import type { Project } from "@/content/types";
import { getCategory, getProjects, getServiceCategories } from "@/lib/content";
import { Section, SectionHeading, Badge, Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Icon, WhatsAppIcon } from "@/components/ui/Icon";
import { ButtonLink } from "@/components/ui/Button";
import { MockupLabel, ProjectMockup, BrowserMockup } from "@/components/mockups/Mockups";
import { HeroVisual } from "@/components/home/HeroVisual";
import { ChatDemo } from "@/components/features/ChatDemo";
import { WorkflowVisualizer } from "@/components/features/WorkflowVisualizer";

/* 1 ─ Trust-building introduction */
export function TrustIntro() {
  const principles = [
    { title: "Practical", body: "Solutions to specific, costly problems — not AI for its own sake." },
    { title: "Integrated", body: "AI, workflows and your website designed as one connected system." },
    { title: "Owned by you", body: "Documented code and workflows, deployed on accounts you control." },
  ];
  return (
    <Section labelledBy="intro-title" className="border-y border-line bg-surface">
      <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-16">
        <div>
          <Reveal>
            <p className="eyebrow mb-4">A technology partner, not just a chatbot vendor</p>
            <h2 id="intro-title" className="text-2xl leading-snug text-fg sm:text-[1.9rem]">
              We build intelligent AI agents, automate business operations and develop modern websites —{" "}
              <span className="text-muted">so your team spends less time on repetitive work and more time growing the business.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <ul className="mt-10 divide-y divide-line border-y border-line">
              {principles.map((p, i) => (
                <li key={p.title} className="flex gap-5 py-5">
                  <span className="label tabular-nums pt-1 text-primary-bright">0{i + 1}</span>
                  <div>
                    <p className="font-[family-name:var(--font-display)] font-medium text-fg">{p.title}</p>
                    <p className="mt-1 text-sm text-muted">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
        <Reveal delay={0.12} className="mx-auto w-full max-w-[560px]">
          <HeroVisual />
        </Reveal>
      </div>
      <Reveal delay={0.15} className="mt-14 flex flex-col gap-3 border-t border-line pt-8 sm:flex-row sm:items-baseline sm:gap-8">
        <p className="label shrink-0 text-muted">Built for</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.95rem] text-fg/85">
          {industries.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}

/* 2 ─ Services overview */
export async function ServicesOverview() {
  const serviceCategories = await getServiceCategories();
  return (
    <Section id="services" labelledBy="services-title">
      <SectionHeading
        id="services-title"
        eyebrow="What we do"
        title={
          <>
            Three disciplines. <span className="accent-serif text-gradient">One</span> growth system.
          </>
        }
        description="Most growth problems sit between channels and tools. We solve them with AI, automation and web development working together."
      />
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {serviceCategories.map((cat, i) => (
          <Reveal key={cat.slug} delay={i * 0.08}>
            <article className="card card-hover group flex h-full flex-col p-6 sm:p-7">
              <div className="flex items-center justify-between">
                <span className="grid size-11 place-items-center rounded-xl border border-primary/20 bg-primary/10 text-primary-bright">
                  <Icon name={cat.icon} size={22} />
                </span>
                <span className="label tabular-nums text-muted">0{i + 1}</span>
              </div>
              <h3 className="mt-6 text-xl font-semibold tracking-tight text-fg">{cat.title}</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-muted">{cat.tagline}</p>
              <ul className="mt-6 space-y-2.5 border-t border-ink/[0.06] pt-6">
                {cat.services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${cat.slug}/${s.slug}`} className="flex items-center justify-between gap-3 text-sm text-fg/80 transition-colors hover:text-fg">
                      {s.title}
                      <ArrowUpRight className="size-3.5 shrink-0 text-muted" aria-hidden="true" />
                    </Link>
                  </li>
                ))}
              </ul>
              <Link
                href={`/services/${cat.slug}`}
                className="mt-auto inline-flex items-center gap-1.5 pt-8 text-sm font-medium text-primary-bright hover:text-fg"
              >
                Explore {cat.title} <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 3 ─ Featured AI solutions + live chatbot demo */
export async function FeaturedAI() {
  const ai = (await getCategory("ai-solutions")) ?? (await getServiceCategories())[0];
  return (
    <Section id="ai-demo" labelledBy="ai-title" className="overflow-hidden">
      <div aria-hidden="true" className="glow-primary pointer-events-none absolute left-0 top-1/3 h-[500px] w-[600px] opacity-40 blur-3xl" />
      <div className="relative grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <SectionHeading
            id="ai-title"
            eyebrow="Featured · AI solutions"
            title={
              <>
                Talk to an assistant <span className="accent-serif text-gradient">before</span> you hire us to build one.
              </>
            }
            description="Try our demo assistant. Ask about our services, or switch scenarios to see how an AI assistant could work for a clinic or a travel business."
          />
          <Reveal delay={0.1}>
            <ul className="mt-9 grid gap-3 sm:grid-cols-2">
              {(ai?.solution.points ?? []).map((p) => (
                <li key={p} className="flex items-start gap-3 text-sm text-fg/85">
                  <Check className="mt-0.5 size-4 shrink-0 text-primary-bright" aria-hidden="true" /> {p}
                </li>
              ))}
            </ul>
            <div className="mt-9 flex flex-wrap gap-3">
              <ButtonLink href="/services/ai-solutions" variant="secondary" arrow>
                Explore AI solutions
              </ButtonLink>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <ChatDemo />
        </Reveal>
      </div>
    </Section>
  );
}

/* 4 ─ Featured website development */
export async function FeaturedWeb() {
  const web = await getCategory("web-development");
  const pillars = [
    { title: "Performance-first", body: "Server rendering, optimised images and fonts, minimal JavaScript." },
    { title: "Search-ready", body: "Semantic HTML, metadata, sitemaps and structured data built in." },
    { title: "Editable", body: "Headless CMS so your team updates content without a developer." },
    { title: "Conversion-led", body: "Every page structured around a clear next step for the visitor." },
  ];
  return (
    <Section labelledBy="web-title">
      <div className="grid gap-14 lg:grid-cols-[1.1fr_1fr] lg:items-center">
        <Reveal className="order-2 lg:order-1">
          <div className="relative">
            <div aria-hidden="true" className="glow-secondary absolute -inset-10 opacity-50 blur-2xl" />
            <BrowserMockup className="relative" />
            <MockupLabel className="absolute -bottom-3 left-4" />
          </div>
        </Reveal>
        <div className="order-1 lg:order-2">
          <SectionHeading
            id="web-title"
            eyebrow="Featured · Web development"
            title={
              <>
                Websites engineered to <span className="accent-serif text-gradient">convert</span>.
              </>
            }
            description={web?.intro}
          />
          <Reveal delay={0.1}>
            <dl className="mt-9 grid gap-6 sm:grid-cols-2">
              {pillars.map((p) => (
                <div key={p.title} className="border-l border-primary/40 pl-4">
                  <dt className="font-medium text-fg">{p.title}</dt>
                  <dd className="mt-1.5 text-sm text-muted">{p.body}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-9">
              <ButtonLink href="/services/web-development" variant="secondary" arrow>
                Explore web development
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}

/* 5 ─ Interactive automation showcase */
export function AutomationShowcase() {
  return (
    <Section id="automation" labelledBy="automation-title" className="border-y border-line bg-surface">
      <SectionHeading
        id="automation-title"
        align="center"
        eyebrow="Interactive · Automation"
        title={
          <>
            Watch a workflow <span className="accent-serif text-gradient">run itself</span>.
          </>
        }
        description="Pick a scenario and press play. Each step shows what an automated system does behind the scenes — from the first message to the final confirmation."
      />
      <Reveal delay={0.1} className="mt-12">
        <WorkflowVisualizer />
      </Reveal>
    </Section>
  );
}

/* 6 ─ Featured projects */
export async function FeaturedProjects() {
  const projects = await getProjects();
  return (
    <Section id="work" labelledBy="work-title">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading
          id="work-title"
          eyebrow="Selected work"
          title={
            <>
              Real systems, <span className="accent-serif text-gradient">built</span> and running.
            </>
          }
          description="A selection of AI assistants, automations and websites we have built."
        />
        <ButtonLink href="/work" variant="secondary" arrow className="self-start sm:self-auto">
          All case studies
        </ButtonLink>
      </div>
      <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((p, i) => (
          <Reveal key={p.slug} delay={i * 0.08}>
            <ProjectCard project={p} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

export function ProjectCard({ project: p, large = false }: { project: Project; large?: boolean }) {
  // Card thumbnail: prefer a wide (desktop) screenshot, otherwise the first one.
  const shot = p.screenshots.find((s) => !isPortrait(s)) ?? p.screenshots[0];
  const portrait = shot ? isPortrait(shot) : false;
  return (
    <article className="card card-hover group relative flex h-full flex-col overflow-hidden">
      <div className={cn("relative flex h-64 items-start justify-center overflow-hidden border-b border-line bg-[linear-gradient(180deg,color-mix(in_oklab,var(--brand-primary)_8%,var(--brand-surface-raised)),var(--brand-surface))] px-6 pt-12 sm:h-72 sm:pt-14", large && "lg:h-80 lg:px-12")}>
        {shot ? (
          <div className={cn("w-full transition-transform duration-500 group-hover:-translate-y-2", portrait && "max-w-[200px]", large && !portrait && "max-w-xl")}>
            {portrait ? (
              <PhoneFrame shot={shot} sizes="200px" />
            ) : (
              <BrowserFrame shot={shot} sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw" />
            )}
          </div>
        ) : (
          <>
            <div className="w-full transition-transform duration-500 group-hover:-translate-y-2">
              <ProjectMockup kind={p.mockup} className={p.mockup === "website-travel" ? "" : "max-w-[230px]"} />
            </div>
            <MockupLabel className="absolute left-4 top-4" />
          </>
        )}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="label text-muted">
          {p.category} · {p.industry}
        </p>
        <h3 className="mt-3 text-xl font-semibold tracking-tight text-fg">
          <Link href={`/work/${p.slug}`} className="after:absolute after:inset-0">
            {p.title}
          </Link>
        </h3>
        <p className="mt-2.5 line-clamp-3 text-sm leading-relaxed text-muted">{p.summary}</p>
        <ul className="mt-auto flex flex-wrap gap-1.5 pt-5">
          {p.stack.map((s) => (
            <li key={s}>
              <Badge className="text-[11px]">{s}</Badge>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}

/* 7 ─ Why choose us */
export function WhyUs() {
  return (
    <Section labelledBy="why-title">
      <SectionHeading
        id="why-title"
        eyebrow="Why work with us"
        title={
          <>
            Engineering discipline. <span className="accent-serif text-gradient">Business</span> focus.
          </>
        }
      />
      <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {whyUs.map((w, i) => (
          <Reveal key={w.title} delay={(i % 3) * 0.06} className="bg-bg">
            <div className="group h-full p-7 transition-colors duration-300 hover:bg-surface sm:p-8">
              <Icon name={w.icon} size={22} className="text-primary-bright" />
              <h3 className="mt-6 text-lg font-medium text-fg">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{w.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 8 ─ Development process */
export function Process() {
  return (
    <Section id="process" labelledBy="process-title" className="border-y border-line bg-surface">
      <SectionHeading
        id="process-title"
        eyebrow="How we work"
        title={
          <>
            A clear process, from <span className="accent-serif text-gradient">first call</span> to launch.
          </>
        }
      />
      <div className="relative mt-12">
      <div aria-hidden="true" className="absolute left-0 right-0 top-[27px] hidden h-px bg-[linear-gradient(90deg,transparent,var(--brand-primary),var(--brand-secondary),transparent)] opacity-40 md:block" />
      <ol className="relative grid gap-8 md:grid-cols-5 md:gap-5">
        {processSteps.map((s, i) => (
          <li key={s.title}>
            <Reveal delay={i * 0.07} className="relative flex gap-5 md:block">
              <span className="relative z-10 grid size-12 shrink-0 place-items-center rounded-xl border border-line bg-surface text-primary-bright shadow-[0_1px_2px_var(--shadow-soft)]">
                <Icon name={s.icon} size={20} />
              </span>
              <div className="md:mt-6">
                <p className="text-xs font-semibold text-muted">Step {i + 1}</p>
                <h3 className="mt-1 text-lg font-medium text-fg">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.body}</p>
                <p className="mt-3 text-xs text-secondary-bright">→ {s.deliverable}</p>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>
      </div>
    </Section>
  );
}

/* 9 ─ Technologies and integrations */
export function TechStack() {
  const groups = ["AI", "Automation", "Web", "Channels"] as const;
  return (
    <Section labelledBy="tech-title">
      <SectionHeading
        id="tech-title"
        eyebrow="Technologies & integrations"
        title="Modern tools, chosen for the job."
        description="We pick proven technologies that fit your requirements and budget — and integrate with the tools you already use."
      />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((g, i) => (
          <Reveal key={g} delay={i * 0.06}>
            <div className="card h-full p-6">
              <h3 className="text-sm font-medium text-fg">{g}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {technologies
                  .filter((t) => t.group === g)
                  .map((t) => (
                    <li key={t.name}>
                      <span className="inline-block rounded-lg border border-ink/[0.07] bg-bg/60 px-2.5 py-1.5 text-[13px] text-fg/85">{t.name}</span>
                    </li>
                  ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}

/* 10 ─ FAQ */
export function FAQ({ items }: { items: { q: string; a: string }[] }) {
  return (
    <Section id="faq" labelledBy="faq-title">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <SectionHeading
          id="faq-title"
          eyebrow="FAQ"
          title="Questions, answered."
          description={
            <>
              Can&apos;t find what you&apos;re looking for?{" "}
              <Link href="/contact" className="text-primary-bright underline-offset-4 hover:underline">
                Ask us directly
              </Link>
              .
            </>
          }
        />
        <Reveal delay={0.05}>
          <div className="divide-y divide-ink/[0.07] border-y border-ink/[0.07]">
            {items.map((f) => (
              <details key={f.q} className="group py-1">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-left text-[1.02rem] font-medium text-fg [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span className="relative grid size-7 shrink-0 place-items-center rounded-full border border-ink/10 text-muted transition-transform duration-300 group-open:rotate-45" aria-hidden="true">
                    +
                  </span>
                </summary>
                <p className="pb-6 pr-10 text-[15px] leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

/* 11 ─ Contact CTA */
export function ContactCTA({
  title = (
    <>
      Let&apos;s build something that <span className="accent-serif text-gradient">works</span>.
    </>
  ),
  description = "Tell us about the process you want to automate or the website you need. The first consultation is free, and you'll leave with clear next steps.",
}: {
  title?: ReactNode;
  description?: string;
}) {
  return (
    <section aria-labelledby="cta-title" className="relative py-16 sm:py-20">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-line bg-[linear-gradient(135deg,color-mix(in_oklab,var(--brand-primary)_10%,var(--brand-surface)),var(--brand-surface)_60%,color-mix(in_oklab,var(--brand-secondary)_6%,var(--brand-surface)))] px-6 py-14 text-center sm:px-12 sm:py-16">
            <div aria-hidden="true" className="glow-primary absolute -top-40 left-1/2 h-[380px] w-[680px] -translate-x-1/2 opacity-60 blur-3xl" />
            <div className="relative mx-auto max-w-2xl">
              <h2 id="cta-title" className="text-[1.75rem] font-semibold leading-[1.15] tracking-tight text-fg sm:text-4xl">
                {title}
              </h2>
              <p className="mt-5 text-base text-muted sm:text-lg">{description}</p>
              <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
                <ButtonLink href={siteConfig.cta.primary.href} size="lg" arrow>
                  {siteConfig.cta.primary.label}
                </ButtonLink>
                <ButtonLink href={whatsappLink()} size="lg" variant="secondary">
                  <WhatsAppIcon size={18} /> Chat on WhatsApp
                </ButtonLink>
              </div>
              <p className="mt-6 text-sm text-muted">
                Not sure about scope?{" "}
                <Link href="/estimate" className="text-primary-bright underline-offset-4 hover:underline">
                  Try the project estimator
                </Link>
              </p>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
