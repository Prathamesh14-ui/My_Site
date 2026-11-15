import { siteConfig } from "@/config/site";

/** Client-safe scenario metadata (no prompts or server logic). */
export const chatScenarios = {
  agency: {
    label: "Our assistant",
    description: "Ask about our services",
    greeting: `Hi! I'm the ${siteConfig.name} assistant. Ask me about AI agents, WhatsApp chatbots, automation or websites — or what might suit your business.`,
    suggestions: ["What services do you offer?", "Can you build a WhatsApp chatbot?", "How does a project start?"],
  },
  clinic: {
    label: "Clinic demo",
    description: "Fictional clinic booking assistant",
    greeting: "Hello! I'm the booking assistant for Demo Clinic (a fictional clinic for this demo). How can I help you today?",
    suggestions: ["I'd like to book an appointment", "What are your timings?", "Can I reschedule?"],
  },
  travel: {
    label: "Travel demo",
    description: "Fictional travel enquiry assistant",
    greeting: "Hi there! I'm the travel assistant for Demo Travels (fictional, for this demo). Where would you like to go?",
    suggestions: ["Suggest a family trip in December", "Do you have honeymoon packages?", "What's included in a package?"],
  },
} as const;

export type ChatScenario = keyof typeof chatScenarios;
export type ChatMode = "live" | "demo";
