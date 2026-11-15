import { defineArrayMember, defineField, defineType } from "sanity";
import { ComponentIcon } from "@sanity/icons/Component";
import { iconNames } from "@/components/ui/icon-names";

const iconField = defineField({
  name: "icon",
  type: "string",
  options: { list: iconNames.map((n) => ({ title: n, value: n })) },
  initialValue: "sparkles",
  validation: (r) => r.required(),
});

const stringList = (name: string, title: string, description?: string) =>
  defineField({ name, title, description, type: "array", of: [{ type: "string" }] });

export const serviceCategory = defineType({
  name: "serviceCategory",
  title: "Service area",
  type: "document",
  icon: ComponentIcon,
  groups: [
    { name: "main", title: "Main", default: true },
    { name: "page", title: "Page content" },
    { name: "services", title: "Services" },
  ],
  fields: [
    defineField({ name: "title", type: "string", group: "main", validation: (r) => r.required() }),
    defineField({ name: "shortTitle", title: "Short title", type: "string", group: "main", description: "Used in buttons, e.g. “Automation”.", validation: (r) => r.required() }),
    defineField({
      name: "slug",
      type: "slug",
      group: "main",
      description: "Web address, e.g. /services/your-slug. Changing it breaks existing links.",
      options: { source: "title" },
      validation: (r) => r.required(),
    }),
    defineField({ name: "order", title: "Display order", type: "number", group: "main", initialValue: 10 }),
    { ...iconField, group: "main" },
    defineField({ name: "eyebrow", title: "Small label above headings", type: "string", group: "main" }),
    defineField({ name: "tagline", type: "string", group: "main", validation: (r) => r.required() }),
    defineField({ name: "intro", type: "text", rows: 3, group: "main", validation: (r) => r.required() }),
    defineField({ name: "seoDescription", title: "SEO description", type: "text", rows: 2, group: "main", validation: (r) => r.max(170) }),
    defineField({
      name: "visual",
      type: "string",
      group: "page",
      options: {
        list: [
          { title: "AI agent network", value: "agent" },
          { title: "Workflow steps", value: "workflow" },
          { title: "Website browser", value: "browser" },
        ],
        layout: "radio",
      },
      initialValue: "agent",
    }),
    defineField({
      name: "problem",
      title: "Business problem",
      type: "object",
      group: "page",
      fields: [defineField({ name: "title", type: "string" }), stringList("points", "Points")],
    }),
    defineField({
      name: "solution",
      title: "Our solution",
      type: "object",
      group: "page",
      fields: [defineField({ name: "title", type: "string" }), defineField({ name: "body", type: "text", rows: 3 }), stringList("points", "Points")],
    }),
    { ...stringList("capabilities", "Key capabilities"), group: "page" },
    defineField({
      name: "useCases",
      title: "Use cases",
      type: "array",
      group: "page",
      of: [
        defineArrayMember({
          type: "object",
          name: "useCase",
          fields: [
            defineField({ name: "industry", type: "string" }),
            defineField({ name: "title", type: "string" }),
            defineField({ name: "body", type: "text", rows: 2 }),
          ],
        }),
      ],
    }),
    defineField({
      name: "benefits",
      type: "array",
      group: "page",
      of: [
        defineArrayMember({
          type: "object",
          name: "benefit",
          fields: [defineField({ name: "title", type: "string" }), defineField({ name: "body", type: "text", rows: 2 })],
        }),
      ],
    }),
    defineField({
      name: "services",
      type: "array",
      group: "services",
      description: "Each service gets its own page at /services/<area>/<service>.",
      of: [
        defineArrayMember({
          type: "object",
          name: "subService",
          fields: [
            defineField({ name: "title", type: "string", validation: (r) => r.required() }),
            defineField({ name: "slug", type: "slug", options: { source: (_doc, ctx) => (ctx.parent as { title?: string })?.title ?? "" }, validation: (r) => r.required() }),
            iconField,
            defineField({ name: "summary", type: "text", rows: 2, validation: (r) => r.required() }),
            defineField({ name: "problem", type: "text", rows: 2 }),
            defineField({ name: "solution", type: "text", rows: 2 }),
            stringList("capabilities", "Capabilities"),
            stringList("useCases", "Use cases"),
            defineField({ name: "idealFor", title: "Ideal for", type: "string" }),
          ],
          preview: { select: { title: "title", subtitle: "summary" } },
        }),
      ],
    }),
  ],
  orderings: [{ title: "Display order", name: "orderAsc", by: [{ field: "order", direction: "asc" }] }],
  preview: { select: { title: "title", subtitle: "tagline" } },
});
