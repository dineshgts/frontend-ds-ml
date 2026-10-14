export type DashboardStatus =
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "review"
  | "approved"
  | "production"
  | "retired";

export interface DashboardSummary {
  label: string;
  value: number | string;
  helper: string;
  trend?: string;
  source: "demo-api" | "mock";
}

export interface RecentJob {
  id: string;
  name: string;
  projectName: string;
  stage: string;
  status: Extract<DashboardStatus, "queued" | "running" | "completed" | "failed">;
  progress: number;
  updatedAt: string;
}

export interface RecentExperiment {
  id: string;
  name: string;
  datasetName: string;
  problemType: string;
  status: Extract<DashboardStatus, "queued" | "running" | "completed" | "failed" | "review">;
  updatedAt: string;
  bestMetric?: string;
}

export interface ModelActivity {
  id: string;
  name: string;
  version: string;
  algorithm: string;
  status: Extract<DashboardStatus, "review" | "approved" | "production" | "retired" | "failed">;
  metricLabel: string;
  metricValue: string;
  updatedAt: string;
}
