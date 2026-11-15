# AI Automation Studio — Agency Website

Premium, production-ready website for an AI automation & web development studio.
Built with **Next.js 16 (App Router, Cache Components)**, **TypeScript**, **Tailwind CSS v4**, **Motion** and **Lucide**.

> "AI Automation Studio" is a temporary working name. Every brand detail is centralised — see *Rebranding*.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in what you need
npm run dev                  # http://localhost:3000
```

Production: `npm run build && npm start`. Quality checks: `npx tsc --noEmit`, `npm run lint`.

## Rebranding (one file)

`src/config/site.ts` controls the business name, monogram/logo image, tagline, positioning, contact email,
WhatsApp number, CTA labels, social links and **brand colours** (injected as CSS variables, so the whole design follows).

Before launch, replace the values marked `PLACEHOLDER`:

- `contact.email`, `contact.whatsapp.number` / `display`
- `social.*` (empty values are hidden)
- `src/app/icon.svg` (favicon) — and optionally `logo.imageSrc` for a real logo
- `src/app/privacy/page.tsx` — have the privacy notice reviewed for your jurisdiction

## Content

| What | Where |
| --- | --- |
| Services (3 categories, 21 services) | `src/content/services.ts` |
| Case studies | `src/content/projects.ts` — list **only verified features**. `showClientName` controls client names; add real screenshots to `screenshots` to replace the labelled mockups |
| FAQ, process, technologies, nav | `src/content/general.ts` |
| Estimator pricing | `src/config/pricing.ts` |

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph |
| `ANTHROPIC_API_KEY` | Enables the **live AI** chatbot. Without it the chatbot runs in a clearly badged *scripted demo mode* |
| `CHAT_MODEL` | Optional model override (default `claude-opus-5-5`) |
| `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`, `ENQUIRY_FROM_EMAIL` | Enquiries by email via [Resend](https://resend.com) (verify your sending domain) |
| `ENQUIRY_WEBHOOK_URL`, `ENQUIRY_WEBHOOK_SECRET` | Enquiries as JSON to a webhook — e.g. an **n8n Webhook node** (secret sent as `X-Webhook-Secret`) |

Configure **at least one** enquiry destination. If none is configured, or all configured destinations fail,
the form shows an error with email/WhatsApp alternatives — it never shows a false success.

## Interactive features

- **Live AI chatbot demo** (`/api/chat`): streams Claude responses server-side with a server-side refusal fallback;
  three scenarios (agency assistant, fictional clinic, fictional travel). API key never reaches the browser.
- **Automation workflow visualiser**: three animated scenarios with step controls and execution log.
- **Project estimator** (`/estimate`): builds an enquiry summary and hands it to the contact form.
  Price ranges are **off** (`showPriceRanges: false`) and amounts are placeholders — set your own before enabling.
  Indicative timelines in `weeks` are also placeholders to review.
- **Enquiry system** (`/api/contact`): Zod validation (shared client/server), honeypot, rate limiting, loading/success/error states.

## SEO

Per-page titles, descriptions, canonicals, Open Graph/Twitter (generated OG image), `sitemap.xml`, `robots.txt`,
JSON-LD (ProfessionalService, WebSite, BreadcrumbList, Service, FAQPage), semantic headings.

## Deployment notes

- Works on any Node host (Vercel recommended). Cache Components requires the Node.js runtime.
- The rate limiter is in-memory (per instance). For multi-instance/serverless scale, swap `src/lib/rate-limit.ts` for a shared store (e.g. Upstash Redis).
