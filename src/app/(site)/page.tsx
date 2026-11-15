import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { getFaqs } from "@/lib/content";
import { Hero } from "@/components/home/Hero";
import {
  TrustIntro,
  ServicesOverview,
  FeaturedAI,
  FeaturedWeb,
  AutomationShowcase,
  FeaturedProjects,
  WhyUs,
  Process,
  TechStack,
  FAQ,
  ContactCTA,
} from "@/components/home/HomeSections";
import { JsonLd } from "@/components/seo/JsonLd";
import { faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: { absolute: `${siteConfig.name} — AI Agents, Automation & Web Development in Mumbai` },
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const faqs = await getFaqs();
  return (
    <>
      <Hero />
      <TrustIntro />
      <ServicesOverview />
      <FeaturedAI />
      <FeaturedWeb />
      <AutomationShowcase />
      <FeaturedProjects />
      <WhyUs />
      <Process />
      <TechStack />
      <FAQ items={faqs} />
      <ContactCTA />
      <JsonLd data={faqJsonLd(faqs)} />
    </>
  );
}
