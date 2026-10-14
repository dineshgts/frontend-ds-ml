"use client";

import { useCallback, useEffect, useState } from "react";

export type ResourceLoader<T> = (options: { signal?: AbortSignal }) => Promise<T[]>;

export function useResourceList<T>(loader: ResourceLoader<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState(0);
  const refetch = useCallback(() => setRequestId((current) => current + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);
    loader({ signal: controller.signal })
      .then(setItems)
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === "AbortError") return;
        setError(cause instanceof Error ? cause.message : "An unexpected error occurred.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [loader, requestId]);

  return { items, loading, error, refetch };
}
