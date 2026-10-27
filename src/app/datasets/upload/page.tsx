"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { FormEvent } from "react";
import { ArrowLeft, CheckCircle2, FileUp, UploadCloud, X } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import ErrorState from "@/components/common/ErrorState";
import { uploadDataset } from "@/api/datasets";

const ACCEPTED_EXTENSIONS = [".csv", ".xlsx", ".xls"];
const MAX_FILE_SIZE = 25 * 1024 * 1024;

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function DatasetUploadPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [datasetName, setDatasetName] = useState("");
  const [projectId, setProjectId] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submissionState, setSubmissionState] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [simulateError, setSimulateError] = useState(false);

  function selectFile(selected: File | null) {
    setValidationError(null);
    setSubmissionState("idle");
    if (!selected) {
      setFile(null);
      return;
    }

    const lowerName = selected.name.toLowerCase();
    const accepted = ACCEPTED_EXTENSIONS.some((extension) => lowerName.endsWith(extension));
    if (!accepted) {
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      setValidationError("Unsupported file type. Choose a CSV, XLS, or XLSX file.");
      return;
    }
    if (selected.size === 0) {
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      setValidationError("The selected file is empty. Choose a file that contains data.");
      return;
    }
    if (selected.size > MAX_FILE_SIZE) {
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      setValidationError("The file is larger than the 25 MB upload limit.");
      return;
    }
    setFile(selected);
    if (!datasetName.trim()) setDatasetName(selected.name.replace(/\.[^.]+$/, ""));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(null);
    if (!file) {
      setValidationError("Select a dataset file before continuing.");
      return;
    }
    if (simulateError) {
      setSubmissionState("error");
      setValidationError("Simulated submission error is enabled. Turn it off to upload to the API.");
      return;
    }
    setSubmissionState("submitting");
    try {
      await uploadDataset(file);
      setSubmissionState("success");
    } catch (cause: unknown) {
      setSubmissionState("error");
      setValidationError(cause instanceof Error ? cause.message : "Upload failed. Please try again.");
    }
  }

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 p-4 sm:p-6 lg:p-8">
      <Link href="/datasets" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-indigo-700">
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to datasets
      </Link>
      <PageHeader title="Upload dataset" description="Upload a CSV or Excel dataset to the FastAPI backend (maximum 25 MB)." />

      <form onSubmit={submit} className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
        <div>
          <label htmlFor="dataset-name" className="mb-2 block text-sm font-semibold text-slate-800">Dataset name <span className="text-red-600">*</span></label>
          <input id="dataset-name" value={datasetName} onChange={(event) => setDatasetName(event.target.value)} maxLength={120} placeholder="e.g. Customer Sales Dataset" className="min-h-11 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
        </div>

        <div>
          <label htmlFor="project-id" className="mb-2 block text-sm font-semibold text-slate-800">Project ID <span className="font-normal text-slate-400">(optional)</span></label>
          <input id="project-id" value={projectId} onChange={(event) => setProjectId(event.target.value)} placeholder="e.g. prj_001" className="min-h-11 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100" />
          <p className="mt-1 text-xs text-slate-500">Project association is not supported by the current upload API.</p>
        </div>

        <div>
          <span className="mb-2 block text-sm font-semibold text-slate-800">Dataset file <span className="text-red-600">*</span></span>
          <input ref={inputRef} id="dataset-file" type="file" accept=".csv,.tsv,.xlsx,.xls,.json,text/csv,application/json" onChange={(event) => selectFile(event.target.files?.[0] ?? null)} className="sr-only" />
          <button type="button" onClick={() => inputRef.current?.click()} className="flex min-h-44 w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-indigo-400 hover:bg-indigo-50/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-indigo-600">
            <UploadCloud className="mb-3 h-8 w-8 text-indigo-600" aria-hidden="true" />
            <span className="font-semibold text-slate-900">Choose a file to upload</span>
            <span className="mt-1 text-sm text-slate-500">CSV, XLS or XLSX · Maximum 25 MB</span>
          </button>
          {file ? (
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
              <FileUp className="h-5 w-5 shrink-0 text-emerald-700" aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-emerald-900">{file.name}</p>
                <p className="text-xs text-emerald-800">{formatSize(file.size)} · File type accepted</p>
              </div>
              <button type="button" onClick={() => { selectFile(null); if (inputRef.current) inputRef.current.value = ""; }} aria-label="Remove selected file" className="rounded-lg p-2 text-emerald-800 hover:bg-emerald-100"><X className="h-4 w-4" /></button>
            </div>
          ) : null}
        </div>

        {validationError ? <div role="alert" className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">{validationError}</div> : null}
        {submissionState === "success" ? (
          <div role="status" className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
            <div><p className="font-semibold">Dataset uploaded successfully</p><p className="mt-1">The API accepted the file and registered its metadata. Return to the dataset list to view it.</p></div>
          </div>
        ) : null}
        {submissionState === "error" ? <ErrorState title="Dataset upload failed" message={validationError ?? "The API could not accept this file. Please retry."} onRetry={() => { setSubmissionState("idle"); setValidationError(null); }} /> : null}

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <label className="flex items-center gap-2 text-xs text-slate-500"><input type="checkbox" checked={simulateError} onChange={(event) => setSimulateError(event.target.checked)} className="rounded border-slate-300" /> Simulate an upload error for testing</label>
          <button type="submit" disabled={submissionState === "submitting"} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-wait disabled:opacity-60">
            {submissionState === "submitting" ? "Submitting…" : "Submit dataset"}
          </button>
        </div>
      </form>
    </main>
  );
}
