import type { LucideIcon } from "lucide-react";
interface DashboardSummaryCardProps {
  label: string; value: number | string; helper: string; icon: LucideIcon;
  iconClassName: string; sourceLabel?: string;
}
export default function DashboardSummaryCard({ label, value, helper, icon: Icon, iconClassName, sourceLabel = "Mock" }: DashboardSummaryCardProps) {
  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0"><p className="text-sm font-medium text-slate-500">{label}</p><p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</p></div>
        <span className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}><Icon className="h-5 w-5" aria-hidden="true" /></span>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2"><p className="text-xs text-slate-500">{helper}</p><span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{sourceLabel}</span></div>
    </article>
  );
}
