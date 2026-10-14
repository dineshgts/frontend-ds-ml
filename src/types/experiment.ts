export type ExperimentStatus = "draft" | "queued" | "running" | "completed" | "failed" | "cancelled";

export interface Experiment {
  id: string;
  name: string;
  description?: string;
  datasetId?: string;
  status?: ExperimentStatus;
  createdAt?: string;
  updatedAt?: string;
}
