import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { HeroVisual } from "./HeroVisual";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pb-20 pt-32 sm:pb-28 sm:pt-40">
      <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0" />
      <div aria-hidden="true" className="glow-primary pointer-events-none absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 opacity-70 blur-3xl" />
      <div aria-hidden="true" className="glow-secondary pointer-events-none absolute -right-40 top-40 h-[420px] w-[520px] opacity-50 blur-3xl" />

      <Container className="relative">
        <div className="grid items-center gap-14 lg:grid-cols-[1.08fr_1fr] lg:gap-10">
          <div>
            <Reveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] py-1 pl-1 pr-3 text-xs text-fg/80">
                <span className="rounded-full bg-primary/20 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-primary-bright">New</span>
                AI agents · Automation · Web — one team
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <h1 id="hero-title" className="mt-7 text-[2.7rem] font-semibold leading-[1.02] tracking-[-0.035em] text-fg sm:text-[3.4rem] lg:text-[3.55rem] xl:text-[4.15rem]">
                <span className="block">Intelligent AI.</span>
                <span className="block sm:whitespace-nowrap">
                  <span className="accent-serif text-gradient pr-1">Smarter</span> Automation.
                </span>
                <span className="block">Digital Growth.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-muted">
                We help businesses work smarter through custom AI agents, intelligent automation systems and high-performance websites.
              </p>
            </Reveal>
            <Reveal delay={0.18}>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <ButtonLink href={siteConfig.cta.primary.href} size="lg" arrow>
                  {siteConfig.cta.primary.label}
                </ButtonLink>
                <ButtonLink href={siteConfig.cta.secondary.href} size="lg" variant="secondary">
                  {siteConfig.cta.secondary.label}
                </ButtonLink>
              </div>
            </Reveal>
            <Reveal delay={0.24}>
              <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
                {["Custom AI agents", "WhatsApp chatbots", "n8n workflows", "Next.js websites"].map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <span className="size-1 rounded-full bg-primary-bright" aria-hidden="true" /> {t}
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
