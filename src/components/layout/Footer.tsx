import Link from "next/link";
import { Mail, MapPin } from "lucide-react";
import { siteConfig, whatsappLink } from "@/config/site";
import { getServiceCategories } from "@/lib/content";
import { Container } from "@/components/ui/Section";
import { WhatsAppIcon } from "@/components/ui/Icon";
import { Logo } from "./Logo";
import { CurrentYear } from "./CurrentYear";

const socialLabels: Record<keyof typeof siteConfig.social, string> = {
  linkedin: "LinkedIn",
  github: "GitHub",
  x: "X",
  instagram: "Instagram",
};

export async function Footer() {
  const serviceCategories = await getServiceCategories();
  const socials = (Object.keys(siteConfig.social) as (keyof typeof siteConfig.social)[]).filter((k) => siteConfig.social[k]);

  return (
    <footer className="relative mt-10 border-t border-white/[0.06] bg-surface/40">
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--brand-primary),var(--brand-secondary),transparent)] opacity-50" />
      <Container className="py-16">
        <div className="grid gap-12 lg:grid-cols-[1.3fr_2fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-muted">{siteConfig.positioning}</p>
            <ul className="mt-6 space-y-3 text-sm">
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex items-center gap-2.5 text-fg/85 hover:text-fg">
                  <Mail className="size-4 text-primary-bright" aria-hidden="true" /> {siteConfig.contact.email}
                </a>
              </li>
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-fg/85 hover:text-fg">
                  <WhatsAppIcon size={16} className="text-primary-bright" /> {siteConfig.contact.whatsapp.display}
                </a>
              </li>
              <li className="inline-flex items-center gap-2.5 text-muted">
                <MapPin className="size-4 text-primary-bright" aria-hidden="true" /> {siteConfig.location.city}, {siteConfig.location.country} · {siteConfig.location.servesLabel}
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {serviceCategories.map((cat) => (
              <div key={cat.slug}>
                <h2 className="text-sm font-medium text-fg">
                  <Link href={`/services/${cat.slug}`} className="hover:text-primary-bright">{cat.title}</Link>
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {cat.services.slice(0, 5).map((s) => (
                    <li key={s.slug}>
                      <Link href={`/services/${cat.slug}/${s.slug}`} className="text-sm text-muted transition-colors hover:text-fg">
                        {s.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <h2 className="text-sm font-medium text-fg">Company</h2>
              <ul className="mt-4 space-y-2.5 text-sm">
                <li><Link href="/work" className="text-muted hover:text-fg">Case studies</Link></li>
                <li><Link href="/about" className="text-muted hover:text-fg">About</Link></li>
                <li><Link href="/estimate" className="text-muted hover:text-fg">Project estimator</Link></li>
                <li><Link href="/contact" className="text-muted hover:text-fg">Contact</Link></li>
                <li><Link href="/privacy" className="text-muted hover:text-fg">Privacy</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/[0.06] pt-8 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear /> {siteConfig.name}. All rights reserved.
          </p>
          {socials.length > 0 && (
            <ul className="flex gap-5">
              {socials.map((k) => (
                <li key={k}>
                  <a href={siteConfig.social[k]} target="_blank" rel="noopener noreferrer" className="hover:text-fg">
                    {socialLabels[k]}
                  </a>
                </li>
              ))}
            </ul>
          )}
          <p>Built in {siteConfig.location.city}, for businesses everywhere.</p>
        </div>
      </Container>
    </footer>
  );
}
