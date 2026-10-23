import type { ReactNode } from "react";
interface DashboardSectionProps { title: string; description?: string; children: ReactNode; }
export default function DashboardSection({ title, description, children }: DashboardSectionProps) {
  return <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="border-b border-slate-100 px-5 py-4 sm:px-6"><h2 className="text-base font-semibold text-slate-900">{title}</h2>{description && <p className="mt-1 text-sm text-slate-500">{description}</p>}</div>
    {children}
  </section>;
}
