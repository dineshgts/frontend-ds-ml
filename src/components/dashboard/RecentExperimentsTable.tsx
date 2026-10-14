import { ArrowUpRight } from "lucide-react";
import type { RecentExperiment } from "@/types/dashboard";
import DashboardSection from "./DashboardSection";
import StatusBadge from "./StatusBadge";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function RecentExperimentsTable({ experiments }: { experiments: RecentExperiment[] }) {
  return (
    <DashboardSection
      title="Recent experiments"
      description="Experiment history and best available metric"
      action={
        <a href="/experiments" className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
          All experiments <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[590px] text-left">
          <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3">Experiment</th>
              <th className="px-4 py-3">Problem type</th>
              <th className="px-4 py-3">Best metric</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-6 py-3">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {experiments.map((experiment) => (
              <tr key={experiment.id} className="hover:bg-slate-50/70">
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900">{experiment.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{experiment.datasetName} · {experiment.id}</p>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">{experiment.problemType}</td>
                <td className="px-4 py-4 text-sm font-medium tabular-nums text-slate-800">{experiment.bestMetric ?? "—"}</td>
                <td className="px-4 py-4"><StatusBadge status={experiment.status} /></td>
                <td className="px-6 py-4 text-xs text-slate-500 whitespace-nowrap">{formatTime(experiment.updatedAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-slate-100 px-6 py-3 text-xs text-slate-400">Illustrative sample experiments — connect the Experiment API for live history.</p>
    </DashboardSection>
  );
}
