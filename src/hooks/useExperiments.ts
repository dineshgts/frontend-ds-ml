"use client";

import { useCallback } from "react";
import { getExperiments } from "@/api/experiments";
import { useResourceList } from "@/hooks/useResourceList";

export function useExperiments() {
  const loader = useCallback(getExperiments, []);
  const result = useResourceList(loader);
  return { experiments: result.items, loading: result.loading, error: result.error, refetch: result.refetch };
}
