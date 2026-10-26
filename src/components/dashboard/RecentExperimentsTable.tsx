import DashboardSection from "./DashboardSection";
import StatusBadge from "./StatusBadge";
type Experiment = { id: string; name: string; dataset: string; status: string; updatedAt: string };
function formatDate(value: string) { return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(new Date(value)); }
export default function RecentExperimentsTable({ experiments }: { experiments: Experiment[] }) {
  return <DashboardSection title="Recent experiments" description="Representative experiment activity · mock data">
    {experiments.length === 0 ? <div className="p-8 text-center text-sm text-slate-500">No experiments to display yet.</div> :
      <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3 font-semibold">Experiment</th><th className="px-5 py-3 font-semibold">Dataset</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Updated</th></tr></thead>
        <tbody className="divide-y divide-slate-100">{experiments.map(exp => <tr key={exp.id} className="hover:bg-slate-50/70">
          <td className="px-5 py-4"><p className="font-medium text-slate-800">{exp.name}</p><p className="mt-1 text-xs text-slate-400">{exp.id}</p></td><td className="px-5 py-4 text-slate-600">{exp.dataset}</td><td className="px-5 py-4"><StatusBadge status={exp.status} /></td><td className="whitespace-nowrap px-5 py-4 text-slate-500">{formatDate(exp.updatedAt)}</td>
        </tr>)}</tbody></table></div>}
  </DashboardSection>;
}
