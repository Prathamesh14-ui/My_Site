/** Icon keys available to content (local files and Sanity). Kept free of React so the Studio schema can import it. */
export const iconNames = [
  "brain", "bot", "messages", "headset", "sparkles", "database", "plug", "workflow", "calendar", "calendarCheck",
  "target", "users", "code", "globe", "building", "zap", "cart", "rocket", "layers", "pen", "refresh",
  "search", "shield", "check", "lock", "key", "chat", "whatsapp",
] as const;

export type IconName = (typeof iconNames)[number];

export function isIconName(v: unknown): v is IconName {
  return typeof v === "string" && (iconNames as readonly string[]).includes(v);
}
