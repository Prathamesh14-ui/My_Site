import type { IconName } from "@/components/ui/icon-names";

export type VisualKind = "agent" | "workflow" | "browser";

export interface SubService {
  slug: string;
  title: string;
  icon: IconName;
  summary: string;
  problem: string;
  solution: string;
  capabilities: string[];
  useCases: string[];
  idealFor: string;
}

export interface ServiceCategory {
  slug: string;
  title: string;
  shortTitle: string;
  icon: IconName;
  eyebrow: string;
  tagline: string;
  intro: string;
  seoDescription: string;
  problem: { title: string; points: string[] };
  solution: { title: string; body: string; points: string[] };
  capabilities: string[];
  useCases: { industry: string; title: string; body: string }[];
  benefits: { title: string; body: string }[];
  visual: VisualKind;
  services: SubService[];
}

export type MockupKind = "whatsapp-clinic" | "whatsapp-travel" | "website-travel";

export interface Project {
  slug: string;
  title: string;
  /** Shown only if `showClientName` is true — protects confidential clients. */
  clientName?: string;
  showClientName: boolean;
  category: string;
  industry: string;
  summary: string;
  challenge: string;
  approach: string;
  /** Verified, implemented features only. Do not add unbuilt functionality. */
  features: { title: string; body: string }[];
  stack: string[];
  flow?: string[];
  mockup: MockupKind;
  /** Real screenshots, if/when available. Empty → coded mockup is shown with a label. */
  screenshots: { src: string; alt: string; width?: number; height?: number }[];
  relatedService: string;
  /** Public link to the live project (only with the client's permission). */
  liveUrl?: string;
}
