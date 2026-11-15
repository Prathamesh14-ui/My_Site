"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Play, Pause, RotateCcw, SkipForward, Check } from "lucide-react";
import { Icon, type IconName } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Step = { title: string; tool: string; icon: IconName; log: string };

const scenarios: Record<string, { label: string; steps: Step[] }> = {
  clinic: {
    label: "Clinic booking",
    steps: [
      { title: "Customer sends a message", tool: "WhatsApp", icon: "whatsapp", log: "“Hi, can I book a check-up on Thursday evening?”" },
      { title: "AI agent understands", tool: "AI agent", icon: "bot", log: "intent = book_appointment · day = Thursday · time = evening" },
      { title: "Checks availability", tool: "Google Calendar", icon: "calendar", log: "Free slots found: 5:30 PM, 6:15 PM → offered to patient" },
      { title: "Books the appointment", tool: "n8n workflow", icon: "calendarCheck", log: "Patient chose 5:30 PM → calendar event created" },
      { title: "Sends confirmation", tool: "WhatsApp", icon: "check", log: "“You're booked for Thursday, 5:30 PM. See you then!”" },
    ],
  },
  leads: {
    label: "Lead capture",
    steps: [
      { title: "New lead arrives", tool: "Website form", icon: "globe", log: "Enquiry: 3BHK, budget range, wants a site visit" },
      { title: "AI qualifies the lead", tool: "AI agent", icon: "bot", log: "Requirements extracted · priority = high" },
      { title: "Creates CRM record", tool: "CRM", icon: "users", log: "Contact + deal created, source = website" },
      { title: "Alerts the sales team", tool: "WhatsApp", icon: "whatsapp", log: "Assigned agent notified with lead summary" },
      { title: "Sends follow-up", tool: "Email", icon: "messages", log: "Acknowledgement sent to the lead automatically" },
    ],
  },
  travel: {
    label: "Travel enquiry",
    steps: [
      { title: "Traveller asks a question", tool: "WhatsApp", icon: "whatsapp", log: "“Family trip to the mountains in December?”" },
      { title: "AI interprets the request", tool: "AI agent", icon: "bot", log: "type = family · season = December · theme = mountains" },
      { title: "Finds matching packages", tool: "Package data", icon: "database", log: "2 matching packages retrieved" },
      { title: "Shares the itinerary", tool: "WhatsApp", icon: "messages", log: "Day-by-day itinerary sent in chat" },
      { title: "Logs the enquiry", tool: "n8n workflow", icon: "workflow", log: "Enquiry saved for the travel team to follow up" },
    ],
  },
};

type ScenarioKey = keyof typeof scenarios;

export function WorkflowVisualizer() {
  const reduce = useReducedMotion();
  const [key, setKey] = useState<ScenarioKey>("clinic");
  const [active, setActive] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const steps = scenarios[key].steps;
  const finished = active >= steps.length - 1;

  const running = playing && !finished;

  useEffect(() => {
    if (!running) return;
    const id = setTimeout(() => setActive((a) => a + 1), active === -1 ? 250 : reduce ? 900 : 1500);
    return () => clearTimeout(id);
  }, [running, active, reduce]);

  const play = () => {
    if (finished) setActive(-1);
    setPlaying(true);
  };
  const reset = () => {
    setPlaying(false);
    setActive(-1);
  };
  const step = () => {
    setPlaying(false);
    setActive((a) => (a >= steps.length - 1 ? 0 : a + 1));
  };
  const choose = (k: ScenarioKey) => {
    setKey(k);
    setActive(-1);
    setPlaying(false);
  };

  return (
    <div className="card overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-col gap-4 border-b border-ink/[0.06] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div role="group" aria-label="Workflow scenario" className="flex flex-wrap gap-1.5">
          {(Object.keys(scenarios) as ScenarioKey[]).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={k === key}
              onClick={() => choose(k)}
              className={cn(
                "shrink-0 rounded-full px-3.5 py-2 text-sm transition-colors",
                k === key ? "bg-ink/10 text-fg" : "text-muted hover:bg-ink/[0.05] hover:text-fg",
              )}
            >
              {scenarios[k].label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <span className="mr-2 hidden font-mono text-[10px] uppercase tracking-wider text-muted lg:inline">Simulation</span>
          <button
            type="button"
            onClick={running ? () => setPlaying(false) : play}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-medium text-white"
          >
            {running ? <Pause className="size-4" aria-hidden="true" /> : <Play className="size-4" aria-hidden="true" />}
            {running ? "Pause" : finished ? "Replay" : active >= 0 ? "Resume" : "Run workflow"}
          </button>
          <button type="button" onClick={step} aria-label="Next step" className="grid size-10 place-items-center rounded-full border border-ink/10 text-muted hover:text-fg">
            <SkipForward className="size-4" aria-hidden="true" />
          </button>
          <button type="button" onClick={reset} aria-label="Reset workflow" className="grid size-10 place-items-center rounded-full border border-ink/10 text-muted hover:text-fg">
            <RotateCcw className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Nodes */}
      <div className="relative px-4 py-8 sm:px-6 lg:py-12">
        <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-0 opacity-50" />
        <ol className="relative flex flex-col gap-0 lg:flex-row lg:items-stretch">
          {steps.map((s, i) => {
            const state = i < active ? "done" : i === active ? "active" : "idle";
            return (
              <li key={`${key}-${i}`} className="flex flex-col lg:min-w-0 lg:flex-1 lg:flex-row lg:items-stretch">
                <motion.div
                  animate={{ scale: state === "active" && !reduce ? 1.03 : 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 22 }}
                  className={cn(
                    "relative flex items-center gap-4 rounded-2xl border p-4 transition-colors duration-500 lg:h-full lg:w-full lg:flex-col lg:items-start lg:gap-3",
                    state === "active" && "border-primary/60 bg-primary/10 shadow-[0_0_40px_-10px_var(--brand-primary)]",
                    state === "done" && "border-secondary/35 bg-secondary/[0.06]",
                    state === "idle" && "border-ink/[0.07] bg-bg/70",
                  )}
                  aria-current={state === "active" ? "step" : undefined}
                >
                  <span
                    className={cn(
                      "grid size-11 shrink-0 place-items-center rounded-xl border transition-colors duration-500",
                      state === "idle" ? "border-ink/10 text-muted" : "border-transparent bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))] text-white",
                    )}
                  >
                    {state === "done" ? <Check className="size-5" aria-hidden="true" /> : <Icon name={s.icon} size={20} />}
                  </span>
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-wider text-muted">{s.tool}</p>
                    <p className={cn("mt-0.5 text-sm font-medium leading-snug", state === "idle" ? "text-fg/70" : "text-fg")}>{s.title}</p>
                  </div>
                  <span className="sr-only">{state === "done" ? "(completed)" : state === "active" ? "(in progress)" : "(pending)"}</span>
                </motion.div>
                {i < steps.length - 1 && <Connector filled={i < active} />}
              </li>
            );
          })}
        </ol>
      </div>

      {/* Log */}
      <div className="border-t border-ink/[0.06] bg-bg/50 p-4 font-mono text-[12px] sm:px-6">
        <p className="mb-2 text-[10px] uppercase tracking-wider text-muted">Execution log</p>
        <ul className="min-h-[112px] space-y-1.5" aria-live="polite">
          {active < 0 && <li className="text-muted">Press “Run workflow” to start the simulation.</li>}
          <AnimatePresence initial={false}>
            {steps.slice(0, active + 1).map((s, i) => (
              <motion.li
                key={`${key}-log-${i}`}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-3"
              >
                <span className="shrink-0 text-secondary-bright">[{String(i + 1).padStart(2, "0")}]</span>
                <span className="shrink-0 text-primary-bright">{s.tool}</span>
                <span className="text-fg/80">{s.log}</span>
              </motion.li>
            ))}
          </AnimatePresence>
          {finished && (
            <li className="pt-1 text-success">✓ Workflow completed — no manual steps required.</li>
          )}
        </ul>
      </div>
    </div>
  );
}

function Connector({ filled }: { filled: boolean }) {
  return (
    <div aria-hidden="true" className="relative mx-auto h-8 w-px lg:mx-2 lg:h-px lg:w-8 lg:shrink-0 lg:self-center">
      <div className="absolute inset-0 bg-ink/10" />
      <motion.div
        className="absolute inset-0 origin-top bg-[linear-gradient(var(--brand-primary),var(--brand-secondary))] lg:origin-left lg:bg-[linear-gradient(90deg,var(--brand-primary),var(--brand-secondary))]"
        initial={false}
        animate={{ scale: filled ? 1 : 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      />
    </div>
  );
}
