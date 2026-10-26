/**
 * Team 2 API Contract v1 integration surface.
 *
 * IMPORTANT: These paths/types reflect Team 2's sample contract documents and must be
 * checked against the live FastAPI Swagger/OpenAPI schema before being treated as live.
 * The currently tested prototype dataset-list call remains GET /datasets in datasets.ts.
 */
import { apiGet, apiPost, apiUpload } from "@/api/client";

export const TEAM2_API_PATHS = {
  health: "/health",
  datasets: "/api/v1/datasets",
  datasetUpload: "/api/v1/datasets/upload",
  datasetDetail: (datasetId: string) => `/api/v1/datasets/${encodeURIComponent(datasetId)}`,
  datasetProfile: (datasetId: string) => `/api/v1/datasets/${encodeURIComponent(datasetId)}/profile`,
  experiments: "/api/v1/experiments",
  experimentDetail: (experimentId: string) => `/api/v1/experiments/${encodeURIComponent(experimentId)}`,
  trainingJobs: "/api/v1/training/jobs",
  trainingJobDetail: (jobId: string) => `/api/v1/training/jobs/${encodeURIComponent(jobId)}`,
  predict: "/api/v1/predict",
} as const;

export type Team2ApiEnvelope<T> = {
  success: boolean;
  message?: string;
  data: T;
};

export type Team2Dataset = {
  dataset_id: string;
  dataset_name: string;
  row_count: number;
  column_count: number;
  status: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

export type Team2DatasetListResponse = Team2ApiEnvelope<Team2Dataset[]>;

export type Team2DatasetUploadResponse = Team2ApiEnvelope<{
  dataset_id: string;
  dataset_name: string;
  status: string;
}>;

export type Team2DatasetProfileResponse = Team2ApiEnvelope<{
  dataset_id: string;
  status?: string;
  [key: string]: unknown;
}>;

export type Team2ExperimentRequest = {
  dataset_id: string;
  target_column: string;
  problem_type: string;
  experiment_name?: string;
  description?: string;
  [key: string]: unknown;
};

export type Team2Experiment = {
  experiment_id: string;
  dataset_id?: string;
  status?: string;
  experiment_name?: string;
  [key: string]: unknown;
};

export type Team2TrainingJobRequest = {
  experiment_id?: string;
  dataset_id: string;
  target_column: string;
  problem_type: string;
  algorithm?: string;
  [key: string]: unknown;
};

export type Team2TrainingJob = {
  job_id: string;
  status: string;
  [key: string]: unknown;
};

export type Team2PredictionRequest = {
  model_id?: string;
  model_name?: string;
  input_data: Record<string, unknown> | Record<string, unknown>[];
};

export type Team2PredictionResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
  predictions?: unknown;
  [key: string]: unknown;
};

export function getTeam2Health(options: { signal?: AbortSignal } = {}) {
  return apiGet<unknown>(TEAM2_API_PATHS.health, options);
}

export function getTeam2Datasets(options: { signal?: AbortSignal } = {}) {
  return apiGet<Team2DatasetListResponse>(TEAM2_API_PATHS.datasets, options);
}

export function uploadTeam2Dataset(file: File, options: { signal?: AbortSignal } = {}) {
  // Team 2's documents show multipart upload; confirm the exact form field name with Team 2.
  return apiUpload<Team2DatasetUploadResponse>(TEAM2_API_PATHS.datasetUpload, file, "file", options);
}

export function getTeam2Dataset(datasetId: string, options: { signal?: AbortSignal } = {}) {
  return apiGet<Team2ApiEnvelope<Team2Dataset>>(
    TEAM2_API_PATHS.datasetDetail(datasetId),
    options
  );
}

export function requestTeam2DatasetProfile(
  datasetId: string,
  options: { signal?: AbortSignal } = {}
) {
  return apiPost<Team2DatasetProfileResponse, Record<string, never>>(
    TEAM2_API_PATHS.datasetProfile(datasetId),
    {},
    options
  );
}

export function createTeam2Experiment(
  payload: Team2ExperimentRequest,
  options: { signal?: AbortSignal } = {}
) {
  return apiPost<Team2ApiEnvelope<Team2Experiment>, Team2ExperimentRequest>(
    TEAM2_API_PATHS.experiments,
    payload,
    options
  );
}

export function getTeam2Experiment(experimentId: string, options: { signal?: AbortSignal } = {}) {
  return apiGet<Team2ApiEnvelope<Team2Experiment>>(
    TEAM2_API_PATHS.experimentDetail(experimentId),
    options
  );
}

export function createTeam2TrainingJob(
  payload: Team2TrainingJobRequest,
  options: { signal?: AbortSignal } = {}
) {
  return apiPost<Team2ApiEnvelope<Team2TrainingJob>, Team2TrainingJobRequest>(
    TEAM2_API_PATHS.trainingJobs,
    payload,
    options
  );
}

export function getTeam2TrainingJob(jobId: string, options: { signal?: AbortSignal } = {}) {
  return apiGet<Team2ApiEnvelope<Team2TrainingJob>>(
    TEAM2_API_PATHS.trainingJobDetail(jobId),
    options
  );
}

export function requestTeam2Prediction(
  payload: Team2PredictionRequest,
  options: { signal?: AbortSignal } = {}
) {
  return apiPost<Team2PredictionResponse, Team2PredictionRequest>(
    TEAM2_API_PATHS.predict,
    payload,
    options
  );
}
