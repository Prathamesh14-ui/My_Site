import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

export function Hero() {
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pb-20 pt-32 sm:pb-24 sm:pt-40 lg:min-h-[86vh] lg:pb-28 lg:pt-44">
      {/* Single soft sphere — the only decoration */}
      <div
        aria-hidden="true"
        className="sphere pointer-events-none absolute -right-40 -top-40 size-[420px] sm:-right-32 sm:-top-48 sm:size-[560px] lg:-right-24 lg:-top-56 lg:size-[680px]"
      />

      <Container className="relative">
        <div className="max-w-4xl">
          <div>
            <p className="text-sm text-muted sm:text-base">AI agents · Automation · Web — one team</p>
          </div>
          <div>
            <h1
              id="hero-title"
              className="mt-5 text-[2.6rem] font-medium leading-[1.05] tracking-[-0.035em] text-fg sm:text-6xl lg:text-[4.75rem] xl:text-[5.25rem]"
            >
              <span className="block">Intelligent AI.</span>
              <span className="block">
                <span className="accent-serif text-gradient">Smarter</span> Automation.
              </span>
              <span className="block">Digital Growth.</span>
            </h1>
          </div>
          <div>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl">
              We help businesses work smarter through custom AI agents, intelligent automation systems and high-performance websites.
            </p>
          </div>
          <div>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={siteConfig.cta.primary.href} size="lg" arrow>
                {siteConfig.cta.primary.label}
              </ButtonLink>
              <ButtonLink href={siteConfig.cta.secondary.href} size="lg" variant="secondary">
                {siteConfig.cta.secondary.label}
              </ButtonLink>
            </div>
          </div>
          <div>
            <ul className="mt-14 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-muted">
              {["Custom AI agents", "WhatsApp chatbots", "Workflow automation", "Modern websites"].map((t, i) => (
                <li key={t} className="flex items-center gap-6">
                  {i > 0 && <span className="hidden h-4 w-px bg-line sm:block" aria-hidden="true" />}
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
