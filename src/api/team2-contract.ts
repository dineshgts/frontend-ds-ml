/**
 * Exact API contracts implemented by Team 2 FastAPI.
 * Source of truth: FINAL_API_CONTRACT.md and the backend route schemas.
 */
import { apiGet, apiPost } from "@/api/client";

export const TEAM2_API_PATHS = {
  health: "/health",
  profiling: "/api/v1/profiling/",
  quality: "/api/v1/quality/",
  orchestration: "/api/v1/orchestration/",
} as const;

export type InferredType =
  | "numerical" | "categorical" | "datetime" | "time"
  | "text" | "boolean" | "mixed" | "empty";
export type ProfilingStatus = "success" | "warning" | "failed";
export type ColumnWarningCode =
  | "EMPTY_COLUMN" | "CONSTANT_COLUMN" | "MIXED_TYPES" | "HIGH_CARDINALITY";
export type ProfilingWarningCode =
  | ColumnWarningCode | "EMPTY_DATASET" | "DUPLICATES_APPROXIMATE"
  | "CLASS_DISTRIBUTION_SKIPPED";

export interface NumericSummary {
  min?: number | null;
  max?: number | null;
  mean?: number | null;
  median?: number | null;
  std?: number | null;
  q1?: number | null;
  q3?: number | null;
  skewness?: number | null;
}
export interface TopValue { value: string; count: number; percentage: number; }
export interface HistogramBin { start: number; end: number; count: number; }
export interface ColumnProfile {
  name: string;
  position: number;
  dtype: string;
  inferred_type: InferredType;
  missing_count: number;
  missing_pct: number;
  unique_count: number;
  likely_identifier: boolean;
  warnings: ColumnWarningCode[];
  summary?: NumericSummary | Record<string, unknown>;
  top_values?: TopValue[];
  histogram?: HistogramBin[];
  mixed_breakdown?: Record<string, unknown>;
}
export interface ProfilingDataset {
  row_count: number;
  column_count: number;
  column_names: string[];
  duplicate_row_count: number;
}
export interface DatasetReference { dataset_id: string; name?: string | null; }
export interface CorrelationPair { column_a: string; column_b: string; coefficient: number; }
export interface ClassCount { value: string; count: number; percentage: number; }
export interface ClassDistribution {
  target_column: string;
  class_count: number;
  classes: ClassCount[];
  majority_class: string;
  minority_class: string;
  imbalance_ratio: number | null;
  missing_count: number;
}
export interface ProfilingWarning {
  code: ProfilingWarningCode;
  severity: string;
  column: string | null;
  message?: string;
}
export interface ProfilingError { code: string; message?: string; column?: string | null; }
export interface ProfilingResponse {
  schema_version: string;
  request_id: string | null;
  module: string;
  status: ProfilingStatus | string;
  generated_at: string;
  duration_ms: number;
  dataset_reference: DatasetReference;
  dataset: ProfilingDataset;
  columns: ColumnProfile[];
  warnings: ProfilingWarning[];
  errors: ProfilingError[];
  correlations: CorrelationPair[];
  class_distribution?: ClassDistribution;
}

export interface Team2ProfileRequest {
  schema_version: "1.0-draft";
  request_id: string;
  dataset_reference: {
    dataset_id: string;
    source_type: "file";
    name?: string;
    location: string;
  };
  metadata?: {
    format?: "csv" | "xlsx";
    sheet_name?: string | number;
    delimiter?: string;
    encoding?: string;
    missing_value_markers?: string[];
    identifier_columns?: string[];
  };
  options?: {
    top_n_values?: number;
    include_statistics?: boolean;
    target_column?: string;
    include_correlations?: boolean;
  };
}

export interface Team2QualityRequest { dataset_id: string; version: string; }
export interface QualityIssue {
  issue_id: string;
  category: string;
  severity: string;
  affected_column: string;
  affected_row_count: number;
  description: string;
  recommended_action: string;
}
export interface QualityValidationSummary {
  total_issues_detected: number;
  total_duplicate_records: number;
  execution_mode: string;
  source_mutated: boolean;
}
export interface Team2QualityResponse {
  status: string;
  message: string;
  dataset_id: string;
  version: string;
  quality_metadata: {
    validation_summary: QualityValidationSummary;
    issue_logs: QualityIssue[];
    errors: unknown[];
  };
}

export interface Team2OrchestrationRequest {
  dataset_id: string;
  dataset_source: string;
  request_id?: string;
  dataset_name?: string;
  target_col?: string;
  id_cols?: string[];
  options?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}
export interface Team2OrchestrationResponse {
  dataset_context: { dataset_id: string; dataset_name: string; source_type: string };
  status: string;
  service_status: { profiling: string; quality: string; semantic_analysis: string };
  downstream_context: {
    profiling_output_available: boolean;
    quality_findings_available: boolean;
    semantic_output_available: boolean;
    quality_issue_count: number;
  };
  profiling: ProfilingResponse | Record<string, unknown>;
  quality: Omit<Team2QualityResponse, "message" | "dataset_id" | "version"> | Record<string, unknown>;
  semantic_analysis: { status: string; message?: string };
}

export function requestTeam2Profiling(payload: Team2ProfileRequest, options: { signal?: AbortSignal } = {}) {
  return apiPost<ProfilingResponse, Team2ProfileRequest>(TEAM2_API_PATHS.profiling, payload, options);
}
export function requestTeam2Quality(payload: Team2QualityRequest, options: { signal?: AbortSignal } = {}) {
  return apiPost<Team2QualityResponse, Team2QualityRequest>(TEAM2_API_PATHS.quality, payload, options);
}
export function requestTeam2Orchestration(payload: Team2OrchestrationRequest, options: { signal?: AbortSignal } = {}) {
  return apiPost<Team2OrchestrationResponse, Team2OrchestrationRequest>(TEAM2_API_PATHS.orchestration, payload, options);
}
export function getTeam2Health(options: { signal?: AbortSignal } = {}) {
  return apiGet<{ status: string }>(TEAM2_API_PATHS.health, options);
}
