"use client";

import Link from "next/link";
import { Database, RefreshCw, UploadCloud } from "lucide-react";
import DatasetTable from "@/components/datasets/DatasetTable";
import DatasetPagination from "@/components/datasets/DatasetPagination";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";
import { useDatasets } from "@/hooks/useDatasets";

export default function DatasetsPage() {
  const {
    datasets,
    page,
    pageSize,
    total,
    loading,
    error,
    setPage,
    setPageSize,
    refresh,
  } = useDatasets();

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-6 p-4 sm:p-6 lg:p-8">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <Database className="h-3.5 w-3.5" aria-hidden="true" />
            Data workspace · Mock mode
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Datasets</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Browse datasets, review their status, and open a dataset workspace.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button type="button" onClick={refresh} disabled={loading} className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50">
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} aria-hidden="true" /> Refresh
          </button>
          <Link href="/datasets/upload" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700">
            <UploadCloud className="h-4 w-4" aria-hidden="true" /> Upload dataset
          </Link>
        </div>
      </header>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">All datasets</h2>
            <p className="mt-1 text-sm text-slate-500">Select a dataset name to open Overview, Data Quality, Columns, Distributions, Correlations and Recommendations.</p>
          </div>
          <p className="text-sm font-medium tabular-nums text-slate-600">
            {total.toLocaleString("en-IN")} datasets
          </p>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : loading ? (
          <LoadingState label="Loading datasets" rows={5} />
        ) : (
          <>
            <DatasetTable datasets={datasets} />
            <DatasetPagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
            />
          </>
        )}
      </section>
      <p className="text-xs text-slate-400">
        Frontend demo data only. No FastAPI request is made on this page.
      </p>
    </main>
  );
}
