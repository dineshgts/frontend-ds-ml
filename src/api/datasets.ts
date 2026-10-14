import { apiGet } from "@/api/client";
import type { Dataset } from "@/types/dataset";

export function getDatasets(options: { signal?: AbortSignal } = {}): Promise<Dataset[]> {
  return apiGet<Dataset[]>("/datasets", { signal: options.signal });
}

export function getDataset(id: string, options: { signal?: AbortSignal } = {}): Promise<Dataset> {
  return apiGet<Dataset>(`/datasets/${encodeURIComponent(id)}`, { signal: options.signal });
}
