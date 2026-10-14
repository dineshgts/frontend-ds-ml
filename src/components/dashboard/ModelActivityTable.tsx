import { ArrowUpRight, Boxes } from "lucide-react";
import type { ModelActivity } from "@/types/dashboard";
import DashboardSection from "./DashboardSection";
import StatusBadge from "./StatusBadge";

function formatTime(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export default function ModelActivityTable({ models }: { models: ModelActivity[] }) {
  return (
    <DashboardSection
      title="Model activity"
      description="Recent model registry and approval changes"
      action={
        <a href="/models" className="inline-flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700">
          Open model registry <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </a>
      }
    >
      <div className="divide-y divide-slate-100">
        {models.map((model) => (
          <div key={model.id} className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-700">
                <Boxes className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">{model.name} <span className="ml-1 text-xs font-normal text-slate-400">{model.version}</span></p>
                <p className="mt-1 text-sm text-slate-500">{model.algorithm} · {model.metricLabel}: <span className="font-medium text-slate-700">{model.metricValue}</span></p>
                <p className="mt-1 text-xs text-slate-400">{model.id} · {formatTime(model.updatedAt)}</p>
              </div>
            </div>
            <div className="sm:pl-4"><StatusBadge status={model.status} /></div>
          </div>
        ))}
      </div>
      <p className="border-t border-slate-100 px-6 py-3 text-xs text-slate-400">Illustrative sample registry events — not production model state.</p>
    </DashboardSection>
  );
}
