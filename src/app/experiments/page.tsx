import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";
export default function ExperimentsPage() {
  return <PageContainer>
    <PageHeader title="Experiments" description="Browse experiments and open an experiment workspace."
       />
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="font-semibold text-slate-900">Demo experiment</h2>
      <p className="mt-1 text-sm text-slate-500">A sample route for validating Experiment Workspace navigation.</p>
      <Link href="/experiments/demo-experiment" className="mt-4 inline-flex text-sm font-medium text-indigo-700 hover:text-indigo-900">Open workspace →</Link>
    </div>
  </PageContainer>;
}
