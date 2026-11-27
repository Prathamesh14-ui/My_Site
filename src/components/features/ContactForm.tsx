"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { CircleCheck, CircleX, LoaderCircle, Mail } from "lucide-react";
import { siteConfig, whatsappLink } from "@/config/site";
import { FALLBACK_SERVICE_OPTION, budgetOptions, enquirySchema, fieldErrors, type EnquiryField } from "@/lib/enquiry";
import { ESTIMATE_STORAGE_KEY, type EstimateHandoff } from "@/lib/estimate";
import { Button } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icon";
import { cn } from "@/lib/utils";

type Status = { kind: "idle" } | { kind: "submitting" } | { kind: "success" } | { kind: "error"; message: string };

const initial = { name: "", business: "", email: "", whatsapp: "", service: "", budget: "", message: "", website: "" };

export function ContactForm({ serviceOptions }: { serviceOptions: string[] }) {
  const [values, setValues] = useState(initial);
  const [consent, setConsent] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<EnquiryField, string>>>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [prefilled, setPrefilled] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // Prefill from the estimator hand-off or a ?service= link.
  useEffect(() => {
    let service = "";
    let message = "";
    try {
      const raw = sessionStorage.getItem(ESTIMATE_STORAGE_KEY);
      if (raw) {
        const data = JSON.parse(raw) as EstimateHandoff;
        service = data.service;
        message = data.summary;
      }
    } catch {
      /* storage unavailable — ignore */
    }
    const qs = new URLSearchParams(window.location.search).get("service");
    if (qs && serviceOptions.includes(qs)) service = qs;
    if (service && !serviceOptions.includes(service)) service = FALLBACK_SERVICE_OPTION;
    if (service || message) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration from browser-only storage
      setValues((v) => ({ ...v, service: service || v.service, message: message || v.message }));
      setPrefilled(Boolean(message));
    }
  }, [serviceOptions]);

  function update(field: keyof typeof initial, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
    if (errors[field as EnquiryField]) setErrors((e) => ({ ...e, [field]: undefined }));
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (status.kind === "submitting") return;
    const payload = { ...values, consent };
    const parsed = enquirySchema.safeParse(payload);
    if (!parsed.success) {
      const errs = fieldErrors(parsed.error);
      setErrors(errs);
      const first = Object.keys(errs)[0];
      formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setErrors({});
    setStatus({ kind: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, source: window.location.pathname }),
      });
      const data = (await res.json().catch(() => null)) as { ok?: boolean; error?: string; fields?: Partial<Record<EnquiryField, string>> } | null;
      if (res.ok && data?.ok === true) {
        setStatus({ kind: "success" });
        setValues(initial);
        setConsent(false);
        try {
          sessionStorage.removeItem(ESTIMATE_STORAGE_KEY);
        } catch {}
      } else {
        if (data?.fields) setErrors(data.fields);
        setStatus({ kind: "error", message: data?.error || "We couldn't send your enquiry. Please try again or contact us directly." });
      }
    } catch {
      setStatus({ kind: "error", message: "Network error — please check your connection and try again, or contact us directly." });
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  if (status.kind === "success") {
    return (
      <motion.div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card flex flex-col items-center px-6 py-16 text-center outline-none"
      >
        <span className="grid size-14 place-items-center rounded-full bg-success/15 text-success">
          <CircleCheck className="size-7" aria-hidden="true" />
        </span>
        <h2 className="mt-6 text-2xl font-semibold text-fg">Thank you — your enquiry has been sent.</h2>
        <p className="mt-3 max-w-md text-muted">{siteConfig.contact.responseTime} If it&apos;s urgent, message us on WhatsApp.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button variant="secondary" onClick={() => setStatus({ kind: "idle" })}>
            Send another enquiry
          </Button>
          <Link href="/work" className="inline-flex h-11 items-center justify-center rounded-full px-5 text-sm text-primary-bright hover:text-fg">
            See our work →
          </Link>
        </div>
      </motion.div>
    );
  }

  const submitting = status.kind === "submitting";

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="card space-y-6 p-6 sm:p-8" aria-describedby="form-note">
      {prefilled && (
        <p className="rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm text-primary-bright">
          We&apos;ve added your estimator summary to the project description — feel free to edit it.
        </p>
      )}
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Full name" name="name" required error={errors.name}>
          <input id="name" name="name" autoComplete="name" value={values.name} onChange={(e) => update("name", e.target.value)} className="input" {...aria("name", errors.name)} />
        </Field>
        <Field label="Business name" name="business" error={errors.business}>
          <input id="business" name="business" autoComplete="organization" value={values.business} onChange={(e) => update("business", e.target.value)} className="input" {...aria("business", errors.business)} />
        </Field>
        <Field label="Email" name="email" required error={errors.email}>
          <input id="email" name="email" type="email" inputMode="email" autoComplete="email" value={values.email} onChange={(e) => update("email", e.target.value)} className="input" {...aria("email", errors.email)} />
        </Field>
        <Field label="WhatsApp number" name="whatsapp" error={errors.whatsapp} hint="Include country code, e.g. +91">
          <input id="whatsapp" name="whatsapp" type="tel" inputMode="tel" autoComplete="tel" placeholder="+91 98XXX XXXXX" value={values.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} className="input" {...aria("whatsapp", errors.whatsapp, true)} />
        </Field>
        <Field label="Service interested in" name="service" required error={errors.service}>
          <select id="service" name="service" value={values.service} onChange={(e) => update("service", e.target.value)} className="input appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 fill=%22none%22 stroke=%22%239BA1B4%22 stroke-width=%222%22><path d=%22M2 4l4 4 4-4%22/></svg>')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10" {...aria("service", errors.service)}>
            <option value="">Select a service…</option>
            {serviceOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>
        <Field label="Estimated budget" name="budget" required error={errors.budget}>
          <select id="budget" name="budget" value={values.budget} onChange={(e) => update("budget", e.target.value)} className="input appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%2212%22 fill=%22none%22 stroke=%22%239BA1B4%22 stroke-width=%222%22><path d=%22M2 4l4 4 4-4%22/></svg>')] bg-[length:12px] bg-[right_1rem_center] bg-no-repeat pr-10" {...aria("budget", errors.budget)}>
            <option value="">Select a range…</option>
            {budgetOptions.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Project description" name="message" required error={errors.message} hint="What problem are you trying to solve? Mention tools you use today.">
        <textarea id="message" name="message" rows={6} value={values.message} onChange={(e) => update("message", e.target.value)} className="input resize-y" maxLength={4000} {...aria("message", errors.message, true)} />
      </Field>

      {/* Honeypot (hidden from people) */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="website">Website</label>
        <input id="website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => update("website", e.target.value)} />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-muted">
          <input
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(e) => {
              setConsent(e.target.checked);
              if (errors.consent) setErrors((er) => ({ ...er, consent: undefined }));
            }}
            className="mt-0.5 size-4 shrink-0 accent-[var(--brand-primary)]"
            aria-invalid={Boolean(errors.consent)}
            aria-describedby={errors.consent ? "consent-error" : undefined}
          />
          <span>
            I agree that {siteConfig.name} may use these details to respond to my enquiry. See our{" "}
            <Link href="/privacy" className="text-primary-bright underline underline-offset-4 hover:decoration-2">privacy notice</Link>.
          </span>
        </label>
        {errors.consent && <p id="consent-error" className="mt-2 text-sm text-danger">{errors.consent}</p>}
      </div>

      <AnimatePresence>
        {status.kind === "error" && (
          <motion.div
            ref={statusRef}
            tabIndex={-1}
            role="alert"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-xl border border-danger/30 bg-danger/10 p-4 text-sm text-danger outline-none"
          >
            <p className="flex items-start gap-2.5">
              <CircleX className="mt-0.5 size-4 shrink-0" aria-hidden="true" /> {status.message}
            </p>
            <div className="mt-3 flex flex-wrap gap-4 pl-6.5">
              <a href={`mailto:${siteConfig.contact.email}`} className="inline-flex items-center gap-1.5 font-medium text-fg hover:underline">
                <Mail className="size-4" aria-hidden="true" /> {siteConfig.contact.email}
              </a>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-medium text-fg hover:underline">
                <WhatsAppIcon size={16} /> WhatsApp us
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col-reverse gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id="form-note" className="text-xs text-muted">Fields marked * are required. {siteConfig.contact.responseTime}</p>
        <Button type="submit" size="lg" disabled={submitting} aria-busy={submitting} className="w-full sm:w-auto">
          {submitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden="true" /> Sending…
            </>
          ) : (
            "Send enquiry"
          )}
        </Button>
      </div>
    </form>
  );
}

function aria(name: string, error?: string, hasHint = false) {
  const ids = [error ? `${name}-error` : null, hasHint && !error ? `${name}-hint` : null].filter(Boolean).join(" ");
  return { "aria-invalid": Boolean(error), "aria-describedby": ids || undefined };
}

function Field({
  label,
  name,
  required,
  error,
  hint,
  children,
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn(name === "message" && "sm:col-span-2")}>
      <label htmlFor={name} className="mb-2 block text-sm font-medium text-fg/90">
        {label}
        {required && <span className="text-primary-bright"> *</span>}
      </label>
      {children}
      {hint && !error && (
        <p id={`${name}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${name}-error`} className="mt-1.5 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
