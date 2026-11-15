"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Send, RotateCcw, Sparkles, Info } from "lucide-react";
import { chatScenarios, type ChatMode, type ChatScenario } from "@/lib/chat-scenarios";
import { cn } from "@/lib/utils";

type Message = { id: number; role: "user" | "assistant"; content: string; mode?: ChatMode; error?: boolean };

let nextId = 1;

export function ChatDemo({ className }: { className?: string }) {
  const [scenario, setScenario] = useState<ChatScenario>("agency");
  const [mode, setMode] = useState<ChatMode | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let active = true;
    fetch("/api/chat", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { mode: ChatMode }) => active && setMode(d.mode))
      .catch(() => active && setMode("demo"));
    return () => {
      active = false;
      abortRef.current?.abort();
    };
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages]);

  function switchScenario(s: ChatScenario) {
    abortRef.current?.abort();
    setScenario(s);
    setMessages([]);
    setPending(false);
  }

  async function send(text: string) {
    const content = text.trim().slice(0, 1500);
    if (!content || pending) return;
    const userMsg: Message = { id: nextId++, role: "user", content };
    const history = [...messages.filter((m) => !m.error), userMsg];
    const botId = nextId++;
    setMessages([...messages, userMsg, { id: botId, role: "assistant", content: "" }]);
    setInput("");
    setPending(true);

    const controller = new AbortController();
    abortRef.current = controller;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario, messages: history.map(({ role, content }) => ({ role, content })) }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "The assistant is unavailable right now. Please try again.");
      }
      const replyMode = (res.headers.get("X-Chat-Mode") as ChatMode) || "demo";
      setMode(replyMode);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((prev) => prev.map((m) => (m.id === botId ? { ...m, content: acc, mode: replyMode } : m)));
      }
      if (!acc.trim()) throw new Error("The assistant returned an empty response. Please try again.");
    } catch (err) {
      if (controller.signal.aborted) return;
      const msg = err instanceof Error ? err.message : "Something went wrong.";
      setMessages((prev) => prev.map((m) => (m.id === botId ? { ...m, content: msg, error: true } : m)));
    } finally {
      if (abortRef.current === controller) setPending(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(input);
  }

  const config = chatScenarios[scenario];

  return (
    <div className={cn("glass relative flex h-[560px] flex-col overflow-hidden rounded-3xl shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)] sm:h-[600px]", className)}>
      {/* Header */}
      <div className="border-b border-white/[0.06] px-4 py-3.5 sm:px-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[linear-gradient(135deg,var(--brand-primary),var(--brand-secondary))] text-white">
              <Sparkles className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-fg">{config.label}</p>
              <p className="truncate text-xs text-muted">{config.description}</p>
            </div>
          </div>
          <ModeBadge mode={mode} />
        </div>
        <div role="group" aria-label="Demo scenario" className="mt-3.5 flex flex-wrap gap-1.5">
          {(Object.keys(chatScenarios) as ChatScenario[]).map((s) => (
            <button
              key={s}
              type="button"
              aria-pressed={s === scenario}
              onClick={() => switchScenario(s)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-xs transition-colors",
                s === scenario ? "bg-white/10 text-fg" : "text-muted hover:bg-white/[0.05] hover:text-fg",
              )}
            >
              {chatScenarios[s].label}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-5 sm:px-5" aria-live="polite" aria-busy={pending}>
        <Bubble role="assistant">{config.greeting}</Bubble>
        <AnimatePresence initial={false}>
          {messages.map((m) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }}>
              <Bubble role={m.role} error={m.error}>
                {m.content || <TypingDots />}
              </Bubble>
            </motion.div>
          ))}
        </AnimatePresence>
        {messages.length === 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {config.suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => void send(s)}
                className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-left text-xs text-primary-bright transition-colors hover:bg-primary/20"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="border-t border-white/[0.06] p-3 sm:p-4">
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <label htmlFor="chat-input" className="sr-only">
            Message the assistant
          </label>
          <input
            id="chat-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message…"
            maxLength={1500}
            autoComplete="off"
            className="input h-11 flex-1 rounded-full py-0"
          />
          <button
            type="submit"
            disabled={pending || !input.trim()}
            aria-label="Send message"
            className="grid size-11 shrink-0 place-items-center rounded-full bg-primary text-white transition-opacity disabled:opacity-40"
          >
            <Send className="size-4" aria-hidden="true" />
          </button>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={() => switchScenario(scenario)}
              aria-label="Restart conversation"
              className="grid size-11 shrink-0 place-items-center rounded-full border border-white/10 text-muted hover:text-fg"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
            </button>
          )}
        </form>
        <p className="mt-2.5 flex items-start gap-1.5 px-1 text-[11px] leading-snug text-muted">
          <Info className="mt-px size-3 shrink-0" aria-hidden="true" />
          {mode === "live"
            ? "Responses are generated by AI and may be imperfect. Demo scenarios are fictional; nothing is booked or sent. Don't share sensitive information."
            : "Demo mode: responses are pre-written scripts, not AI-generated. Scenarios are fictional; nothing is booked or sent."}
        </p>
      </div>
    </div>
  );
}

function ModeBadge({ mode }: { mode: ChatMode | null }) {
  if (!mode) return <span className="h-6 w-20 animate-pulse rounded-full bg-white/[0.06]" aria-hidden="true" />;
  return mode === "live" ? (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2.5 py-1 text-[11px] font-medium text-emerald-300">
      <span className="size-1.5 rounded-full bg-emerald-400" aria-hidden="true" /> Live AI
    </span>
  ) : (
    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-amber-300/25 bg-amber-300/10 px-2.5 py-1 text-[11px] font-medium text-amber-200" title="No AI backend configured — replies are scripted">
      <span className="size-1.5 rounded-full bg-amber-300" aria-hidden="true" /> Demo mode · scripted
    </span>
  );
}

function Bubble({ role, error, children }: { role: "user" | "assistant"; error?: boolean; children: ReactNode }) {
  return (
    <div className={cn("flex", role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[14px] leading-relaxed",
          role === "user"
            ? "rounded-br-md bg-[linear-gradient(135deg,var(--brand-primary),color-mix(in_oklab,var(--brand-primary)_60%,var(--brand-secondary)))] text-white"
            : error
              ? "rounded-bl-md border border-red-400/30 bg-red-500/10 text-red-200"
              : "rounded-bl-md border border-white/[0.07] bg-raised/80 text-fg/90",
        )}
      >
        <span className="sr-only">{role === "user" ? "You: " : "Assistant: "}</span>
        {children}
      </div>
    </div>
  );
}

function TypingDots() {
  return (
    <span className="inline-flex gap-1 py-1" aria-label="Assistant is typing">
      {[0, 1, 2].map((i) => (
        <span key={i} className="size-1.5 animate-bounce rounded-full bg-muted" style={{ animationDelay: `${i * 120}ms` }} />
      ))}
    </span>
  );
}
