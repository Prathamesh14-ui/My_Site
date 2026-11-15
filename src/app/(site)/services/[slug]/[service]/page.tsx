import { Suspense } from "react";
import { PageSkeleton } from "@/components/layout/PageSkeleton";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { getService, getServiceCategories } from "@/lib/content";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { JsonLd } from "@/components/seo/JsonLd";
import { Benefits, CapabilityGrid, ProblemSolution, ServiceVisual } from "@/components/services/ServiceBlocks";
import { ContactCTA } from "@/components/home/HomeSections";

export async function generateStaticParams() {
  return (await getServiceCategories()).flatMap((c) => c.services.map((s) => ({ slug: c.slug, service: s.slug })));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]/[service]">): Promise<Metadata> {
  const { slug, service } = await params;
  const found = await getService(slug, service);
  if (!found) return {};
  return pageMetadata({
    title: found.service.title,
    description: `${found.service.summary} ${found.service.solution}`.slice(0, 160),
    path: `/services/${slug}/${service}`,
  });
}

/**
 * The URL params are read inside <Suspense> so Next.js can build (and later
 * refresh) a shared page shell; prerendered slugs are still fully static.
 */
export default function SubServicePage(props: PageProps<"/services/[slug]/[service]">) {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <SubServicePageContent params={props.params} />
    </Suspense>
  );
}

async function SubServicePageContent({ params }: Pick<PageProps<"/services/[slug]/[service]">, "params">) {
  const { slug, service } = await params;
  const found = await getService(slug, service);
  if (!found) notFound();
  const { category, service: s } = found;
  const path = `/services/${category.slug}/${s.slug}`;
  const contactHref = `${siteConfig.cta.primary.href}?service=${encodeURIComponent(s.title)}`;
  const siblings = category.services.filter((x) => x.slug !== s.slug);

  return (
    <>
      <PageHero
        eyebrow={category.title}
        crumbs={[
          { name: "Services", path: "/services" },
          { name: category.title, path: `/services/${category.slug}` },
          { name: s.title, path },
        ]}
        title={s.title}
        description={s.summary}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <ButtonLink href={contactHref} size="lg" arrow>
            {siteConfig.cta.primary.label}
          </ButtonLink>
          <ButtonLink href="/estimate" size="lg" variant="secondary">
            Estimate your project
          </ButtonLink>
        </div>
      </PageHero>

      <Section className="pt-4 sm:pt-8">
        <ProblemSolution
          problemTitle="The challenge"
          problems={[s.problem, ...category.problem.points.slice(0, 2)]}
          solutionTitle="How we solve it"
          solutionBody={s.solution}
          solutions={s.capabilities.slice(0, 3)}
        />
      </Section>

      <Section labelledBy="cap-heading" className="pt-0 sm:pt-0">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading id="cap-heading" eyebrow="Key capabilities" title="What's included" />
            <ul className="mt-10 space-y-4">
              {s.capabilities.map((c) => (
                <li key={c}>
                  <Reveal className="flex items-start gap-3 text-[15px] text-fg/90">
                    <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-primary/15 text-primary-bright">
                      <Check className="size-3.5" aria-hidden="true" />
                    </span>
                    {c}
                  </Reveal>
                </li>
              ))}
            </ul>
            <Reveal className="mt-10 rounded-2xl border border-white/[0.07] bg-surface/60 p-5">
              <p className="text-xs uppercase tracking-wider text-muted">Ideal for</p>
              <p className="mt-1.5 font-medium text-fg">{s.idealFor}</p>
            </Reveal>
          </div>
          <Reveal delay={0.1} className="mx-auto w-full max-w-[520px]">
            <ServiceVisual kind={category.visual} />
          </Reveal>
        </div>
      </Section>

      <Section labelledBy="uses-heading" className="border-y border-white/[0.05] bg-surface/30">
        <SectionHeading id="uses-heading" eyebrow="Real-world use cases" title="How businesses use it" />
        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {s.useCases.map((u, i) => (
            <li key={u}>
              <Reveal delay={i * 0.06} className="card flex h-full items-start gap-4 p-6">
                <span className="font-mono text-sm text-primary-bright">0{i + 1}</span>
                <span className="text-fg/90">{u}</span>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section labelledBy="benefits-heading">
        <SectionHeading id="benefits-heading" eyebrow="Benefits" title="What you gain" />
        <div className="mt-12">
          <Benefits items={category.benefits} />
        </div>
      </Section>

      <Section labelledBy="cat-cap-heading" className="pt-0 sm:pt-0">
        <SectionHeading id="cat-cap-heading" eyebrow={category.title} title="Backed by our wider capabilities" />
        <div className="mt-10">
          <CapabilityGrid items={category.capabilities} />
        </div>
      </Section>

      <Section labelledBy="related-heading" className="border-t border-white/[0.05] pt-16 sm:pt-20">
        <h2 id="related-heading" className="text-xl font-semibold text-fg">Related {category.shortTitle.toLowerCase()} services</h2>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {siblings.map((x) => (
            <li key={x.slug}>
              <Link href={`/services/${category.slug}/${x.slug}`} className="card card-hover group flex items-center gap-3 p-4">
                <Icon name={x.icon} size={18} className="text-primary-bright" />
                <span className="text-sm text-fg/90">{x.title}</span>
                <ArrowUpRight className="ml-auto size-4 text-muted transition-colors group-hover:text-fg" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <ContactCTA title={<>Let&apos;s talk about {s.title.toLowerCase()}.</>} />
      <JsonLd data={serviceJsonLd({ name: s.title, description: s.summary, path })} />
    </>
  );
}
