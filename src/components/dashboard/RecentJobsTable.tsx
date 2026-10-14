import { ArrowUpRight, Clock3 } from "lucide-react";
import type { RecentJob } from "@/types/dashboard";
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

export default function RecentJobsTable({ jobs }: { jobs: RecentJob[] }) {
  return (
    <DashboardSection
      title="Recent jobs"
      description="Latest workflow and training activity"
      action={
        <a href="/experiments" className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
          View experiments <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[650px] text-left">
          <thead className="bg-slate-50/80 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-6 py-3">Job</th>
              <th className="px-4 py-3">Stage</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-6 py-3">Updated</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <tr key={job.id} className="align-middle hover:bg-slate-50/70">
                <td className="px-6 py-4">
                  <p className="font-medium text-slate-900">{job.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{job.projectName} · {job.id}</p>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">{job.stage}</td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="h-1.5 w-20 overflow-hidden rounded-full bg-slate-100">
                      <div className="h-full rounded-full bg-indigo-500" style={{ width: `${job.progress}%` }} />
                    </div>
                    <span className="text-xs tabular-nums text-slate-500">{job.progress}%</span>
                  </div>
                </td>
                <td className="px-4 py-4"><StatusBadge status={job.status} /></td>
                <td className="px-6 py-4 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                    <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{formatTime(job.updatedAt)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="border-t border-slate-100 px-6 py-3 text-xs text-slate-400">Illustrative sample jobs — not live training telemetry.</p>
    </DashboardSection>
  );
}
