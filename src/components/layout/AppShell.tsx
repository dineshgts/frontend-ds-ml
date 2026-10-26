
"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import Header from "./Header";
import MainContent from "./MainContent";
import Sidebar from "./Sidebar";

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Header
        sidebarCollapsed={sidebarCollapsed}
        onSidebarToggle={() =>
          setSidebarCollapsed((previous) => !previous)
        }
        onMobileMenuOpen={() => setMobileOpen(true)}
      />

      <Sidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <MainContent sidebarCollapsed={sidebarCollapsed}>
        {children}
      </MainContent>
    </div>
  );
}
