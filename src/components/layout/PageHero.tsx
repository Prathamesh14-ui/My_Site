import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { Container } from "@/components/ui/Section";
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
    <section className="relative overflow-hidden pb-12 pt-32 sm:pb-16 sm:pt-40">
      <div aria-hidden="true" className="sphere pointer-events-none absolute -right-40 -top-56 size-[380px] opacity-70 sm:-right-24 sm:size-[480px]" />
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
        <div className="mt-6 max-w-3xl">
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="text-[2.35rem] font-medium leading-[1.08] tracking-[-0.03em] text-fg sm:text-5xl lg:text-[3.5rem]">{title}</h1>
          {description && <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{description}</p>}
        </div>
        {children && <div className="mt-8">{children}</div>}
      </Container>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </section>
  );
}
