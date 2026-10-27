"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  AlertTriangle, ArrowRight, CalendarDays, CheckCircle2, Clock3,
  Columns3, Database, FileSpreadsheet, RefreshCw, Rows3, Sparkles,
  TriangleAlert, XCircle, Info,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import WorkspaceLayout from "@/components/layout/WorkspaceLayout";
import DatasetStatusBadge from "@/components/datasets/DatasetStatusBadge";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { getDataset, getDatasetProfile, profileDataset } from "@/api/datasets";
import type { DatasetProfile } from "@/api/datasets";
import type { Dataset } from "@/types/dataset";
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
  overview: "Review dataset metadata, profiling summaries, and available actions.",
  quality: "Inspect missing values and any warnings or validation issues returned by the API.",
  columns: "Review column names, non-empty values, missing values, inferred types, and available statistics.",
  distributions: "Explore distributions when the backend provides distribution statistics.",
  correlations: "Review correlation results when they are provided by the backend.",
  recommendations: "Review data preparation recommendations returned by the backend.",
};

type ProfileState = "pending" | "running" | "completed" | "failed";
type AnyRecord = Record<string, unknown>;

function record(value: unknown): AnyRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? value as AnyRecord : null;
}
function numberValue(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}
function stringValue(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}
function display(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "number") return value.toLocaleString();
  if (typeof value === "string" || typeof value === "boolean") return String(value);
  return "—";
}
function profileStatus(profile: DatasetProfile | null, running: boolean, failed: boolean): ProfileState {
  if (running) return "running";
  if (failed) return "failed";
  const status = (profile?.status ?? "not_started").toLowerCase();
  if (["completed", "complete", "ready", "success", "succeeded"].includes(status)) return "completed";
  if (["running", "profiling", "processing", "in_progress"].includes(status)) return "running";
  if (["failed", "error"].includes(status)) return "failed";
  return "pending";
}

function MetricCard({ label, value, icon: Icon, detail }: {
  label: string; value: string; icon: typeof Database; detail?: string;
}) {
  return <div className="rounded-xl border border-slate-200 bg-white p-4">
    <div className="flex items-center justify-between gap-3"><p className="text-sm text-slate-500">{label}</p><Icon className="h-4 w-4 text-slate-400" aria-hidden="true" /></div>
    <p className="mt-2 break-words text-xl font-semibold tabular-nums text-slate-950">{value}</p>
    {detail && <p className="mt-1 text-xs text-slate-500">{detail}</p>}
  </div>;
}

function Panel({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
    <div className="mb-4"><h2 className="font-semibold text-slate-950">{title}</h2>{description && <p className="mt-1 text-sm text-slate-500">{description}</p>}</div>
    {children}
  </section>;
}

function StatusPanel({ status, message, onRun, disabled }: {
  status: ProfileState; message?: string; onRun: () => void; disabled: boolean;
}) {
  const config = {
    pending: { label: "Pending", cls: "bg-slate-100 text-slate-700", Icon: Clock3 },
    running: { label: "Running", cls: "bg-amber-50 text-amber-800", Icon: RefreshCw },
    completed: { label: "Completed", cls: "bg-emerald-50 text-emerald-700", Icon: CheckCircle2 },
    failed: { label: "Failed", cls: "bg-red-50 text-red-700", Icon: XCircle },
  }[status];
  const Icon = config.Icon;
  return <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3"><span className={`rounded-lg p-2 ${config.cls}`}><Icon className={`h-5 w-5 ${status === "running" ? "animate-spin" : ""}`} aria-hidden="true" /></span><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-semibold text-slate-900">Profiling {config.label.toLowerCase()}</h3><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${config.cls}`}>{config.label}</span></div><p className="mt-1 text-sm text-slate-600">{message ?? (status === "pending" ? "Profiling has not been started for this dataset." : status === "running" ? "The profile request is being processed." : status === "completed" ? "The backend returned profiling results." : "The profiling request failed. You can retry it.")}</p></div></div>
      {status !== "completed" && <button type="button" onClick={onRun} disabled={disabled || status === "running"} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"><RefreshCw className={`h-4 w-4 ${disabled || status === "running" ? "animate-spin" : ""}`} />{status === "failed" ? "Retry profiling" : status === "running" ? "Profiling…" : "Run profiling"}</button>}
    </div>
  </div>;
}

function getFindings(profile: DatasetProfile | null): Array<{ title: string; message: string; severity: string }> {
  if (!profile) return [];
  const source = profile as unknown as AnyRecord;
  const raw = source.quality_findings ?? source.findings ?? source.warnings ?? source.validation_issues ?? source.issues;
  if (!Array.isArray(raw)) return [];
  return raw.map((item, index) => {
    if (typeof item === "string") return { title: `Finding ${index + 1}`, message: item, severity: "warning" };
    const obj = record(item) ?? {};
    return {
      title: stringValue(obj.title ?? obj.name ?? obj.code) ?? `Finding ${index + 1}`,
      message: stringValue(obj.message ?? obj.description ?? obj.detail) ?? "The backend returned a finding without a message.",
      severity: stringValue(obj.severity ?? obj.level ?? obj.type) ?? "warning",
    };
  });
}

function ProfileColumnsTable({ profile }: { profile: DatasetProfile }) {
  const columns = Array.isArray(profile.columns) ? profile.columns : [];
  if (!columns.length) return <div className="rounded-xl border border-dashed border-slate-300 p-8 text-center"><Columns3 className="mx-auto h-7 w-7 text-slate-400"/><p className="mt-2 text-sm font-semibold text-slate-800">No column details available</p><p className="mt-1 text-sm text-slate-500">The current API response does not contain column-level results for this dataset.</p></div>;
  const rows = columns as unknown as AnyRecord[];
  const totalRows = numberValue(profile.row_count);
  return <div className="overflow-hidden rounded-xl border border-slate-200"><div className="overflow-x-auto"><table className="min-w-[760px] w-full divide-y divide-slate-200 text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr><th className="px-4 py-3 font-semibold">Column</th><th className="px-4 py-3 font-semibold">Data type</th><th className="px-4 py-3 text-right font-semibold">Non-empty</th><th className="px-4 py-3 text-right font-semibold">Missing</th><th className="px-4 py-3 text-right font-semibold">Missing %</th><th className="px-4 py-3 font-semibold">Sample values</th></tr></thead><tbody className="divide-y divide-slate-100 bg-white">{rows.map((column, index) => {
    const name = stringValue(column.name ?? column.column_name) ?? `Column ${index + 1}`;
    const nonEmpty = numberValue(column.non_empty_count ?? column.nonEmptyCount ?? column.non_null_count);
    const missing = numberValue(column.missing_count ?? column.missingCount ?? column.null_count);
    const missingPercent = numberValue(column.missing_percent ?? column.missing_percentage) ?? (missing !== null && totalRows ? missing / totalRows * 100 : null);
    const type = stringValue(column.data_type ?? column.dtype ?? column.type ?? column.inferred_type) ?? "Not provided";
    const samples = Array.isArray(column.sample_values) ? column.sample_values.map(display).join(", ") : display(column.sample_values);
    return <tr key={`${name}-${index}`} className="hover:bg-slate-50/70"><td className="max-w-56 break-words px-4 py-3 font-medium text-slate-900">{name}</td><td className="px-4 py-3"><span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">{type}</span></td><td className="px-4 py-3 text-right tabular-nums text-slate-700">{display(nonEmpty)}</td><td className="px-4 py-3 text-right tabular-nums text-slate-700">{display(missing)}</td><td className="px-4 py-3 text-right tabular-nums text-slate-700">{missingPercent === null ? "—" : `${missingPercent.toFixed(1)}%`}</td><td className="max-w-64 px-4 py-3 text-slate-500"><span className="line-clamp-2">{samples === "—" ? "—" : samples}</span></td></tr>;
  })}</tbody></table></div></div>;
}

export default function DatasetWorkspaceView({ section }: { section: string }) {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const datasetId = parts[1] || "";
  const base = `/datasets/${datasetId}`;
  const active = sections.find((item) => item.key === section) ?? sections[0];
  const navigation = sections.map((item) => ({ label: item.label, href: item.slug ? `${base}/${item.slug}` : base }));
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [profile, setProfile] = useState<DatasetProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [profiling, setProfiling] = useState(false);
  const [profileFailed, setProfileFailed] = useState(false);

  const loadData = useCallback(async (signal?: AbortSignal) => {
    if (!datasetId) return;
    setLoading(true);
    setLoadError(null);
    try {
      const datasetResult = await getDataset(datasetId, { signal });
      setDataset(datasetResult);
      try {
        const profileResult = await getDatasetProfile(datasetId, { signal });
        setProfile(profileResult);
        setProfileFailed(["failed", "error"].includes((profileResult.status ?? "").toLowerCase()));
      } catch (error) {
        // A profile may not exist until the user starts profiling.
        setProfile(null);
        setProfileError(error instanceof Error ? error.message : "Could not load profiling status.");
      }
    } catch (error) {
      if (signal?.aborted) return;
      setLoadError(error instanceof Error ? error.message : "Could not load dataset details.");
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }, [datasetId]);

  useEffect(() => {
    const controller = new AbortController();
    void loadData(controller.signal);
    return () => controller.abort();
  }, [loadData]);

  const status = profileStatus(profile, profiling, profileFailed);
  const findings = useMemo(() => getFindings(profile), [profile]);
  const columns = profile?.columns ?? [];
  const totalMissing = columns.reduce((sum, column) => sum + (numberValue(column.missing_count) ?? 0), 0);
  const hasMissingMetrics = columns.some((column) => numberValue(column.missing_count) !== null);

  async function runProfiling() {
    if (!datasetId) return;
    setProfiling(true);
    setProfileFailed(false);
    setProfileError(null);
    try {
      const result = await profileDataset(datasetId);
      setProfile(result);
      setProfileFailed(["failed", "error"].includes((result.status ?? "").toLowerCase()));
      if (["unavailable", "unsupported"].includes((result.status ?? "").toLowerCase())) setProfileError(result.message ?? "Profiling is not available for this dataset.");
    } catch (error) {
      setProfileFailed(true);
      setProfileError(error instanceof Error ? error.message : "Profiling failed. Please retry.");
    } finally {
      setProfiling(false);
    }
  }

  if (loading) return <div className="mx-auto max-w-5xl p-6"><div className="animate-pulse space-y-4"><div className="h-7 w-56 rounded bg-slate-200"/><div className="h-28 rounded-2xl bg-slate-100"/><div className="grid gap-3 sm:grid-cols-3"><div className="h-24 rounded-xl bg-slate-100"/><div className="h-24 rounded-xl bg-slate-100"/><div className="h-24 rounded-xl bg-slate-100"/></div></div></div>;
  if (loadError) return <div className="mx-auto max-w-3xl p-6"><ErrorState title="Could not load dataset" message={loadError} onRetry={() => void loadData()} /></div>;
  if (!dataset) return <div className="mx-auto max-w-3xl p-6"><EmptyState title="Dataset not found" description="The requested dataset was not returned by the backend." action={<Link href="/datasets" className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700">Back to datasets</Link>} /></div>;

  const rowCount = numberValue(profile?.row_count) ?? dataset.row_count;
  const columnCount = numberValue(profile?.column_count) ?? dataset.column_count;
  const backendMessage = stringValue(profile?.message);

  return <WorkspaceLayout title={dataset.name} description={`Dataset ID: ${dataset.id}`} navigation={navigation} navigationVariant="tabs" activeNavigationHref={pathname}
    headerActions={<Link href="/datasets" className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><ArrowRight className="h-4 w-4 rotate-180" aria-hidden="true"/>All datasets</Link>}>
    <PageHeader title={active.label} description={descriptions[active.key]} breadcrumb={`Datasets / ${dataset.name}`} />

    <div className="mt-5 space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="flex min-w-0 items-start gap-3"><div className="rounded-xl bg-indigo-50 p-3 text-indigo-700"><FileSpreadsheet className="h-6 w-6" aria-hidden="true"/></div><div className="min-w-0"><h2 className="break-words text-lg font-semibold text-slate-950">{dataset.name}</h2><p className="mt-1 break-all font-mono text-xs text-slate-500">{dataset.id}</p><div className="mt-3"><DatasetStatusBadge status={dataset.status}/></div></div></div><div className="inline-flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-600"><CalendarDays className="h-4 w-4" aria-hidden="true"/>Created {formatDatasetDate(dataset.created_at)}</div></div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><MetricCard label="Rows" value={formatDatasetNumber(rowCount)} icon={Rows3}/><MetricCard label="Columns" value={formatDatasetNumber(columnCount)} icon={Columns3}/><MetricCard label="Missing values" value={hasMissingMetrics ? totalMissing.toLocaleString() : "—"} icon={TriangleAlert} detail={hasMissingMetrics ? "Across profiled columns" : "Not returned by API"}/><MetricCard label="Project" value={dataset.project_id ?? "Unassigned"} icon={Database}/></div>
      </section>

      {(active.key === "overview" || active.key === "quality") && <Panel title="Profiling status" description="Status is mapped from the backend profile response; a request in progress is shown separately."><StatusPanel status={status} message={profileError ?? backendMessage ?? (profileError ? undefined : undefined)} onRun={() => void runProfiling()} disabled={profiling}/>{profileError && <p role="alert" className="mt-3 text-sm text-red-700">{profileError}</p>}</Panel>}

      {(active.key === "overview" || active.key === "columns") && <Panel title="Column summary" description="Values are displayed only when supplied by the profiling API. Missing percentage is calculated from returned missing counts and row count."><ProfileColumnsTable profile={profile ?? { dataset_id: dataset.id, status: "not_started" }}/></Panel>}

      {(active.key === "overview" || active.key === "quality") && <Panel title="Data-quality findings" description="Warnings and validation issues are read from optional findings fields in the API response; no findings are invented.">
        {findings.length ? <div className="space-y-3">{findings.map((finding, index) => { const isError = /error|critical|fail|invalid/i.test(finding.severity); return <div key={`${finding.title}-${index}`} className={`flex gap-3 rounded-xl border p-4 ${isError ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50"}`}><AlertTriangle className={`mt-0.5 h-5 w-5 shrink-0 ${isError ? "text-red-600" : "text-amber-700"}`} aria-hidden="true"/><div><div className="flex flex-wrap items-center gap-2"><p className={`font-semibold ${isError ? "text-red-900" : "text-amber-900"}`}>{finding.title}</p><span className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${isError ? "bg-red-100 text-red-800" : "bg-amber-100 text-amber-800"}`}>{finding.severity}</span></div><p className={`mt-1 text-sm ${isError ? "text-red-800" : "text-amber-800"}`}>{finding.message}</p></div></div>; })}</div> : <div className="flex items-start gap-3 rounded-xl border border-dashed border-slate-300 p-4"><Info className="mt-0.5 h-5 w-5 text-slate-400" aria-hidden="true"/><div><p className="font-medium text-slate-800">No quality findings returned</p><p className="mt-1 text-sm text-slate-500">The current backend profile contract returns column counts and sample values, but does not currently define a dedicated quality-findings payload. This section will display warnings when the API provides them.</p></div></div>}
      </Panel>}

      {active.key === "columns" && profile && <Panel title="Available statistics" description="Additional statistics appear when included in each column's API object."><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">{columns.map((column, index) => { const obj = column as unknown as AnyRecord; const stats = record(obj.statistics ?? obj.stats) ?? obj; const keys = ["unique_count", "unique_values", "distinct_count", "mean", "median", "std", "min", "max", "outlier_count", "cardinality"]; const available = keys.filter((key) => stats[key] !== undefined && stats[key] !== null); return <div key={`${column.name}-${index}`} className="rounded-xl border border-slate-200 p-4"><h3 className="truncate font-semibold text-slate-900">{column.name}</h3>{available.length ? <dl className="mt-3 space-y-2">{available.map((key) => <div key={key} className="flex items-center justify-between gap-3 text-sm"><dt className="capitalize text-slate-500">{key.replaceAll("_", " ")}</dt><dd className="font-medium tabular-nums text-slate-800">{display(stats[key])}</dd></div>)}</dl> : <p className="mt-2 text-sm text-slate-500">No additional statistics supplied.</p>}</div>; })}</div></Panel>}

      {!["overview", "quality", "columns"].includes(active.key) && <Panel title={`${active.label} data`} description={descriptions[active.key]}><EmptyState title={`${active.label} not provided by this API response`} description="The current profiling endpoint does not return this analysis yet. This view avoids showing fabricated charts or recommendations." action={<button type="button" onClick={() => void loadData()} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Refresh data</button>}/></Panel>}

      <div className="flex flex-wrap gap-2">{sections.filter((item) => item.key !== active.key).map((item) => <Link key={item.key} href={item.slug ? `${base}/${item.slug}` : base} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-700">{item.label}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true"/></Link>)}</div>
    </div>
  </WorkspaceLayout>;
}
