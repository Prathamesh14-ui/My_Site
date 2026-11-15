import { defineField, defineType } from "sanity";
import { EnvelopeIcon } from "@sanity/icons/Envelope";
import { ReplyButtons } from "../components/ReplyButtons";

export const enquiryStatuses = [
  { title: "🟢 New", value: "new" },
  { title: "💬 Contacted", value: "contacted" },
  { title: "📄 Proposal sent", value: "proposal" },
  { title: "🏆 Won", value: "won" },
  { title: "⚪ Lost / not a fit", value: "lost" },
];

const statusLabel = (v?: string) => enquiryStatuses.find((s) => s.value === v)?.title ?? "🟢 New";

/** Enquiries submitted through the website contact form. Visitor details are read-only. */
export const enquiry = defineType({
  name: "enquiry",
  title: "Enquiry",
  type: "document",
  icon: EnvelopeIcon,
  fields: [
    defineField({
      name: "reply",
      title: "Reply",
      type: "string",
      description: "Opens a pre-filled reply. After contacting them, update the status below.",
      components: { input: ReplyButtons },
    }),
    defineField({ name: "status", type: "string", options: { list: enquiryStatuses, layout: "radio", direction: "horizontal" }, initialValue: "new" }),
    defineField({ name: "notes", title: "Private notes", type: "text", rows: 4, description: "Only visible to you in the Studio." }),
    defineField({ name: "name", title: "Full name", type: "string", readOnly: true }),
    defineField({ name: "business", title: "Business name", type: "string", readOnly: true }),
    defineField({ name: "email", type: "string", readOnly: true }),
    defineField({ name: "whatsapp", title: "WhatsApp number", type: "string", readOnly: true }),
    defineField({ name: "service", title: "Service interested in", type: "string", readOnly: true }),
    defineField({ name: "budget", title: "Estimated budget", type: "string", readOnly: true }),
    defineField({ name: "message", title: "Project description", type: "text", rows: 8, readOnly: true }),
    defineField({ name: "submittedAt", title: "Submitted", type: "datetime", readOnly: true }),
    defineField({ name: "source", title: "Sent from page", type: "string", readOnly: true }),
  ],
  orderings: [{ title: "Newest first", name: "submittedDesc", by: [{ field: "submittedAt", direction: "desc" }] }],
  preview: {
    select: { name: "name", business: "business", service: "service", status: "status", submittedAt: "submittedAt" },
    prepare({ name, business, service, status, submittedAt }) {
      const date = submittedAt ? new Date(submittedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "";
      return {
        title: `${name ?? "Unknown"}${business ? ` · ${business}` : ""}`,
        subtitle: `${statusLabel(status)} · ${service ?? ""}${date ? ` · ${date}` : ""}`,
      };
    },
  },
});
