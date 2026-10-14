import type { DashboardStatus } from "@/types/dashboard";

const statusStyles: Record<DashboardStatus, string> = {
  queued: "bg-slate-100 text-slate-700 ring-slate-200",
  running: "bg-blue-50 text-blue-700 ring-blue-200",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  failed: "bg-rose-50 text-rose-700 ring-rose-200",
  review: "bg-amber-50 text-amber-800 ring-amber-200",
  approved: "bg-violet-50 text-violet-700 ring-violet-200",
  production: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  retired: "bg-slate-100 text-slate-600 ring-slate-200",
};

const statusLabels: Record<DashboardStatus, string> = {
  queued: "Queued",
  running: "Running",
  completed: "Completed",
  failed: "Failed",
  review: "Needs review",
  approved: "Approved",
  production: "Production",
  retired: "Retired",
};

export default function StatusBadge({ status }: { status: DashboardStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${statusStyles[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      {statusLabels[status]}
    </span>
  );
}
