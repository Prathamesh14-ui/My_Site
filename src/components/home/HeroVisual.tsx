"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon, type IconName } from "@/components/ui/Icon";

const nodes: { id: string; label: string; icon: IconName; x: number; y: number }[] = [
  { id: "wa", label: "WhatsApp", icon: "whatsapp", x: 70, y: 70 },
  { id: "web", label: "Website chat", icon: "chat", x: 70, y: 250 },
  { id: "kb", label: "Knowledge", icon: "database", x: 230, y: 330 },
  { id: "cal", label: "Calendar", icon: "calendar", x: 390, y: 70 },
  { id: "crm", label: "CRM", icon: "users", x: 390, y: 250 },
  { id: "flow", label: "n8n", icon: "workflow", x: 230, y: 30 },
];
const center = { x: 230, y: 170 };

const events = [
  { tag: "IN", text: "WhatsApp: “Can I book Thursday at 5:30?”", tone: "text-secondary-bright" },
  { tag: "AI", text: "Intent detected → book_appointment", tone: "text-primary-bright" },
  { tag: "API", text: "Calendar: 5:30 PM slot is free", tone: "text-success" },
  { tag: "OK", text: "Booked · confirmation sent", tone: "text-success" },
  { tag: "IN", text: "Website: “Do you build Next.js sites?”", tone: "text-secondary-bright" },
  { tag: "AI", text: "Answered from knowledge base", tone: "text-primary-bright" },
  { tag: "CRM", text: "Lead created and assigned", tone: "text-success" },
];

function pathFor(n: { x: number; y: number }) {
  const mx = (n.x + center.x) / 2;
  return `M${n.x},${n.y} C${mx},${n.y} ${mx},${center.y} ${center.x},${center.y}`;
}

export function HeroVisual() {
  const reduce = useReducedMotion();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (reduce) return;
    const id = setInterval(() => setTick((t) => t + 1), 2200);
    return () => clearInterval(id);
  }, [reduce]);

  const visible = [0, 1, 2].map((o) => events[(tick + o) % events.length]);

  return (
    <div className="relative" aria-hidden="true">
      <div className="absolute -inset-10 glow-primary opacity-60 blur-2xl" />
      <div data-theme="dark" className="glass relative overflow-hidden rounded-3xl shadow-[0_40px_120px_-30px_var(--shadow-strong)]">
        <div className="flex items-center justify-between border-b border-ink/[0.06] px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="flex gap-1.5">
              <span className="size-2.5 rounded-full bg-ink/15" />
              <span className="size-2.5 rounded-full bg-ink/15" />
              <span className="size-2.5 rounded-full bg-ink/15" />
            </span>
            <span className="ml-2 font-mono text-[11px] text-muted">agent-console</span>
          </div>
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-muted">
            <span className="size-1.5 animate-pulse-soft rounded-full bg-success" /> Illustration
          </span>
        </div>

        <svg viewBox="0 0 460 370" className="w-full">
          <defs>
            <linearGradient id="hv-line" x1="0" x2="1">
              <stop offset="0%" stopColor="var(--brand-secondary)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0.7" />
            </linearGradient>
            <radialGradient id="hv-core">
              <stop offset="0%" stopColor="var(--brand-primary)" stopOpacity="0.55" />
              <stop offset="100%" stopColor="var(--brand-primary)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {nodes.map((n, i) => (
            <g key={n.id}>
              <path id={`hv-p-${n.id}`} d={pathFor(n)} fill="none" stroke="url(#hv-line)" strokeWidth="1.2" />
              <path d={pathFor(n)} fill="none" stroke="var(--brand-primary-bright)" strokeOpacity="0.35" strokeWidth="1.2" strokeDasharray="3 9" className="animate-flow" />
              {!reduce && (
                <circle r="2.6" fill="var(--brand-secondary-bright)">
                  <animateMotion dur={`${2.4 + (i % 3) * 0.6}s`} begin={`${i * 0.35}s`} repeatCount="indefinite">
                    <mpath href={`#hv-p-${n.id}`} />
                  </animateMotion>
                </circle>
              )}
            </g>
          ))}

          <circle cx={center.x} cy={center.y} r="70" fill="url(#hv-core)" />
          <circle cx={center.x} cy={center.y} r="40" fill="none" stroke="var(--brand-primary)" strokeOpacity="0.35" className="animate-pulse-soft" />
          <circle cx={center.x} cy={center.y} r="28" fill="#0d0e15" stroke="var(--brand-primary-bright)" strokeOpacity="0.8" />

          {nodes.map((n) => (
            <g key={`${n.id}-node`}>
              <rect x={n.x - 34} y={n.y - 17} width="68" height="34" rx="10" fill="#0f1119" stroke="rgba(255,255,255,0.09)" />
              <foreignObject x={n.x - 34} y={n.y - 17} width="68" height="34">
                <div className="flex h-full items-center justify-center gap-1.5 text-[9.5px] text-fg/85">
                  <Icon name={n.icon} size={12} className="text-primary-bright" />
                  <span>{n.label}</span>
                </div>
              </foreignObject>
            </g>
          ))}
          <foreignObject x={center.x - 28} y={center.y - 28} width="56" height="56">
            <div className="flex h-full flex-col items-center justify-center text-white">
              <Icon name="bot" size={18} />
              <span className="mt-0.5 text-[8px] font-medium tracking-wide">AI AGENT</span>
            </div>
          </foreignObject>
        </svg>

        <div className="border-t border-ink/[0.06] px-4 py-3">
          <ul className="relative h-[84px] overflow-hidden font-mono text-[11px]">
            <AnimatePresence initial={false} mode="popLayout">
              {visible.map((e, i) => (
                <motion.li
                  key={tick + i}
                  layout
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: i === 0 ? 1 : 0.55 - i * 0.12, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.45 }}
                  className="flex h-7 items-center gap-2.5"
                >
                  <span className={`w-9 shrink-0 rounded bg-ink/[0.05] px-1 text-center text-[9.5px] ${e.tone}`}>{e.tag}</span>
                  <span className="truncate text-fg/80">{e.text}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </div>
  );
}
