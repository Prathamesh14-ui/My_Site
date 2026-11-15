import { CheckCheck, MapPin, Lock, Search } from "lucide-react";
import type { MockupKind } from "@/content/types";
import { cn } from "@/lib/utils";

export function MockupLabel({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-amber-300/20 bg-amber-300/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-amber-200/90",
        className,
      )}
    >
      Illustrative mockup
    </span>
  );
}

type Msg = { from: "user" | "bot"; text: string; meta?: string };

const conversations: Record<"whatsapp-clinic" | "whatsapp-travel", { title: string; subtitle: string; messages: Msg[] }> = {
  "whatsapp-clinic": {
    title: "Clinic Assistant",
    subtitle: "AI assistant · online",
    messages: [
      { from: "user", text: "Hi, I'd like to book an appointment for Thursday evening." },
      { from: "bot", text: "Sure! Thursday has 5:30 PM and 6:15 PM available. Which works for you?" },
      { from: "user", text: "5:30 please" },
      { from: "bot", text: "I've sent a 6-digit code to verify your number. Please reply with it." },
      { from: "user", text: "482913" },
      { from: "bot", text: "Verified ✓ Your appointment is booked for Thursday, 5:30 PM. A confirmation has been sent.", meta: "Booked in Google Calendar" },
    ],
  },
  "whatsapp-travel": {
    title: "Travel Assistant",
    subtitle: "AI assistant · online",
    messages: [
      { from: "user", text: "Any family packages for the mountains in December?" },
      { from: "bot", text: "Here are two options that fit a December family trip — a 5-night hill-station package and a 6-night scenic circuit. Shall I share the itinerary?" },
      { from: "user", text: "Yes, the 5-night one" },
      { from: "bot", text: "Day 1: Arrival & check-in · Day 2: Sightseeing tour · Day 3: Day excursion… Want me to pass your enquiry to our travel team?" },
    ],
  },
};

export function PhoneChatMockup({ kind, className }: { kind: "whatsapp-clinic" | "whatsapp-travel"; className?: string }) {
  const convo = conversations[kind];
  return (
    <div
      role="img"
      aria-label={`Illustrative mockup of a WhatsApp conversation with the ${convo.title}`}
      className={cn("relative mx-auto w-full max-w-[300px] rounded-[2.2rem] border border-white/10 bg-[#0c0d12] p-2.5 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]", className)}
    >
      <div className="overflow-hidden rounded-[1.8rem] border border-white/[0.06] bg-surface">
        <div className="flex items-center gap-3 border-b border-white/[0.06] bg-raised px-4 pb-3 pt-5">
          <span className="grid size-9 place-items-center rounded-full bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))] text-xs font-semibold text-white">AI</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-fg">{convo.title}</p>
            <p className="text-[11px] text-emerald-400/90">{convo.subtitle}</p>
          </div>
        </div>
        <div className="space-y-2.5 px-3 py-4 text-[12.5px] leading-snug" aria-hidden="true">
          {convo.messages.map((m, i) => (
            <div key={i} className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[82%] rounded-2xl px-3 py-2",
                  m.from === "user" ? "rounded-br-md bg-primary/80 text-white" : "rounded-bl-md border border-white/[0.06] bg-raised text-fg/90",
                )}
              >
                {m.text}
                {m.meta && (
                  <span className="mt-1.5 flex items-center gap-1 text-[10.5px] text-secondary-bright">
                    <CheckCheck className="size-3" /> {m.meta}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function BrowserMockup({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Illustrative mockup of a travel package website with dynamic package cards"
      className={cn("w-full overflow-hidden rounded-2xl border border-white/10 bg-[#0c0d12] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]", className)}
    >
      <div className="flex items-center gap-3 border-b border-white/[0.06] bg-raised px-4 py-2.5" aria-hidden="true">
        <span className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
          <span className="size-2.5 rounded-full bg-white/15" />
        </span>
        <span className="flex flex-1 items-center gap-1.5 truncate rounded-md bg-bg/70 px-2.5 py-1 font-mono text-[10.5px] text-muted">
          <Lock className="size-3" /> travel-website / packages
        </span>
      </div>
      <div className="p-4 sm:p-5" aria-hidden="true">
        <div className="relative overflow-hidden rounded-xl bg-[radial-gradient(120%_120%_at_0%_0%,color-mix(in_oklab,var(--brand-secondary)_45%,transparent),transparent_60%),radial-gradient(120%_120%_at_100%_100%,color-mix(in_oklab,var(--brand-primary)_45%,transparent),transparent_60%)] p-5">
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/60">Curated holidays</p>
          <p className="mt-2 max-w-[16rem] text-lg font-semibold leading-tight text-white">Discover your next journey</p>
          <div className="mt-4 flex max-w-xs items-center gap-2 rounded-lg bg-black/40 px-3 py-2 text-[11px] text-white/70">
            <Search className="size-3.5" /> Search destinations
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3">
          {["Hill escape", "Coastal week", "Heritage tour"].map((t, i) => (
            <div key={t} className="overflow-hidden rounded-lg border border-white/[0.06] bg-raised">
              <div
                className="h-14 sm:h-16"
                style={{
                  background: `linear-gradient(${140 + i * 40}deg, color-mix(in oklab, var(--brand-primary) ${30 + i * 10}%, #0b0c12), color-mix(in oklab, var(--brand-secondary) ${40 - i * 8}%, #0b0c12))`,
                }}
              />
              <div className="p-2">
                <p className="truncate text-[10.5px] font-medium text-fg/90">{t}</p>
                <p className="mt-0.5 flex items-center gap-1 text-[9.5px] text-muted">
                  <MapPin className="size-2.5" /> Package · CMS
                </p>
                <span className="mt-2 block rounded bg-primary/25 py-1 text-center text-[9.5px] text-primary-bright">Enquire</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectMockup({ kind, className }: { kind: MockupKind; className?: string }) {
  if (kind === "website-travel") return <BrowserMockup className={className} />;
  return <PhoneChatMockup kind={kind} className={className} />;
}
