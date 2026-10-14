import { apiGet } from "@/api/client";
import type { Report } from "@/types/model";

export function getReports(options: { signal?: AbortSignal } = {}): Promise<Report[]> {
  return apiGet<Report[]>("/reports", { signal: options.signal });
}
