"use client";

import { usePathname } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import WorkspaceLayout from "@/components/layout/WorkspaceLayout";

const sections = [
  { key: "overview", label: "Overview", slug: "" },
  { key: "problem-definition", label: "Problem Definition", slug: "problem-definition" },
  { key: "preprocessing", label: "Preprocessing", slug: "preprocessing" },
  { key: "features", label: "Features", slug: "features" },
  { key: "models", label: "Models", slug: "models" },
  { key: "evaluation", label: "Evaluation", slug: "evaluation" },
  { key: "explainability", label: "Explainability", slug: "explainability" },
  { key: "results", label: "Results", slug: "results" },
] as const;
const descriptions: Record<string, string> = {
  overview: "Review experiment status and workflow progress.",
  "problem-definition": "Define the machine-learning task and target column.",
  preprocessing: "Review data preparation and preprocessing steps.",
  features: "Inspect selected features and feature engineering.",
  models: "Review candidate models and training status.",
  evaluation: "Compare model metrics and evaluation results.",
  explainability: "Review model explanations and feature importance.",
  results: "Review final experiment results and artifacts.",
};

export default function ExperimentWorkspaceView({ section }: { section: string }) {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const experimentId = parts[1] || "demo-experiment";
  const base = `/experiments/${experimentId}`;
  const active = sections.find((item) => item.key === section) ?? sections[0];
  const navigation = sections.map((item) => ({ label: item.label, href: item.slug ? `${base}/${item.slug}` : base }));
  return (
    <WorkspaceLayout title="Experiment Workspace" description={`Experiment ID: ${experimentId}`} navigation={navigation} navigationVariant="tabs" activeNavigationHref={pathname}>
      <PageHeader title={active.label} description={descriptions[active.key]} breadcrumb={`Experiments / ${experimentId}`} />
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 sm:p-7">
        <p className="text-sm font-semibold text-slate-800">{active.label}</p>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">This route and its workspace navigation are connected. Experiment execution and model training are not yet connected to the production API.</p>
        <p className="mt-4 inline-flex max-w-full break-all rounded-md bg-slate-100 px-2.5 py-1.5 font-mono text-xs text-slate-600">{pathname}</p>
      </div>
    </WorkspaceLayout>
  );
}
