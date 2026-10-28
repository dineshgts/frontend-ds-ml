"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { mockModelTraining, type JobStatus, type ProblemType } from "@/mock/modelTraining";

type View = "recommendations" | "jobs" | "details";
const metricLabels: Record<string, string> = {
  accuracy: "Accuracy", precision: "Precision", recall: "Recall",
  f1Score: "F1 Score", rocAuc: "ROC-AUC", rmse: "RMSE",
  mae: "MAE", silhouetteScore: "Silhouette Score",
};
const statusStyles: Record<JobStatus, string> = {
  pending: "bg-slate-100 text-slate-700",
  running: "bg-blue-100 text-blue-700",
  completed: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
};
function StatusBadge({ status }: { status: JobStatus }) {
  return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[status]}`}>{status}</span>;
}
function Section({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <section className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div><h2 className="text-lg font-semibold text-slate-900">{title}</h2>{description && <p className="mt-1 text-sm text-slate-500">{description}</p>}</div>{children}</section>;
}
function formatMetric(key: string, value: number) { return ["rmse", "mae"].includes(key) ? value.toFixed(2) : value.toFixed(3); }

export default function ModelTrainingWorkspace() {
  const [view, setView] = useState<View>("recommendations");
  const [problemType, setProblemType] = useState<ProblemType>("classification");
  const [compareIds, setCompareIds] = useState(["model-001", "model-002", "model-003"]);
  const [status, setStatus] = useState<"all" | JobStatus>("all");
  const [search, setSearch] = useState("");
  const [jobId, setJobId] = useState("job-1001");
  const candidates = mockModelTraining.candidates.filter((m) => m.problemTypes.includes(problemType));
  const compared = mockModelTraining.candidates.filter((m) => compareIds.includes(m.id));
  const jobs = useMemo(() => mockModelTraining.jobs.filter((j) =>
    (status === "all" || j.status === status) &&
    `${j.name} ${j.dataset} ${j.id}`.toLowerCase().includes(search.toLowerCase())
  ), [status, search]);
  const job = mockModelTraining.jobs.find((j) => j.id === jobId);
  const model = mockModelTraining.candidates.find((m) => m.id === job?.modelId);

  return <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6 lg:p-8">
    <header><p className="text-sm font-medium text-indigo-600">MACHINE LEARNING WORKSPACE</p><h1 className="mt-1 text-2xl font-bold text-slate-900">Models & Training</h1><p className="mt-2 text-sm text-slate-500">Explore candidate models, compare metrics, and inspect training jobs. Uses frontend mock data only.</p></header>
    <nav className="flex flex-wrap gap-2 border-b border-slate-200 pb-3">{([["recommendations", "Recommendations & Comparison"], ["jobs", "Training Jobs"], ["details", "Job Details"]] as [View, string][]).map(([key, label]) => <button key={key} onClick={() => setView(key)} className={`rounded-lg px-4 py-2 text-sm font-medium ${view === key ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}>{label}</button>)}</nav>

    {view === "recommendations" && <div className="space-y-6">
      <Section title="Model recommendations" description="Choose a supported problem type and select models for comparison.">
        <label className="block max-w-sm text-sm font-medium text-slate-700">Problem type<select value={problemType} onChange={(e) => setProblemType(e.target.value as ProblemType)} className="mt-2 w-full rounded-lg border border-slate-300 p-2.5">{mockModelTraining.problemTypes.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}</select></label>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{candidates.map((m) => <article key={m.id} className="rounded-xl border border-slate-200 p-4"><div className="flex justify-between gap-3"><div><h3 className="font-semibold text-slate-900">{m.name}</h3><p className="text-xs text-slate-500">{m.algorithm}</p></div><input type="checkbox" aria-label={`Compare ${m.name}`} checked={compareIds.includes(m.id)} onChange={() => setCompareIds((ids) => ids.includes(m.id) ? ids.filter((id) => id !== m.id) : [...ids, m.id])} /></div><p className="mt-3 text-sm text-slate-600">{m.description}</p><p className="mt-3 rounded-lg bg-indigo-50 p-3 text-sm text-indigo-800">{m.reason}</p><div className="mt-3 flex flex-wrap gap-1">{m.problemTypes.map((p) => <span key={p} className="rounded-full bg-slate-100 px-2 py-1 text-xs capitalize">{p}</span>)}</div></article>)}</div>
      </Section>
      <Section title="Model comparison" description="Metrics are illustrative mock values; unavailable metrics display as a dash.">
        {compared.length === 0 ? <p className="text-sm text-slate-500">Select at least one model above.</p> : <div className="overflow-x-auto"><table className="w-full min-w-[600px] text-left text-sm"><thead className="bg-slate-50"><tr><th className="p-3">Metric</th>{compared.map((m) => <th key={m.id} className="p-3">{m.name}</th>)}</tr></thead><tbody>{Object.keys(metricLabels).filter((k) => compared.some((m) => m.metrics[k] !== undefined)).map((k) => <tr key={k} className="border-t"><td className="p-3 font-medium">{metricLabels[k]}</td>{compared.map((m) => <td key={m.id} className="p-3 tabular-nums">{m.metrics[k] === undefined ? "—" : formatMetric(k, m.metrics[k])}</td>)}</tr>)}</tbody></table></div>}
      </Section>
    </div>}

    {view === "jobs" && <Section title="Training jobs" description="Search jobs and filter by lifecycle status.">
      <div className="flex flex-col gap-3 sm:flex-row"><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search jobs, datasets, or IDs" className="min-h-10 flex-1 rounded-lg border px-3 text-sm" /><select value={status} onChange={(e) => setStatus(e.target.value as "all" | JobStatus)} aria-label="Filter by status" className="min-h-10 rounded-lg border px-3 text-sm"><option value="all">All statuses</option>{(["pending", "running", "completed", "failed"] as JobStatus[]).map((s) => <option key={s} value={s}>{s}</option>)}</select></div>
      <div className="overflow-x-auto"><table className="w-full min-w-[700px] text-left text-sm"><thead className="bg-slate-50"><tr>{["Job", "Dataset", "Status", "Progress", "Duration", "Action"].map((h) => <th key={h} className="p-3">{h}</th>)}</tr></thead><tbody>{jobs.map((j) => <tr key={j.id} className="border-t"><td className="p-3"><p className="font-medium">{j.name}</p><p className="text-xs text-slate-500">{j.id}</p></td><td className="p-3">{j.dataset}</td><td className="p-3"><StatusBadge status={j.status} /></td><td className="p-3"><div className="flex items-center gap-2"><div className="h-2 w-20 overflow-hidden rounded-full bg-slate-100"><div className={`h-full ${j.status === "failed" ? "bg-red-500" : j.status === "completed" ? "bg-emerald-500" : "bg-indigo-500"}`} style={{ width: `${j.progress}%` }} /></div>{j.progress}%</div></td><td className="p-3">{j.duration}</td><td className="p-3"><button onClick={() => { setJobId(j.id); setView("details"); }} className="font-medium text-indigo-600 hover:underline">View details</button></td></tr>)}{jobs.length === 0 && <tr><td colSpan={6} className="p-8 text-center text-slate-500">No jobs match these filters.</td></tr>}</tbody></table></div>
    </Section>}

    {view === "details" && <Section title="Training job details" description="Status, progress, metrics, parameters, and failure information.">
      {!job ? <p>Job not found.</p> : <div className="space-y-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h3 className="font-semibold">{job.name}</h3><p className="text-sm text-slate-500">{job.id} · {job.dataset}</p></div><StatusBadge status={job.status} /></div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{[["Model", model?.name ?? job.modelId], ["Problem type", job.problemType], ["Progress", `${job.progress}%`], ["Duration", job.duration]].map(([k, v]) => <div key={k} className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">{k}</p><p className="mt-1 font-semibold capitalize">{v}</p></div>)}</div>
        <div><div className="mb-2 flex justify-between text-sm"><span>Training progress</span><span>{job.progress}%</span></div><div role="progressbar" aria-valuenow={job.progress} aria-valuemin={0} aria-valuemax={100} className="h-3 overflow-hidden rounded-full bg-slate-100"><div className={`h-full ${job.status === "failed" ? "bg-red-500" : job.status === "completed" ? "bg-emerald-500" : "bg-indigo-500"}`} style={{ width: `${job.progress}%` }} /></div></div>
        {job.status === "running" && <p className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">Training is running. Live updates are not connected in this mock UI.</p>}
        {job.status === "failed" && <div className="rounded-xl border border-red-200 bg-red-50 p-4"><h4 className="font-semibold text-red-800">Training failed</h4><p className="mt-1 text-sm text-red-700">{job.error ?? "No error details available."}</p></div>}
        {job.status === "completed" && <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">Training completed successfully.</p>}
        <div><h4 className="mb-3 font-semibold">Evaluation metrics</h4>{job.metrics && Object.keys(job.metrics).length ? <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{Object.entries(job.metrics).map(([k, v]) => <div key={k} className="rounded-xl border p-4"><p className="text-xs text-slate-500">{metricLabels[k] ?? k}</p><p className="mt-1 text-xl font-bold">{formatMetric(k, v)}</p></div>)}</div> : <p className="text-sm text-slate-500">No evaluation metrics available for this job.</p>}</div>
        <div><h4 className="mb-3 font-semibold">Training parameters</h4><div className="overflow-x-auto rounded-xl border"><table className="w-full text-left text-sm"><tbody>{Object.entries(job.parameters).map(([k, v]) => <tr key={k} className="border-b last:border-0"><td className="p-3 font-medium">{k}</td><td className="p-3">{v}</td></tr>)}</tbody></table></div></div>
        <button onClick={() => setView("jobs")} className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-slate-50">Back to training jobs</button>
      </div>}
    </Section>}
  </main>;
}
