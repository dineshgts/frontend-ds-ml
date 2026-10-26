
import Link from "next/link";
import type { LucideIcon } from "lucide-react";

export interface NavigationItemProps {
  label: string;
  href: string;
  icon: LucideIcon;
  active?: boolean;
  collapsed?: boolean;
  disabled?: boolean;
  badge?: string | number;
  onNavigate?: () => void;
}

export default function NavigationItem({
  label,
  href,
  icon: Icon,
  active = false,
  collapsed = false,
  disabled = false,
  badge,
  onNavigate,
}: NavigationItemProps) {
  const className = [
    "group relative flex min-h-10 w-full items-center rounded-lg text-sm font-medium",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2",
    collapsed ? "gap-3 px-3 lg:justify-center lg:gap-0 lg:px-2" : "gap-3 px-3",
    disabled
      ? "cursor-not-allowed text-slate-300"
      : active
        ? "bg-indigo-50 text-indigo-700"
        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
  ].join(" ");

  const content = (
    <>
      <Icon
        aria-hidden="true"
        className={[
          "h-5 w-5 shrink-0",
          disabled
            ? "text-slate-300"
            : active
              ? "text-indigo-600"
              : "text-slate-400 group-hover:text-slate-600",
        ].join(" ")}
      />

      <span
        className={[
          "min-w-0 flex-1 truncate",
          collapsed ? "lg:hidden" : "",
        ].join(" ")}
      >
        {label}
      </span>

      {badge !== undefined && (
        <span
          className={[
            "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
            collapsed ? "lg:hidden" : "",
            active
              ? "bg-indigo-100 text-indigo-700"
              : "bg-slate-100 text-slate-500",
          ].join(" ")}
        >
          {badge}
        </span>
      )}

      {active && (
        <span
          aria-hidden="true"
          className={[
            "h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600",
            collapsed ? "lg:hidden" : "",
          ].join(" ")}
        />
      )}

      {collapsed && badge !== undefined && (
        <span
          aria-hidden="true"
          className="absolute right-1 top-1 hidden h-2 w-2 rounded-full bg-indigo-500 lg:block"
        />
      )}
    </>
  );

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        title={collapsed ? label : undefined}
        className={className}
      >
        {content}
      </span>
    );
  }

  return (
    <Link
      href={href}
      onClick={onNavigate}
      aria-current={active ? "page" : undefined}
      title={collapsed ? label : undefined}
      className={className}
    >
      {content}
    </Link>
  );
}
