import Link from "next/link";
import type { Dataset } from "@/types/dataset";
import DatasetStatusBadge from "./DatasetStatusBadge";
import EmptyState from "@/components/common/EmptyState";

interface DatasetTableProps {
  datasets: Dataset[];
  onSelect?: (dataset: Dataset) => void;
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatNumber(value: number | null) {
  return value == null ? "—" : value.toLocaleString("en-IN");
}

export default function DatasetTable({ datasets, onSelect }: DatasetTableProps) {
  if (datasets.length === 0) {
    return (
      <EmptyState
        title="No datasets found"
        description="There are no datasets on this page yet. Try another page or change the page size."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-[850px] w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
          <tr>
            <th scope="col" className="px-5 py-3 font-semibold">Dataset</th>
            <th scope="col" className="px-5 py-3 font-semibold">Project ID</th>
            <th scope="col" className="px-5 py-3 text-right font-semibold">Rows</th>
            <th scope="col" className="px-5 py-3 text-right font-semibold">Columns</th>
            <th scope="col" className="px-5 py-3 font-semibold">Status</th>
            <th scope="col" className="px-5 py-3 font-semibold">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {datasets.map((dataset) => (
            <tr
              key={dataset.id}
              onClick={() => onSelect?.(dataset)}
              className={`transition-colors hover:bg-slate-50 ${onSelect ? "cursor-pointer" : ""}`}
            >
              <td className="px-5 py-4">
                <Link
                  href={`/datasets/${dataset.id}`}
                  onClick={(event) => event.stopPropagation()}
                  className="font-semibold text-indigo-600 hover:text-indigo-800 hover:underline focus-visible:rounded focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600"
                >
                  {dataset.name}
                </Link>
                <div className="mt-1 text-xs text-slate-500">{dataset.id}</div>
              </td>
              <td className="px-5 py-4 text-slate-600">{dataset.project_id ?? "Not assigned"}</td>
              <td className="px-5 py-4 text-right tabular-nums text-slate-700">{formatNumber(dataset.row_count)}</td>
              <td className="px-5 py-4 text-right tabular-nums text-slate-700">{formatNumber(dataset.column_count)}</td>
              <td className="px-5 py-4"><DatasetStatusBadge status={dataset.status} /></td>
              <td className="whitespace-nowrap px-5 py-4 text-slate-600">{formatDate(dataset.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
