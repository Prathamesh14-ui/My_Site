import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategory, serviceCategories } from "@/content/services";
import { projects } from "@/content/projects";
import { pageMetadata, serviceJsonLd } from "@/lib/seo";
import { siteConfig } from "@/config/site";
import { PageHero } from "@/components/layout/PageHero";
import { Section, SectionHeading } from "@/components/ui/Section";
import { ButtonLink } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { Benefits, CapabilityGrid, ProblemSolution, ServiceVisual, SubServiceGrid, UseCases } from "@/components/services/ServiceBlocks";
import { ContactCTA, ProjectCard } from "@/components/home/HomeSections";
import { ChatDemo } from "@/components/features/ChatDemo";
import { WorkflowVisualizer } from "@/components/features/WorkflowVisualizer";

export function generateStaticParams() {
  return serviceCategories.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) return {};
  return pageMetadata({ title: `${cat.title} Services`, description: cat.seoDescription, path: `/services/${cat.slug}` });
}

export default async function ServiceCategoryPage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const cat = getCategory(slug);
  if (!cat) notFound();

  const related = projects.filter(
    (p) => p.relatedService === cat.slug || (cat.slug === "ai-solutions" && p.mockup.startsWith("whatsapp")),
  );
  const contactHref = `${siteConfig.cta.primary.href}?service=${encodeURIComponent(cat.services[0].title)}`;

  return (
    <>
      <PageHero
        eyebrow={cat.eyebrow}
        crumbs={[
          { name: "Services", path: "/services" },
          { name: cat.title, path: `/services/${cat.slug}` },
        ]}
        title={cat.title}
        description={cat.tagline}
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

      {/* Intro + visual */}
      <Section labelledBy="intro-heading" className="pt-4 sm:pt-8">
        <div className="grid gap-14 lg:grid-cols-2 lg:items-center">
          <SectionHeading id="intro-heading" eyebrow="Introduction" title="What this service does for you" description={cat.intro} />
          <Reveal delay={0.1} className="mx-auto w-full max-w-[540px]">
            <ServiceVisual kind={cat.visual} />
          </Reveal>
        </div>
      </Section>

      <Section className="pt-0 sm:pt-0">
        <ProblemSolution
          problemTitle={cat.problem.title}
          problems={cat.problem.points}
          solutionTitle={cat.solution.title}
          solutionBody={cat.solution.body}
          solutions={cat.solution.points}
        />
      </Section>

      <Section labelledBy="services-heading" className="border-y border-white/[0.05] bg-surface/30">
        <SectionHeading id="services-heading" eyebrow="Services" title={`${cat.shortTitle} services`} description="Each service starts from a business problem and ends with a working system." />
        <div className="mt-12">
          <SubServiceGrid category={cat} />
        </div>
      </Section>

      <Section labelledBy="cap-heading">
        <SectionHeading id="cap-heading" eyebrow="Key capabilities" title="What we bring to the build" />
        <div className="mt-12">
          <CapabilityGrid items={cat.capabilities} />
        </div>
      </Section>

      {cat.slug === "ai-solutions" && (
        <Section labelledBy="demo-heading" className="pt-0 sm:pt-0">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <SectionHeading id="demo-heading" eyebrow="Try it" title="Experience an AI assistant" description="Switch between our own assistant and two fictional business scenarios. The badge always shows whether replies come from a live AI model or a scripted demo." />
            <Reveal delay={0.1}>
              <ChatDemo />
            </Reveal>
          </div>
        </Section>
      )}
      {cat.slug === "business-automation" && (
        <Section labelledBy="demo-heading" className="pt-0 sm:pt-0">
          <SectionHeading id="demo-heading" eyebrow="Try it" title="See an automated workflow in action" />
          <Reveal delay={0.1} className="mt-12">
            <WorkflowVisualizer />
          </Reveal>
        </Section>
      )}

      <Section labelledBy="uses-heading" className="border-y border-white/[0.05] bg-surface/30">
        <SectionHeading id="uses-heading" eyebrow="Real-world use cases" title="Where this makes a difference" />
        <div className="mt-12">
          <UseCases items={cat.useCases} />
        </div>
      </Section>

      <Section labelledBy="benefits-heading">
        <SectionHeading id="benefits-heading" eyebrow="Benefits" title="What changes for your business" />
        <div className="mt-12">
          <Benefits items={cat.benefits} />
        </div>
      </Section>

      {related.length > 0 && (
        <Section labelledBy="related-heading" className="pt-0 sm:pt-0">
          <SectionHeading id="related-heading" eyebrow="Related work" title="Built by our team" />
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <ProjectCard key={p.slug} project={p} />
            ))}
          </div>
        </Section>
      )}

      <ContactCTA
        title={<>Ready to explore {cat.shortTitle.toLowerCase()}?</>}
        description="Book a free consultation. We'll discuss your process, recommend an approach and outline clear next steps."
      />
      <JsonLd data={serviceJsonLd({ name: cat.title, description: cat.seoDescription, path: `/services/${cat.slug}` })} />
    </>
  );
}
