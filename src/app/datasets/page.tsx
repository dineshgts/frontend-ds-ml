import Link from "next/link";
import PageContainer from "@/components/layout/PageContainer";
import PageHeader from "@/components/layout/PageHeader";

export default function DatasetsPage() {
  return <PageContainer>
    <PageHeader title="Datasets" description="Browse datasets and open a dataset workspace."
       />
    <div className="rounded-xl border border-slate-200 bg-white p-5 sm:p-6">
      <h2 className="font-semibold text-slate-900">Demo dataset</h2>
      <p className="mt-1 text-sm text-slate-500">A sample route for validating Dataset Workspace navigation.</p>
      <Link href="/datasets/demo-dataset" className="mt-4 inline-flex text-sm font-medium text-indigo-700 hover:text-indigo-900">Open workspace →</Link>
    </div>
  </PageContainer>;
}
