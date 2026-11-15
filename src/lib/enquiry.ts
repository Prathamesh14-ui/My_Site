import { z } from "zod";
import { allServiceOptions } from "@/content/services";

/** Budget options shown on the contact form (visitor's budget, not our pricing). */
export const budgetOptions = [
  "Not sure yet",
  "Under ₹1 lakh",
  "₹1 – 3 lakh",
  "₹3 – 7 lakh",
  "₹7 lakh+",
  "International project (USD/EUR) — let's discuss",
] as const;

export const serviceInterestOptions = [
  ...allServiceOptions.map((o) => o.value),
  "Multiple services / not sure",
] as const;

const phoneRegex = /^\+?[0-9\s\-()]{7,20}$/;

export const enquirySchema = z.object({
  name: z.string({ error: "Please enter your full name." }).trim().min(2, "Please enter your full name.").max(100, "Name is too long."),
  business: z.string().trim().max(120, "Business name is too long.").optional().default(""),
  email: z.string({ error: "Please enter a valid email address." }).trim().max(200).pipe(z.email("Please enter a valid email address.")),
  whatsapp: z
    .string()
    .trim()
    .max(20)
    .refine((v) => v === "" || phoneRegex.test(v), "Please enter a valid number, including country code.")
    .optional()
    .default(""),
  service: z.string({ error: "Please choose a service." }).trim().min(1, "Please choose a service.").max(120),
  budget: z.string({ error: "Please choose a budget range." }).trim().min(1, "Please choose a budget range.").max(80),
  message: z.string({ error: "Please describe your project." }).trim().min(20, "Please tell us a little more (at least 20 characters).").max(4000, "Message is too long (max 4,000 characters)."),
  consent: z.literal(true, { error: "Please agree so we can respond to your enquiry." }),
  /** Honeypot — must stay empty. */
  website: z.string().max(0).optional().default(""),
});

export type EnquiryInput = z.input<typeof enquirySchema>;
export type Enquiry = z.output<typeof enquirySchema>;
export type EnquiryField = keyof EnquiryInput;

export function fieldErrors(error: z.ZodError): Partial<Record<EnquiryField, string>> {
  const out: Partial<Record<EnquiryField, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as EnquiryField | undefined;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
