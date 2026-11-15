import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { NextStudio, metadata as studioMetadata } from "next-sanity/studio";
import config from "../../../../sanity.config";
import { sanityConfigured } from "@/sanity/env";

export { viewport } from "next-sanity/studio";

export const metadata: Metadata = { ...studioMetadata, title: "Content Studio" };

/**
 * The Studio is an admin app with client-side routing under /studio/*, so it is
 * rendered per request rather than prerendered.
 */
export default function StudioPage() {
  return (
    <Suspense fallback={null}>
      <Studio />
    </Suspense>
  );
}

async function Studio() {
  await connection();
  if (!sanityConfigured) return <StudioSetup />;
  return <NextStudio config={config} />;
}

function StudioSetup() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-24 text-fg">
      <p className="eyebrow">Content Studio</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight">Connect Sanity to start editing</h1>
      <p className="mt-4 text-muted">
        The website is currently using its built-in starter content. To edit content here, connect a Sanity project:
      </p>
      <ol className="mt-8 list-decimal space-y-3 pl-5 text-[15px] leading-relaxed text-fg/85">
        <li>Create a free project at sanity.io/manage and note its <strong>Project ID</strong>.</li>
        <li>
          In your hosting settings, add the environment variables <code className="rounded bg-white/10 px-1.5">NEXT_PUBLIC_SANITY_PROJECT_ID</code> and{" "}
          <code className="rounded bg-white/10 px-1.5">NEXT_PUBLIC_SANITY_DATASET</code> (usually <code className="rounded bg-white/10 px-1.5">production</code>).
        </li>
        <li>In sanity.io/manage → API → CORS origins, add this site&apos;s address with &ldquo;Allow credentials&rdquo; ticked.</li>
        <li>Redeploy, reopen /studio, sign in, then use &ldquo;Import content&rdquo; to copy the starter content into Sanity.</li>
      </ol>
    </main>
  );
}
