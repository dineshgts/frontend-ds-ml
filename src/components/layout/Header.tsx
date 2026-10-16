
"use client";

import {
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { globalNavigation } from "@/components/navigation/navigation";

interface HeaderProps {
  sidebarCollapsed: boolean;
  onSidebarToggle: () => void;
  onMobileMenuOpen: () => void;
  context?: string;
}

export default function Header({
  sidebarCollapsed,
  onSidebarToggle,
  onMobileMenuOpen,
  context,
}: HeaderProps) {
  const pathname = usePathname();

  const routeContext = globalNavigation
    .flatMap((group) => group.items)
    .find(
      (item) =>
        !item.disabled &&
        (pathname === item.href ||
          pathname.startsWith(`${item.href}/`)),
    )?.label;

  const currentContext =
    context ?? routeContext ?? "Application";

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-slate-200 bg-white/95 backdrop-blur md:h-[72px]">
      <div
        className={[
          "flex h-full items-center gap-2 px-3 sm:px-4",
          "transition-[padding] duration-200",
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-64",
        ].join(" ")}
      >
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMobileMenuOpen}
          aria-label="Open navigation"
          aria-controls="global-sidebar"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        {/* Desktop sidebar toggle */}
        <button
          type="button"
          onClick={onSidebarToggle}
          aria-label={
            sidebarCollapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          aria-expanded={!sidebarCollapsed}
          aria-controls="global-sidebar"
          className="hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 lg:inline-flex"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen
              className="h-5 w-5"
              aria-hidden="true"
            />
          ) : (
            <PanelLeftClose
              className="h-5 w-5"
              aria-hidden="true"
            />
          )}
        </button>

        {/* Application title and current page */}
        <div className="flex min-w-0 items-center gap-2">
          <span className="hidden text-sm font-semibold text-slate-900 sm:inline">
            DataFlow
          </span>

          <span className="hidden text-slate-300 sm:inline">
            /
          </span>

          <span className="truncate text-sm text-slate-500">
            {currentContext}
          </span>
        </div>
      </div>
    </header>
  );
}
