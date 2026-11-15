import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { defineQuery } from "next-sanity";
import { sanityClient } from "@/sanity/client";
import { isIconName } from "@/components/ui/icon-names";
import type { MockupKind, Project, ServiceCategory, SubService, VisualKind } from "@/content/types";
import { serviceCategories as localCategories } from "@/content/services";
import { projects as localProjects } from "@/content/projects";
import { faqs as localFaqs } from "@/content/general";

/**
 * Content access for the site.
 * Reads from Sanity when NEXT_PUBLIC_SANITY_PROJECT_ID is set and the dataset has
 * content; otherwise falls back to the local files in src/content/. Results are
 * cached (profile "cms" in next.config.ts) and tagged "sanity" so the
 * /api/revalidate webhook can refresh them instantly.
 */

export const CMS_TAG = "sanity";

async function query<T>(groq: string): Promise<T | null> {
  if (!sanityClient) return null;
  try {
    return await sanityClient.fetch<T>(groq);
  } catch (error) {
    console.error("[cms] Sanity query failed — using local content.", error instanceof Error ? error.message : error);
    return null;
  }
}

const arr = <T,>(v: T[] | null | undefined): T[] => (Array.isArray(v) ? v.filter((x) => x != null) : []);
const str = (v: unknown, fallback = ""): string => (typeof v === "string" ? v : fallback);

/* ───────── Services ───────── */

const CATEGORIES_QUERY = defineQuery(`*[_type == "serviceCategory" && defined(slug.current)] | order(coalesce(order, 999) asc, title asc){
  "slug": slug.current, title, shortTitle, icon, eyebrow, tagline, intro, seoDescription, visual,
  problem{title, points}, solution{title, body, points}, capabilities,
  useCases[]{industry, title, body}, benefits[]{title, body},
  "services": services[defined(slug.current)]{ "slug": slug.current, title, icon, summary, problem, solution, capabilities, useCases, idealFor }
}`);

type RawCategory = Partial<Omit<ServiceCategory, "services">> & { services?: Partial<SubService>[] | null };

function normalizeCategory(c: RawCategory): ServiceCategory {
  const visual: VisualKind = c.visual === "workflow" || c.visual === "browser" ? c.visual : "agent";
  return {
    slug: str(c.slug),
    title: str(c.title, "Untitled"),
    shortTitle: str(c.shortTitle, str(c.title, "Services")),
    icon: isIconName(c.icon) ? c.icon : "sparkles",
    eyebrow: str(c.eyebrow),
    tagline: str(c.tagline),
    intro: str(c.intro),
    seoDescription: str(c.seoDescription, str(c.intro)).slice(0, 170),
    problem: { title: str(c.problem?.title, "The challenge"), points: arr(c.problem?.points) },
    solution: { title: str(c.solution?.title, "Our solution"), body: str(c.solution?.body), points: arr(c.solution?.points) },
    capabilities: arr(c.capabilities),
    useCases: arr(c.useCases).map((u) => ({ industry: str(u.industry), title: str(u.title), body: str(u.body) })),
    benefits: arr(c.benefits).map((b) => ({ title: str(b.title), body: str(b.body) })),
    visual,
    services: arr(c.services)
      .filter((s) => s.slug)
      .map((s) => ({
        slug: str(s.slug),
        title: str(s.title, "Untitled service"),
        icon: isIconName(s.icon) ? s.icon : "sparkles",
        summary: str(s.summary),
        problem: str(s.problem),
        solution: str(s.solution),
        capabilities: arr(s.capabilities),
        useCases: arr(s.useCases),
        idealFor: str(s.idealFor),
      })),
  };
}

export async function getServiceCategories(): Promise<ServiceCategory[]> {
  "use cache";
  cacheLife("cms");
  cacheTag(CMS_TAG);
  const data = await query<RawCategory[]>(CATEGORIES_QUERY);
  const cms = arr(data).map(normalizeCategory).filter((c) => c.slug);
  return cms.length ? cms : localCategories;
}

export async function getCategory(slug: string) {
  return (await getServiceCategories()).find((c) => c.slug === slug);
}

export async function getService(categorySlug: string, serviceSlug: string) {
  const category = await getCategory(categorySlug);
  const service = category?.services.find((s) => s.slug === serviceSlug);
  return category && service ? { category, service } : undefined;
}

/** Options for the contact form's "Service interested in" dropdown. */
export async function getServiceOptions(): Promise<string[]> {
  const cats = await getServiceCategories();
  return [...new Set([...cats.flatMap((c) => c.services.map((s) => s.title)), "Multiple services / not sure"])];
}

/* ───────── Case studies ───────── */

const PROJECTS_QUERY = defineQuery(`*[_type == "project" && defined(slug.current)] | order(coalesce(order, 999) asc, title asc){
  "slug": slug.current, title, clientName, showClientName, category, industry, summary, challenge, approach,
  features[]{title, body}, stack, flow, mockup, relatedService,
  "screenshots": screenshots[defined(asset)]{ "src": asset->url, alt, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height }
}`);

type RawProject = Partial<Project> & { screenshots?: { src?: string; alt?: string; width?: number; height?: number }[] | null };

const mockups: MockupKind[] = ["whatsapp-clinic", "whatsapp-travel", "website-travel"];

function normalizeProject(p: RawProject): Project {
  return {
    slug: str(p.slug),
    title: str(p.title, "Untitled project"),
    clientName: str(p.clientName) || undefined,
    showClientName: p.showClientName === true,
    category: str(p.category),
    industry: str(p.industry),
    summary: str(p.summary),
    challenge: str(p.challenge),
    approach: str(p.approach),
    features: arr(p.features).map((f) => ({ title: str(f.title), body: str(f.body) })),
    stack: arr(p.stack),
    flow: arr(p.flow).length ? arr(p.flow) : undefined,
    mockup: mockups.includes(p.mockup as MockupKind) ? (p.mockup as MockupKind) : "website-travel",
    screenshots: arr(p.screenshots)
      .filter((s) => s.src)
      .map((s) => ({ src: str(s.src), alt: str(s.alt, str(p.title)), width: s.width ?? 1600, height: s.height ?? 1000 })),
    relatedService: str(p.relatedService, "web-development"),
  };
}

export async function getProjects(): Promise<Project[]> {
  "use cache";
  cacheLife("cms");
  cacheTag(CMS_TAG);
  const data = await query<RawProject[]>(PROJECTS_QUERY);
  const cms = arr(data).map(normalizeProject).filter((p) => p.slug);
  return cms.length ? cms : localProjects;
}

export async function getProject(slug: string) {
  return (await getProjects()).find((p) => p.slug === slug);
}

/* ───────── FAQs ───────── */

const FAQS_QUERY = defineQuery(`*[_type == "faq" && defined(question)] | order(coalesce(order, 999) asc){ "q": question, "a": answer }`);

export async function getFaqs(): Promise<{ q: string; a: string }[]> {
  "use cache";
  cacheLife("cms");
  cacheTag(CMS_TAG);
  const data = await query<{ q?: string; a?: string }[]>(FAQS_QUERY);
  const cms = arr(data)
    .filter((f) => f.q && f.a)
    .map((f) => ({ q: str(f.q), a: str(f.a) }));
  return cms.length ? cms : localFaqs;
}
