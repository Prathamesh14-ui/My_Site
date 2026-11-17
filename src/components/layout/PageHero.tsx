import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbJsonLd } from "@/lib/seo";

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  crumbs: { name: string; path: string }[];
  children?: ReactNode;
}) {
  const all = [{ name: "Home", path: "/" }, ...crumbs];
  return (
    <section className="relative overflow-hidden bg-[linear-gradient(180deg,color-mix(in_oklab,var(--brand-primary)_6%,var(--brand-bg)),var(--brand-bg))] pb-12 pt-28 sm:pb-16 sm:pt-32">
      <div aria-hidden="true" className="glow-primary pointer-events-none absolute -top-56 right-0 h-[420px] w-[620px] opacity-70 blur-3xl" />
      <Container className="relative">
        <nav aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1.5 text-xs text-muted">
            {all.map((c, i) => (
              <li key={c.path} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight className="size-3" aria-hidden="true" />}
                {i === all.length - 1 ? (
                  <span aria-current="page" className="text-fg/80">{c.name}</span>
                ) : (
                  <Link href={c.path} className="hover:text-fg">{c.name}</Link>
                )}
              </li>
            ))}
          </ol>
        </nav>
        <Reveal className="mt-6 max-w-3xl">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="text-[2.25rem] font-semibold leading-[1.1] tracking-[-0.025em] text-fg sm:text-5xl lg:text-[3.25rem]">{title}</h1>
          {description && <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{description}</p>}
        </Reveal>
        {children && <Reveal delay={0.1} className="mt-8">{children}</Reveal>}
      </Container>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </section>
  );
}
