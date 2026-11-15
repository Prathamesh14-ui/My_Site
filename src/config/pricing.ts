/**
 * ─────────────────────────────────────────────────────────────
 *  PROJECT ESTIMATOR CONFIGURATION
 * ─────────────────────────────────────────────────────────────
 *  The estimator never shows a final quotation. It turns visitor
 *  choices into an enquiry summary and — only if you enable it —
 *  an indicative price range.
 *
 *  IMPORTANT: the amounts below are PLACEHOLDERS, not real business
 *  prices. Price display is OFF by default (`showPriceRanges: false`).
 *  Set your own ranges, then switch it on.
 */

export type Tier = "starter" | "standard" | "advanced";

export interface PricedRange {
  min: number;
  max: number;
}

export interface EstimatorProjectType {
  id: string;
  label: string;
  description: string;
  /** Indicative ranges per scope tier (PLACEHOLDER values). */
  tiers: Record<Tier, PricedRange & { label: string; summary: string }>;
  /** Indicative delivery in weeks per tier (PLACEHOLDER values). */
  weeks: Record<Tier, [number, number]>;
}

export interface EstimatorAddon {
  id: string;
  label: string;
  /** Which project types this add-on applies to. */
  appliesTo: string[];
  price: PricedRange;
}

export const pricingConfig = {
  /** Turn on only after replacing placeholder amounts with your real ranges. */
  showPriceRanges: false,
  currency: "INR",
  locale: "en-IN",
  disclaimer:
    "This is an indicative estimate to help scope your project — not a final quotation. Final pricing depends on detailed requirements, integrations and content, and is confirmed in writing after a consultation.",

  urgency: {
    flexible: { label: "Flexible", multiplier: 1 },
    standard: { label: "Within 1–2 months", multiplier: 1 },
    urgent: { label: "Urgent (priority delivery)", multiplier: 1.2 },
  },

  projectTypes: [
    {
      id: "website",
      label: "Website development",
      description: "Business websites, landing pages, Next.js, CMS and e-commerce.",
      tiers: {
        starter: { label: "Landing page", summary: "Single high-converting page", min: 0, max: 0 },
        standard: { label: "Business website", summary: "Multi-page site with CMS", min: 0, max: 0 },
        advanced: { label: "Web application / e-commerce", summary: "Custom full-stack build", min: 0, max: 0 },
      },
      weeks: { starter: [1, 2], standard: [3, 6], advanced: [6, 12] },
    },
    {
      id: "chatbot",
      label: "AI chatbot development",
      description: "Website or in-app assistants trained on your business knowledge.",
      tiers: {
        starter: { label: "FAQ assistant", summary: "Answers from your content", min: 0, max: 0 },
        standard: { label: "Lead-qualifying assistant", summary: "Knowledge + lead capture + handoff", min: 0, max: 0 },
        advanced: { label: "RAG assistant", summary: "Document retrieval, multiple sources", min: 0, max: 0 },
      },
      weeks: { starter: [1, 2], standard: [2, 4], advanced: [4, 8] },
    },
    {
      id: "whatsapp",
      label: "WhatsApp automation",
      description: "WhatsApp Business chatbots, booking flows and notifications.",
      tiers: {
        starter: { label: "Auto-replies & routing", summary: "Menus, FAQs, human handoff", min: 0, max: 0 },
        standard: { label: "AI WhatsApp assistant", summary: "AI conversations + one integration", min: 0, max: 0 },
        advanced: { label: "Full booking / sales flow", summary: "Calendar, CRM, OTP, reminders", min: 0, max: 0 },
      },
      weeks: { starter: [1, 2], standard: [2, 4], advanced: [4, 8] },
    },
    {
      id: "agent",
      label: "Custom AI agents",
      description: "Agents that reason, use tools and complete multi-step tasks.",
      tiers: {
        starter: { label: "Single-task agent", summary: "One workflow, a few tools", min: 0, max: 0 },
        standard: { label: "Business assistant", summary: "Several tools and data sources", min: 0, max: 0 },
        advanced: { label: "Multi-agent system", summary: "Orchestrated agents, approvals, monitoring", min: 0, max: 0 },
      },
      weeks: { starter: [2, 3], standard: [3, 6], advanced: [6, 12] },
    },
    {
      id: "automation",
      label: "Business automation",
      description: "n8n workflows, CRM syncing, lead routing and API integrations.",
      tiers: {
        starter: { label: "Single workflow", summary: "One process automated end-to-end", min: 0, max: 0 },
        standard: { label: "Workflow bundle", summary: "3–5 connected workflows", min: 0, max: 0 },
        advanced: { label: "Operations platform", summary: "Custom APIs, error handling, dashboards", min: 0, max: 0 },
      },
      weeks: { starter: [1, 2], standard: [2, 5], advanced: [5, 10] },
    },
  ] satisfies EstimatorProjectType[],

  addons: [
    { id: "crm", label: "CRM integration", appliesTo: ["chatbot", "whatsapp", "agent", "automation", "website"], price: { min: 0, max: 0 } },
    { id: "calendar", label: "Google Calendar / booking", appliesTo: ["chatbot", "whatsapp", "agent", "automation", "website"], price: { min: 0, max: 0 } },
    { id: "multilingual", label: "Multiple languages", appliesTo: ["chatbot", "whatsapp", "agent", "website"], price: { min: 0, max: 0 } },
    { id: "cms", label: "Content management (CMS)", appliesTo: ["website"], price: { min: 0, max: 0 } },
    { id: "payments", label: "Online payments", appliesTo: ["website", "whatsapp"], price: { min: 0, max: 0 } },
    { id: "analytics", label: "Reporting dashboard", appliesTo: ["chatbot", "whatsapp", "agent", "automation", "website"], price: { min: 0, max: 0 } },
    { id: "support", label: "Ongoing maintenance & support", appliesTo: ["chatbot", "whatsapp", "agent", "automation", "website"], price: { min: 0, max: 0 } },
  ] satisfies EstimatorAddon[],
};

export type UrgencyKey = keyof typeof pricingConfig.urgency;
