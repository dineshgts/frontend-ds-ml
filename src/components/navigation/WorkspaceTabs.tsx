import Link from "next/link";
import type { WorkspaceNavigationItem } from "./WorkspaceNavigation";

interface WorkspaceTabsProps {
  items: WorkspaceNavigationItem[];
  activeHref?: string;
}

export default function WorkspaceTabs({
  items,
  activeHref,
}: WorkspaceTabsProps) {
  return (
    <nav
      aria-label="Workspace navigation"
      className="w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain border-b border-slate-200"
    >
      <div className="flex w-max min-w-full gap-1">
        {items.map((item) => {
          const active = activeHref
            ? item.href === activeHref
            : item.active ?? false;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={[
                "border-b-2 px-3 py-3 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                active
                  ? "border-indigo-600 text-indigo-700"
                  : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800",
              ].join(" ")}
            >
              {item.label}
              {item.badge !== undefined && (
                <span className="ml-2 rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
