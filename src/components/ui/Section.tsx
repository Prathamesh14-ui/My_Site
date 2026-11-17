import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "./Reveal";

export function Container({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

export function Section({
  id,
  className,
  children,
  labelledBy,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("relative py-14 sm:py-18 lg:py-20", className)}>
      <Container>{children}</Container>
    </section>
  );
}

export function SectionHeading({
  id,
  eyebrow,
  title,
  description,
  align = "left",
  as: As = "h2",
  className,
}: {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <Reveal className={cn("max-w-3xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <As
        id={id}
        className={cn(
          "font-semibold tracking-tight text-fg",
          As === "h1" ? "text-4xl leading-[1.08] sm:text-5xl" : "text-[1.75rem] leading-[1.15] sm:text-4xl lg:text-[2.5rem]",
        )}
      >
        {title}
      </As>
      {description && <p className="mt-4 text-base leading-relaxed text-muted sm:text-[1.0625rem]">{description}</p>}
    </Reveal>
  );
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-line bg-raised px-2.5 py-1 text-xs font-medium text-fg/80",
        className,
      )}
    >
      {children}
    </span>
  );
}
