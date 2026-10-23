import type { DatasetStatus } from "@/types/dataset";

interface DatasetStatusBadgeProps {
  status: DatasetStatus;
}

const statusStyles: Record<DatasetStatus, string> = {
  uploaded: "bg-blue-50 text-blue-700 ring-blue-600/20",
  profiling: "bg-amber-50 text-amber-700 ring-amber-600/20",
  ready: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  failed: "bg-red-50 text-red-700 ring-red-600/20",
};

export default function DatasetStatusBadge({
  status,
}: DatasetStatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold capitalize ring-1 ring-inset ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}