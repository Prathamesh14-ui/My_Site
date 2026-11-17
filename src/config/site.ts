/**
 * ─────────────────────────────────────────────────────────────
 *  CENTRAL BRAND CONFIGURATION
 * ─────────────────────────────────────────────────────────────
 *  Everything that identifies the business lives here. Rename the
 *  business, swap the logo, change colours or contact details in
 *  this one file — no component hardcodes the brand.
 *
 *  Values marked  PLACEHOLDER  must be replaced before launch.
 */

export const siteConfig = {
  name: "PS Automation Studio",
  /** Short form used in tight spaces (mobile header, OG image). */
  shortName: "PS Automation",
  /**
   * Logo files in /public — one per theme (the header/footer swap automatically).
   * Set `images` to null to fall back to the built-in monogram badge.
   */
  logo: {
    monogram: "PS",
    images: { dark: "/logo-dark.svg", light: "/logo-light.svg" } as { dark: string; light: string } | null,
  },
  tagline: "Intelligent AI. Smarter Automation. Digital Growth.",
  positioning:
    "We build intelligent AI agents, automate business operations and develop modern websites that help businesses grow.",
  description:
    "AI agents, WhatsApp chatbots, business workflow automation and high-performance websites for startups, SMEs, clinics, travel and real estate businesses — built in Mumbai, delivered worldwide.",

  /** Public site URL — set NEXT_PUBLIC_SITE_URL in production. */
  url: (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, ""),
  locale: "en_IN",

  location: {
    city: "Mumbai",
    region: "Maharashtra",
    country: "India",
    countryCode: "IN",
    servesLabel: "Serving clients in India and internationally",
  },

  contact: {
    email: "patu.surve2001@gmail.com",
    whatsapp: {
      /** International format, digits only (used for wa.me links). */
      number: "919920035011",
      display: "+91 99200 35011",
      defaultMessage: "Hi! I'd like to discuss a project with your team.",
    },
    responseTime: "We reply to enquiries within one business day.",
    hours: "Mon – Sat, 10:00 – 19:00 IST",
  },

  /** Primary call-to-action used across the site. */
  cta: {
    primary: { label: "Book a Free Consultation", href: "/contact" },
    secondary: { label: "Explore Our Solutions", href: "/services" },
  },

  /** Social profiles — leave empty strings to hide. PLACEHOLDER */
  social: {
    linkedin: "",
    github: "",
    x: "",
    instagram: "",
  },

  /**
   * Brand colours. Injected as CSS variables in the root layout, so the
   * whole design system (Tailwind tokens, gradients, glows) follows them.
   */
  colors: {
    background: "#08090D",
    surface: "#10121A",
    surfaceRaised: "#161924",
    border: "#1F2330",
    foreground: "#F5F6FA",
    muted: "#9BA1B4",
    primary: "#8B5CF6", // electric purple
    primaryBright: "#A78BFA",
    secondary: "#3B82F6", // electric blue
    secondaryBright: "#60A5FA",
    /** Light theme (visitors can switch with the theme toggle; dark is the default). */
    light: {
      background: "#F6F6FB",
      surface: "#FFFFFF",
      surfaceRaised: "#F0F0F7",
      border: "#E2E3EC",
      foreground: "#0B0C14",
      muted: "#555B6E",
      primary: "#7C3AED",
      primaryBright: "#6D28D9", // darker for readable accent text on white
      secondary: "#2563EB",
      secondaryBright: "#1D4ED8",
    },
  },
  /** Theme shown to first-time visitors: "dark", "light" or "system". */
  defaultTheme: "dark" as "dark" | "light" | "system",
} as const;

export type SiteConfig = typeof siteConfig;

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(message ?? siteConfig.contact.whatsapp.defaultMessage);
  return `https://wa.me/${siteConfig.contact.whatsapp.number}?text=${text}`;
}

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
