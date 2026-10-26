type StatusBadgeProps = { status: string };
const styles: Record<string, string> = {
  running: "bg-sky-50 text-sky-700 ring-sky-600/20",
  completed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  failed: "bg-rose-50 text-rose-700 ring-rose-600/20",
  deployed: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  validation: "bg-amber-50 text-amber-800 ring-amber-600/20",
  development: "bg-slate-100 text-slate-700 ring-slate-600/20",
  pending: "bg-amber-50 text-amber-800 ring-amber-600/20",
};
export default function StatusBadge({ status }: StatusBadgeProps) {
  const className = styles[status.toLowerCase()] ?? "bg-slate-100 text-slate-700 ring-slate-600/20";
  return <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${className}`}>{status}</span>;
}
