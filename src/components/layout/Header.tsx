"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Menu, X, ArrowRight } from "lucide-react";
import { navigation } from "@/content/general";
import { siteConfig, whatsappLink } from "@/config/site";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type IsActive = (href: string) => boolean;

/**
 * Reads the current URL for active-link styling. Isolated in a Suspense boundary so
 * the header can be part of the prerendered page shell (Cache Components); the
 * fallback renders the same links without the active state.
 */
function ActivePath({ children }: { children: (isActive: IsActive) => ReactNode }) {
  return <Suspense fallback={children(() => false)}><ActivePathInner>{children}</ActivePathInner></Suspense>;
}

function ActivePathInner({ children }: { children: (isActive: IsActive) => ReactNode }) {
  const pathname = usePathname();
  return children((href) => pathname === href || pathname.startsWith(`${href}/`));
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock scroll while the mobile menu is open; close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "transition-all duration-300",
          scrolled || open ? "border-b border-line bg-bg/85 backdrop-blur-xl" : "border-b border-transparent",
        )}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 md:h-[76px] lg:px-8">
          <Logo />

          <nav aria-label="Main" className="hidden items-center gap-0.5 rounded-xl border border-line bg-surface/80 p-1 shadow-[0_1px_2px_var(--shadow-soft)] backdrop-blur-md md:flex">
            <ActivePath>
            {(isActive) => navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "relative flex h-9 items-center rounded-lg px-3.5 font-[family-name:var(--font-display)] text-[0.84rem] transition-colors lg:px-4",
                  isActive(item.href) ? "text-fg" : "text-muted hover:text-fg",
                )}
              >
                {isActive(item.href) && (
                  <motion.span layoutId="nav-active" className="absolute inset-0 rounded-lg bg-ink/[0.08]" transition={{ type: "spring", bounce: 0.15, duration: 0.45 }} />
                )}
                <span className="relative">{item.label}</span>
              </Link>
            ))}
            </ActivePath>
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <ThemeToggle compact />
            <ButtonLink href={siteConfig.cta.primary.href} size="md" variant="inverse" className="hidden h-10 px-4 lg:inline-flex">
              {siteConfig.cta.primary.label}
            </ButtonLink>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 grid size-11 place-items-center rounded-full text-fg md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 bottom-0 top-16 overflow-y-auto bg-bg/97 backdrop-blur-xl md:hidden"
          >
            <nav aria-label="Mobile" className="flex min-h-full flex-col px-4 pb-8 pt-6">
              <ul className="flex flex-col">
                <ActivePath>
                {(isActive) => navigation.map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i }}
                  >
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={isActive(item.href) ? "page" : undefined}
                      className="flex items-center justify-between border-b border-ink/[0.06] py-5 text-2xl font-medium tracking-tight"
                    >
                      <span className={isActive(item.href) ? "text-gradient" : "text-fg"}>{item.label}</span>
                      <ArrowRight className="size-5 text-muted" aria-hidden="true" />
                    </Link>
                  </motion.li>
                ))}
                </ActivePath>
              </ul>
              <div className="mt-auto flex flex-col gap-3 pt-10">
                <p className="text-xs uppercase tracking-[0.16em] text-muted">Appearance</p>
                <ThemeToggle className="mb-3 w-full" />
                <ButtonLink href={siteConfig.cta.primary.href} size="lg" arrow onClick={() => setOpen(false)}>
                  {siteConfig.cta.primary.label}
                </ButtonLink>
                <ButtonLink href={whatsappLink()} variant="secondary" size="lg">
                  <WhatsAppIcon size={18} /> Chat on WhatsApp
                </ButtonLink>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
