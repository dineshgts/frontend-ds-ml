import Link from "next/link";
import type { WorkspaceNavigationItem } from "./WorkspaceNavigation";

interface WorkspaceSidebarProps {
  items: WorkspaceNavigationItem[];
  activeHref?: string;
}

export default function WorkspaceSidebar({
  items,
  activeHref,
}: WorkspaceSidebarProps) {
  return (
    <nav
      aria-label="Workspace navigation"
      className="w-full shrink-0 border-b border-slate-200 pb-3 md:w-56 md:border-b-0 md:border-r md:pb-0 md:pr-4"
    >
      <div className="flex gap-1 overflow-x-auto md:block md:space-y-1">
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
                "flex min-h-10 shrink-0 items-center rounded-lg px-3 text-sm font-medium transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                active
                  ? "bg-indigo-50 text-indigo-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")}
            >
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              {item.badge !== undefined && (
                <span className="ml-2 text-xs text-slate-400">{item.badge}</span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
