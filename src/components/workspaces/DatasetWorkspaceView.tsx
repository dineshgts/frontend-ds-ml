"use client";

import { usePathname } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import WorkspaceLayout from "@/components/layout/WorkspaceLayout";

const sections = [
  { key: "overview", label: "Overview", slug: "" },
  { key: "quality", label: "Data Quality", slug: "quality" },
  { key: "columns", label: "Columns", slug: "columns" },
  { key: "distributions", label: "Distributions", slug: "distributions" },
  { key: "correlations", label: "Correlations", slug: "correlations" },
  { key: "recommendations", label: "Recommendations", slug: "recommendations" },
] as const;
const descriptions: Record<string, string> = {
  overview: "Review dataset metadata and preparation status.",
  quality: "Inspect validation checks, missing values, duplicates, and data-quality findings.",
  columns: "Review column names, inferred types, and summary information.",
  distributions: "Explore feature distributions and summary charts.",
  correlations: "Review relationships and correlations between dataset columns.",
  recommendations: "Review suggested data-quality fixes and preparation recommendations.",
};

export default function DatasetWorkspaceView({ section }: { section: string }) {
  const pathname = usePathname();
  const parts = pathname.split("/").filter(Boolean);
  const datasetId = parts[1] || "demo-dataset";
  const base = `/datasets/${datasetId}`;
  const active = sections.find((item) => item.key === section) ?? sections[0];
  const navigation = sections.map((item) => ({ label: item.label, href: item.slug ? `${base}/${item.slug}` : base }));
  return (
    <WorkspaceLayout title="Dataset Workspace" description={`Dataset ID: ${datasetId}`} navigation={navigation} navigationVariant="tabs" activeNavigationHref={pathname}>
      <PageHeader title={active.label} description={descriptions[active.key]} breadcrumb={`Datasets / ${datasetId}`} />
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-5 sm:p-7">
        <p className="text-sm font-semibold text-slate-800">{active.label}</p>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">This route and its workspace navigation are connected. Dataset analysis and live data are not yet connected to the production API.</p>
        <p className="mt-4 inline-flex max-w-full break-all rounded-md bg-slate-100 px-2.5 py-1.5 font-mono text-xs text-slate-600">{pathname}</p>
      </div>
    </WorkspaceLayout>
  );
}
