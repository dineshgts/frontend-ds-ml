"use client";

import Link from "next/link";
import {
  Activity,
  ArrowRight,
  Boxes,
  CircleHelp,
  Database,
  FlaskConical,
  FolderKanban,
  Plus,
  Sparkles,
} from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import DashboardSummaryCard from "./DashboardSummaryCard";
import DashboardSection from "./DashboardSection";
import RecentJobsTable from "./RecentJobsTable";
import RecentExperimentsTable from "./RecentExperimentsTable";
import ModelActivityTable from "./ModelActivityTable";
import { mockModelActivity, mockRecentExperiments, mockRecentJobs } from "@/data/dashboard-mock";

export default function DashboardOverview() {
  const { projects, loading: projectsLoading, error: projectsError, refetch } = useProjects();

  return (
    <div className="space-y-7">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Workspace overview
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Dashboard</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Monitor your datasets, experiments, model training and recent platform activity.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/datasets" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50">
            <Database className="h-4 w-4" aria-hidden="true" /> Browse datasets
          </Link>
          <Link href="/projects" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700">
            <Plus className="h-4 w-4" aria-hidden="true" /> View projects
          </Link>
        </div>
      </div>

      <div role="note" className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-950">
        <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
        <div>
          <p className="font-semibold">Demo dashboard — sample data is clearly marked.</p>
          <p className="mt-1 leading-5 text-amber-900/80">
            Project count comes from the existing local demo API. Dataset, experiment, job and model activity below use mock records until matching Python API endpoints are connected.
          </p>
        </div>
      </div>

      {projectsError && (
        <div className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800 sm:flex-row sm:items-center sm:justify-between">
          <p>Could not load the project count from the demo API: {projectsError}</p>
          <button type="button" onClick={refetch} className="w-fit rounded-lg border border-rose-300 px-3 py-1.5 font-semibold hover:bg-rose-100">Retry</button>
        </div>
      )}

      <section aria-label="Platform summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <DashboardSummaryCard
          label="Projects"
          value={projects.length}
          helper={projectsLoading ? "Loading from local demo API…" : `${projects.filter((project) => project.status === "active").length} active in demo project list`}
          icon={FolderKanban}
          iconClassName="bg-indigo-50 text-indigo-700"
          loading={projectsLoading}
          sourceLabel="Demo API"
        />
        <DashboardSummaryCard
          label="Datasets"
          value="12"
          helper="9 ready · 2 processing · 1 needs attention"
          icon={Database}
          iconClassName="bg-sky-50 text-sky-700"
          sourceLabel="Mock"
        />
        <DashboardSummaryCard
          label="Experiments"
          value="8"
          helper="2 running · 5 completed · 1 needs review"
          icon={FlaskConical}
          iconClassName="bg-violet-50 text-violet-700"
          sourceLabel="Mock"
        />
        <DashboardSummaryCard
          label="Registered models"
          value="6"
          helper="2 production · 1 awaiting approval"
          icon={Boxes}
          iconClassName="bg-emerald-50 text-emerald-700"
          sourceLabel="Mock"
        />
      </section>

      <div className="grid min-w-0 grid-cols-1 gap-6 2xl:grid-cols-[minmax(0,1.45fr)_minmax(360px,0.9fr)]">
        <RecentJobsTable jobs={mockRecentJobs} />
        <DashboardSection title="Workflow at a glance" description="From uploaded data to usable insights">
          <div className="space-y-4 p-5 sm:p-6">
            {[
              { label: "Dataset profiling", detail: "Structure, columns and data quality", percent: 100, color: "bg-emerald-500" },
              { label: "Problem & feature selection", detail: "Target detection and feature review", percent: 82, color: "bg-indigo-500" },
              { label: "Model training & evaluation", detail: "Candidate training and comparison", percent: 68, color: "bg-sky-500" },
              { label: "Explainability & reports", detail: "Available after model evaluation", percent: 25, color: "bg-violet-500" },
            ].map((step) => (
              <div key={step.label}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-800">{step.label}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{step.detail}</p>
                  </div>
                  <span className="text-xs font-semibold tabular-nums text-slate-600">{step.percent}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                  <div className={`h-full rounded-full ${step.color}`} style={{ width: `${step.percent}%` }} />
                </div>
              </div>
            ))}
            <p className="flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400">
              <Activity className="h-4 w-4" aria-hidden="true" /> Illustrative workflow progress, not connected to job telemetry.
            </p>
          </div>
        </DashboardSection>
      </div>

      <RecentExperimentsTable experiments={mockRecentExperiments} />
      <ModelActivityTable models={mockModelActivity} />

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="font-semibold text-slate-900">Continue the end-to-end workflow</p>
          <p className="mt-1 text-sm text-slate-500">Upload a dataset, review its quality, then create an experiment.</p>
        </div>
        <Link href="/datasets" className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
          Go to datasets <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
