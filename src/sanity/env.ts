/**
 * Sanity connection settings (all public — no secrets here).
 * Set NEXT_PUBLIC_SANITY_PROJECT_ID to connect the CMS. Until then the site
 * uses the local content files in src/content/.
 */
export const projectId = (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "").trim();
export const dataset = (process.env.NEXT_PUBLIC_SANITY_DATASET || "production").trim();
export const apiVersion = "2025-10-01";

export const sanityConfigured = /^[a-z0-9-]+$/.test(projectId);
