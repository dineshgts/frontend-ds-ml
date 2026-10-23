import DashboardSection from "./DashboardSection";
import StatusBadge from "./StatusBadge";
type Model = { id: string; name: string; version: string; status: string; metric: string; updatedAt: string };
export default function ModelActivityTable({ models }: { models: Model[] }) {
  return <DashboardSection title="Model activity" description="Representative model registry activity · mock data">
    {models.length === 0 ? <div className="p-8 text-center text-sm text-slate-500">No model activity to display yet.</div> :
      <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm">
        <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-5 py-3 font-semibold">Model</th><th className="px-5 py-3 font-semibold">Version</th><th className="px-5 py-3 font-semibold">Status</th><th className="px-5 py-3 font-semibold">Metric</th></tr></thead>
        <tbody className="divide-y divide-slate-100">{models.map(model => <tr key={model.id} className="hover:bg-slate-50/70">
          <td className="px-5 py-4"><p className="font-medium text-slate-800">{model.name}</p><p className="mt-1 text-xs text-slate-400">{model.id}</p></td><td className="px-5 py-4 text-slate-600">{model.version}</td><td className="px-5 py-4"><StatusBadge status={model.status} /></td><td className="px-5 py-4 text-slate-600">{model.metric}</td>
        </tr>)}</tbody></table></div>}
  </DashboardSection>;
}
