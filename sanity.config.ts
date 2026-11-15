"use client";

/**
 * Sanity Studio configuration — mounted at /studio (src/app/studio/[[...tool]]/page.tsx).
 */
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { DownloadIcon } from "@sanity/icons/Download";
import { apiVersion, dataset, projectId, sanityConfigured } from "./src/sanity/env";
import { schemaTypes } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";
import { ImportContentTool } from "./src/sanity/tools/ImportContentTool";
import { StudioIcon } from "./src/sanity/components/StudioIcon";
import { siteConfig } from "./src/config/site";

export default defineConfig({
  basePath: "/studio",
  name: "default",
  title: `${siteConfig.name} CMS`,
  icon: StudioIcon,
  // A syntactically valid placeholder keeps the config importable before setup; the page shows setup steps instead.
  projectId: sanityConfigured ? projectId : "notconfigured",
  dataset,
  schema: {
    types: schemaTypes,
    // Enquiries only come from the website form — hide them from "Create new".
    templates: (prev) => prev.filter((t) => t.schemaType !== "enquiry"),
  },
  document: {
    newDocumentOptions: (prev) => prev.filter((item) => item.templateId !== "enquiry"),
    actions: (prev, ctx) => (ctx.schemaType === "enquiry" ? prev.filter((a) => a.action !== "duplicate") : prev),
  },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  tools: (prev) => [
    ...prev,
    { name: "import", title: "Import content", icon: DownloadIcon, component: ImportContentTool },
  ],
});
