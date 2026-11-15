import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden pb-24 pt-40">
      <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="glow-primary pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[700px] -translate-x-1/2 opacity-60 blur-3xl" />
      <Container className="relative text-center">
        <p className="font-mono text-sm text-primary-bright">404</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-fg sm:text-6xl">
          This page took a <span className="accent-serif text-gradient">different</span> route.
        </h1>
        <p className="mx-auto mt-5 max-w-md text-muted">The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <ButtonLink href="/" arrow>Back to home</ButtonLink>
          <ButtonLink href="/services" variant="secondary">Explore services</ButtonLink>
        </div>
      </Container>
    </section>
  );
}
