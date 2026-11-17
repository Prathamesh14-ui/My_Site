import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/ui/Section";
import { CostEstimator } from "@/components/features/CostEstimator";

export const metadata = pageMetadata({
  title: "Project Estimator — Scope Your AI, Automation or Website Project",
  description:
    "Choose website development, AI chatbots, WhatsApp automation, custom AI agents or business automation to build an indicative project summary. Not a final quotation.",
  path: "/estimate",
});

export default function EstimatePage() {
  return (
    <>
      <PageHero
        eyebrow="Project estimator"
        crumbs={[{ name: "Estimate", path: "/estimate" }]}
        title={
          <>
            Scope your project in <span className="accent-serif text-gradient">a minute</span>.
          </>
        }
        description="Select what you need and we'll build an indicative project summary you can send with your enquiry. It's a starting point for the conversation, not a final quote."
      />
      <Section className="pt-0 sm:pt-0 lg:pt-0">
        <CostEstimator />
      </Section>
    </>
  );
}
