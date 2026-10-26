"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  AlertTriangle, ArrowRight, CalendarDays, CheckCircle2, Clock3,
  Columns3, Database, FileSpreadsheet, RefreshCw, Rows3, Sparkles,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import WorkspaceLayout from "@/components/layout/WorkspaceLayout";
import DatasetStatusBadge from "@/components/datasets/DatasetStatusBadge";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { mockDatasets } from "@/data/dataset-mock";
import { formatDatasetDate, formatDatasetNumber } from "@/lib/dataset-format";

const sections = [
  { key: "overview", label: "Overview", slug: "" },
  { key: "quality", label: "Data Quality", slug: "quality" },
  { key: "columns", label: "Columns", slug: "columns" },
  { key: "distributions", label: "Distributions", slug: "distributions" },
  { key: "correlations", label: "Correlations", slug: "correlations" },
  { key: "recommendations", label: "Recommendations", slug: "recommendations" },
] as const;

const descriptions: Record<string, string> = {
  overview: "Review dataset metadata, profiling status, and available actions.",
  quality: "Inspect validation checks, missing values, duplicates, and data-quality findings.",
  columns: "Review column names, inferred types, and summary information.",
  distributions: "Explore feature distributions and summary charts.",
  correlations: "Review relationships and correlations between dataset columns.",
  recommendations: "Review suggested data-quality fixes and preparation recommendations.",
};

function MetricCard({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Database }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3"><p className="text-sm text-slate-500">{label}</p><Icon className="h-4 w-4 text-slate-400" aria-hidden="true" /></div>
      <p className="mt-2 break-words text-xl font-semibold tabular-nums text-slate-950">{value}</p>
    </div>
  );
}

export default function DatasetWorkspaceView({ section }: { section: string }) {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const datasetId = parts[1] || "demo-dataset";
  const base = `/datasets/${datasetId}`;
  const dataset = mockDatasets.find((item) => item.id === datasetId);
  const active = sections.find((item) => item.key === section) ?? sections[0];
  const navigation = sections.map((item) => ({ label: item.label, href: item.slug ? `${base}/${item.slug}` : base }));
  const [profilingStatus, setProfilingStatus] = useState<"idle" | "running" | "complete">("idle");
  const [showRetryError, setShowRetryError] = useState(false);

  if (!dataset) {
    return <div className="mx-auto max-w-3xl p-6"><EmptyState title="Dataset not found" description={`No mock dataset exists for “${datasetId}”. Return to the dataset list and select one of the available datasets.`} action={<Link href="/datasets" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Back to datasets</Link>} /></div>;
  }

  const profileLabel = profilingStatus === "running" ? "Profiling in progress" : profilingStatus === "complete" ? "Demo profiling completed" : dataset.status === "ready" ? "Profiling complete" : dataset.status === "profiling" ? "Profiling in progress" : dataset.status === "failed" ? "Profiling failed" : "Awaiting profiling";

  return (
    <WorkspaceLayout title={dataset.name} description={`Dataset ID: ${dataset.id}`} navigation={navigation} navigationVariant="tabs" activeNavigationHref={pathname}
      headerActions={<Link href="/datasets" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true" /> All datasets</Link>}>
      <PageHeader title={active.label} description={descriptions[active.key]} breadcrumb={`Datasets / ${dataset.name}`} />

      {active.key === "overview" ? (
        <div className="mt-5 space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <div className="rounded-xl bg-indigo-50 p-3 text-indigo-700"><FileSpreadsheet className="h-6 w-6" aria-hidden="true" /></div>
                <div className="min-w-0"><h2 className="break-words text-lg font-semibold text-slate-950">{dataset.name}</h2><p className="mt-1 break-all font-mono text-xs text-slate-500">{dataset.id}</p><div className="mt-3"><DatasetStatusBadge status={dataset.status} /></div></div>
              </div>
              <div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600"><CalendarDays className="h-4 w-4" aria-hidden="true" />Created {formatDatasetDate(dataset.created_at)}</div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard label="Rows" value={formatDatasetNumber(dataset.row_count)} icon={Rows3} />
              <MetricCard label="Columns" value={formatDatasetNumber(dataset.column_count)} icon={Columns3} />
              <MetricCard label="Project" value={dataset.project_id ?? "Unassigned"} icon={Database} />
              <MetricCard label="Processing status" value={dataset.status} icon={Clock3} />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div><h2 className="font-semibold text-slate-950">Profiling status</h2><p className="mt-1 text-sm text-slate-500">Frontend demo status only; no profiling job is started on the backend.</p></div>
              <span className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${profilingStatus === "complete" || dataset.status === "ready" ? "bg-emerald-50 text-emerald-700" : dataset.status === "failed" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-800"}`}>
                {profilingStatus === "complete" || dataset.status === "ready" ? <CheckCircle2 className="h-3.5 w-3.5" /> : dataset.status === "failed" ? <AlertTriangle className="h-3.5 w-3.5" /> : <Clock3 className="h-3.5 w-3.5" />}
                {profileLabel}
              </span>
            </div>
            {showRetryError ? <div className="mt-4"><ErrorState title="Demo profiling could not be started" message="This is a simulated frontend error. The backend profiling service is not connected." onRetry={() => { setShowRetryError(false); setProfilingStatus("idle"); }} /></div> : (
              <div className="mt-4 flex flex-col gap-3 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3"><Sparkles className="mt-0.5 h-5 w-5 text-indigo-600" aria-hidden="true" /><div><p className="text-sm font-semibold text-slate-800">Dataset profiling</p><p className="mt-1 text-sm text-slate-500">Review columns, distributions and quality checks using the workspace tabs.</p></div></div>
                <button type="button" onClick={() => { if (dataset.status === "failed") setShowRetryError(true); else { setProfilingStatus("running"); window.setTimeout(() => setProfilingStatus("complete"), 900); } }} disabled={profilingStatus === "running"} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50">
                  <RefreshCw className={`h-4 w-4 ${profilingStatus === "running" ? "animate-spin" : ""}`} />{profilingStatus === "running" ? "Profiling…" : dataset.status === "failed" ? "Retry profiling (demo)" : "Run profiling (demo)"}
                </button>
              </div>
            )}
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
            <h2 className="font-semibold text-slate-950">Available actions</h2><p className="mt-1 text-sm text-slate-500">Open a workspace section to inspect this dataset. Analysis content is illustrative until the API contract is connected.</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {sections.slice(1).map((item) => <Link key={item.key} href={item.slug ? `${base}/${item.slug}` : base} className="group flex items-center justify-between gap-3 rounded-xl border border-slate-200 p-4 transition hover:border-indigo-300 hover:bg-indigo-50/50"><div><p className="font-semibold text-slate-900">{item.label}</p><p className="mt-1 text-xs leading-5 text-slate-500">{descriptions[item.key]}</p></div><ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-indigo-600" aria-hidden="true" /></Link>)}
            </div>
          </section>
        </div>
      ) : (
        <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="mb-4 flex items-start gap-3"><div className="rounded-xl bg-indigo-50 p-3 text-indigo-700"><Sparkles className="h-5 w-5" aria-hidden="true" /></div><div><h2 className="font-semibold text-slate-950">{active.label}</h2><p className="mt-1 text-sm text-slate-500">{descriptions[active.key]}</p></div></div>
          <EmptyState title={`${active.label} preview`} description={`This ${active.label.toLowerCase()} section is ready for dataset-specific mock results. Current dataset: ${dataset.name} (${dataset.id}). No FastAPI request is made.`} action={<button type="button" onClick={() => window.location.reload()} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Refresh preview</button>} />
        </section>
      )}
    </WorkspaceLayout>
  );
}
