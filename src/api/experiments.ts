import { apiGet } from "@/api/client";
import type { Experiment } from "@/types/experiment";

export function getExperiments(options: { signal?: AbortSignal } = {}): Promise<Experiment[]> {
  return apiGet<Experiment[]>("/experiments", { signal: options.signal });
}

export function getExperiment(id: string, options: { signal?: AbortSignal } = {}): Promise<Experiment> {
  return apiGet<Experiment>(`/experiments/${encodeURIComponent(id)}`, { signal: options.signal });
}
