"use client";

import { useCallback } from "react";
import { getModels } from "@/api/models";
import { useResourceList } from "@/hooks/useResourceList";

export function useModels() {
  const loader = useCallback(getModels, []);
  const result = useResourceList(loader);
  return { models: result.items, loading: result.loading, error: result.error, refetch: result.refetch };
}
