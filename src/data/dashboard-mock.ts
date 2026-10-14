import type {
  ModelActivity,
  RecentExperiment,
  RecentJob,
} from "@/types/dashboard";

/**
 * Explicitly illustrative frontend data. Replace these records with the
 * Python API response when the corresponding endpoints are available.
 */
export const mockRecentJobs: RecentJob[] = [
  {
    id: "job-demo-104",
    name: "Customer churn — AutoML training",
    projectName: "Customer Churn Prediction",
    stage: "Model evaluation",
    status: "running",
    progress: 68,
    updatedAt: "2026-10-14T09:25:00+05:30",
  },
  {
    id: "job-demo-103",
    name: "Retail demand — data profiling",
    projectName: "Retail Demand Forecasting",
    stage: "Data quality analysis",
    status: "completed",
    progress: 100,
    updatedAt: "2026-10-14T08:50:00+05:30",
  },
  {
    id: "job-demo-102",
    name: "Equipment failure — preprocessing",
    projectName: "Equipment Failure Analysis",
    stage: "Preprocessing",
    status: "queued",
    progress: 0,
    updatedAt: "2026-10-14T08:35:00+05:30",
  },
  {
    id: "job-demo-101",
    name: "Sales forecast — candidate training",
    projectName: "Sales Forecasting",
    stage: "Training",
    status: "failed",
    progress: 42,
    updatedAt: "2026-10-13T17:40:00+05:30",
  },
];

export const mockRecentExperiments: RecentExperiment[] = [
  {
    id: "exp-demo-208",
    name: "Churn baseline comparison",
    datasetName: "customer_churn.csv",
    problemType: "Classification",
    status: "running",
    updatedAt: "2026-10-14T09:20:00+05:30",
    bestMetric: "F1: 0.86",
  },
  {
    id: "exp-demo-207",
    name: "Retail demand v2",
    datasetName: "retail_sales.csv",
    problemType: "Forecasting",
    status: "completed",
    updatedAt: "2026-10-14T08:45:00+05:30",
    bestMetric: "RMSE: 12.4",
  },
  {
    id: "exp-demo-206",
    name: "Equipment anomaly exploration",
    datasetName: "sensor_readings.csv",
    problemType: "Anomaly detection",
    status: "review",
    updatedAt: "2026-10-13T16:10:00+05:30",
    bestMetric: "F1: 0.91",
  },
];

export const mockModelActivity: ModelActivity[] = [
  {
    id: "model-demo-031",
    name: "Churn Risk Classifier",
    version: "v1.3",
    algorithm: "XGBoost",
    status: "review",
    metricLabel: "F1 score",
    metricValue: "0.89",
    updatedAt: "2026-10-14T09:10:00+05:30",
  },
  {
    id: "model-demo-030",
    name: "Retail Demand Forecaster",
    version: "v2.0",
    algorithm: "Random Forest",
    status: "production",
    metricLabel: "RMSE",
    metricValue: "12.4",
    updatedAt: "2026-10-14T08:30:00+05:30",
  },
  {
    id: "model-demo-029",
    name: "Equipment Failure Model",
    version: "v0.8",
    algorithm: "Gradient Boosting",
    status: "approved",
    metricLabel: "Recall",
    metricValue: "0.92",
    updatedAt: "2026-10-13T15:45:00+05:30",
  },
];
