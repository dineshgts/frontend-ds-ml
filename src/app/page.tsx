import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";

export default function HomePage() {
  return (
    <PageContainer>
      <PageHeader
        title="Application Shell"
        description="Reusable layout and navigation foundation for the DataFlow AutoML platform."
      />

      <section className="rounded-xl border border-dashed border-slate-300 bg-white p-6">
        <h2 className="text-sm font-semibold text-slate-900">
          Workspace foundation
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
          Business functionality is intentionally not implemented here. Future
          dataset and experiment workspaces can use the shared WorkspaceLayout
          with either tabs or a secondary sidebar.
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/dashboard"
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Dashboard
          </Link>
          <Link
            href="/datasets"
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          >
            Datasets
          </Link>
        </div>
      </section>
    </PageContainer>
  );
}
