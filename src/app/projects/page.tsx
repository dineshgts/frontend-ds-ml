"use client";

import { useState } from "react";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
import { useProjects } from "@/hooks/useProjects";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value));
}

export default function ProjectsPage() {
  const [simulateError, setSimulateError] = useState(false);
  const { projects, loading, error, refetch } = useProjects({ simulateError });

  return (
    <PageContainer>
      <PageHeader
        title="Projects"
        description="Representative API integration showing request, response, loading, and error handling."
        actions={
          <button
            type="button"
            onClick={() => { setSimulateError(false); refetch(); }}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Retry request
          </button>
        }
      />

      <section className="space-y-5" aria-live="polite">
        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">API connection test</p>
            <p className="mt-1 text-sm text-slate-500">GET {process.env.NEXT_PUBLIC_API_URL ?? "/api/demo"}/projects</p>
          </div>
          <button
            type="button"
            onClick={() => setSimulateError((value) => !value)}
            aria-pressed={simulateError}
            className={`rounded-lg px-3 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 ${simulateError ? "bg-rose-50 text-rose-700" : "border border-slate-200 text-slate-700 hover:bg-slate-50"}`}
          >
            {simulateError ? "Error simulation: ON" : "Test error state"}
          </button>
        </div>

        {loading && (
          <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-6 text-sm text-slate-600">
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" aria-hidden="true" />
            <span>Loading projects from the API…</span>
          </div>
        )}

        {!loading && error && (
          <div role="alert" className="rounded-xl border border-rose-200 bg-rose-50 p-5">
            <p className="font-semibold text-rose-900">Unable to load projects</p>
            <p className="mt-1 text-sm text-rose-800">{error}</p>
            <button type="button" onClick={refetch} className="mt-4 rounded-lg bg-rose-700 px-3 py-2 text-sm font-medium text-white hover:bg-rose-800">
              Try again
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">Response received successfully</p>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">HTTP 200 expected</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projects.map((project) => (
                <article key={project.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-semibold text-slate-900">{project.name}</h2>
                    <span className={`shrink-0 rounded-full px-2 py-1 text-xs font-medium capitalize ${project.status === "active" ? "bg-emerald-50 text-emerald-700" : project.status === "completed" ? "bg-slate-100 text-slate-600" : "bg-amber-50 text-amber-700"}`}>
                      {project.status}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-slate-500">{project.description}</p>
                  <p className="mt-5 border-t border-slate-100 pt-3 text-xs text-slate-400">Updated {formatDate(project.updatedAt)}</p>
                </article>
              ))}
            </div>
            <details className="rounded-xl border border-slate-200 bg-white p-4">
              <summary className="cursor-pointer text-sm font-semibold text-slate-700">View raw JSON response</summary>
              <pre className="mt-3 overflow-x-auto rounded-lg bg-slate-950 p-4 text-xs leading-5 text-slate-100">{JSON.stringify(projects, null, 2)}</pre>
            </details>
          </>
        )}
      </section>
    </PageContainer>
  );
}
