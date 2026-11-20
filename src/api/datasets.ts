import { apiGet, apiPost, apiUpload } from "@/api/client";
import type { ProfilingResponse, Team2QualityResponse } from "@/api/team2-contract";
import type { Dataset } from "@/types/dataset";

type RecordValue = Record<string, unknown>;

function isRecord(value: unknown): value is RecordValue {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

/**
 * Maps the Team 2 dataset registry record into the frontend Dataset model.
 *
 * Backend source: app/routes/datasets.py
 * Registry fields: dataset_id, dataset_name, file_name, file_format, rows,
 * columns, uploaded_at, status, processing_error, profiled_at.
 *
 * Internal fields such as storage_path and result_path are deliberately
 * not exposed to the browser.
 */
function normalizeDataset(value: unknown): Dataset {
  if (!isRecord(value)) {
    throw new Error("Invalid dataset response: expected a dataset object.");
  }

  const id = value.dataset_id ?? value.id;
  const name = value.dataset_name ?? value.name;

  if (typeof id !== "string" || typeof name !== "string") {
    throw new Error(
      "Invalid Team 2 dataset response: missing dataset_id or dataset_name."
    );
  }

  const rows = value.rows ?? value.row_count ?? value.rowCount;
  const columns = value.columns ?? value.column_count ?? value.columnCount;
  const createdAt = value.uploaded_at ?? value.created_at ?? value.createdAt;
  const versionValue = value.version ?? value.dataset_version;
  const rawStatus =
    typeof value.status === "string" ? value.status.toLowerCase() : "uploaded";

  const knownStatuses = [
    "uploaded",
    "validating",
    "profiling",
    "ready",
    "failed",
  ] as const;

  const status: Dataset["status"] = knownStatuses.includes(
    rawStatus as Dataset["status"]
  )
    ? (rawStatus as Dataset["status"])
    : "uploaded";

  return {
    id,
    name,
    project_id:
      typeof value.project_id === "string" ? value.project_id : null,
    row_count: typeof rows === "number" ? rows : null,
    column_count: typeof columns === "number" ? columns : null,
    status,
    created_at: typeof createdAt === "string" ? createdAt : "",
    version: typeof versionValue === "string" ? versionValue : null,
    file_name: typeof value.file_name === "string" ? value.file_name : null,
    file_format:
      typeof value.file_format === "string" ? value.file_format : null,
    processing_error:
      typeof value.processing_error === "string"
        ? value.processing_error
        : null,
    profiled_at:
      typeof value.profiled_at === "string" ? value.profiled_at : null,
  };
}

export const DATASET_API_PATHS = {
  list: "/datasets",
  upload: "/api/v1/datasets/upload",
  detail: (datasetId: string) => `/datasets/${encodeURIComponent(datasetId)}`,
  savedProcessingResult: (datasetId: string) =>
    `/api/v1/datasets/${encodeURIComponent(datasetId)}/profile`,
  startProcessing: (datasetId: string) =>
    `/api/v1/datasets/${encodeURIComponent(datasetId)}/profile`,
  retryProcessing: (datasetId: string) =>
    `/api/v1/datasets/${encodeURIComponent(datasetId)}/retry`,
} as const;

export async function getDatasets(
  options: { signal?: AbortSignal } = {}
): Promise<Dataset[]> {
  const response = await apiGet<unknown>(DATASET_API_PATHS.list, options);

  if (!isRecord(response) || !Array.isArray(response.datasets)) {
    throw new Error(
      "Invalid Team 2 dataset list response: expected a datasets array."
    );
  }

  return response.datasets.map(normalizeDataset);
}

export async function getDataset(
  id: string,
  options: { signal?: AbortSignal } = {}
): Promise<Dataset> {
  const response = await apiGet<unknown>(
    DATASET_API_PATHS.detail(id),
    options
  );

  if (!isRecord(response) || !("dataset" in response)) {
    throw new Error(
      "Invalid Team 2 dataset detail response: expected a dataset property."
    );
  }

  return normalizeDataset(response.dataset);
}

export interface DatasetUploadResult {
  dataset: Dataset;
  originalFilename: string;
  accepted: boolean;
  message: string;
}

export async function uploadDataset(
  file: File,
  options: { signal?: AbortSignal } = {}
): Promise<DatasetUploadResult> {
  // Team 2 accepts only multipart field "file" plus an optional
  // Idempotency-Key header. It does not accept dataset_name or project_id.
  const response = await apiUpload<unknown>(
    DATASET_API_PATHS.upload,
    file,
    "file",
    options
  );

  if (!isRecord(response) || !isRecord(response.dataset)) {
    throw new Error(
      "Upload response did not contain the expected dataset object."
    );
  }

  return {
    dataset: normalizeDataset(response.dataset),
    originalFilename: file.name,
    accepted:
      response.status === "accepted" ||
      response.status === "duplicate_request",
    message:
      typeof response.message === "string"
        ? response.message
        : "Upload accepted.",
  };
}

/**
 * GET /api/v1/datasets/{dataset_id}/profile returns the saved combined
 * orchestration result, not a bare ProfilingResponse.
 */
export interface DatasetProcessingResult {
  dataset_context?: RecordValue;
  status?: string;
  service_status?: RecordValue;
  downstream_context?: RecordValue;
  profiling?: ProfilingResponse | null;
  quality?: Team2QualityResponse | RecordValue | null;
  semantic_analysis?: RecordValue;
}

export async function getDatasetProcessingResult(
  datasetId: string,
  options: { signal?: AbortSignal } = {}
): Promise<DatasetProcessingResult> {
  return apiGet<DatasetProcessingResult>(
    DATASET_API_PATHS.savedProcessingResult(datasetId),
    options
  );
}

export async function startDatasetProcessing(
  datasetId: string,
  options: { signal?: AbortSignal } = {}
) {
  return apiPost<{ status: string; message?: string; dataset_id?: string }>(
    DATASET_API_PATHS.startProcessing(datasetId),
    {},
    options
  );
}

export async function retryDatasetProcessing(
  datasetId: string,
  options: { signal?: AbortSignal } = {}
) {
  return apiPost<{ status: string; message?: string; dataset_id?: string }>(
    DATASET_API_PATHS.retryProcessing(datasetId),
    {},
    options
  );
}

export type DatasetProfile = ProfilingResponse;
