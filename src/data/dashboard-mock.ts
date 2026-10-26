import type { DashboardSummary } from "@/types/dashboard";

export const mockDashboardSummary: DashboardSummary = {
  projects: { total: 3, active: 1 },
  datasets: { total: 12 },
  experiments: { total: 8 },
  training_jobs: { total: 5, running: 2, completed: 2, failed: 1 },
  models: { total: 4, deployed: 2 },
};

export const mockRecentJobs = [
  { id: "JOB-105", name: "Customer Churn Training", type: "Classification", status: "Running", updatedAt: "2026-10-21T10:30:00+05:30" },
  { id: "JOB-104", name: "Sales Forecast", type: "Regression", status: "Completed", updatedAt: "2026-10-21T09:45:00+05:30" },
  { id: "JOB-103", name: "Customer Segmentation", type: "Clustering", status: "Failed", updatedAt: "2026-10-20T16:20:00+05:30" },
];

export const mockRecentExperiments = [
  { id: "EXP-208", name: "Churn Baseline", dataset: "Customer Dataset", status: "Completed", updatedAt: "2026-10-21T10:15:00+05:30" },
  { id: "EXP-207", name: "Sales Model Comparison", dataset: "Retail Sales", status: "Running", updatedAt: "2026-10-21T09:10:00+05:30" },
  { id: "EXP-206", name: "Segment Discovery", dataset: "Customer Dataset", status: "Failed", updatedAt: "2026-10-20T15:40:00+05:30" },
];

export const mockModelActivity = [
  { id: "MDL-014", name: "Churn Classifier", version: "v1.2", status: "Deployed", metric: "F1 0.89", updatedAt: "2026-10-21T10:00:00+05:30" },
  { id: "MDL-013", name: "Sales Forecaster", version: "v1.0", status: "Validation", metric: "MAE 12.4", updatedAt: "2026-10-20T14:30:00+05:30" },
  { id: "MDL-012", name: "Segment Model", version: "v0.9", status: "Development", metric: "Silhouette 0.71", updatedAt: "2026-10-19T11:00:00+05:30" },
];
