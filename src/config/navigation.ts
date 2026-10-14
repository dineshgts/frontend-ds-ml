import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Database,
  FileBarChart2,
  FolderKanban,
  FlaskConical,
  HelpCircle,
  LayoutDashboard,
  LineChart,
  Settings,
  Sparkles,
  Target,
} from "lucide-react";

export type NavigationItemConfig = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string | number;
  disabled?: boolean;
};

export type NavigationGroupConfig = {
  title: string;
  items: NavigationItemConfig[];
};

export const globalNavigation: NavigationGroupConfig[] = [
  {
    title: "Main",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: "Workspace",
    items: [
      {
        label: "Projects",
        href: "/projects",
        icon: FolderKanban,
      },
      {
        label: "Datasets",
        href: "/datasets",
        icon: Database,
      },
      {
        label: "Experiments",
        href: "/experiments",
        icon: FlaskConical,
      },
      {
        label: "Models",
        href: "/models",
        icon: Sparkles,
      },
      {
        label: "Predictions",
        href: "/predictions",
        icon: Target,
        disabled: true,
        badge: "Soon",
      },
      {
        label: "Reports",
        href: "/reports",
        icon: FileBarChart2,
      },
    ],
  },
  {
    title: "System",
    items: [
      {
        label: "Settings",
        href: "/settings",
        icon: Settings,
      },
      {
        label: "Help",
        href: "/help",
        icon: HelpCircle,
        disabled: true,
        badge: "Soon",
      },
    ],
  },
];

