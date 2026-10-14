export type ModelStatus = "training" | "ready" | "failed" | "archived";

export interface Model {
  id: string;
  name: string;
  experimentId?: string;
  algorithm?: string;
  status?: ModelStatus;
  createdAt?: string;
}

export interface Prediction {
  id: string;
  modelId: string;
  status?: "queued" | "running" | "completed" | "failed";
  createdAt?: string;
}

export interface Report {
  id: string;
  title: string;
  type?: string;
  createdAt?: string;
  downloadUrl?: string;
}
