import { Suspense } from "react";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { getCategory, getProject, getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading, Badge } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { MockupLabel, ProjectMockup } from "@/components/mockups/Mockups";
import { ContactCTA, ProjectCard } from "@/components/home/HomeSections";

export async function generateStaticParams() {
  return (await getProjects()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/work/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) return {};
  return pageMetadata({ title: `${p.title} — Case Study`, description: p.summary.slice(0, 160), path: `/work/${p.slug}` });
}

/**
 * The URL params are read inside <Suspense> so Next.js can build (and later
 * refresh) a shared page shell; prerendered slugs are still fully static.
 */
export default function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <CaseStudyPageContent params={props.params} />
    </Suspense>
  );
}

async function CaseStudyPageContent({ params }: Pick<PageProps<"/work/[slug]">, "params">) {
  const { slug } = await params;
  const p = await getProject(slug);
  if (!p) notFound();
  const service = await getCategory(p.relatedService);
  const others = (await getProjects()).filter((x) => x.slug !== p.slug);

  return (
    <>
      <PageHero
        eyebrow={`Case study · ${p.category}`}
        crumbs={[
          { name: "Work", path: "/work" },
          { name: p.title, path: `/work/${p.slug}` },
        ]}
        title={p.title}
        description={p.summary}
      >
        <dl className="flex flex-wrap gap-x-10 gap-y-4 text-sm">
          <div>
            <dt className="text-muted">Industry</dt>
            <dd className="mt-1 font-medium text-fg">{p.industry}</dd>
          </div>
          <div>
            <dt className="text-muted">Client</dt>
            <dd className="mt-1 font-medium text-fg">{p.showClientName && p.clientName ? p.clientName : "Confidential"}</dd>
          </div>
          <div>
            <dt className="text-muted">Type</dt>
            <dd className="mt-1 font-medium text-fg">{p.category}</dd>
          </div>
        </dl>
      </PageHero>

      {/* Visual */}
      <Section className="pt-0 sm:pt-0">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[radial-gradient(70%_90%_at_50%_0%,color-mix(in_oklab,var(--brand-primary)_22%,transparent),transparent),var(--brand-surface)] px-5 py-12 sm:px-12 sm:py-16">
            <div aria-hidden="true" className="grid-bg absolute inset-0 opacity-60" />
            {p.screenshots.length > 0 ? (
              <div className="relative grid gap-6 md:grid-cols-2">
                {p.screenshots.map((s) => (
                  <Image key={s.src} src={s.src} alt={s.alt} width={s.width ?? 1600} height={s.height ?? 1000} className="rounded-xl border border-white/10" sizes="(min-width: 768px) 50vw, 100vw" />
                ))}
              </div>
            ) : (
              <div className={p.mockup === "website-travel" ? "relative mx-auto max-w-3xl" : "relative mx-auto max-w-[320px]"}>
                <ProjectMockup kind={p.mockup} />
              </div>
            )}
            {p.screenshots.length === 0 && (
              <div className="relative mt-8 flex flex-col items-center gap-2 text-center">
                <MockupLabel />
                <p className="max-w-md text-xs text-muted">Recreated to illustrate the solution. Not a screenshot of the production system; example content is fictional.</p>
              </div>
            )}
          </div>
        </Reveal>
      </Section>

      <Section className="pt-0 sm:pt-0">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <Reveal>
            <h2 className="text-2xl font-semibold tracking-tight text-fg">The challenge</h2>
            <p className="mt-4 leading-relaxed text-muted">{p.challenge}</p>
            <h2 className="mt-10 text-2xl font-semibold tracking-tight text-fg">Our approach</h2>
            <p className="mt-4 leading-relaxed text-muted">{p.approach}</p>
            <h3 className="mt-10 text-sm font-medium text-fg">Technologies</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {p.stack.map((s) => (
                <li key={s}>
                  <Badge>{s}</Badge>
                </li>
              ))}
            </ul>
          </Reveal>
          <div>
            <Reveal>
              <h2 className="text-2xl font-semibold tracking-tight text-fg">What we built</h2>
              <p className="mt-2 text-sm text-muted">Implemented and verified features.</p>
            </Reveal>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {p.features.map((f, i) => (
                <li key={f.title}>
                  <Reveal delay={(i % 2) * 0.05} className="card h-full p-5">
                    <p className="flex items-center gap-2 font-medium text-fg">
                      <Check className="size-4 text-primary-bright" aria-hidden="true" /> {f.title}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {p.flow && (
        <Section labelledBy="flow-heading" className="border-y border-white/[0.05] bg-surface/30">
          <SectionHeading id="flow-heading" eyebrow="How it works" title="The flow, step by step" />
          <ol className="mt-12 flex flex-col gap-3 lg:flex-row lg:items-stretch">
            {p.flow.map((step, i) => (
              <li key={step} className="flex flex-col items-center gap-3 lg:flex-1 lg:flex-row">
                <Reveal delay={i * 0.05} className="w-full rounded-2xl border border-white/[0.08] bg-bg/70 p-4 lg:h-full">
                  <span className="font-mono text-xs text-primary-bright">{String(i + 1).padStart(2, "0")}</span>
                  <p className="mt-2 text-sm font-medium leading-snug text-fg">{step}</p>
                </Reveal>
                {i < p.flow!.length - 1 && <ArrowRight className="size-4 shrink-0 rotate-90 text-muted lg:rotate-0" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </Section>
      )}

      {service && (
        <Section className="py-16 sm:py-20">
          <Reveal className="card flex flex-col items-start justify-between gap-6 p-7 sm:flex-row sm:items-center sm:p-9">
            <div>
              <p className="eyebrow">Related service</p>
              <p className="mt-2 text-xl font-semibold text-fg">{service.title}</p>
              <p className="mt-1 text-sm text-muted">{service.tagline}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href={`/services/${service.slug}`} variant="secondary">Explore service</ButtonLink>
              <ButtonLink href={siteConfig.cta.primary.href} arrow>Start a similar project</ButtonLink>
            </div>
          </Reveal>
        </Section>
      )}

      <Section labelledBy="more-heading" className="pt-0 sm:pt-0">
        <div className="flex items-end justify-between gap-4">
          <h2 id="more-heading" className="text-2xl font-semibold tracking-tight text-fg">More case studies</h2>
          <Link href="/work" className="text-sm text-primary-bright hover:text-fg">View all</Link>
        </div>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {others.map((o) => (
            <ProjectCard key={o.slug} project={o} />
          ))}
        </div>
      </Section>

      <ContactCTA />
    </>
  );
}
