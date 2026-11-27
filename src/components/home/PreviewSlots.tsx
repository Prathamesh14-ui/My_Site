/**
 * PREVIEW-ONLY placeholders for the founder section and a client testimonial.
 * They show where real content would go. Replace with real details before publishing — never ship as is.
 */
import { Quote } from "lucide-react";
import { Section } from "@/components/ui/Section";

function PlaceholderTag() {
  return (
    <span className="label inline-block rounded-md border border-dashed border-warning/60 px-2 py-1 text-[10px] text-warning">
      Preview placeholder — needs your real details
    </span>
  );
}

export function FounderSlot() {
  return (
    <Section labelledBy="founder-title" className="border-y border-line bg-surface">
      <div className="grid gap-10 md:grid-cols-[260px_1fr] md:items-center lg:gap-16">
        <div className="grid aspect-[4/5] w-full max-w-[260px] place-items-center rounded-2xl border-2 border-dashed border-ink/15 bg-bg text-center text-sm text-muted">
          <span>
            Your photo
            <br />
            <span className="text-xs">(professional headshot)</span>
          </span>
        </div>
        <div>
          <div>
            <PlaceholderTag />
          </div>
          <p className="eyebrow mt-5 mb-3">Who you&apos;ll work with</p>
          <h2 id="founder-title" className="text-3xl leading-tight text-fg sm:text-4xl">
            [Your name], Founder
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted">
            [2–3 lines in your own words: your background, what you build, and why clients can trust you. For example: how you started, the kind of businesses you help, and how you work with them.]
          </p>
          <p className="mt-4 text-sm text-muted">Mumbai, India · Working with clients in India and internationally</p>
        </div>
      </div>
    </Section>
  );
}

export function TestimonialSlot() {
  return (
    <Section labelledBy="testimonial-title" className="pt-0 sm:pt-0 lg:pt-0">
      <h2 id="testimonial-title" className="sr-only">Client feedback</h2>
      <figure className="mx-auto max-w-3xl rounded-2xl border border-dashed border-ink/15 p-8 text-center sm:p-12">
        <div>
          <PlaceholderTag />
        </div>
        <Quote className="mx-auto mt-6 size-8 text-primary-bright" aria-hidden="true" />
        <blockquote className="mt-5 text-xl leading-relaxed text-fg sm:text-2xl">
          [A short, real quote from your S2 Holidays client about working with you.]
        </blockquote>
        <figcaption className="mt-6 text-sm text-muted">[Client name], [Role] — S2 Holidays</figcaption>
      </figure>
    </Section>
  );
}
