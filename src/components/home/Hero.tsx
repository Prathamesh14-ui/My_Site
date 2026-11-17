import { Check } from "lucide-react";
import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="relative overflow-hidden border-b border-line bg-[linear-gradient(180deg,color-mix(in_oklab,var(--brand-primary)_7%,var(--brand-bg)),var(--brand-bg)_70%)] pb-16 pt-28 sm:pb-20 sm:pt-32 lg:pb-24 lg:pt-36"
    >
      <div aria-hidden="true" className="glow-primary pointer-events-none absolute -top-48 left-1/4 h-[480px] w-[760px] opacity-60 blur-3xl" />
      <div aria-hidden="true" className="glow-secondary pointer-events-none absolute -right-40 top-32 h-[380px] w-[480px] opacity-50 blur-3xl" />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_1fr] lg:gap-10">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-lg border border-line bg-surface py-1 pl-1 pr-3 text-xs font-medium text-fg/80 shadow-[0_1px_2px_var(--shadow-soft)]">
                <span className="label rounded-md bg-primary/15 px-2 py-0.5 text-primary-bright">New</span>
                AI agents · Automation · Web — one team
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 id="hero-title" className="mt-6 text-[2.5rem] font-semibold leading-[1.06] tracking-[-0.03em] text-fg sm:text-[3.25rem] lg:text-[3.4rem] xl:text-[3.75rem]">
                <span className="block">Intelligent AI.</span>
                <span className="block sm:whitespace-nowrap">
                  <span className="accent-serif text-gradient pr-1">Smarter</span> Automation.
                </span>
                <span className="block">Digital Growth.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
                We help businesses work smarter through custom AI agents, intelligent automation systems and high-performance websites.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={siteConfig.cta.primary.href} size="lg" arrow>
                  {siteConfig.cta.primary.label}
                </ButtonLink>
                <ButtonLink href={siteConfig.cta.secondary.href} size="lg" variant="secondary">
                  {siteConfig.cta.secondary.label}
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <ul className="mt-10 grid max-w-md grid-cols-2 gap-x-6 gap-y-3 border-t border-line pt-6 text-sm text-fg/80">
                {["Custom AI agents", "WhatsApp chatbots", "Workflow automation", "Modern websites"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Check className="size-4 shrink-0 text-primary-bright" aria-hidden="true" /> {t}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal delay={0.15} className="mx-auto w-full max-w-[560px]">
            <HeroVisual />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
