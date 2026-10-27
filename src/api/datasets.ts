import { apiGet, apiUpload, apiPost } from "@/api/client";
import type { Dataset } from "@/types/dataset";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function unwrap<T>(value: unknown): T {
  if (isRecord(value) && "data" in value) {
    if (value.success === false) {
      throw new Error(typeof value.message === "string" ? value.message : "The API request was not successful.");
    }
    return value.data as T;
  }
  return value as T;
}

function normalizeDataset(value: unknown): Dataset {
  if (!isRecord(value)) throw new Error("Invalid dataset response: expected a dataset object.");
  const id = value.id ?? value.dataset_id;
  const name = value.name ?? value.dataset_name;
  if (typeof id !== "string" || typeof name !== "string") {
    throw new Error("Invalid dataset response: missing dataset ID or name.");
  }
  const rowCount = value.rowCount ?? value.row_count;
  const columnCount = value.columnCount ?? value.column_count;
  return {
    id,
    name,
    project_id: typeof value.project_id === "string" ? value.project_id : null,
    row_count: typeof rowCount === "number" ? rowCount : null,
    column_count: typeof columnCount === "number" ? columnCount : null,
    status: typeof value.status === "string" ? value.status as Dataset["status"] : "uploaded",
    created_at: typeof value.created_at === "string" ? value.created_at :
      typeof value.createdAt === "string" ? value.createdAt : "",
  };
}

export async function getDatasets(options: { signal?: AbortSignal } = {}): Promise<Dataset[]> {
  // The backend retains the legacy GET /datasets endpoint and returns a direct array.
  // It also supports the v1 wrapped contract, so both response formats are accepted.
  const response = await apiGet<unknown>("/datasets", { signal: options.signal });
  const data = unwrap<unknown>(response);
  if (!Array.isArray(data)) throw new Error("Invalid dataset response: expected a list.");
  return data.map(normalizeDataset);
}

export async function getDataset(id: string, options: { signal?: AbortSignal } = {}): Promise<Dataset> {
  const response = await apiGet<unknown>(`/datasets/${encodeURIComponent(id)}`, { signal: options.signal });
  return normalizeDataset(unwrap(response));
}

export interface DatasetUploadResult {
  dataset: Dataset;
  originalFilename?: string;
}

export async function uploadDataset(file: File, options: { signal?: AbortSignal } = {}): Promise<DatasetUploadResult> {
  const response = await apiUpload<unknown>("/api/v1/datasets/upload", file, "file", options);
  const data = unwrap<unknown>(response);
  const record = isRecord(data) ? data : {};
  return {
    dataset: normalizeDataset(data),
    originalFilename: typeof record.original_filename === "string" ? record.original_filename : file.name,
  };
}

export interface DatasetProfile {
  dataset_id: string;
  status: string;
  row_count?: number;
  column_count?: number;
  columns?: Array<{ name: string; non_empty_count: number; missing_count: number; sample_values: string[] }>;
  message?: string;
}

export async function getDatasetProfile(id: string, options: { signal?: AbortSignal } = {}): Promise<DatasetProfile> {
  const response = await apiGet<unknown>(`/api/v1/datasets/${encodeURIComponent(id)}/profile`, { signal: options.signal });
  return unwrap<DatasetProfile>(response);
}

export async function profileDataset(id: string, options: { signal?: AbortSignal } = {}): Promise<DatasetProfile> {
  const response = await apiPost<unknown>(`/api/v1/datasets/${encodeURIComponent(id)}/profile`, {}, options);
  return unwrap<DatasetProfile>(response);
}
