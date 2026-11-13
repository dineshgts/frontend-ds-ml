import { apiGet, apiPost, apiUpload } from "@/api/client";
import type { ProfilingResponse } from "@/api/team2-contract";
import type { Dataset } from "@/types/dataset";

type RecordValue = Record<string, unknown>;
function isRecord(value: unknown): value is RecordValue { return typeof value === "object" && value !== null && !Array.isArray(value); }

function normalizeDataset(value: unknown): Dataset {
  if (!isRecord(value)) throw new Error("Invalid dataset response: expected a dataset object.");
  const id = value.dataset_id ?? value.id;
  const name = value.dataset_name ?? value.name;
  if (typeof id !== "string" || typeof name !== "string") throw new Error("Invalid Team 2 dataset response: missing dataset_id or dataset_name.");
  const rows = value.rows ?? value.row_count ?? value.rowCount;
  const columns = value.columns ?? value.column_count ?? value.columnCount;
  const createdAt = value.uploaded_at ?? value.created_at ?? value.createdAt;
  const versionValue = value.version ?? value.dataset_version;
  const version = typeof versionValue === "string" ? versionValue : null;
  const rawStatus = typeof value.status === "string" ? value.status.toLowerCase() : "uploaded";
  const status: Dataset["status"] = rawStatus === "validating" ? "validating" : rawStatus === "profiling" ? "profiling" : rawStatus === "ready" ? "ready" : rawStatus === "failed" ? "failed" : "uploaded";
  return { id, name, project_id: typeof value.project_id === "string" ? value.project_id : null, row_count: typeof rows === "number" ? rows : null, column_count: typeof columns === "number" ? columns : null, status, created_at: typeof createdAt === "string" ? createdAt : "", version };
}

export async function getDatasets(options: { signal?: AbortSignal } = {}): Promise<Dataset[]> {
  const response = await apiGet<unknown>("/datasets", options);
  if (!isRecord(response) || !Array.isArray(response.datasets)) throw new Error("Invalid Team 2 dataset list response: expected a datasets array.");
  return response.datasets.map(normalizeDataset);
}
export async function getDataset(id: string, options: { signal?: AbortSignal } = {}): Promise<Dataset> {
  const response = await apiGet<unknown>(`/datasets/${encodeURIComponent(id)}`, options);
  if (!isRecord(response) || !("dataset" in response)) throw new Error("Invalid Team 2 dataset detail response: expected a dataset property.");
  return normalizeDataset(response.dataset);
}
export interface DatasetUploadResult { dataset: Dataset; originalFilename: string; accepted: boolean; message: string; }
export async function uploadDataset(file: File, options: { signal?: AbortSignal } = {}): Promise<DatasetUploadResult> {
  const response = await apiUpload<unknown>("/api/v1/datasets/upload", file, "file", options);
  if (!isRecord(response) || !isRecord(response.dataset)) throw new Error("Upload response did not contain the expected dataset object.");
  return { dataset: normalizeDataset(response.dataset), originalFilename: file.name, accepted: response.status === "accepted" || response.status === "duplicate_request", message: typeof response.message === "string" ? response.message : "Upload accepted." };
}

export interface DatasetProcessingResult { dataset_context?: RecordValue; status?: string; service_status?: RecordValue; downstream_context?: RecordValue; profiling?: ProfilingResponse; quality?: RecordValue; semantic_analysis?: RecordValue; }
export async function getDatasetProcessingResult(datasetId: string, options: { signal?: AbortSignal } = {}): Promise<DatasetProcessingResult> {
  return apiGet<DatasetProcessingResult>(`/api/v1/datasets/${encodeURIComponent(datasetId)}/profile`, options);
}
export async function startDatasetProcessing(datasetId: string, options: { signal?: AbortSignal } = {}) {
  return apiPost<{ status: string; message?: string; dataset_id?: string }>(`/api/v1/datasets/${encodeURIComponent(datasetId)}/profile`, {}, options);
}
export async function retryDatasetProcessing(datasetId: string, options: { signal?: AbortSignal } = {}) {
  return apiPost<{ status: string; message?: string; dataset_id?: string }>(`/api/v1/datasets/${encodeURIComponent(datasetId)}/retry`, {}, options);
}
export type DatasetProfile = ProfilingResponse;
