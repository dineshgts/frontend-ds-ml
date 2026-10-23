
"use client";

import Link from "next/link";
import { BarChart3, X } from "lucide-react";
import { usePathname } from "next/navigation";
import NavigationGroup from "@/components/navigation/NavigationGroup";
import { globalNavigation } from "@/components/navigation/navigation";

interface SidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export default function Sidebar({
  collapsed,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <button
        type="button"
        aria-label="Close navigation overlay"
        aria-hidden={!mobileOpen}
        tabIndex={mobileOpen ? 0 : -1}
        onClick={onMobileClose}
        className={[
          "fixed inset-0 z-40 bg-slate-950/40",
          "transition-opacity duration-200 lg:hidden",
          mobileOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        ].join(" ")}
      />

      {/* Sidebar */}
      <aside
        id="global-sidebar"
        aria-label="Global navigation"
        className={[
          "fixed inset-y-0 left-0 z-50 flex flex-col",
          "border-r border-slate-200 bg-white",
          "w-64 transition-[width,transform] duration-200 ease-out",
          collapsed ? "lg:w-20" : "lg:w-64",
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0",
        ].join(" ")}
      >
        {/* Brand header */}
        <div className="flex h-16 shrink-0 items-center border-b border-slate-200 px-4 md:h-[72px]">
          <Link
            href="/dashboard"
            onClick={onMobileClose}
            aria-label="DataFlow dashboard"
            className={[
              "flex min-w-0 items-center gap-3 rounded-lg",
              "focus-visible:outline-none focus-visible:ring-2",
              "focus-visible:ring-indigo-500",
              collapsed ? "lg:mx-auto" : "",
            ].join(" ")}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white">
              <BarChart3 className="h-6 w-6" aria-hidden="true" />
            </span>

            <span
              className={[
                "min-w-0 overflow-hidden whitespace-nowrap",
                collapsed ? "lg:hidden" : "",
              ].join(" ")}
            >
              <span className="block text-base font-bold leading-5 tracking-tight text-slate-950">
                DataFlow
              </span>
              <span className="mt-1 block text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400">
                AutoML Platform
              </span>
            </span>
          </Link>

          {/* Mobile close button */}
          <button
            type="button"
            onClick={onMobileClose}
            aria-label="Close navigation"
            className="ml-auto rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 lg:hidden"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation */}
        <nav
          aria-label="Main navigation"
          className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-3 py-5"
        >
          <div className="space-y-6">
            {globalNavigation.map((group) => (
              <NavigationGroup
                key={group.title}
                group={group}
                pathname={pathname}
                collapsed={collapsed}
                onNavigate={onMobileClose}
              />
            ))}
          </div>
        </nav>
      </aside>
    </>
  );
}
