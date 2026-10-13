"use client";

import { useCallback, useEffect, useState } from "react";
import { getProjects } from "@/api/projects";
import type { Project } from "@/types/project";

interface UseProjectsOptions {
  simulateError?: boolean;
}

export function useProjects({ simulateError = false }: UseProjectsOptions = {}) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState(0);

  const refetch = useCallback(() => setRequestId((current) => current + 1), []);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    getProjects({ simulateError, signal: controller.signal })
      .then(setProjects)
      .catch((cause: unknown) => {
        if (cause instanceof Error && cause.name === "AbortError") return;
        setError(cause instanceof Error ? cause.message : "An unexpected error occurred.");
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });

    return () => controller.abort();
  }, [simulateError, requestId]);

  return { projects, loading, error, refetch };
}
