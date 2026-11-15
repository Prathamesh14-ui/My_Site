import { Container } from "@/components/ui/Section";

/** Shown only while a page for a not-yet-prerendered URL streams in (e.g. a slug just published in the CMS). */
export function PageSkeleton() {
  return (
    <section aria-busy="true" aria-label="Loading" className="relative overflow-hidden pb-16 pt-32 sm:pb-20 sm:pt-40">
      <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0" />
      <Container className="relative">
        <div className="h-3 w-40 animate-pulse rounded bg-white/[0.06]" />
        <div className="mt-10 h-3 w-28 animate-pulse rounded bg-primary/20" />
        <div className="mt-6 h-12 w-full max-w-2xl animate-pulse rounded-xl bg-white/[0.07] sm:h-16" />
        <div className="mt-6 h-4 w-full max-w-xl animate-pulse rounded bg-white/[0.05]" />
        <div className="mt-3 h-4 w-2/3 max-w-lg animate-pulse rounded bg-white/[0.05]" />
      </Container>
    </section>
  );
}
