import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  if (siteConfig.logo.imageSrc) {
    return <Image src={siteConfig.logo.imageSrc} alt="" width={32} height={32} className={className} />;
  }
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative grid size-8 place-items-center overflow-hidden rounded-[10px] font-mono text-[11px] font-semibold tracking-tight text-white",
        "bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))] shadow-[0_0_0_1px_rgba(255,255,255,0.15)_inset,0_6px_20px_-6px_var(--brand-primary)]",
        className,
      )}
    >
      <span className="absolute inset-[3px] rounded-[7px] bg-bg/85" />
      <span className="relative text-gradient">{siteConfig.logo.monogram}</span>
    </span>
  );
}

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2.5 font-semibold tracking-tight text-fg", className)} aria-label={`${siteConfig.name} — home`}>
      <LogoMark />
      <span className="text-[0.95rem]">{siteConfig.name}</span>
    </Link>
  );
}
