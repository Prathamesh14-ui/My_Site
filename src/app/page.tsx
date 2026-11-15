import type { Metadata } from "next";
import { siteConfig } from "@/config/site";
import { faqs } from "@/content/general";
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

export default function HomePage() {
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
      <FAQ />
      <ContactCTA />
      <JsonLd data={faqJsonLd(faqs)} />
    </>
  );
}
