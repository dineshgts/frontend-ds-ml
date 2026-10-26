import type { ReactNode } from "react";

interface MainContentProps {
  children: ReactNode;
  sidebarCollapsed?: boolean;
}

export default function MainContent({ children, sidebarCollapsed = false }: MainContentProps) {
  return (
    <main id="main-content" className={[
      "min-h-screen min-w-0 max-w-full overflow-x-clip pt-16 md:pt-[72px]",
      sidebarCollapsed ? "lg:pl-20" : "lg:pl-64",
      "transition-[padding] duration-200 ease-out",
    ].join(" ")}>
      {children}
    </main>
  );
}
