import { apiGet } from "@/api/client";
import type { Project } from "@/types/project";

export function getProjects(options: { simulateError?: boolean; signal?: AbortSignal } = {}): Promise<Project[]> {
  const query = options.simulateError ? "?simulateError=true" : "";
  return apiGet<Project[]>(`/projects${query}`, { signal: options.signal });
}
