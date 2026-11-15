import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteConfig } from "@/config/site";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const c = siteConfig.colors;
  const logo = siteConfig.logo.imageSrc
    ? `data:image/svg+xml;base64,${(await readFile(join(process.cwd(), "public", siteConfig.logo.imageSrc))).toString("base64")}`
    : null;
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: `radial-gradient(70% 90% at 20% 0%, ${c.primary}55, transparent), radial-gradient(60% 80% at 100% 100%, ${c.secondary}40, transparent), ${c.background}`,
          color: c.foreground,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          {logo ? (
            <img src={logo} width={72} height={72} alt="" />
          ) : (
            <div
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                background: `linear-gradient(135deg, ${c.primary}, ${c.secondary})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 22,
                fontWeight: 700,
                color: "white",
              }}
            >
              {siteConfig.logo.monogram}
            </div>
          )}
          <div style={{ fontSize: 30, fontWeight: 600 }}>{siteConfig.name}</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>{siteConfig.tagline}</div>
          <div style={{ marginTop: 28, fontSize: 28, color: c.muted, maxWidth: 900 }}>
            AI agents · WhatsApp chatbots · n8n automation · Next.js websites
          </div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: c.muted }}>
          {siteConfig.location.city}, {siteConfig.location.country} · Serving businesses worldwide
        </div>
      </div>
    ),
    size,
  );
}
