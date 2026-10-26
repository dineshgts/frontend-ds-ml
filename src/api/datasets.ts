import { apiGet } from "@/api/client";
import type { Dataset } from "@/types/dataset";

type Team2Dataset = {
  dataset_id: string;
  dataset_name: string;
  row_count: number;
  column_count: number;
  status: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

type DatasetEnvelope = {
  success: boolean;
  message?: string;
  data: Team2Dataset[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeDataset(value: unknown): Dataset {
  if (!isRecord(value)) {
    throw new Error("Invalid dataset response: each dataset must be an object.");
  }

  // Current locally verified prototype schema.
  if (
    typeof value.id === "string" &&
    typeof value.name === "string"
  ) {
    return {
      id: value.id,
      name: value.name,
      status: typeof value.status === "string" ? value.status as Dataset["status"] : undefined,
      rowCount: typeof value.rowCount === "number" ? value.rowCount : undefined,
      columnCount: typeof value.columnCount === "number" ? value.columnCount : undefined,
      description: typeof value.description === "string" ? value.description : undefined,
      createdAt: typeof value.createdAt === "string" ? value.createdAt : undefined,
      updatedAt: typeof value.updatedAt === "string" ? value.updatedAt : undefined,
    };
  }

  // Team 2's proposed API Contract v1 envelope schema.
  if (
    typeof value.dataset_id === "string" &&
    typeof value.dataset_name === "string"
  ) {
    return {
      id: value.dataset_id,
      name: value.dataset_name,
      status: typeof value.status === "string" ? value.status as Dataset["status"] : undefined,
      rowCount: typeof value.row_count === "number" ? value.row_count : undefined,
      columnCount: typeof value.column_count === "number" ? value.column_count : undefined,
      description: typeof value.description === "string" ? value.description : undefined,
      createdAt: typeof value.created_at === "string" ? value.created_at : undefined,
      updatedAt: typeof value.updated_at === "string" ? value.updated_at : undefined,
    };
  }

  throw new Error("Invalid dataset response: expected id/name or dataset_id/dataset_name fields.");
}

export async function getDatasets(options: { signal?: AbortSignal } = {}): Promise<Dataset[]> {
  const response: unknown = await apiGet<unknown>("/datasets", { signal: options.signal });

  // Current prototype returns a direct array. Also accept Team 2's documented envelope
  // so the UI can tolerate either response shape while the contract is being finalized.
  if (Array.isArray(response)) {
    return response.map(normalizeDataset);
  }

  if (isRecord(response) && Array.isArray(response.data)) {
    if (response.success === false) {
      throw new Error(typeof response.message === "string" ? response.message : "Dataset request was not successful.");
    }
    return response.data.map(normalizeDataset);
  }

  throw new Error("Invalid dataset response: expected a list or an object containing data.");
}

export async function getDataset(id: string, options: { signal?: AbortSignal } = {}): Promise<Dataset> {
  const response: unknown = await apiGet<unknown>(`/datasets/${encodeURIComponent(id)}`, { signal: options.signal });
  if (isRecord(response) && "data" in response) {
    return normalizeDataset(response.data);
  }
  return normalizeDataset(response);
}
