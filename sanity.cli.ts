import { defineCliConfig } from "sanity/cli";

/** Optional: lets you run Sanity CLI commands (e.g. `npx sanity dataset export`) from this folder. */
export default defineCliConfig({
  api: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  },
});
