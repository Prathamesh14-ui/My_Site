import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getFaqs } from "@/lib/content";
import { Hero } from "@/components/home/Hero";
import {
  ServicesOverview,
  FeaturedAI,
  AutomationShowcase,
  FeaturedProjects,
  WhyUs,
  Process,
  FAQ,
  ContactCTA,
} from "@/components/home/HomeSections";
import { FounderSlot, TestimonialSlot } from "@/components/home/PreviewSlots";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — AI Agents, Automation & Web Development in Mumbai` },
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const all = await getFaqs();
  // Business questions first; technical ones (n8n) last.
  const faqs = [...all.filter((f) => !/n8n/i.test(f.q)), ...all.filter((f) => /n8n/i.test(f.q))];
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <TestimonialSlot />
      <ServicesOverview />
      <FounderSlot />
      <FeaturedAI />
      <AutomationShowcase />
      <WhyUs />
      <Process />
      <FAQ items={faqs} />
      <ContactCTA />
      <JsonLd data={faqJsonLd(faqs)} />
    </>
  );
}
