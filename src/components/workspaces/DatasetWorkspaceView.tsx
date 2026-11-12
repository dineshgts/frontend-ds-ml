
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import type { ReactNode } from "react";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Columns3,
  Database,
  FileSpreadsheet,
  Play,
  RefreshCw,
  Rows3,
  ShieldCheck,
  TriangleAlert,
  XCircle,
} from "lucide-react";

import PageHeader from "@/components/layout/PageHeader";
import WorkspaceLayout from "@/components/layout/WorkspaceLayout";
import DatasetStatusBadge from "@/components/datasets/DatasetStatusBadge";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";

import {
  asQualityResponse,
  getDataset,
  getDatasetProcessingResult,
} from "@/api/datasets";

import type {
  DatasetProfile,
  DatasetQuality,
} from "@/api/datasets";

import type { Dataset } from "@/types/dataset";

import {
  formatDatasetDate,
  formatDatasetNumber,
} from "@/lib/dataset-format";

// Dataset workspace navigation
const sections = [
  { key: "overview", label: "Overview", slug: "" },
  { key: "quality", label: "Data Quality", slug: "quality" },
  { key: "columns", label: "Columns", slug: "columns" },
  { key: "distributions", label: "Distributions", slug: "distributions" },
  { key: "correlations", label: "Correlations", slug: "correlations" },
  { key: "recommendations", label: "Recommendations", slug: "recommendations" },
] as const;

// Page descriptions
const descriptions: Record<string, string> = {
  overview: "Review dataset metadata and run Team 2 data profiling.",
  quality:
    "Run Team 2 validation against a registered dataset and inspect its issue logs.",
  columns:
    "Inspect inferred data types, missing values, unique values and descriptive statistics.",
  distributions:
    "Explore numeric histograms and categorical top values returned by profiling.",
  correlations:
    "Inspect the correlation output returned by the profiling service.",
  recommendations:
    "Recommendations are not included in the current Team 2 profiling or quality contracts.",
};

type AnyRecord = Record<string, unknown>;

// Helpers
function asRecord(value: unknown): AnyRecord | null {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as AnyRecord)
    : null;
}

function numberValue(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : null;
}

function display(value: unknown): string {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "number") {
    return value.toLocaleString(undefined, {
      maximumFractionDigits: 3,
    });
  }

  if (typeof value === "string" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value);
}

// Reusable panel
function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
      <div className="mb-4">
        <h2 className="font-semibold text-slate-950">{title}</h2>

        {description && (
          <p className="mt-1 text-sm text-slate-500">
            {description}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}

// Reusable metric card
function Metric({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Database;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>{label}</span>
        <Icon className="h-4 w-4" />
      </div>

      <p className="mt-2 text-xl font-semibold text-slate-950">
        {value}
      </p>
    </div>
  );
}

// Reusable error list
function ErrorList({
  title,
  items,
}: {
  title: string;
  items: unknown[];
}) {
  if (!items.length) {
    return (
      <p className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-800">
        No {title.toLowerCase()} returned.
      </p>
    );
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => {
        const obj = asRecord(item);

        const message = obj
          ? obj.message ??
            obj.description ??
            obj.detail ??
            JSON.stringify(obj)
          : item;

        return (
          <li
            key={index}
            className="flex gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"
          >
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            {display(message)}
          </li>
        );
      })}
    </ul>
  );
}

// Main dataset workspace
export default function DatasetWorkspaceView({
  section,
}: {
  section: string;
}) {
  const pathname = usePathname();

  const datasetId =
    pathname.split("/").filter(Boolean)[1] ?? "";

  const base = `/datasets/${datasetId}`;

  const active =
    sections.find((item) => item.key === section) ?? sections[0];

  const navigation = sections.map((item) => ({
    label: item.label,
    href: item.slug ? `${base}/${item.slug}` : base,
  }));

  // Dataset state
  const [dataset, setDataset] = useState<Dataset | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Profiling state
  const [profile, setProfile] = useState<DatasetProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Quality state
  const [quality, setQuality] = useState<DatasetQuality | null>(null);
  const [qualityLoading, setQualityLoading] = useState(false);
  const [qualityError, setQualityError] = useState<string | null>(null);

  // Load dataset details
  const loadDataset = useCallback(
    async (signal?: AbortSignal) => {
      if (!datasetId) return;

      setLoading(true);
      setLoadError(null);

      try {
        setDataset(await getDataset(datasetId, { signal }));
      } catch (error) {
        if (!signal?.aborted) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Could not load dataset details."
          );
        }
      } finally {
        if (!signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [datasetId]
  );

  useEffect(() => {
    const controller = new AbortController();

    void loadDataset(controller.signal);

    return () => controller.abort();
  }, [loadDataset]);

  // Load profiling results
  async function runProfile() {
    if (!dataset) return;

    setProfileLoading(true);
    setProfileError(null);

    try {
      const result = await getDatasetProcessingResult(dataset.id);

      if (!result.profiling) {
        throw new Error(
          "The saved processing response does not contain profiling results."
        );
      }

      setProfile(result.profiling);

      const qualityResult = asQualityResponse(
        dataset.id,
        result.quality
      );

      if (qualityResult) {
        setQuality(qualityResult);
      }
    } catch (error) {
      setProfileError(
        error instanceof Error
          ? error.message
          : "Profiling results could not be loaded."
      );
    } finally {
      setProfileLoading(false);
    }
  }

  // Load quality results
  async function runQuality() {
    if (!dataset) return;

    setQualityLoading(true);
    setQualityError(null);

    try {
      const result = await getDatasetProcessingResult(dataset.id);

      const qualityResult = asQualityResponse(
        dataset.id,
        result.quality
      );

      if (!qualityResult) {
        throw new Error(
          "The saved processing response does not contain quality results."
        );
      }

      setQuality(qualityResult);
    } catch (error) {
      setQuality(null);

      setQualityError(
        error instanceof Error
          ? error.message
          : "Data-quality results could not be loaded."
      );
    } finally {
      setQualityLoading(false);
    }
  }

  // Derived values
  const profileColumns = profile?.columns ?? [];

  const totalMissing = profileColumns.reduce(
    (sum, column) =>
      sum + (numberValue(column.missing_count) ?? 0),
    0
  );

  const datasetStats = profile?.dataset;

  const summary = quality?.quality_metadata?.validation_summary;

  const correlations = profile?.correlations;

  // Loading state
  if (loading) {
    return (
      <div className="p-8 text-sm text-slate-500">
        Loading dataset…
      </div>
    );
  }

  // Error state
  if (loadError) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <ErrorState
          title="Could not load dataset"
          message={loadError}
          onRetry={() => void loadDataset()}
        />
      </div>
    );
  }

  // Dataset not found
  if (!dataset) {
    return (
      <div className="mx-auto max-w-3xl p-6">
        <EmptyState
          title="Dataset not found"
          description="The dataset details endpoint did not return this dataset."
          action={
            <Link
              href="/datasets"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Back to datasets
            </Link>
          }
        />
      </div>
    );
  }

 return (
  <>
    {/* Back button outside WorkspaceLayout */}
    <div className="mb-4 px-6 pt-4">
      <Link
        href="/datasets"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to datasets
      </Link>
    </div>

    <WorkspaceLayout
      title={dataset.name}
      description={`Dataset ID: ${dataset.id}`}
      navigation={navigation}
      navigationVariant="tabs"
      activeNavigationHref={pathname}
    >
      <PageHeader
        title={active.label}
        description={descriptions[active.key]}
        breadcrumb={`Datasets / ${dataset.name}`}
      />
      <div className="mt-5 space-y-6">

        {/* Dataset overview card */}
        <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <span className="rounded-xl bg-indigo-50 p-3 text-indigo-700">
                <FileSpreadsheet className="h-6 w-6" />
              </span>

              <div>
                <h2 className="font-semibold text-slate-950">
                  {dataset.name}
                </h2>

                <p className="mt-1 font-mono text-xs text-slate-500">
                  {dataset.id}
                </p>

                <div className="mt-2">
                  <DatasetStatusBadge status={dataset.status} />
                </div>
              </div>
            </div>

            <p className="inline-flex items-center gap-2 text-sm text-slate-500">
              <CalendarDays className="h-4 w-4" />
              Created {formatDatasetDate(dataset.created_at)}
            </p>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Metric
              label="Rows"
              value={formatDatasetNumber(
                numberValue(datasetStats?.row_count) ??
                  dataset.row_count
              )}
              icon={Rows3}
            />

            <Metric
              label="Columns"
              value={formatDatasetNumber(
                numberValue(datasetStats?.column_count) ??
                  dataset.column_count
              )}
              icon={Columns3}
            />

            <Metric
              label="Missing values"
              value={
                profile
                  ? totalMissing.toLocaleString()
                  : "—"
              }
              icon={TriangleAlert}
            />

            <Metric
              label="Duplicate rows"
              value={
                profile
                  ? display(datasetStats?.duplicate_row_count)
                  : "—"
              }
              icon={Database}
            />
          </div>
        </section>

        {/* Profiling section */}
        {(
          active.key === "overview" ||
          active.key === "columns" ||
          active.key === "distributions" ||
          active.key === "correlations"
        ) && (
          <Panel
            title="Data profiling"
            description="Loads the saved profiling result generated automatically after upload by Team 2 background processing."
          >
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void runProfile()}
                disabled={
                  profileLoading || dataset.status !== "ready"
                }
                className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {profileLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}

                {profileLoading
                  ? "Loading results…"
                  : dataset.status !== "ready"
                    ? `Processing (${dataset.status})…`
                    : profile
                      ? "Reload profiling results"
                      : "Load profiling results"}
              </button>

              {profile && (
                <span className="inline-flex items-center gap-1 text-sm text-emerald-700">
                  <CheckCircle2 className="h-4 w-4" />
                  API status: {profile.status}
                </span>
              )}
            </div>

            {profileError && (
              <div role="alert" className="mt-3">
                <ErrorState
                  title="Profiling could not be completed"
                  message={profileError}
                  onRetry={() => void runProfile()}
                />
              </div>
            )}

            {profile && (
              <p className="mt-3 text-xs text-slate-500">
                Request {profile.request_id} · Generated{" "}
                {new Date(profile.generated_at).toLocaleString()} ·{" "}
                {display(profile.duration_ms)} ms
              </p>
            )}
          </Panel>
        )}

        {/* Column profile */}
        {profile &&
          (active.key === "overview" || active.key === "columns") && (
            <Panel
              title="Column profile"
              description="Column names, inferred types, missing counts, unique counts and statistics from Team 2."
            >
              <div className="overflow-x-auto">
                <table className="min-w-[760px] w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      {[
                        "Column",
                        "Inferred type",
                        "Data type",
                        "Missing",
                        "Missing %",
                        "Unique",
                        "Identifier?",
                      ].map((item) => (
                        <th key={item} className="px-3 py-3">
                          {item}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {profileColumns.map((column) => (
                      <tr key={column.name}>
                        <td className="px-3 py-3 font-medium text-slate-900">
                          {column.name}
                        </td>

                        <td className="px-3 py-3">
                          {column.inferred_type}
                        </td>

                        <td className="px-3 py-3">
                          {column.dtype}
                        </td>

                        <td className="px-3 py-3 tabular-nums">
                          {display(column.missing_count)}
                        </td>

                        <td className="px-3 py-3 tabular-nums">
                          {display(column.missing_pct)}%
                        </td>

                        <td className="px-3 py-3 tabular-nums">
                          {display(column.unique_count)}
                        </td>

                        <td className="px-3 py-3">
                          {column.likely_identifier ? "Yes" : "No"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {profileColumns.length === 0 && (
                <p className="text-sm text-slate-500">
                  The profiling response did not contain column details.
                </p>
              )}

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {profileColumns
                  .filter((column) => column.summary)
                  .map((column) => (
                    <div
                      key={column.name}
                      className="rounded-xl border border-slate-200 p-4"
                    >
                      <h3 className="font-semibold">
                        {column.name} statistics
                      </h3>

                      <dl className="mt-2 grid grid-cols-2 gap-2 text-sm">
                        {Object.entries(column.summary ?? {}).map(
                          ([key, value]) => (
                            <div key={key}>
                              <dt className="text-slate-500">
                                {key.replaceAll("_", " ")}
                              </dt>

                              <dd className="font-medium">
                                {display(value)}
                              </dd>
                            </div>
                          )
                        )}
                      </dl>
                    </div>
                  ))}
              </div>
            </Panel>
          )}

        {/* Distributions */}
        {profile && active.key === "distributions" && (
          <Panel
            title="Column distributions"
            description="Numeric histograms and categorical top values returned by the profiling API."
          >
            <div className="space-y-4">
              {profileColumns.map((column) => (
                <div
                  key={column.name}
                  className="rounded-xl border border-slate-200 p-4"
                >
                  <h3 className="font-semibold">
                    {column.name}
                    <span className="ml-2 text-xs font-normal text-slate-500">
                      {column.inferred_type}
                    </span>
                  </h3>

                  {column.histogram?.length ? (
                    <div className="mt-3 flex h-36 items-end gap-1 border-b border-slate-200 pb-1">
                      {column.histogram.map((bin, index) => {
                        const max = Math.max(
                          1,
                          ...column.histogram!.map((item) => item.count)
                        );

                        return (
                          <div
                            key={index}
                            title={`${bin.start}–${bin.end}: ${bin.count}`}
                            className="flex-1 rounded-t bg-indigo-500"
                            style={{
                              height: `${Math.max(
                                2,
                                (bin.count / max) * 100
                              )}%`,
                            }}
                          />
                        );
                      })}
                    </div>
                  ) : column.top_values?.length ? (
                    <div className="mt-3 space-y-2">
                      {column.top_values.map((item, index) => (
                        <div
                          key={index}
                          className="grid grid-cols-[minmax(0,1fr)_3fr_auto] items-center gap-3 text-sm"
                        >
                          <span className="truncate">
                            {display(item.value)}
                          </span>

                          <div className="h-2 rounded bg-slate-100">
                            <div
                              className="h-2 rounded bg-indigo-500"
                              style={{
                                width: `${Math.max(
                                  0,
                                  Math.min(100, item.percentage)
                                )}%`,
                              }}
                            />
                          </div>

                          <span className="tabular-nums text-slate-500">
                            {item.percentage}%
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-slate-500">
                      No distribution values returned for this column.
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Panel>
        )}

        {/* Correlations */}
        {profile && active.key === "correlations" && (
          <Panel
            title="Correlation results"
            description="Correlation pairs returned by Team 2's profiling API."
          >
            <div className="overflow-x-auto">
              {correlations?.length ? (
                <table className="w-full min-w-[520px] text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-3">Column A</th>
                      <th className="px-3 py-3">Column B</th>
                      <th className="px-3 py-3">Coefficient</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {correlations.map((pair, index) => (
                      <tr
                        key={`${pair.column_a}-${pair.column_b}-${index}`}
                      >
                        <td className="px-3 py-3 font-medium">
                          {pair.column_a}
                        </td>

                        <td className="px-3 py-3">
                          {pair.column_b}
                        </td>

                        <td className="px-3 py-3 tabular-nums">
                          {display(pair.coefficient)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <EmptyState
                  title="No correlations returned"
                  description="The profiling response contains no correlation pairs for this dataset."
                />
              )}
            </div>
          </Panel>
        )}

        {/* Class distribution */}
        {profile?.class_distribution &&
          (active.key === "overview" || active.key === "columns") && (
            <Panel
              title="Class distribution"
              description={`Target column: ${profile.class_distribution.target_column}`}
            >
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <Metric
                  label="Classes"
                  value={display(profile.class_distribution.class_count)}
                  icon={Columns3}
                />

                <Metric
                  label="Majority class"
                  value={display(profile.class_distribution.majority_class)}
                  icon={CheckCircle2}
                />

                <Metric
                  label="Minority class"
                  value={display(profile.class_distribution.minority_class)}
                  icon={TriangleAlert}
                />

                <Metric
                  label="Imbalance ratio"
                  value={display(profile.class_distribution.imbalance_ratio)}
                  icon={Database}
                />
              </div>

              <div className="mt-4 space-y-2">
                {profile.class_distribution.classes.map((item) => (
                  <div
                    key={item.value}
                    className="grid grid-cols-[minmax(0,1fr)_3fr_auto] items-center gap-3 text-sm"
                  >
                    <span className="truncate">{item.value}</span>

                    <div className="h-2 rounded bg-slate-100">
                      <div
                        className="h-2 rounded bg-indigo-500"
                        style={{
                          width: `${Math.max(
                            0,
                            Math.min(100, item.percentage)
                          )}%`,
                        }}
                      />
                    </div>

                    <span className="tabular-nums text-slate-500">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-xs text-slate-500">
                Missing target values:{" "}
                {display(profile.class_distribution.missing_count)}
              </p>
            </Panel>
          )}

        {/* Quality validation */}
        {active.key === "quality" && (
          <Panel
            title="Data quality validation"
            description="Loads the quality result generated automatically for this uploaded dataset by Team 2 background processing."
          >
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void runQuality()}
                disabled={
                  qualityLoading || dataset.status !== "ready"
                }
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {qualityLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <ShieldCheck className="h-4 w-4" />
                )}

                {qualityLoading
                  ? "Loading results…"
                  : "Load quality results"}
              </button>

              <span className="text-xs text-slate-500">
                Results are generated during the upload processing workflow.
              </span>
            </div>

            {qualityError && (
              <div role="alert" className="mt-4">
                <ErrorState
                  title="Quality validation failed"
                  message={qualityError}
                  onRetry={() => void runQuality()}
                />
              </div>
            )}

            {quality && (
              <div className="mt-5 space-y-4">
                <div
                  className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
                    quality.status === "success"
                      ? "bg-emerald-50 text-emerald-800"
                      : "bg-amber-50 text-amber-900"
                  }`}
                >
                  {quality.status === "success" ? (
                    <CheckCircle2 className="h-5 w-5" />
                  ) : (
                    <XCircle className="h-5 w-5" />
                  )}

                  <span className="font-semibold">
                    {quality.message}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                  <Metric
                    label="Issues detected"
                    value={display(summary?.total_issues_detected)}
                    icon={TriangleAlert}
                  />

                  <Metric
                    label="Duplicate records"
                    value={display(summary?.total_duplicate_records)}
                    icon={Rows3}
                  />

                  <Metric
                    label="Execution mode"
                    value={display(summary?.execution_mode)}
                    icon={Clock3}
                  />

                  <Metric
                    label="Source mutated"
                    value={display(summary?.source_mutated)}
                    icon={Database}
                  />
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">Issue logs</h3>

                  <ErrorList
                    title="Issue logs"
                    items={quality.quality_metadata?.issue_logs ?? []}
                  />
                </div>

                <div>
                  <h3 className="mb-2 font-semibold">
                    Validation errors
                  </h3>

                  <ErrorList
                    title="Validation errors"
                    items={quality.quality_metadata?.errors ?? []}
                  />
                </div>

                <p className="text-xs text-slate-500">
                  Dataset: {quality.dataset_id} · Version: {quality.version}
                </p>
              </div>
            )}
          </Panel>
        )}

        {/* Recommendations */}
        {active.key === "recommendations" && (
          <Panel
            title="Recommendations"
            description="The current Team 2 API contract does not include a recommendations endpoint or response field."
          >
            <EmptyState
              title="Recommendations are not available yet"
              description="This page is retained in the workspace. It will display recommendations when an API contract is provided."
            />
          </Panel>
        )}

        {/* Empty profiling state */}
        {active.key !== "quality" &&
          active.key !== "recommendations" &&
          !profile && (
            <p className="rounded-xl border border-dashed border-slate-300 p-4 text-sm text-slate-500">
              Run data profiling to populate this section with backend results.
            </p>
          )}

        {/* Profiling warnings */}
        {profile && profile.warnings?.length > 0 && (
          <Panel title="Profiling warnings">
            <ErrorList
              title="Warnings"
              items={profile.warnings}
            />
          </Panel>
        )}

        {/* Profiling errors */}
        {profile && profile.errors?.length > 0 && (
          <Panel title="Profiling errors">
            <ErrorList
              title="Errors"
              items={profile.errors}
            />
          </Panel>
        )}

        {/* Navigation links */}
        <div className="flex flex-wrap gap-2">
          {sections
            .filter((item) => item.key !== active.key)
            .map((item) => (
              <Link
                key={item.key}
                href={item.slug ? `${base}/${item.slug}` : base}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:border-indigo-300 hover:text-indigo-700"
              >
                {item.label}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            ))}
        </div>
      </div>
    </WorkspaceLayout>
    </>
  );
}
