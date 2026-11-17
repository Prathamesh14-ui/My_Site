/**
 * Converts the local starter content (src/content) into Sanity documents.
 * Used by the "Import starter content" tool in the Studio.
 * Deterministic _ids make the import safe to run more than once.
 */
import { serviceCategories } from "@/content/services";
import { projects } from "@/content/projects";
import { faqs } from "@/content/general";

type SeedDoc = { _id: string; _type: string; [key: string]: unknown };

const key = (s: string, i: number) => `${s.replace(/[^a-zA-Z0-9]/g, "").slice(0, 20) || "item"}${i}`;
const slug = (current: string) => ({ _type: "slug", current });

export function buildSeedDocuments(): SeedDoc[] {
  const categories: SeedDoc[] = serviceCategories.map((c, ci) => ({
    _id: `serviceCategory-${c.slug}`,
    _type: "serviceCategory",
    title: c.title,
    shortTitle: c.shortTitle,
    slug: slug(c.slug),
    order: (ci + 1) * 10,
    icon: c.icon,
    eyebrow: c.eyebrow,
    tagline: c.tagline,
    intro: c.intro,
    seoDescription: c.seoDescription,
    visual: c.visual,
    problem: { title: c.problem.title, points: c.problem.points },
    solution: { title: c.solution.title, body: c.solution.body, points: c.solution.points },
    capabilities: c.capabilities,
    useCases: c.useCases.map((u, i) => ({ _key: key(u.title, i), _type: "useCase", ...u })),
    benefits: c.benefits.map((b, i) => ({ _key: key(b.title, i), _type: "benefit", ...b })),
    services: c.services.map((s, i) => ({
      _key: key(s.slug, i),
      _type: "subService",
      title: s.title,
      slug: slug(s.slug),
      icon: s.icon,
      summary: s.summary,
      problem: s.problem,
      solution: s.solution,
      capabilities: s.capabilities,
      useCases: s.useCases,
      idealFor: s.idealFor,
    })),
  }));

  const projectDocs: SeedDoc[] = projects.map((p, pi) => ({
    _id: `project-${p.slug}`,
    _type: "project",
    title: p.title,
    slug: slug(p.slug),
    order: (pi + 1) * 10,
    category: p.category,
    industry: p.industry,
    clientName: p.clientName ?? "",
    showClientName: p.showClientName,
    summary: p.summary,
    challenge: p.challenge,
    approach: p.approach,
    features: p.features.map((f, i) => ({ _key: key(f.title, i), _type: "feature", ...f })),
    stack: p.stack,
    flow: p.flow ?? [],
    relatedService: p.relatedService,
    mockup: p.mockup,
    ...(p.liveUrl ? { liveUrl: p.liveUrl } : {}),
  }));

  const faqDocs: SeedDoc[] = faqs.map((f, i) => ({
    _id: `faq-${i + 1}`,
    _type: "faq",
    question: f.q,
    answer: f.a,
    order: (i + 1) * 10,
  }));

  return [...categories, ...projectDocs, ...faqDocs];
}
