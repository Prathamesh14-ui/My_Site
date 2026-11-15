import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary:
    "text-white bg-[linear-gradient(110deg,var(--brand-primary),color-mix(in_oklab,var(--brand-primary)_55%,var(--brand-secondary)))] shadow-[0_0_0_1px_color-mix(in_oklab,white_14%,transparent)_inset,0_8px_30px_-8px_color-mix(in_oklab,var(--brand-primary)_70%,transparent)] hover:shadow-[0_0_0_1px_color-mix(in_oklab,white_22%,transparent)_inset,0_12px_40px_-8px_color-mix(in_oklab,var(--brand-primary)_90%,transparent)] hover:-translate-y-0.5",
  secondary:
    "text-fg bg-white/[0.04] border border-white/10 hover:bg-white/[0.08] hover:border-white/20",
  ghost: "text-fg/80 hover:text-fg",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-[0.95rem]",
};

export function buttonClasses(variant: Variant = "primary", size: Size = "md", className?: string) {
  return cn(base, variants[variant], sizes[size], className);
}

interface CommonProps {
  variant?: Variant;
  size?: Size;
  arrow?: boolean;
  children: ReactNode;
  className?: string;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  ...rest
}: CommonProps & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  const external = typeof href === "string" && /^https?:/.test(href);
  return (
    <Link
      href={href}
      className={buttonClasses(variant, size, className)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...rest}
    >
      {children}
      {arrow && <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />}
    </Link>
  );
}

export function Button({
  variant = "primary",
  size = "md",
  arrow = false,
  className,
  children,
  ...rest
}: CommonProps & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button className={buttonClasses(variant, size, className)} {...rest}>
      {children}
      {arrow && <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />}
    </button>
  );
}
