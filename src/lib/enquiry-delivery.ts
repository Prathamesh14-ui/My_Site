import "server-only";
import { randomUUID } from "node:crypto";
import { absoluteUrl, siteConfig } from "@/config/site";
import { sanityWriteClient } from "@/sanity/client";
import type { Enquiry } from "./enquiry";

/**
 * Delivers an enquiry to every configured destination.
 *
 *   Sanity (saved in the Studio's "Enquiries" list):  SANITY_API_TOKEN (+ Sanity project vars)
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

type Meta = { submittedAt: string; source: string; studioUrl?: string };

function rows(e: Enquiry, meta: Meta) {
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

async function sendEmail(e: Enquiry, meta: Meta) {
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
<p style="white-space:pre-wrap;margin:0">${escapeHtml(e.message)}</p>
${meta.studioUrl ? `<p style="margin:20px 0 0"><a href="${meta.studioUrl}" style="color:#7c3aed">Open in Studio → reply &amp; update status</a></p>` : ""}</div>`;
  const text = `${rows(e, meta).map(([k, v]) => `${k}: ${v}`).join("\n")}\n\nProject description:\n${e.message}${meta.studioUrl ? `\n\nOpen in Studio: ${meta.studioUrl}` : ""}`;

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

async function sendWebhook(e: Enquiry, meta: Meta) {
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

async function saveToSanity(e: Enquiry, meta: Meta, id: string) {
  if (!sanityWriteClient) return null;
  await sanityWriteClient.create({
    _id: id,
    _type: "enquiry",
    status: "new",
    name: e.name,
    business: e.business,
    email: e.email,
    whatsapp: e.whatsapp,
    service: e.service,
    budget: e.budget,
    message: e.message,
    submittedAt: meta.submittedAt,
    source: meta.source,
  });
  return "sanity";
}

export function deliveryConfigured() {
  return Boolean(
    sanityWriteClient || (process.env.RESEND_API_KEY && process.env.ENQUIRY_TO_EMAIL) || process.env.ENQUIRY_WEBHOOK_URL,
  );
}

export async function deliverEnquiry(e: Enquiry, source: string): Promise<DeliveryResult> {
  if (!deliveryConfigured()) return { ok: false, reason: "not_configured", errors: [] };
  const id = `enquiry-${randomUUID()}`;
  const meta: Meta = {
    submittedAt: new Date().toISOString(),
    source,
    studioUrl: sanityWriteClient ? absoluteUrl(`/studio/intent/edit/id=${id};type=enquiry`) : undefined,
  };
  const results = await Promise.allSettled([saveToSanity(e, meta, id), sendEmail(e, meta), sendWebhook(e, meta)]);
  const channels: string[] = [];
  const errors: string[] = [];
  for (const r of results) {
    if (r.status === "fulfilled" && r.value) channels.push(r.value);
    if (r.status === "rejected") errors.push(r.reason instanceof Error ? r.reason.message : String(r.reason));
  }
  return channels.length ? { ok: true, channels, errors } : { ok: false, reason: "failed", errors };
}
