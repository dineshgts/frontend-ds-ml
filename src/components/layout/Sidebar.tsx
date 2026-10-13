"use client";

import Link from "next/link";
import { BarChart3, X } from "lucide-react";
import { usePathname } from "next/navigation";
import NavigationGroup from "@/components/navigation/NavigationGroup";
import { globalNavigation } from "@/components/navigation/navigation";

interface SidebarProps { collapsed: boolean; mobileOpen: boolean; onMobileClose: () => void; }

export default function Sidebar({ collapsed, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname();
  return (
    <>
      <button type="button" aria-label="Close navigation overlay" aria-hidden={!mobileOpen} tabIndex={mobileOpen ? 0 : -1}
        onClick={onMobileClose}
        className={["fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-[1px] transition-opacity lg:hidden",
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"].join(" ")} />
      <aside id="global-sidebar" aria-label="Global navigation"
        className={["fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white",
          "w-64 transition-[width,transform] duration-200 ease-out",
          collapsed ? "lg:w-20" : "lg:w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"].join(" ")}>
        <div className="flex h-16 shrink-0 items-center border-b border-slate-100 px-4 md:h-[72px]">
          <Link href="/dashboard" onClick={onMobileClose}
            className={["flex min-w-0 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
              collapsed ? "lg:mx-auto" : ""].join(" ")}>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white"><BarChart3 className="h-5 w-5" aria-hidden="true" /></span>
            <span className={collapsed ? "lg:hidden" : "min-w-0"}>
              <span className="block text-sm font-bold text-slate-950">DataFlow</span>
              <span className="block text-[10px] uppercase tracking-wider text-slate-400">AutoML Platform</span>
            </span>
          </Link>
          <button type="button" onClick={onMobileClose} aria-label="Close navigation"
            className="ml-auto rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 lg:hidden">
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-5"><div className="space-y-6">
          {globalNavigation.map((group) => <NavigationGroup key={group.title} group={group} pathname={pathname} collapsed={collapsed} onNavigate={onMobileClose} />)}
        </div></div>
      </aside>
    </>
  );
}
