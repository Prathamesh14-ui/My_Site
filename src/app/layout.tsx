import type { Metadata, Viewport } from "next";
import type { CSSProperties } from "react";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/config/site";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — AI Agents, Automation & Web Development`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "AI agent development",
    "WhatsApp AI chatbot",
    "n8n automation",
    "business automation India",
    "Next.js development Mumbai",
    "AI chatbot development",
    "RAG solutions",
    "web development agency Mumbai",
  ],
  openGraph: {
    type: "website",
    locale: siteConfig.locale,
    siteName: siteConfig.name,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: siteConfig.colors.background,
  colorScheme: "dark",
};

const brandVars = {
  "--brand-bg": siteConfig.colors.background,
  "--brand-surface": siteConfig.colors.surface,
  "--brand-surface-raised": siteConfig.colors.surfaceRaised,
  "--brand-border": siteConfig.colors.border,
  "--brand-fg": siteConfig.colors.foreground,
  "--brand-muted": siteConfig.colors.muted,
  "--brand-primary": siteConfig.colors.primary,
  "--brand-primary-bright": siteConfig.colors.primaryBright,
  "--brand-secondary": siteConfig.colors.secondary,
  "--brand-secondary-bright": siteConfig.colors.secondaryBright,
} as CSSProperties;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      style={brandVars}
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body className="flex min-h-dvh flex-col">
        {children}
      </body>
    </html>
  );
}
