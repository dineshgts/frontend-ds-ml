export type JobStatus = "pending" | "running" | "completed" | "failed";
export type ProblemType = "classification" | "regression" | "clustering";

export interface ModelCandidate {
  id: string;
  name: string;
  algorithm: string;
  problemTypes: ProblemType[];
  description: string;
  reason: string;
  metrics: Record<string, number>;
}
export interface TrainingJob {
  id: string;
  name: string;
  modelId: string;
  dataset: string;
  problemType: ProblemType;
  status: JobStatus;
  progress: number;
  startedAt: string;
  duration: string;
  metrics?: Record<string, number>;
  error?: string;
  parameters: Record<string, string | number>;
}

export const mockModelTraining = {
  problemTypes: [
    { value: "classification", label: "Classification" },
    { value: "regression", label: "Regression" },
    { value: "clustering", label: "Clustering" },
  ] as { value: ProblemType; label: string }[],
  candidates: [
    { id: "model-001", name: "Random Forest", algorithm: "Ensemble", problemTypes: ["classification", "regression"], description: "An ensemble of decision trees for structured datasets.", reason: "A strong baseline for tabular data.", metrics: { accuracy: 0.92, precision: 0.90, recall: 0.89, f1Score: 0.895, rocAuc: 0.94, rmse: 12.4, mae: 8.6 } },
    { id: "model-002", name: "Logistic Regression", algorithm: "Linear", problemTypes: ["classification"], description: "An interpretable classification baseline.", reason: "Useful when explainability is important.", metrics: { accuracy: 0.87, precision: 0.85, recall: 0.86, f1Score: 0.855, rocAuc: 0.90 } },
    { id: "model-003", name: "Gradient Boosting", algorithm: "Boosting", problemTypes: ["classification", "regression"], description: "Sequential decision trees that improve model predictions.", reason: "A candidate for strong tabular performance.", metrics: { accuracy: 0.94, precision: 0.93, recall: 0.91, f1Score: 0.92, rocAuc: 0.96, rmse: 10.8, mae: 7.4 } },
    { id: "model-004", name: "K-Means", algorithm: "Clustering", problemTypes: ["clustering"], description: "Groups records by similarity without target labels.", reason: "Useful for initial unsupervised segmentation.", metrics: { silhouetteScore: 0.71 } },
  ] satisfies ModelCandidate[],
  jobs: [
    { id: "job-1001", name: "Customer Churn — Random Forest", modelId: "model-001", dataset: "Customer Churn Dataset", problemType: "classification", status: "running", progress: 65, startedAt: "2026-10-28T09:30:00Z", duration: "4m 32s", parameters: { n_estimators: 100, max_depth: 12, random_state: 42 } },
    { id: "job-1002", name: "Sales Forecast — Gradient Boosting", modelId: "model-003", dataset: "Retail Sales Dataset", problemType: "regression", status: "completed", progress: 100, startedAt: "2026-10-28T08:00:00Z", duration: "6m 14s", metrics: { rmse: 10.8, mae: 7.4 }, parameters: { n_estimators: 150, learning_rate: 0.1, max_depth: 5 } },
    { id: "job-1003", name: "Customer Segmentation — K-Means", modelId: "model-004", dataset: "Customer Dataset", problemType: "clustering", status: "failed", progress: 42, startedAt: "2026-10-28T07:15:00Z", duration: "2m 05s", error: "Mock training stopped because the dataset contains invalid numeric values.", parameters: { n_clusters: 4, random_state: 42 } },
    { id: "job-1004", name: "Churn Baseline — Logistic Regression", modelId: "model-002", dataset: "Customer Churn Dataset", problemType: "classification", status: "pending", progress: 0, startedAt: "2026-10-28T10:00:00Z", duration: "Not started", parameters: { max_iter: 200, random_state: 42 } },
  ] satisfies TrainingJob[],
};
