import { siteConfig } from "@/config/site";

/**
 * Theme system. Colours come from src/config/site.ts. The root <html> carries
 * data-theme="dark" | "light". Any element with data-theme="dark" inside a light
 * page re-applies the dark palette — used to keep product illustrations dark.
 */
export type ThemePreference = "dark" | "light" | "system";
export const THEME_STORAGE_KEY = "theme";

type Palette = {
  background: string; surface: string; surfaceRaised: string; border: string; foreground: string;
  muted: string; primary: string; primaryBright: string; secondary: string; secondaryBright: string;
};

const palette = (c: Palette) => `
  --brand-bg:${c.background};--brand-surface:${c.surface};--brand-surface-raised:${c.surfaceRaised};
  --brand-border:${c.border};--brand-fg:${c.foreground};--brand-muted:${c.muted};
  --brand-primary:${c.primary};--brand-primary-bright:${c.primaryBright};
  --brand-secondary:${c.secondary};--brand-secondary-bright:${c.secondaryBright};`;

const darkTones = `--brand-ink:#ffffff;--tone-success:#6ee7b7;--tone-warning:#fde68a;--tone-danger:#fca5a5;color-scheme:dark;`;
const lightTones = `--brand-ink:#0b0c14;--tone-success:#047857;--tone-warning:#92400e;--tone-danger:#b91c1c;color-scheme:light;`;

export function themeCss(): string {
  const { light, ...dark } = siteConfig.colors;
  return [
    // Page-level defaults (dark) + effects
    `:root{${palette(dark)}${darkTones}--glow-a:16%;--glow-b:12%;--shadow-strong:rgba(0,0,0,.7);--shadow-soft:rgba(0,0,0,.35)}`,
    `:root[data-theme="light"]{${palette(light)}${lightTones}--glow-a:8%;--glow-b:6%;--shadow-strong:rgba(35,30,80,.20);--shadow-soft:rgba(35,30,80,.10)}`,
    // Dark islands inside a light page (illustrations, mockups)
    `:root[data-theme="light"] [data-theme="dark"]{${palette(dark)}${darkTones}color:var(--brand-fg)}`,
  ].join("");
}

/** Runs before first paint so the page never flashes the wrong theme. */
export function themeScript(): string {
  return `(function(){try{var d=${JSON.stringify(siteConfig.defaultTheme)};var p=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})||d;var t=p==="system"?(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark"):p;if(t!=="light"&&t!=="dark")t="dark";document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;
}
