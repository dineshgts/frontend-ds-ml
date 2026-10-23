"use client";

import Link from "next/link";
import { Activity, ArrowRight, Boxes, CircleHelp, Database, FlaskConical, FolderKanban, Plus, Sparkles, BriefcaseBusiness, ListChecks } from "lucide-react";
import DashboardSummaryCard from "./DashboardSummaryCard";
import DashboardSection from "./DashboardSection";
import RecentJobsTable from "./RecentJobsTable";
import RecentExperimentsTable from "./RecentExperimentsTable";
import ModelActivityTable from "./ModelActivityTable";
import { mockDashboardSummary, mockModelActivity, mockRecentExperiments, mockRecentJobs } from "@/data/dashboard-mock";

export default function DashboardOverview() {
  const summary = mockDashboardSummary;
  return <div className="mx-auto w-full max-w-[1600px] space-y-7 p-4 sm:p-6 lg:p-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
  {/* Dashboard heading */}
  <div className="min-w-0 flex-1">
    <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
      <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
      Workspace overview
    </div>

    <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
      Dashboard
    </h1>

    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
      Monitor projects, datasets, experiments, training jobs and registered
      models across the platform.
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

    <div role="note" className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-950">
      <CircleHelp className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" aria-hidden="true" />
      <div><p className="font-semibold">Frontend demo — summary values use representative mock data.</p><p className="mt-1 leading-5 text-amber-900/80">The summary matches the proposed dashboard API response contract. Backend integration will be added later. Recent activity and workflow progress are illustrative mock content.</p></div>
    </div>

    <section aria-label="Platform summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardSummaryCard label="Projects" value={summary.projects.total} helper={`${summary.projects.active} active`} icon={FolderKanban} iconClassName="bg-indigo-50 text-indigo-700" />
      <DashboardSummaryCard label="Datasets" value={summary.datasets.total} helper="Total registered datasets" icon={Database} iconClassName="bg-sky-50 text-sky-700" />
      <DashboardSummaryCard label="Experiments" value={summary.experiments.total} helper="Total experiments" icon={FlaskConical} iconClassName="bg-violet-50 text-violet-700" />
      <DashboardSummaryCard label="Models" value={summary.models.total} helper={`${summary.models.deployed} deployed`} icon={Boxes} iconClassName="bg-emerald-50 text-emerald-700" />
    </section>

    <section aria-label="Training job summary" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <DashboardSummaryCard label="Training jobs" value={summary.training_jobs.total} helper="Total training jobs" icon={Activity} iconClassName="bg-slate-100 text-slate-700" />
      <DashboardSummaryCard label="Running jobs" value={summary.training_jobs.running} helper="Currently running (mock)" icon={ListChecks} iconClassName="bg-sky-50 text-sky-700" />
      <DashboardSummaryCard label="Completed jobs" value={summary.training_jobs.completed} helper="Successfully completed (mock)" icon={BriefcaseBusiness} iconClassName="bg-emerald-50 text-emerald-700" />
      <DashboardSummaryCard label="Failed jobs" value={summary.training_jobs.failed} helper="Require attention (mock)" icon={CircleHelp} iconClassName="bg-rose-50 text-rose-700" />
    </section>
   
    <RecentExperimentsTable experiments={mockRecentExperiments} />
    <ModelActivityTable models={mockModelActivity} />
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
      <div><p className="font-semibold text-slate-900">Continue the end-to-end workflow</p><p className="mt-1 text-sm text-slate-500">Upload a dataset, review its quality, then create an experiment.</p></div>
      <Link href="/datasets" className="inline-flex items-center justify-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700">Go to datasets <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>
    </div>
  </div>;
}
