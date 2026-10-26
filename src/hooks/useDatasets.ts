"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { mockDatasets } from "@/data/dataset-mock";

export function useDatasets() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const total = mockDatasets.length;

  useEffect(() => {
    setLoading(true);
    setError(null);

    const timeout = window.setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);
      if (searchParams.get("mockError") === "1") {
        setError("Demo error: dataset data could not be loaded.");
      }
      setLoading(false);
    }, 250);

    return () => window.clearTimeout(timeout);
  }, [page, pageSize, refreshKey]);

  const datasets = useMemo(() => {
    const start = (page - 1) * pageSize;
    return mockDatasets.slice(start, start + pageSize);
  }, [page, pageSize, refreshKey]);

  const changePageSize = useCallback((size: number) => {
    if (!Number.isInteger(size) || size < 1 || size > 100) return;
    setPageSize(size);
    setPage(1);
  }, []);

  const refresh = useCallback(() => {
    setRefreshKey((value) => value + 1);
  }, []);

  return {
    datasets,
    page,
    pageSize,
    total,
    loading,
    error,
    setPage,
    setPageSize: changePageSize,
    refresh,
  };
}
