import { siteConfig } from "@/config/site";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { BrowserFrame, isPortrait } from "@/components/work/Screenshots";
import { industries } from "@/content/general";
import { getProjects } from "@/lib/content";

export async function Hero() {
  // Real client work as the hero visual: the first project with a live site and a desktop screenshot.
  const projects = await getProjects();
  const featured = projects.find((p) => p.liveUrl && p.screenshots.some((s) => !isPortrait(s)));
  const shot = featured?.screenshots.find((s) => !isPortrait(s));

  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden border-b border-line pb-16 pt-32 sm:pb-20 sm:pt-36 lg:pb-24 lg:pt-40">
      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-12">
          <div>
            <p className="text-sm font-medium text-primary-bright">AI automation &amp; web development · Mumbai</p>
            <h1
              id="hero-title"
              className="mt-5 text-[2.3rem] font-medium leading-[1.08] tracking-[-0.03em] text-fg sm:text-5xl lg:text-[3.6rem]"
            >
              We automate enquiries, bookings and follow-ups for growing businesses.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted">
              WhatsApp chatbots, AI assistants and fast websites for clinics, travel agencies and service businesses — planned, built and handed over by one team.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <ButtonLink href={siteConfig.cta.primary.href} size="lg" arrow>
                {siteConfig.cta.primary.label}
              </ButtonLink>
              <ButtonLink href="/work" size="lg" variant="secondary">
                See our work
              </ButtonLink>
            </div>
            <div className="mt-12 border-t border-line pt-6">
              <p className="label text-muted">Built for</p>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-fg/80">
                {industries.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
            </div>
          </div>

          {featured && shot && (
            <figure className="relative">
              <BrowserFrame shot={shot} url={featured.liveUrl} sizes="(min-width: 1024px) 600px, 100vw" />
              <figcaption className="mt-4 flex items-center justify-between gap-4 text-sm text-muted">
                <span>
                  <span className="font-medium text-fg">{featured.title}</span> — live client project
                </span>
                <a href={`/work/${featured.slug}`} className="shrink-0 text-primary-bright underline underline-offset-4 hover:decoration-2">
                  Case study
                </a>
              </figcaption>
            </figure>
          )}
        </div>
      </Container>
    </section>
  );
}
