import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Diamond,
  Edit3,
  Group,
  Hexagon,
  Home,
  Link2,
  Lock,
  MoonStar,
  Send,
  Sparkles,
  Star,
  SunMedium,
  Trophy,
  UserCircle2,
  Wallet,
  X,
} from "lucide-react";

const icons = {
  account: UserCircle2,
  ambassador: Award,
  arrowRight: ArrowRight,
  book: BookOpen,
  chain: Link2,
  check: CheckCircle2,
  chevronRight: ChevronRight,
  defi: Wallet,
  diamond: Diamond,
  edit: Edit3,
  groups: Group,
  hexagon: Hexagon,
  home: Home,
  lock: Lock,
  moon: MoonStar,
  send: Send,
  sparkles: Sparkles,
  star: Star,
  sun: SunMedium,
  trophy: Trophy,
  wallet: Wallet,
  x: X,
};

export function Icon({ className = "size-5", name, strokeWidth = 2 }) {
  const Component = icons[name] || Sparkles;

  return <Component className={className} strokeWidth={strokeWidth} />;
}
