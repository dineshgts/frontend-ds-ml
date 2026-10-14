import { apiGet } from "@/api/client";
import type { Model } from "@/types/model";

export function getModels(options: { signal?: AbortSignal } = {}): Promise<Model[]> {
  return apiGet<Model[]>("/models", { signal: options.signal });
}
