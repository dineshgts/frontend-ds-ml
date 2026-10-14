import type { ReactNode } from "react";

interface DashboardSectionProps {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function DashboardSection({
  title,
  description,
  action,
  children,
  className = "",
}: DashboardSectionProps) {
  return (
    <section className={`min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-950/[0.02] ${className}`}>
      <div className="flex flex-col gap-2 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
        </div>
        {action && <div className="shrink-0">{action}</div>}
      </div>
      {children}
    </section>
  );
}
