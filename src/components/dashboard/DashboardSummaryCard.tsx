import type { LucideIcon } from "lucide-react";

interface DashboardSummaryCardProps {
  label: string;
  value: string | number;
  helper: string;
  icon: LucideIcon;
  iconClassName: string;
  loading?: boolean;
  sourceLabel?: string;
}

export default function DashboardSummaryCard({
  label,
  value,
  helper,
  icon: Icon,
  iconClassName,
  loading = false,
  sourceLabel,
}: DashboardSummaryCardProps) {
  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-950/[0.02]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <div className="mt-3 flex items-baseline gap-2">
            {loading ? (
              <span className="inline-block h-8 w-16 animate-pulse rounded-md bg-slate-100" aria-label="Loading" />
            ) : (
              <p className="text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
            )}
          </div>
        </div>
        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${iconClassName}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs leading-5 text-slate-500">{helper}</p>
        {sourceLabel && (
          <span className="rounded-md bg-slate-100 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
            {sourceLabel}
          </span>
        )}
      </div>
    </article>
  );
}
