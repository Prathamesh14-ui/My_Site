import {
  Brain, Bot, MessagesSquare, Headset, Sparkles, Database, Plug, Workflow, Calendar, CalendarCheck,
  Target, Users, Code, Globe, Building, Zap, ShoppingCart, Rocket, Layers, PenTool, RefreshCw,
  Search, Shield, Check, Lock, KeyRound, MessageCircle, type LucideProps,
} from "lucide-react";

function WhatsAppIcon(props: LucideProps) {
  const { size = 24, className, strokeWidth = 1.8 } = props;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M3.5 20.5l1.2-4.1A8.5 8.5 0 1 1 8 19.6z" />
      <path d="M9 8.6c0 3.3 3.1 6.4 6.4 6.4l1.1-1.4-2-.9-.9.9a4.6 4.6 0 0 1-3.2-3.2l.9-.9-.9-2-1.4 1.1z" />
    </svg>
  );
}

const icons = {
  brain: Brain,
  bot: Bot,
  messages: MessagesSquare,
  headset: Headset,
  sparkles: Sparkles,
  database: Database,
  plug: Plug,
  workflow: Workflow,
  calendar: Calendar,
  calendarCheck: CalendarCheck,
  target: Target,
  users: Users,
  code: Code,
  globe: Globe,
  building: Building,
  zap: Zap,
  cart: ShoppingCart,
  rocket: Rocket,
  layers: Layers,
  pen: PenTool,
  refresh: RefreshCw,
  search: Search,
  shield: Shield,
  check: Check,
  lock: Lock,
  key: KeyRound,
  chat: MessageCircle,
  whatsapp: WhatsAppIcon,
} as const;

export type IconName = keyof typeof icons;

export function Icon({ name, ...props }: { name: IconName } & LucideProps) {
  const Cmp = icons[name];
  return <Cmp aria-hidden="true" {...props} />;
}

export { WhatsAppIcon };
