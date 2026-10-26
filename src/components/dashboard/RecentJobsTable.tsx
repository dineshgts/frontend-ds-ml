import DashboardSection from "./DashboardSection";
import StatusBadge from "./StatusBadge";
type Job = { id: string; name: string; type: string; status: string; updatedAt: string };
function formatDate(value: string) { return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value)); }
export default function RecentJobsTable({ jobs }: { jobs: Job[] }) {
  return <DashboardSection title="Recent training jobs" description="Representative job activity · mock data">
    {jobs.length === 0 ? <div className="p-8 text-center text-sm text-slate-500">No training jobs to display yet.</div> :
      <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3 font-semibold">Job</th><th className="px-5 py-3 font-semibold">Type</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Updated</th></tr></thead>
        <tbody className="divide-y divide-slate-100">{jobs.map(job => <tr key={job.id} className="hover:bg-slate-50/70">
          <td className="px-5 py-4"><p className="font-medium text-slate-800">{job.name}</p><p className="mt-1 text-xs text-slate-400">{job.id}</p></td><td className="px-5 py-4 text-slate-600">{job.type}</td><td className="px-5 py-4"><StatusBadge status={job.status} /></td><td className="whitespace-nowrap px-5 py-4 text-slate-500">{formatDate(job.updatedAt)}</td>
        </tr>)}</tbody></table></div>}
  </DashboardSection>;
}
