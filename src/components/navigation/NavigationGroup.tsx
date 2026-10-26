
import NavigationItem from "./NavigationItem";
import type { NavigationGroupConfig } from "./navigation";

interface NavigationGroupProps {
  group: NavigationGroupConfig;
  pathname: string;
  collapsed?: boolean;
  onNavigate?: () => void;
}

function isRouteActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavigationGroup({
  group,
  pathname,
  collapsed = false,
  onNavigate,
}: NavigationGroupProps) {
  return (
    <section aria-label={group.title}>
      <h2
        className={[
          "mb-2 px-3 text-[10px] font-semibold uppercase",
          "tracking-[0.16em] text-slate-400",
          collapsed ? "lg:hidden" : "",
        ].join(" ")}
      >
        {group.title}
      </h2>

      <nav className="space-y-1">
        {group.items.map((item) => (
          <NavigationItem
            key={item.href}
            {...item}
            active={isRouteActive(pathname, item.href)}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>
    </section>
  );
}
