/**
 * GTS Team 3 - Data Profiling API Contract
 *
 * Project:
 * Data Science Intelligence & Automated Machine Learning Engine
 *
 * Source:
 * Team 1 Profiling JSON Schemas
 * Team 2 Final Integration Package
 *
 * Validation Results:
 * Request Schema Comparison: PASS
 * Response Schema Comparison: PASS
 * Sample Request Validation: PASS
 * Sample Response Validation: PASS
 *
 */

// ============================================================
// 1. PROFILING TYPES
// ============================================================

export type InferredType =
  | "numerical"
  | "categorical"
  | "datetime"
  | "time"
  | "text"
  | "boolean"
  | "mixed"
  | "empty";

export type ProfilingStatus =
  | "success"
  | "warning"
  | "failed";

export type ColumnWarningCode =
  | "EMPTY_COLUMN"
  | "CONSTANT_COLUMN"
  | "MIXED_TYPES"
  | "HIGH_CARDINALITY";

export type ProfilingWarningCode =
  | ColumnWarningCode
  | "EMPTY_DATASET"
  | "DUPLICATES_APPROXIMATE"
  | "CLASS_DISTRIBUTION_SKIPPED";

export type ProfilingErrorCode =
  | "INVALID_REQUEST"
  | "SOURCE_NOT_FOUND"
  | "UNSUPPORTED_FORMAT"
  | "DATASET_LOAD_FAILED"
  | "DUPLICATE_COLUMN_NAMES"
  | "PROFILING_FAILED"
  | "TARGET_NOT_FOUND";

// ============================================================
// 2. PROFILING REQUEST
// ============================================================

export interface ProfilingRequestDatasetReference {
  dataset_id: string;
  source_type: "file";
  name?: string;
  location: string;
}

export interface ProfilingMetadata {
  format?: "csv" | "xlsx";
  sheet_name?: string | number;
  delimiter?: string;
  encoding?: string;
  missing_value_markers?: string[];
  identifier_columns?: string[];
}

export interface ProfilingOptions {
  top_n_values?: number;
  include_statistics?: boolean;
  target_column?: string;
  include_correlations?: boolean;
}

export interface ProfilingRequest {
  schema_version: "1.0-draft";
  request_id: string;
  dataset_reference: ProfilingRequestDatasetReference;
  metadata?: ProfilingMetadata;
  options?: ProfilingOptions;
}

// ============================================================
// 3. NUMERIC STATISTICS
// ============================================================

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

// ============================================================
// 4. TOP VALUES
// ============================================================

export interface TopValue {
  value: string;
  count: number;
  percentage: number;
}

// ============================================================
// 5. HISTOGRAM
// ============================================================

export interface HistogramBin {
  start: number;
  end: number;
  count: number;
}

// ============================================================
// 6. MIXED COLUMN INFORMATION
// ============================================================

export interface MixedBreakdown {
  numeric_values: number;
  text_values: number;
}

// ============================================================
// 7. COLUMN PROFILE
// ============================================================

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

  summary?:
    | NumericSummary
    | Record<string, number | string | null>;

  top_values?: TopValue[];
  histogram?: HistogramBin[];
  mixed_breakdown?: MixedBreakdown;
}

// ============================================================
// 8. DATASET INFORMATION
// ============================================================

export interface ProfilingDataset {
  row_count: number;
  column_count: number;
  column_names: string[];
  duplicate_row_count: number;
}

export interface DatasetReference {
  dataset_id: string | null;
  name: string | null;
}

// ============================================================
// 9. CORRELATION INFORMATION
// ============================================================

export interface CorrelationPair {
  column_a: string;
  column_b: string;
  coefficient: number;
}

// ============================================================
// 10. TARGET CLASS DISTRIBUTION
// ============================================================

export interface ClassCount {
  value: string;
  count: number;
  percentage: number;
}

export interface ClassDistribution {
  target_column: string;
  class_count: number;
  classes: ClassCount[];
  majority_class: string;
  minority_class: string;
  imbalance_ratio: number | null;
  missing_count: number;
}

// ============================================================
// 11. PROFILING WARNINGS
// ============================================================

export interface ProfilingWarning {
  code: ProfilingWarningCode;
  severity: "info" | "warning";
  column: string | null;
  message: string;
}

// ============================================================
// 12. PROFILING ERRORS
// ============================================================

export interface ProfilingError {
  code: ProfilingErrorCode;
  message: string;
  field: string | null;
}

// ============================================================
// 13. FINAL PROFILING RESPONSE
// ============================================================

export interface ProfilingResponse {
  schema_version: string;
  request_id: string | null;
  module: string;
  status: ProfilingStatus;

  generated_at: string;
  duration_ms: number;

  dataset_reference: DatasetReference | null;
  dataset: ProfilingDataset | null;

  columns: ColumnProfile[];

  warnings: ProfilingWarning[];
  errors: ProfilingError[];

  correlations?: CorrelationPair[];
  class_distribution?: ClassDistribution;
}