
/**
 * GTS Team 3 - Data Quality API Contract
 *

 *
 * Source: Team 2 final Data Quality API JSON schemas
 * Validated against Team 1 schemas.
 *
 * Request validation: PASS
 * Response validation: 2 differences remain
 * (compliance_status and validation_results).
 *
 * This file follows Team 2's final API structure.
 * TypeScript types only.
 */

// Data Quality Rules
export type DataQualityRule =
  | "NULL_CHECK"
  | "DUP_ROW"
  | "INVALID_RANGE"
  | "OUTLIER_IQR";

// Request: Frontend -> Team 2 Backend
export interface DataQualityRequest {
  dataset_name: string;
  file_path: string;
  rules_to_apply?: DataQualityRule[];
  target_col?: string | null;
  id_cols?: string[];
  numeric_columns?: string[];
}

// Response Status
export type DataQualityStatus =
  | "PASSED"
  | "FAILED_VALIDATION";

// Violation Severity
export type DataQualitySeverity =
  | "CRITICAL"
  | "HIGH"
  | "MEDIUM"
  | "LOW";

// Individual Data Quality Violation
export interface DataQualityViolation {
  rule_id: DataQualityRule;
  column: string;
  severity: DataQualitySeverity;
  failed_count: number;
  description: string;
}

// Response: Team 2 Backend -> Frontend
export interface DataQualityResponse {
  dataset_name: string;
  execution_timestamp: string;
  total_rows_scanned: number;
  status: DataQualityStatus;
  violations: DataQualityViolation[];
}
