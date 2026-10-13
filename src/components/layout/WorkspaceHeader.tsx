import type { ReactNode } from "react";

interface WorkspaceHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export default function WorkspaceHeader({
  title,
  description,
  actions,
}: WorkspaceHeaderProps) {
  return (
    <header className="border-b border-slate-200 pb-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
            Workspace
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
    </header>
  );
}
