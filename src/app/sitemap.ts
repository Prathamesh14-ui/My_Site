import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/config/site";
import { getProjects, getServiceCategories } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [serviceCategories, projects] = await Promise.all([getServiceCategories(), getProjects()]);
  const staticRoutes = [
    { path: "/", priority: 1 },
    { path: "/services", priority: 0.9 },
    { path: "/work", priority: 0.8 },
    { path: "/about", priority: 0.6 },
    { path: "/contact", priority: 0.8 },
    { path: "/estimate", priority: 0.7 },
    { path: "/privacy", priority: 0.2 },
  ];
  return [
    ...staticRoutes.map((r) => ({ url: absoluteUrl(r.path), changeFrequency: "monthly" as const, priority: r.priority })),
    ...serviceCategories.flatMap((c) => [
      { url: absoluteUrl(`/services/${c.slug}`), changeFrequency: "monthly" as const, priority: 0.85 },
      ...c.services.map((s) => ({ url: absoluteUrl(`/services/${c.slug}/${s.slug}`), changeFrequency: "monthly" as const, priority: 0.7 })),
    ]),
    ...projects.map((p) => ({ url: absoluteUrl(`/work/${p.slug}`), changeFrequency: "monthly" as const, priority: 0.7 })),
  ];
}
