"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Check, Info, ArrowRight } from "lucide-react";
import { pricingConfig, type Tier, type UrgencyKey } from "@/config/pricing";
import {
  ESTIMATE_STORAGE_KEY,
  complexityLabel,
  computeEstimate,
  formatMoney,
  summaryText,
  type EstimateHandoff,
  type EstimateSelection,
} from "@/lib/estimate";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

const typeIcons: Record<string, IconName> = {
  website: "globe",
  chatbot: "messages",
  whatsapp: "whatsapp",
  agent: "bot",
  automation: "workflow",
};

const typeToService: Record<string, string> = {
  website: "Professional Business Websites",
  chatbot: "AI Chatbot Development",
  whatsapp: "WhatsApp AI Chatbots",
  agent: "Custom AI Agent Development",
  automation: "n8n Workflow Automation",
};

const tiers: Tier[] = ["starter", "standard", "advanced"];

export function CostEstimator() {
  const router = useRouter();
  const [sel, setSel] = useState<EstimateSelection>({ types: {}, addons: [], urgency: "standard" });
  const result = useMemo(() => computeEstimate(sel), [sel]);
  const selectedIds = Object.keys(sel.types);
  const availableAddons = pricingConfig.addons.filter((a) => a.appliesTo.some((id) => sel.types[id]));

  function toggleType(id: string) {
    setSel((s) => {
      const types = { ...s.types };
      if (types[id]) delete types[id];
      else types[id] = "standard";
      return { ...s, types };
    });
  }
  function setTier(id: string, tier: Tier) {
    setSel((s) => ({ ...s, types: { ...s.types, [id]: tier } }));
  }
  function toggleAddon(id: string) {
    setSel((s) => ({ ...s, addons: s.addons.includes(id) ? s.addons.filter((a) => a !== id) : [...s.addons, id] }));
  }

  function sendToContact() {
    const handoff: EstimateHandoff = {
      service: selectedIds.length === 1 ? typeToService[selectedIds[0]] : "Multiple services / not sure",
      summary: summaryText(sel, result),
    };
    try {
      sessionStorage.setItem(ESTIMATE_STORAGE_KEY, JSON.stringify(handoff));
    } catch {
      /* storage blocked — the contact form still works without the prefill */
    }
    router.push("/contact");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
      <div className="space-y-6">
        {/* Step 1 */}
        <fieldset className="card min-w-0 p-5 sm:p-7">
          <legend className="sr-only">Step 1: What do you need?</legend>
          <StepTitle n={1} title="What do you need?" subtitle="Select one or more." />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {pricingConfig.projectTypes.map((t) => {
              const on = Boolean(sel.types[t.id]);
              return (
                <div key={t.id} className={cn("rounded-2xl border transition-colors", on ? "border-primary/50 bg-primary/[0.07]" : "border-ink/[0.08] bg-bg/50 hover:border-ink/20")}>
                  <button type="button" aria-pressed={on} onClick={() => toggleType(t.id)} className="flex w-full items-start gap-3.5 p-4 text-left">
                    <span className={cn("grid size-10 shrink-0 place-items-center rounded-xl border", on ? "border-transparent bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))] text-white" : "border-ink/10 text-muted")}>
                      <Icon name={typeIcons[t.id] ?? "sparkles"} size={18} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-medium text-fg">{t.label}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed text-muted">{t.description}</span>
                    </span>
                    <span className={cn("mt-1 grid size-5 shrink-0 place-items-center rounded-md border", on ? "border-primary bg-primary text-white" : "border-ink/20")} aria-hidden="true">
                      {on && <Check className="size-3.5" />}
                    </span>
                  </button>
                  {on && (
                    <div className="px-4 pb-4">
                      <p id={`tier-${t.id}`} className="mb-2 text-[11px] uppercase tracking-wider text-muted">Scope</p>
                      <div role="radiogroup" aria-labelledby={`tier-${t.id}`} className="grid grid-cols-3 gap-1 rounded-xl bg-bg/70 p-1">
                        {tiers.map((tier) => (
                          <button
                            key={tier}
                            type="button"
                            role="radio"
                            aria-checked={sel.types[t.id] === tier}
                            onClick={() => setTier(t.id, tier)}
                            className={cn(
                              "rounded-lg px-1.5 py-2 text-[11.5px] leading-tight transition-colors",
                              sel.types[t.id] === tier ? "bg-ink/10 text-fg" : "text-muted hover:text-fg",
                            )}
                          >
                            {t.tiers[tier].label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </fieldset>

        {/* Step 2 */}
        <fieldset className={cn("card min-w-0 p-5 sm:p-7 transition-opacity", !selectedIds.length && "opacity-50")} disabled={!selectedIds.length}>
          <legend className="sr-only">Step 2: Add-ons</legend>
          <StepTitle n={2} title="Integrations & extras" subtitle={selectedIds.length ? "Optional — pick what applies." : "Select a project type first."} />
          <div className="mt-6 flex flex-wrap gap-2">
            {(selectedIds.length ? availableAddons : pricingConfig.addons).map((a) => {
              const on = sel.addons.includes(a.id);
              return (
                <button
                  key={a.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggleAddon(a.id)}
                  className={cn(
                    "inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm transition-colors",
                    on ? "border-primary/50 bg-primary/15 text-fg" : "border-ink/10 text-muted hover:border-ink/25 hover:text-fg",
                  )}
                >
                  {on ? <Check className="size-3.5 text-primary-bright" aria-hidden="true" /> : <span className="text-base leading-none" aria-hidden="true">+</span>}
                  {a.label}
                </button>
              );
            })}
          </div>
        </fieldset>

        {/* Step 3 */}
        <fieldset className="card min-w-0 p-5 sm:p-7">
          <legend className="sr-only">Step 3: Timeline</legend>
          <StepTitle n={3} title="When do you need it?" />
          <div role="radiogroup" aria-label="Timeline" className="mt-6 grid gap-2 sm:grid-cols-3">
            {(Object.keys(pricingConfig.urgency) as UrgencyKey[]).map((k) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={sel.urgency === k}
                onClick={() => setSel((s) => ({ ...s, urgency: k }))}
                className={cn(
                  "rounded-xl border px-4 py-3 text-left text-sm transition-colors",
                  sel.urgency === k ? "border-primary/50 bg-primary/10 text-fg" : "border-ink/10 text-muted hover:text-fg",
                )}
              >
                {pricingConfig.urgency[k].label}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      {/* Summary */}
      <aside aria-labelledby="estimate-summary" className="lg:sticky lg:top-24">
        <div className="glass overflow-hidden rounded-3xl">
          <div className="border-b border-ink/[0.06] p-6">
            <h2 id="estimate-summary" className="text-lg font-semibold text-fg">Your project summary</h2>
            <p className="mt-1 text-sm text-muted">Updates as you choose.</p>
          </div>
          <div className="space-y-6 p-6" aria-live="polite">
            {result.lines.length === 0 ? (
              <p className="text-sm text-muted">Select at least one project type to build your summary.</p>
            ) : (
              <ul className="space-y-3">
                {result.lines.map((l) => (
                  <li key={l.label} className="text-sm">
                    <p className="font-medium text-fg">{l.label}</p>
                    <p className="text-muted">{l.detail}</p>
                  </li>
                ))}
                {result.addons.length > 0 && (
                  <li className="text-sm">
                    <p className="font-medium text-fg">Add-ons</p>
                    <p className="text-muted">{result.addons.join(", ")}</p>
                  </li>
                )}
              </ul>
            )}

            <div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted">Relative scope</span>
                <span className="font-medium text-fg">{complexityLabel(result.complexity)}</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/[0.06]">
                <motion.div
                  className="h-full rounded-full bg-[linear-gradient(90deg,var(--brand-primary),var(--brand-secondary))]"
                  animate={{ width: `${result.complexity}%` }}
                  transition={{ type: "spring", stiffness: 120, damping: 20 }}
                />
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-4 border-t border-ink/[0.06] pt-5 text-sm">
              <div>
                <dt className="text-muted">Indicative timeline</dt>
                <dd className="mt-1 font-medium text-fg">{result.weeks ? `${result.weeks[0]}–${result.weeks[1]} weeks` : "—"}</dd>
              </div>
              <div>
                <dt className="text-muted">Indicative budget</dt>
                <dd className="mt-1 font-medium text-fg">
                  {result.price ? `${formatMoney(result.price.min)} – ${formatMoney(result.price.max)}` : result.lines.length ? "Confirmed after consultation" : "—"}
                </dd>
              </div>
            </dl>

            <p className="flex gap-2 rounded-xl border border-ink/[0.06] bg-bg/50 p-3 text-xs leading-relaxed text-muted">
              <Info className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
              {pricingConfig.disclaimer}
            </p>

            <Button size="lg" className="w-full" disabled={!result.lines.length} onClick={sendToContact}>
              Send summary & book consultation <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function StepTitle({ n, title, subtitle }: { n: number; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-4">
      <span className="grid size-8 shrink-0 place-items-center rounded-full border border-ink/10 font-mono text-xs text-primary-bright">{n}</span>
      <div>
        <h2 className="text-lg font-semibold text-fg">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}
