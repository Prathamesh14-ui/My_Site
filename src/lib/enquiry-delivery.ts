import "server-only";
import { siteConfig } from "@/config/site";
import type { Enquiry } from "./enquiry";

/**
 * Delivers an enquiry to every configured destination.
 *
 *   Email  (Resend):  RESEND_API_KEY + ENQUIRY_TO_EMAIL (+ ENQUIRY_FROM_EMAIL)
 *   Webhook (n8n, Zapier, Make, Slack…):  ENQUIRY_WEBHOOK_URL (+ ENQUIRY_WEBHOOK_SECRET)
 *
 * Succeeds only if at least one destination confirmed delivery.
 */

export type DeliveryResult =
  | { ok: true; channels: string[]; errors: string[] }
  | { ok: false; reason: "not_configured" | "failed"; errors: string[] };

const TIMEOUT_MS = 10_000;

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function rows(e: Enquiry, meta: { submittedAt: string; source: string }) {
  return [
    ["Name", e.name],
    ["Business", e.business || "—"],
    ["Email", e.email],
    ["WhatsApp", e.whatsapp || "—"],
    ["Service", e.service],
    ["Budget", e.budget],
    ["Submitted", meta.submittedAt],
    ["Page", meta.source],
  ] as const;
}

async function sendEmail(e: Enquiry, meta: { submittedAt: string; source: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO_EMAIL;
  if (!apiKey || !to) return null;
  const from = process.env.ENQUIRY_FROM_EMAIL || `${siteConfig.name} <onboarding@resend.dev>`;

  const table = rows(e, meta)
    .map(([k, v]) => `<tr><td style="padding:6px 12px;color:#666">${k}</td><td style="padding:6px 12px"><strong>${escapeHtml(v)}</strong></td></tr>`)
    .join("");
  const html = `<div style="font-family:system-ui,sans-serif;font-size:14px">
<h2 style="margin:0 0 12px">New enquiry from ${escapeHtml(e.name)}</h2>
<table style="border-collapse:collapse">${table}</table>
<h3 style="margin:20px 0 8px">Project description</h3>
<p style="white-space:pre-wrap;margin:0">${escapeHtml(e.message)}</p></div>`;
  const text = `${rows(e, meta).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nProject description:\n${e.message}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()).filter(Boolean),
      reply_to: e.email,
      subject: `New enquiry: ${e.service} — ${e.name}${e.business ? ` (${e.business})` : ""}`,
      html,
      text,
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`email: HTTP ${res.status} ${await res.text().catch(() => "")}`.slice(0, 300));
  return "email";
}

async function sendWebhook(e: Enquiry, meta: { submittedAt: string; source: string }) {
  const url = process.env.ENQUIRY_WEBHOOK_URL;
  if (!url) return null;
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (process.env.ENQUIRY_WEBHOOK_SECRET) headers["X-Webhook-Secret"] = process.env.ENQUIRY_WEBHOOK_SECRET;
  const { consent, website, ...fields } = e;
  void website;
  const res = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ type: "enquiry", site: siteConfig.name, consent, ...fields, ...meta }),
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`webhook: HTTP ${res.status}`);
  return "webhook";
}

export function deliveryConfigured() {
  return Boolean((process.env.RESEND_API_KEY && process.env.ENQUIRY_TO_EMAIL) || process.env.ENQUIRY_WEBHOOK_URL);
}

export async function deliverEnquiry(e: Enquiry, source: string): Promise<DeliveryResult> {
  if (!deliveryConfigured()) return { ok: false, reason: "not_configured", errors: [] };
  const meta = { submittedAt: new Date().toISOString(), source };
  const results = await Promise.allSettled([sendEmail(e, meta), sendWebhook(e, meta)]);
  const channels: string[] = [];
  const errors: string[] = [];
  for (const r of results) {
    if (r.status === "fulfilled" && r.value) channels.push(r.value);
    if (r.status === "rejected") errors.push(r.reason instanceof Error ? r.reason.message : String(r.reason));
  }
  return channels.length ? { ok: true, channels, errors } : { ok: false, reason: "failed", errors };
}
