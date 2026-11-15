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
    <section className="relative overflow-hidden pb-16 pt-32 sm:pb-20 sm:pt-40">
      <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="glow-primary pointer-events-none absolute -top-48 left-1/3 h-[480px] w-[760px] opacity-60 blur-3xl" />
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
        <Reveal className="mt-8 max-w-4xl">
          {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}
          <h1 className="text-4xl font-semibold leading-[1.04] tracking-[-0.03em] text-fg sm:text-6xl">{title}</h1>
          {description && <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{description}</p>}
        </Reveal>
        {children && <Reveal delay={0.1} className="mt-9">{children}</Reveal>}
      </Container>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </section>
  );
}
