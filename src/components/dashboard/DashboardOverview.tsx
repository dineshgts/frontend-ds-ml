
"use client";

import { useEffect, useState } from "react";
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
  BriefcaseBusiness,
  ListChecks,
} from "lucide-react";

import DashboardSummaryCard from "./DashboardSummaryCard";
import RecentJobsTable from "./RecentJobsTable";
import RecentExperimentsTable from "./RecentExperimentsTable";
import ModelActivityTable from "./ModelActivityTable";

import { useProjects } from "@/hooks/useProjects";
import { getDatasets } from "@/api/datasets";
import { getExperiments } from "@/api/experiments";
import {
  mockDashboardSummary,
  mockModelActivity,
  mockRecentJobs,
} from "@/data/dashboard-mock";

import type { Dataset } from "@/types/dataset";
import type { Experiment } from "@/types/experiment";

type RecentExperiment = {
  id: string;
  name: string;
  dataset: string;
  status: string;
  updatedAt: string;
};

export default function DashboardOverview() {
  const {
    projects,
    loading: projectsLoading,
    error: projectsError,
  } = useProjects();

  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [datasetsLoading, setDatasetsLoading] = useState(true);
  const [experimentsLoading, setExperimentsLoading] = useState(true);
  const [datasetsError, setDatasetsError] = useState<string | null>(null);
  const [experimentsError, setExperimentsError] = useState<string | null>(
    null
  );

  useEffect(() => {
    const controller = new AbortController();

    getDatasets({ signal: controller.signal })
      .then(setDatasets)
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setDatasetsError(
          error instanceof Error ? error.message : "Unable to load datasets."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setDatasetsLoading(false);
      });

    getExperiments({ signal: controller.signal })
      .then(setExperiments)
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setExperimentsError(
          error instanceof Error
            ? error.message
            : "Unable to load experiments."
        );
      })
      .finally(() => {
        if (!controller.signal.aborted) setExperimentsLoading(false);
      });

    return () => controller.abort();
  }, []);

  const summary = {
    ...mockDashboardSummary,
    projects: {
      total: projects.length,
      active: projects.filter(
        (project) =>
          String(project.status ?? "").toLowerCase() === "active"
      ).length,
    },
    datasets: {
      total: datasets.length,
    },
    experiments: {
      total: experiments.length,
    },
  };

  const recentExperiments: RecentExperiment[] = experiments
    .slice()
    .reverse()
    .slice(0, 5)
    .map((experiment) => ({
      id: experiment.id,
      name: experiment.name,
      dataset: experiment.datasetId ?? "Not specified",
      status: experiment.status ?? "Created",
      updatedAt:
        experiment.updatedAt ??
        experiment.createdAt ??
        new Date().toISOString(),
    }));

  const loading = projectsLoading || datasetsLoading || experimentsLoading;

  const errors = [
    projectsError && `Projects: ${projectsError}`,
    datasetsError && `Datasets: ${datasetsError}`,
    experimentsError && `Experiments: ${experimentsError}`,
  ].filter(Boolean);

  return (
    <div className="space-y-7">
      {/* Dashboard heading */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            Workspace overview
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Monitor projects, datasets, experiments, training jobs and
            registered models across the platform.
          </p>
        </div>

        {/* Header actions */}
        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
          <Link
            href="/datasets"
            className="inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
          >
            <Database className="h-4 w-4 shrink-0" aria-hidden="true" />
            Browse datasets
          </Link>

          <Link
            href="/projects"
            className="inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
            View projects
          </Link>
        </div>
      </div>

      {/* API status */}
      {loading && (
        <div
          role="status"
          className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600"
        >
          <span className="inline-flex items-center gap-2">
            <Activity className="h-4 w-4 animate-pulse" />
            Loading dashboard data...
          </span>
        </div>
      )}

      {errors.length > 0 && (
        <div
          role="alert"
          className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-950"
        >
          <CircleHelp
            className="mt-0.5 h-5 w-5 shrink-0 text-amber-700"
            aria-hidden="true"
          />
          <div>
            <p className="font-semibold">
              Some dashboard data could not be loaded.
            </p>
            <ul className="mt-1 list-disc pl-5">
              {errors.map((error) => (
                <li key={error}>{error}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Summary cards: live API data */}
      <section
        aria-label="Platform summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <DashboardSummaryCard
          label="Projects"
          value={projects.length}
          helper={
            projectsLoading
              ? "Loading..."
              : `${summary.projects.active} active`
          }
          icon={FolderKanban}
          iconClassName="bg-indigo-50 text-indigo-700"
          sourceLabel="API"
        />

        <DashboardSummaryCard
          label="Datasets"
          value={datasetsLoading ? "—" : datasets.length}
          helper={datasetsLoading ? "Loading..." : "Registered datasets"}
          icon={Database}
          iconClassName="bg-sky-50 text-sky-700"
          sourceLabel="API"
        />

        <DashboardSummaryCard
          label="Experiments"
          value={experimentsLoading ? "—" : experiments.length}
          helper={experimentsLoading ? "Loading..." : "Total experiments"}
          icon={FlaskConical}
          iconClassName="bg-violet-50 text-violet-700"
          sourceLabel="API"
        />

        <DashboardSummaryCard
          label="Models"
          value={summary.models.total}
          helper={`${summary.models.deployed} deployed · demo data`}
          icon={Boxes}
          iconClassName="bg-emerald-50 text-emerald-700"
          sourceLabel="Mock"
        />
      </section>

      {/* Training jobs: mock until backend implementation */}
      <section
        aria-label="Training job summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <DashboardSummaryCard
          label="Training jobs"
          value={summary.training_jobs.total}
          helper="Demo data"
          icon={Activity}
          iconClassName="bg-slate-100 text-slate-700"
          sourceLabel="Mock"
        />

        <DashboardSummaryCard
          label="Running jobs"
          value={summary.training_jobs.running}
          helper="Demo data"
          icon={ListChecks}
          iconClassName="bg-sky-50 text-sky-700"
          sourceLabel="Mock"
        />

        <DashboardSummaryCard
          label="Completed jobs"
          value={summary.training_jobs.completed}
          helper="Demo data"
          icon={BriefcaseBusiness}
          iconClassName="bg-emerald-50 text-emerald-700"
          sourceLabel="Mock"
        />

        <DashboardSummaryCard
          label="Failed jobs"
          value={summary.training_jobs.failed}
          helper="Demo data"
          icon={CircleHelp}
          iconClassName="bg-rose-50 text-rose-700"
          sourceLabel="Mock"
        />
      </section>

      {/* Recent experiments: API data */}
      <RecentExperimentsTable experiments={recentExperiments} />

      {/* Model registry is not implemented in the current backend */}
      <ModelActivityTable models={mockModelActivity} />

      {/* Workflow navigation */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div>
          <p className="font-semibold text-slate-900">
            Continue the end-to-end workflow
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Upload a dataset, review its quality, then create an experiment.
          </p>
        </div>

        <Link
          href="/datasets"
          className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700"
        >
          Go to datasets
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
