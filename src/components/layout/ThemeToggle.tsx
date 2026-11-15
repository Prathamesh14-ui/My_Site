"use client";

import { useSyncExternalStore } from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { siteConfig } from "@/config/site";
import { THEME_STORAGE_KEY, type ThemePreference } from "@/lib/theme";
import { cn } from "@/lib/utils";

const listeners = new Set<() => void>();
const LIGHT_QUERY = "(prefers-color-scheme: light)";

function readPreference(): ThemePreference {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    /* storage blocked */
  }
  return siteConfig.defaultTheme;
}

function applyTheme(pref: ThemePreference) {
  const theme = pref === "system" ? (window.matchMedia(LIGHT_QUERY).matches ? "light" : "dark") : pref;
  document.documentElement.setAttribute("data-theme", theme);
}

function setPreference(pref: ThemePreference) {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    /* storage blocked — the choice still applies for this page view */
  }
  applyTheme(pref);
  listeners.forEach((l) => l());
}

function subscribe(onChange: () => void) {
  listeners.add(onChange);
  const mq = window.matchMedia(LIGHT_QUERY);
  const onSystemChange = () => {
    if (readPreference() === "system") applyTheme("system");
    onChange();
  };
  const onStorage = (e: StorageEvent) => {
    if (e.key === THEME_STORAGE_KEY) {
      applyTheme(readPreference());
      onChange();
    }
  };
  mq.addEventListener("change", onSystemChange);
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(onChange);
    mq.removeEventListener("change", onSystemChange);
    window.removeEventListener("storage", onStorage);
  };
}

const options: { value: ThemePreference; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Light", Icon: Sun },
  { value: "dark", label: "Dark", Icon: Moon },
  { value: "system", label: "System", Icon: Monitor },
];

/** Light / Dark / System switch. `compact` = icons only (header); otherwise icons with labels (mobile menu). */
export function ThemeToggle({ compact = false, className }: { compact?: boolean; className?: string }) {
  // null on the server: the active option is unknown until the browser reads the saved choice.
  const pref = useSyncExternalStore(subscribe, readPreference, () => null);

  return (
    <div
      role="radiogroup"
      aria-label="Colour theme"
      className={cn("inline-flex items-center gap-0.5 rounded-full border border-ink/10 bg-ink/[0.03] p-0.5", className)}
    >
      {options.map(({ value, label, Icon }) => {
        const active = pref === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={compact ? `${label} theme` : undefined}
            title={compact ? `${label} theme` : undefined}
            onClick={() => setPreference(value)}
            className={cn(
              "inline-flex items-center justify-center gap-1.5 rounded-full text-muted transition-colors hover:text-fg",
              compact ? "size-8" : "h-10 flex-1 px-4 text-sm",
              active && "bg-ink/10 text-fg",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
            {!compact && <span>{label}</span>}
          </button>
        );
      })}
    </div>
  );
}
