import { pricingConfig, type Tier, type UrgencyKey } from "@/config/pricing";

export const ESTIMATE_STORAGE_KEY = "enquiry-estimate";

export interface EstimateHandoff {
  service: string;
  summary: string;
}

export interface EstimateSelection {
  types: Record<string, Tier>; // project type id → tier
  addons: string[];
  urgency: UrgencyKey;
}

export interface EstimateResult {
  lines: { label: string; detail: string }[];
  addons: string[];
  weeks: [number, number] | null;
  /** null when price display is disabled or ranges are not configured. */
  price: { min: number; max: number } | null;
  complexity: number; // 0–100, relative scope indicator
}

const tierWeight: Record<Tier, number> = { starter: 1, standard: 2, advanced: 3 };

export function computeEstimate(sel: EstimateSelection): EstimateResult {
  const chosen = pricingConfig.projectTypes.filter((t) => sel.types[t.id]);
  const lines = chosen.map((t) => {
    const tier = t.tiers[sel.types[t.id]];
    return { label: t.label, detail: `${tier.label} — ${tier.summary}` };
  });
  const addons = pricingConfig.addons.filter(
    (a) => sel.addons.includes(a.id) && a.appliesTo.some((id) => sel.types[id]),
  );

  // Timeline: longest project, plus overlap allowance for parallel work streams.
  let weeks: [number, number] | null = null;
  if (chosen.length) {
    const ranges = chosen.map((t) => t.weeks[sel.types[t.id]]);
    const maxMin = Math.max(...ranges.map((r) => r[0]));
    const maxMax = Math.max(...ranges.map((r) => r[1]));
    const extra = Math.max(0, chosen.length - 1);
    weeks = [maxMin + Math.ceil(extra / 2), maxMax + extra];
  }

  const multiplier = pricingConfig.urgency[sel.urgency].multiplier;
  let price: EstimateResult["price"] = null;
  if (pricingConfig.showPriceRanges && chosen.length) {
    const min = chosen.reduce((s, t) => s + t.tiers[sel.types[t.id]].min, 0) + addons.reduce((s, a) => s + a.price.min, 0);
    const max = chosen.reduce((s, t) => s + t.tiers[sel.types[t.id]].max, 0) + addons.reduce((s, a) => s + a.price.max, 0);
    if (max > 0) price = { min: Math.round(min * multiplier), max: Math.round(max * multiplier) };
  }

  const raw = chosen.reduce((s, t) => s + tierWeight[sel.types[t.id]] * 2, 0) + addons.length;
  const complexity = Math.min(100, Math.round((raw / 34) * 100));

  return { lines, addons: addons.map((a) => a.label), weeks, price, complexity };
}

export function formatMoney(n: number) {
  return new Intl.NumberFormat(pricingConfig.locale, {
    style: "currency",
    currency: pricingConfig.currency,
    maximumFractionDigits: 0,
  }).format(n);
}

export function complexityLabel(c: number) {
  if (c === 0) return "—";
  if (c < 25) return "Focused";
  if (c < 50) return "Moderate";
  if (c < 75) return "Substantial";
  return "Large-scale";
}

export function summaryText(sel: EstimateSelection, r: EstimateResult): string {
  const parts = [
    "Project estimator summary:",
    ...r.lines.map((l) => `- ${l.label}: ${l.detail}`),
    r.addons.length ? `- Add-ons: ${r.addons.join(", ")}` : null,
    `- Timeline preference: ${pricingConfig.urgency[sel.urgency].label}`,
    r.weeks ? `- Indicative timeline: ${r.weeks[0]}–${r.weeks[1]} weeks` : null,
    r.price ? `- Indicative range: ${formatMoney(r.price.min)} – ${formatMoney(r.price.max)} (not a quotation)` : null,
    "",
    "About my business / goals: ",
  ];
  return parts.filter((p) => p !== null).join("\n");
}
