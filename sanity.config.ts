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
import { siteConfig } from "./src/config/site";

export default defineConfig({
  basePath: "/studio",
  name: "default",
  title: `${siteConfig.name} CMS`,
  // A syntactically valid placeholder keeps the config importable before setup; the page shows setup steps instead.
  projectId: sanityConfigured ? projectId : "notconfigured",
  dataset,
  schema: { types: schemaTypes },
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: apiVersion })],
  tools: (prev) => [
    ...prev,
    { name: "import", title: "Import content", icon: DownloadIcon, component: ImportContentTool },
  ],
});
