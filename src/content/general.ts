import type { IconName } from "@/components/ui/Icon";

export const navigation = [
  { label: "Services", href: "/services" },
  { label: "Work", href: "/work" },
  { label: "Estimate", href: "/estimate" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export const industries = [
  "Startups",
  "SMEs",
  "Clinics & healthcare",
  "Travel agencies",
  "Real estate",
  "Entrepreneurs",
  "International businesses",
];

export const processSteps: { title: string; body: string; icon: IconName; deliverable: string }[] = [
  { title: "Discover", body: "A free consultation to understand your business, goals and the processes that cost you the most time.", icon: "search", deliverable: "Clear problem statement" },
  { title: "Design", body: "We map the solution — conversation flows, workflows or page structure — and agree scope, timeline and cost in writing.", icon: "pen", deliverable: "Solution blueprint & proposal" },
  { title: "Build", body: "Iterative development with regular demos, so you see working progress rather than waiting for a big reveal.", icon: "code", deliverable: "Working system in staging" },
  { title: "Test", body: "We test real scenarios, edge cases and failure paths before anything reaches your customers.", icon: "shield", deliverable: "Tested, approved release" },
  { title: "Launch & improve", body: "Deployment, handover documentation and ongoing support to refine the system as you learn from real usage.", icon: "rocket", deliverable: "Live system + documentation" },
];

export const whyUs: { title: string; body: string; icon: IconName }[] = [
  { title: "Business problems first", body: "We start with the process you want to improve, not the technology we want to use.", icon: "target" },
  { title: "AI, automation and web under one roof", body: "Your website, chatbot and workflows are designed to work together — no hand-offs between vendors.", icon: "layers" },
  { title: "Practical, working technology", body: "We ship systems that run in production with error handling, monitoring and documentation.", icon: "check" },
  { title: "Security by default", body: "API keys stay server-side, data access is scoped, and sensitive actions get verification steps.", icon: "lock" },
  { title: "You own what we build", body: "Code, workflows and accounts are yours. No lock-in, clear handover.", icon: "key" },
  { title: "Clear communication", body: "Written scopes, regular demos and honest timelines — from Mumbai, working with clients anywhere.", icon: "messages" },
];

export const technologies: { name: string; group: "AI" | "Automation" | "Web" | "Channels" }[] = [
  { name: "OpenAI", group: "AI" },
  { name: "Anthropic Claude", group: "AI" },
  { name: "Google Gemini", group: "AI" },
  { name: "RAG / Vector DBs", group: "AI" },
  { name: "n8n", group: "Automation" },
  { name: "Webhooks & REST APIs", group: "Automation" },
  { name: "Google Calendar", group: "Automation" },
  { name: "Google Sheets", group: "Automation" },
  { name: "CRMs", group: "Automation" },
  { name: "Next.js", group: "Web" },
  { name: "React", group: "Web" },
  { name: "TypeScript", group: "Web" },
  { name: "Tailwind CSS", group: "Web" },
  { name: "Sanity CMS", group: "Web" },
  { name: "Node.js", group: "Web" },
  { name: "WhatsApp Business", group: "Channels" },
  { name: "Website chat", group: "Channels" },
  { name: "Email", group: "Channels" },
];

export const faqs: { q: string; a: string }[] = [
  {
    q: "What kinds of businesses do you work with?",
    a: "Startups, small and medium-sized businesses, clinics and healthcare providers, travel agencies, real estate companies and entrepreneurs — in India and internationally. If your team repeats the same tasks every day or your website isn't generating enquiries, we can probably help.",
  },
  {
    q: "Is an AI chatbot different from a normal chatbot?",
    a: "Yes. Traditional chatbots follow fixed menus. AI chatbots understand free-text messages, answer from your business knowledge and can perform actions such as checking availability or creating a booking — while handing over to a human when needed.",
  },
  {
    q: "Can you build a chatbot for WhatsApp?",
    a: "Yes. We build WhatsApp assistants using the WhatsApp Business Platform, connected to tools such as Google Calendar and your CRM. You'll need a WhatsApp Business account; we guide you through the setup.",
  },
  {
    q: "What is n8n and why do you use it?",
    a: "n8n is a workflow automation platform that connects apps and APIs. We use it because it's flexible, supports AI steps, can be self-hosted, and gives you workflows you own and can extend — without per-task pricing surprises.",
  },
  {
    q: "How much does a project cost?",
    a: "It depends on scope, integrations and content. Use our project estimator to outline your requirements, then book a free consultation — we'll confirm a written quotation once we understand the details.",
  },
  {
    q: "How long does it take?",
    a: "Smaller projects such as a landing page or a single workflow can take a couple of weeks; larger AI systems and web applications take longer. You'll get a timeline with your proposal.",
  },
  {
    q: "Is my data safe?",
    a: "We keep API keys and credentials on the server, limit each integration to the data it needs, and add verification for sensitive actions. We're happy to discuss your specific privacy and compliance requirements.",
  },
  {
    q: "Do you provide support after launch?",
    a: "Yes. We offer maintenance and improvement support, and every project includes handover documentation so your team understands how the system works.",
  },
];
