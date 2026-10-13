"use client";

import {
  Bell,
  ChevronDown,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
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
        (pathname === item.href || pathname.startsWith(`${item.href}/`)),
    )?.label;

  const currentContext = context ?? routeContext ?? "Application";

  return (
    <header className="fixed inset-x-0 top-0 z-40 h-16 border-b border-slate-200 bg-white/95 backdrop-blur md:h-[72px]">
      <div
        className={[
          "flex h-full items-center gap-2 px-3 sm:px-4",
          "transition-[padding] duration-200",
          sidebarCollapsed ? "lg:pl-24" : "lg:pl-72",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={onMobileMenuOpen}
          aria-label="Open navigation"
          aria-controls="global-sidebar"
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 lg:hidden"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onSidebarToggle}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!sidebarCollapsed}
          aria-controls="global-sidebar"
          className="hidden rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 lg:inline-flex"
        >
          {sidebarCollapsed ? (
            <PanelLeftOpen className="h-5 w-5" aria-hidden="true" />
          ) : (
            <PanelLeftClose className="h-5 w-5" aria-hidden="true" />
          )}
        </button>

        <div className="flex min-w-0 items-center gap-2">
          <span className="hidden text-sm font-semibold text-slate-900 sm:inline">
            DataFlow
          </span>
          <span className="hidden text-slate-300 sm:inline">/</span>
          <span className="truncate text-sm text-slate-500">{currentContext}</span>
        </div>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <div className="relative hidden w-56 lg:block xl:w-72">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              aria-hidden="true"
            />
            <input
              aria-label="Search"
              type="search"
              placeholder="Search..."
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 focus:border-indigo-300 focus:bg-white focus:ring-2 focus:ring-indigo-500/10"
            />
          </div>

          <button
            type="button"
            aria-label="Search"
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 lg:hidden"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            aria-label="Notifications"
            className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span
              aria-hidden="true"
              className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-indigo-600"
            />
          </button>

          <div className="mx-1 hidden h-6 w-px bg-slate-200 sm:block" />

          <button
            type="button"
            aria-label="Open user menu"
            className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-semibold text-white">
              A
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-sm font-medium text-slate-800">Admin</span>
              <span className="block text-[11px] text-slate-400">Administrator</span>
            </span>
            <ChevronDown
              className="hidden h-4 w-4 text-slate-400 sm:block"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </header>
  );
}
