import Link from "next/link";
import { ArrowUpRight, Check, X } from "lucide-react";
import type { ServiceCategory, VisualKind } from "@/content/types";
import { Reveal } from "@/components/ui/Reveal";
import { Icon } from "@/components/ui/Icon";
import { HeroVisual } from "@/components/home/HeroVisual";
import { BrowserMockup, MockupLabel } from "@/components/mockups/Mockups";

export function ProblemSolution({
  problemTitle,
  problems,
  solutionTitle,
  solutionBody,
  solutions,
}: {
  problemTitle: string;
  problems: string[];
  solutionTitle: string;
  solutionBody?: string;
  solutions: string[];
}) {
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Reveal className="card h-full p-7 sm:p-9">
        <p className="label text-danger">The business problem</p>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-fg">{problemTitle}</h2>
        <ul className="mt-6 space-y-4">
          {problems.map((p) => (
            <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-muted">
              <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-danger/10 text-danger">
                <X className="size-3" aria-hidden="true" />
              </span>
              {p}
            </li>
          ))}
        </ul>
      </Reveal>
      <Reveal delay={0.08} className="card relative h-full overflow-hidden border-primary/30 p-7 sm:p-9">
        <div aria-hidden="true" className="glow-primary absolute -right-24 -top-24 size-72 opacity-60 blur-2xl" />
        <div className="relative">
          <p className="label text-primary-bright">Our solution</p>
          <h2 className="mt-4 text-2xl font-semibold tracking-tight text-fg">{solutionTitle}</h2>
          {solutionBody && <p className="mt-4 text-[15px] leading-relaxed text-muted">{solutionBody}</p>}
          <ul className="mt-6 space-y-4">
            {solutions.map((p) => (
              <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-fg/85">
                <span className="mt-1 grid size-5 shrink-0 place-items-center rounded-full bg-primary/20 text-primary-bright">
                  <Check className="size-3" aria-hidden="true" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </div>
  );
}

export function CapabilityGrid({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((c, i) => (
        <li key={c}>
          <Reveal delay={(i % 4) * 0.05} className="flex h-full items-start gap-3 rounded-2xl border border-ink/[0.07] bg-surface/60 p-5">
            <span className="label tabular-nums text-primary-bright">{String(i + 1).padStart(2, "0")}</span>
            <span className="text-sm leading-relaxed text-fg/90">{c}</span>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

export function SubServiceGrid({ category }: { category: ServiceCategory }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {category.services.map((s, i) => (
        <Reveal key={s.slug} delay={(i % 3) * 0.06}>
          <article className="card card-hover group relative flex h-full flex-col p-6">
            <span className="grid size-11 place-items-center rounded-xl border border-ink/10 bg-ink/[0.03] text-primary-bright">
              <Icon name={s.icon} size={20} />
            </span>
            <h3 className="mt-5 text-lg font-semibold tracking-tight text-fg">
              <Link href={`/services/${category.slug}/${s.slug}`} className="after:absolute after:inset-0">
                {s.title}
              </Link>
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.summary}</p>
            <div className="mt-5 space-y-2 border-t border-ink/[0.06] pt-5 text-[13px] leading-relaxed">
              <p><span className="text-danger">Problem · </span><span className="text-muted">{s.problem}</span></p>
              <p><span className="text-primary-bright">Solution · </span><span className="text-fg/80">{s.solution}</span></p>
            </div>
            <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-primary-bright">
              Learn more <ArrowUpRight className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </span>
          </article>
        </Reveal>
      ))}
    </div>
  );
}

export function UseCases({ items }: { items: { industry: string; title: string; body: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((u, i) => (
        <Reveal key={u.title} delay={i * 0.05} className="card h-full p-6">
          <p className="label text-secondary-bright">{u.industry}</p>
          <h3 className="mt-3 font-medium text-fg">{u.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted">{u.body}</p>
        </Reveal>
      ))}
    </div>
  );
}

export function Benefits({ items }: { items: { title: string; body: string }[] }) {
  return (
    <dl className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((b, i) => (
        <Reveal key={b.title} delay={i * 0.05} className="border-t border-primary/40 pt-5">
          <dt className="text-lg font-medium text-fg">{b.title}</dt>
          <dd className="mt-2 text-sm leading-relaxed text-muted">{b.body}</dd>
        </Reveal>
      ))}
    </dl>
  );
}

function MiniFlow() {
  const steps = [
    { icon: "whatsapp" as const, label: "Trigger", sub: "WhatsApp / form / webhook" },
    { icon: "bot" as const, label: "AI step", sub: "Understand & decide" },
    { icon: "calendar" as const, label: "Action", sub: "Calendar / CRM / API" },
    { icon: "check" as const, label: "Notify", sub: "Confirmation & alerts" },
  ];
  return (
    <div aria-hidden="true" data-theme="dark" className="glass relative rounded-3xl p-6">
      <p className="mb-5 font-mono text-[10px] uppercase tracking-wider text-muted">workflow · illustration</p>
      <ol className="space-y-0">
        {steps.map((s, i) => (
          <li key={s.label}>
            <div className="flex items-center gap-4 rounded-2xl border border-ink/[0.07] bg-bg/60 p-4">
              <span className="grid size-10 place-items-center rounded-xl bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))] text-white">
                <Icon name={s.icon} size={18} />
              </span>
              <div>
                <p className="text-sm font-medium text-fg">{s.label}</p>
                <p className="text-xs text-muted">{s.sub}</p>
              </div>
              <span className="ml-auto size-2 animate-pulse-soft rounded-full bg-success" style={{ animationDelay: `${i * 0.4}s` }} />
            </div>
            {i < steps.length - 1 && (
              <svg className="mx-auto block h-6 w-4" viewBox="0 0 4 24">
                <line x1="2" y1="0" x2="2" y2="24" stroke="var(--brand-primary-bright)" strokeOpacity="0.5" strokeDasharray="3 5" className="animate-flow" />
              </svg>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ServiceVisual({ kind }: { kind: VisualKind }) {
  if (kind === "agent") return <HeroVisual />;
  if (kind === "workflow") return <MiniFlow />;
  return (
    <div className="relative">
      <BrowserMockup />
      <MockupLabel className="absolute -bottom-3 left-4" />
    </div>
  );
}
