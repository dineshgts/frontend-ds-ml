
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Database, RefreshCw, UploadCloud } from "lucide-react";

import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import DatasetTable from "@/components/datasets/DatasetTable";
import DatasetPagination from "@/components/datasets/DatasetPagination";
import LoadingState from "@/components/common/LoadingState";
import ErrorState from "@/components/common/ErrorState";

import { getDatasets } from "@/api/datasets";
import { ApiRequestError } from "@/api/client";
import type { Dataset } from "@/types/dataset";

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    setLoading(true);
    setError("");

    getDatasets({ signal: controller.signal })
      .then((data) => setDatasets(data))
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;

        setError(
          err instanceof ApiRequestError || err instanceof Error
            ? err.message
            : "Unable to load datasets. Please try again."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [retryKey]);

  const refresh = () => setRetryKey((key) => key + 1);

  const total = datasets.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedDatasets = datasets.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <PageContainer>
      <PageHeader
        title="Datasets"
        description="Browse datasets, review their status, and open a dataset workspace."
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
          <Database className="h-4 w-4" aria-hidden="true" />
          Data workspace · API mode
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={refresh}
            disabled={loading}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
            Refresh
          </button>

          <Link
            href="/datasets/upload"
            className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            <UploadCloud className="h-4 w-4" aria-hidden="true" />
            Upload dataset
          </Link>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <div className="flex flex-col gap-1 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">All datasets</h2>
            <p className="mt-1 text-sm text-slate-500">
              Select a dataset to open its workspace.
            </p>
          </div>

          <p className="text-sm font-medium tabular-nums text-slate-600">
            {total.toLocaleString("en-IN")} datasets
          </p>
        </div>

        {error ? (
          <ErrorState message={error} onRetry={refresh} />
        ) : loading ? (
          <LoadingState label="Loading datasets from API" rows={5} />
        ) : total === 0 ? (
          <div className="p-6 text-sm text-slate-500">
            No datasets found. Upload a dataset if the backend upload endpoint is available.
          </div>
        ) : (
          <>
            <DatasetTable datasets={paginatedDatasets} />

            <DatasetPagination
              page={currentPage}
              pageSize={pageSize}
              total={total}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setPage(1);
              }}
            />
          </>
        )}
      </section>

      <section className="mt-5 rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="font-semibold text-slate-900">HR sample dataset</h2>
        <p className="mt-1 text-sm text-slate-600">
          Download the sample HR data for testing the dataset upload workflow.
        </p>
        <a
          href="/sample-data/HR_Sample_Dataset.csv"
          download
          className="mt-3 inline-flex text-sm font-medium text-indigo-700 hover:text-indigo-900"
        >
          Download HR CSV →
        </a>
      </section>
    </PageContainer>
  );
}
