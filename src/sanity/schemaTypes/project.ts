import { defineArrayMember, defineField, defineType } from "sanity";
import { CaseIcon } from "@sanity/icons/Case";

export const mockupOptions = [
  { title: "Phone chat — booking conversation", value: "whatsapp-clinic" },
  { title: "Phone chat — travel enquiry", value: "whatsapp-travel" },
  { title: "Browser — website with cards", value: "website-travel" },
];

export const project = defineType({
  name: "project",
  title: "Case study",
  type: "document",
  icon: CaseIcon,
  groups: [
    { name: "main", title: "Main", default: true },
    { name: "story", title: "Story" },
    { name: "media", title: "Images" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "main", validation: (r) => r.required().max(90) }),
    defineField({
      name: "slug",
      type: "slug",
      group: "main",
      description: "Web address of the case study, e.g. /work/your-slug",
      options: { source: "title", maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Display order", type: "number", group: "main", description: "Lower numbers appear first.", initialValue: 10 }),
    defineField({ name: "category", type: "string", group: "main", description: "e.g. AI Chatbot, Web Development", validation: (r) => r.required() }),
    defineField({ name: "industry", type: "string", group: "main", validation: (r) => r.required() }),
    defineField({ name: "clientName", title: "Client name", type: "string", group: "main" }),
    defineField({
      name: "showClientName",
      title: "Show client name publicly",
      type: "boolean",
      group: "main",
      description: "Only turn on if the client has given permission. Otherwise the site shows “Confidential”.",
      initialValue: false,
    }),
    defineField({ name: "summary", type: "text", rows: 3, group: "main", validation: (r) => r.required().max(320) }),
    defineField({ name: "challenge", type: "text", rows: 4, group: "story", validation: (r) => r.required() }),
    defineField({ name: "approach", type: "text", rows: 5, group: "story", validation: (r) => r.required() }),
    defineField({
      name: "features",
      title: "Features built",
      type: "array",
      group: "story",
      description: "List only features that were actually implemented and verified.",
      of: [
        defineArrayMember({
          type: "object",
          name: "feature",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "body", type: "text", rows: 2, validation: (r) => r.required() }),
          ],
        }),
      ],
      validation: (r) => r.min(1),
    }),
    defineField({ name: "stack", title: "Technologies", type: "array", group: "story", of: [{ type: "string" }], options: { layout: "tags" } }),
    defineField({ name: "flow", title: "How it works (steps)", type: "array", group: "story", of: [{ type: "string" }] }),
    defineField({
      name: "relatedService",
      title: "Related service area",
      type: "string",
      group: "main",
      options: {
        list: [
          { title: "AI Solutions", value: "ai-solutions" },
          { title: "Business Automation", value: "business-automation" },
          { title: "Web Development", value: "web-development" },
        ],
        layout: "radio",
      },
      validation: (r) => r.required(),
    }),
    defineField({
      name: "screenshots",
      title: "Real screenshots",
      type: "array",
      group: "media",
      description: "Upload real product screenshots. When present they replace the illustrative mockup. Hide confidential data first.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [defineField({ name: "alt", title: "Alt text", type: "string", validation: (r) => r.required() })],
        }),
      ],
    }),
    defineField({
      name: "mockup",
      title: "Illustrative mockup (used when there are no screenshots)",
      type: "string",
      group: "media",
      options: { list: mockupOptions, layout: "radio" },
      initialValue: "website-travel",
    }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "category" } },
});
