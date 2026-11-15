# PS Automation Studio — Agency Website

Premium, production-ready website for an AI automation & web development studio.
Built with **Next.js 16 (App Router, Cache Components)**, **TypeScript**, **Tailwind CSS v4**, **Motion** and **Lucide**.

> Every brand detail (name, logo, colours, contact details) is centralised — see *Rebranding*.

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
| Services (3 categories, 21 services) | Sanity Studio, or `src/content/services.ts` as fallback |
| Case studies | Sanity Studio, or `src/content/projects.ts` — list **only verified features**. `showClientName` controls client names; add real screenshots to `screenshots` to replace the labelled mockups |
| FAQs | Sanity Studio, or `src/content/general.ts` |
| Process, technologies, nav | `src/content/general.ts` |
| Estimator pricing | `src/config/pricing.ts` |

## Content management (Sanity CMS)

Case studies, services (all three areas and every service page) and FAQs can be edited in **Sanity Studio**,
built into the site at **`/studio`**. Brand name, colours and contact details stay in `src/config/site.ts`.

**One-time setup**

1. Create a free project at [sanity.io/manage](https://www.sanity.io/manage) (dataset: `production`, public).
2. Add `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` to your hosting environment variables and redeploy
   (these are baked in at build time, so a redeploy is required).
3. In sanity.io/manage → **API → CORS origins**, add your site URL (and `http://localhost:3000` for local work) with **Allow credentials** ticked.
4. Open `/studio`, sign in, go to **Import content** and click **Import starter content** — this copies the current site text into Sanity.

**How updates go live:** published changes appear within about a minute. For instant updates, add a webhook in
sanity.io/manage → **API → Webhooks**: URL `https://YOUR-SITE/api/revalidate`, trigger on create/update/delete,
HTTP method POST, and a secret that matches `SANITY_REVALIDATE_SECRET`.

**Fallback:** if Sanity isn't configured, is empty, or can't be reached, the site serves the local content in
`src/content/`, so it never goes blank.

**Enquiries:** with `SANITY_API_TOKEN` set, every contact-form submission is saved under **Enquiries** in the Studio
(New / In progress / Won / Lost), with private notes and buttons to reply in Gmail, another email app or WhatsApp.
Keep the dataset **Private** — enquiries contain personal data.

**Screenshots:** upload real screenshots on a case study (with alt text) and they replace the illustrative mockup automatically.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Canonical URLs, sitemap, Open Graph |
| `ANTHROPIC_API_KEY` | Enables the **live AI** chatbot. Without it the chatbot runs in a clearly badged *scripted demo mode* |
| `CHAT_MODEL` | Optional model override (default `claude-opus-5-5`) |
| `RESEND_API_KEY`, `ENQUIRY_TO_EMAIL`, `ENQUIRY_FROM_EMAIL` | Enquiries by email via [Resend](https://resend.com) (verify your sending domain) |
| `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET` | Connect Sanity CMS (see above) |
| `SANITY_API_TOKEN` | Sanity **Editor** token (server-only). Lets the site read a **private** dataset and saves every enquiry to the Studio's **Enquiries** list |
| `SANITY_REVALIDATE_SECRET` | Optional — secret for the instant-update webhook |
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
