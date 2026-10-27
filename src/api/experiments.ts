import { apiGet, apiPost } from "@/api/client";
import type { Experiment } from "@/types/experiment";

type Envelope<T> = { success?: boolean; message?: string; data: T };

function unwrap<T>(value: unknown): T {
  if (typeof value === "object" && value !== null && "data" in value) {
    const envelope = value as Envelope<T>;
    if (envelope.success === false) throw new Error(envelope.message || "Experiment request failed.");
    return envelope.data;
  }
  return value as T;
}

function normalizeExperiment(value: unknown): Experiment {
  if (typeof value !== "object" || value === null) throw new Error("Invalid experiment response.");
  const item = value as Record<string, unknown>;
  const id = item.id ?? item.experiment_id;
  const datasetId = item.datasetId ?? item.dataset_id;
  if (typeof id !== "string") throw new Error("Invalid experiment response: missing experiment ID.");
  return {
    id,
    name: typeof item.name === "string" ? item.name : "Untitled experiment",
    description: typeof item.description === "string" ? item.description : undefined,
    datasetId: typeof datasetId === "string" ? datasetId : undefined,
    status: typeof item.status === "string" ? item.status as Experiment["status"] : "draft",
    createdAt: typeof item.createdAt === "string" ? item.createdAt : undefined,
    updatedAt: typeof item.updatedAt === "string" ? item.updatedAt : undefined,
  };
}

export async function getExperiments(options: { signal?: AbortSignal } = {}): Promise<Experiment[]> {
  const response = await apiGet<unknown>("/api/v1/experiments", { signal: options.signal });
  const data = unwrap<unknown>(response);
  if (!Array.isArray(data)) throw new Error("Invalid experiment response: expected a list.");
  return data.map(normalizeExperiment);
}

export async function getExperiment(id: string, options: { signal?: AbortSignal } = {}): Promise<Experiment> {
  const response = await apiGet<unknown>(`/api/v1/experiments/${encodeURIComponent(id)}`, { signal: options.signal });
  return normalizeExperiment(unwrap(response));
}

export interface CreateExperimentInput {
  name: string;
  dataset_id: string;
  target_column?: string;
  problem_type?: string;
  description?: string;
}

export async function createExperiment(payload: CreateExperimentInput, options: { signal?: AbortSignal } = {}): Promise<Experiment> {
  const response = await apiPost<unknown, CreateExperimentInput>("/api/v1/experiments", payload, options);
  return normalizeExperiment(unwrap(response));
}
