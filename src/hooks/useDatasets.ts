"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { getDatasets } from "@/api/datasets";
import type { Dataset } from "@/types/dataset";

export function useDatasets() {
  const [allDatasets, setAllDatasets] = useState<Dataset[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    getDatasets({ signal: controller.signal })
      .then(setAllDatasets)
      .catch((cause: unknown) => {
        if (controller.signal.aborted) return;
        setError(cause instanceof Error ? cause.message : "Unable to load datasets.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [refreshKey]);

  const total = allDatasets.length;
  const datasets = useMemo(() => {
    const start = (page - 1) * pageSize;
    return allDatasets.slice(start, start + pageSize);
  }, [allDatasets, page, pageSize]);

  const changePageSize = useCallback((size: number) => {
    if (!Number.isInteger(size) || size < 1 || size > 100) return;
    setPageSize(size);
    setPage(1);
  }, []);
  const refresh = useCallback(() => setRefreshKey((value) => value + 1), []);

  return { datasets, page, pageSize, total, loading, error, setPage, setPageSize: changePageSize, refresh };
}
