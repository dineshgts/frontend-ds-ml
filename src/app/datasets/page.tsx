"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { getDatasets } from "@/api/datasets";
import type { Dataset } from "@/types/dataset";
import { ApiRequestError } from "@/api/client";

export default function DatasetsPage() {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
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

  return (
    <PageContainer>
      <PageHeader
        title="Datasets"
        description="Browse datasets and open a dataset workspace."
      />

      <section className="mb-5 rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-semibold text-slate-900">HR sample dataset</h2>
            <p className="mt-1 text-sm text-slate-600">
              Download the sample HR data and upload it through your backend's dataset-upload workflow.
            </p>
            <p className="mt-1 text-xs text-slate-500">
              290 employee records · 11 columns · generated from the HR Excel tables supplied by Team 2
            </p>
          </div>
          <a
            href="/sample-data/HR_Sample_Dataset.csv"
            download
            className="inline-flex shrink-0 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            Download HR CSV
          </a>
        </div>
      </section>

      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">Available datasets</h2>
        <button
          type="button"
          onClick={() => setRetryKey((key) => key + 1)}
          disabled={loading}
          className="rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {loading && (
        <div role="status" className="rounded-xl border border-slate-200 bg-white p-5 text-sm text-slate-500">
          Loading datasets from the API...
        </div>
      )}

      {!loading && error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5">
          <p className="font-medium text-red-800">Could not load datasets</p>
          <p className="mt-1 text-sm text-red-700">{error}</p>
          <p className="mt-2 text-sm text-red-700">
            Check that FastAPI is running and NEXT_PUBLIC_API_URL points to the correct backend.
          </p>
          <button
            type="button"
            onClick={() => setRetryKey((key) => key + 1)}
            className="mt-3 rounded-lg border border-red-300 px-3 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && datasets.length === 0 && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-500">
          No datasets found. Upload a dataset through the backend when the upload endpoint is available.
        </div>
      )}

      {!loading && !error && datasets.length > 0 && (
        <div className="grid gap-4">
          {datasets.map((dataset) => (
            <article
              key={dataset.id}
              className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">{dataset.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">ID: {dataset.id}</p>
                  {dataset.description && (
                    <p className="mt-2 text-sm text-slate-600">{dataset.description}</p>
                  )}
                </div>
                {dataset.status && (
                  <span className="inline-flex w-fit rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {dataset.status}
                  </span>
                )}
              </div>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-slate-600">
                {typeof dataset.rowCount === "number" && <span>Rows: {dataset.rowCount.toLocaleString()}</span>}
                {typeof dataset.columnCount === "number" && <span>Columns: {dataset.columnCount}</span>}
              </div>
              <Link
                href={`/datasets/${encodeURIComponent(dataset.id)}`}
                className="mt-4 inline-flex text-sm font-medium text-indigo-700 hover:text-indigo-900"
              >
                Open workspace →
              </Link>
            </article>
          ))}
        </div>
      )}
    </PageContainer>
  );
}
