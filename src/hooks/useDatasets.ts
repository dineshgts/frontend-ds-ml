"use client";

import { useCallback } from "react";
import { getDatasets } from "@/api/datasets";
import { useResourceList } from "@/hooks/useResourceList";

export function useDatasets() {
  const loader = useCallback(getDatasets, []);
  const result = useResourceList(loader);
  return { datasets: result.items, loading: result.loading, error: result.error, refetch: result.refetch };
}
