import { getProjects } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { ContactCTA, ProjectCard } from "@/components/home/HomeSections";
import { Info } from "lucide-react";

export const metadata = pageMetadata({
  title: "Case Studies — AI Assistants, Automation & Websites",
  description:
    "Case studies of WhatsApp AI assistants, appointment booking automation with Google Calendar and n8n, and a Next.js + Sanity CMS travel website.",
  path: "/work",
});

export default async function WorkPage() {
  const projects = await getProjects();
  return (
    <>
      <PageHero
        eyebrow="Portfolio"
        crumbs={[{ name: "Work", path: "/work" }]}
        title={
          <>
            Work that <span className="accent-serif text-gradient">runs</span> in the real world.
          </>
        }
        description="A selection of AI assistants, automations and websites we've built. Each case study lists only features that were implemented."
      />
      <Section className="pt-0 sm:pt-0 lg:pt-0">
        <Reveal className="mb-10 flex items-start gap-3 rounded-2xl border border-ink/[0.07] bg-surface/60 p-4 text-sm text-muted">
          <Info className="mt-0.5 size-4 shrink-0 text-primary-bright" aria-hidden="true" />
          <p>
            To protect client confidentiality, some projects are shown without client names. Where real screenshots aren&apos;t available, visuals are illustrative mockups built to explain the solution and are labelled as such.
          </p>
        </Reveal>
        <h2 className="sr-only">Case studies</h2>
        <div className="grid gap-6 md:grid-cols-2 md:[&>*:last-child:nth-child(odd)]:col-span-2">
          {projects.map((p, i) => (
            <Reveal key={p.slug} delay={(i % 2) * 0.06}>
              <ProjectCard project={p} large />
            </Reveal>
          ))}
        </div>
      </Section>
      <ContactCTA title={<>Have a similar challenge?</>} description="Tell us what you need. We'll show you how a similar approach could work for your business." />
    </>
  );
}
