import { apiGet } from "@/api/client";
import type { Prediction } from "@/types/model";

export function getPredictions(options: { signal?: AbortSignal } = {}): Promise<Prediction[]> {
  return apiGet<Prediction[]>("/predictions", { signal: options.signal });
}
