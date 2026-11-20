/**
 * GTS | Team 3 - Semantic Understanding & Target Suggestions
 *
 * Source of truth:
 *   Team 1: schemas/handoff_result.schema.json
 *           schemas/review_decisions.schema.json
 *   Team 2: contracts/handoff_result.schema.json
 *           contracts/review_decisions.schema.json
 *
 * Validation evidence (18 
 *   - Team 1 / Team 2 schema comparison: PASS for both files.
 *   - Full response samples and review request: PASS.
 *   - "mandatory_fields_only" is an intentionally incomplete illustration,
 *     NOT a valid full response fixture.
 */

// ---------------------------------------------------------------------------
// Semantic Understanding and Target Suggestions
// ---------------------------------------------------------------------------

export type SemanticProblemType =
  | "binary_classification"
  | "multiclass_classification"
  | "regression"
  | "forecasting"
  | "clustering"
  | "anomaly_detection"
  | "recommendation"
  | "review_required";

export type SemanticType =
  | "identifier"
  | "email"
  | "phone"
  | "percentage"
  | "date"
  | "time"
  | "boolean_flag"
  | "categorical"
  | "financial_amount"
  | "numerical_measure"
  | "text"
  | "unknown";

export type SemanticTargetSource =
  | "user_override"
  | "top_suggestion"
  | "none";

export type SemanticDecisionSource =
  | "user_override"
  | "business_goal"
  | "data_rules";

export type SemanticConfidenceLevel =
  | "High"
  | "Medium"
  | "Low"
  | "User-selected";

export type SemanticCandidatePriority =
  | "Top suggestion"
  | "Alternative"
  | "Candidate"
  | "User-selected"
  | "Blocked by quality";

export type SemanticColumnRoleType =
  | "target"
  | "feature"
  | "identifier"
  | "date"
  | "time"
  | "text"
  | "excluded";

export type SemanticPreprocessingAction =
  | "use_as_target"
  | "label_encode"
  | "do_not_use_as_input"
  | "keep_for_join"
  | "drop"
  | "text_processing"
  | "extract_time_parts"
  | "time_index"
  | "extract_date_features"
  | "impute"
  | "encode_binary"
  | "one_hot_encode"
  | "group_rare_categories"
  | "frequency_or_target_encode"
  | "convert_percentage_to_number"
  | "scale_numeric"
  | "privacy_review_before_use";

// ---------------------------------------------------------------------------
// Target suggestions, semantic columns, and preprocessing handoff
// ---------------------------------------------------------------------------

export interface SemanticAlternative {
  problem_type: SemanticProblemType;
  reason: string;
}

export interface SemanticTargetCandidate {
  rank: number;
  candidate_target: string;
  semantic_type: SemanticType;
  // Team 1 schema leaves this as a free-form string (not an enum).
  suggested_problem_type: string;
  score: number; // JSON Schema range: 0..100
  confidence_level: SemanticConfidenceLevel;
  priority: SemanticCandidatePriority;
  quality_issue_codes: string[];
  blocking_reason: string | null;
  warnings?: string;
  quality_issues?: string;
}

export interface SemanticColumn {
  column: string;
  semantic_type: SemanticType;
  confidence: number | null;
  sensitive: boolean;
}

/**
 * The Team 1 schema requires these keys but does not declare their types.
 * Keep them as unknown rather than inventing stricter requirements.
 * Use runtime narrowing before displaying these particular values.
 */
export interface SemanticTargetStatistics {
  column: unknown;
  semantic_type: unknown;
  unique_count: unknown;
  missing_count: unknown;
  missing_pct: unknown;
  [key: string]: unknown;
}

export interface SemanticMissingSummaryEntry {
  // Required names, but their types are not constrained in the schema.
  column: unknown;
  missing_count: unknown;
  missing_pct: unknown;
  [key: string]: unknown;
}

export interface SemanticTimeInfoEntry {
  // Required names, but their types are not constrained in the schema.
  column: unknown;
  estimated_frequency: unknown;
  gaps: unknown;
  [key: string]: unknown;
}

export interface SemanticFeatureTypeCounts {
  numerical?: number;
  categorical?: number;
  boolean?: number;
  other?: number;
}

/** All dataset_characteristics properties are optional in the schema. */
export interface SemanticDatasetCharacteristics {
  row_count?: number;
  column_count?: number;
  duplicate_row_count?: number;
  profile_status?: string | null;
  feature_column_count?: number;
  feature_type_counts?: SemanticFeatureTypeCounts;
  missing_summary?: SemanticMissingSummaryEntry[];
  time_info?: SemanticTimeInfoEntry[];
  time_columns?: string[];
  identifier_columns?: string[];
  date_columns?: string[];
  sensitive_columns?: string[];
  excluded_columns?: string[];
  validation_warnings?: string[];
}

export interface SemanticColumnRole {
  column: string;
  semantic_type: SemanticType;
  data_type: string;
  role: SemanticColumnRoleType;
  reason: string;
  unique_values: number | null;
  missing_count: number | null;
  missing_pct: number | null;
  sensitive: boolean;
  needs_privacy_review: boolean;
  time_axis: boolean;
  quality_blocked: boolean;
  quality_issues: string[];
  quality_issue_codes: string[];
  preprocessing_hint: string;
  leakage_suspect: "possible" | "strong" | null;
  leakage_correlation: number | null; // JSON Schema range: -1..1
  preprocessing_actions: SemanticPreprocessingAction[];
}

export interface SemanticLeakageSuspect {
  column: string;
  correlation: number; // JSON Schema range: -1..1
  level: "possible" | "strong";
  message: string;
}

export interface SemanticLeakageChecks {
  status: "checked" | "not_checked" | "pending_integration";
  reason: string;
  thresholds: {
    possible: number;
    strong: number;
  };
  limits: string;
  suspects: SemanticLeakageSuspect[];
}

// ---------------------------------------------------------------------------
// Team 1 response: handoff_result.schema.json 
// ---------------------------------------------------------------------------

export interface SemanticHandoffResult {
  dataset: string;
  dataset_id?: string | null;
  target: string | null;
  target_source: SemanticTargetSource;
  problem_type: SemanticProblemType;
  confidence: number; // JSON Schema range: 0..1
  source: SemanticDecisionSource;
  needs_confirmation: boolean;
  evidence: string[];
  alternatives: SemanticAlternative[];
  warnings: string[];
  target_confirmed: boolean;
  target_statistics: SemanticTargetStatistics | null;
  candidates: SemanticTargetCandidate[];
  semantic_columns: SemanticColumn[];
  dataset_characteristics: SemanticDatasetCharacteristics;
  feature_columns: string[];
  recommended_feature_columns: string[];
  approved_feature_columns: string[] | null;
  features_status: "approved" | "recommended_pending_confirmation";
  column_roles: SemanticColumnRole[];
  leakage_checks: SemanticLeakageChecks;
  status: "Proposed, pending verification";
}

/** Team 1 run_detection() returns an array (even for a single dataset). */
export type SemanticDetectionResults = SemanticHandoffResult[];

// ---------------------------------------------------------------------------
//  Team 2: review_decisions.schema.json
// ---------------------------------------------------------------------------

export interface SemanticReviewRequest {
  dataset_id: string;
  goal?: string | null;
  target?: string | null;
  problem_type?: SemanticProblemType | null;
  approved_feature_columns?: string[] | null;
}

// ---------------------------------------------------------------------------
// Team 2 FastAPI wrappers 
// ---------------------------------------------------------------------------

/** GET /api/v1/semantic/handoff/{dataset_id} */
export interface Team2SemanticHandoffApiResponse {
  status: "success";
  message: string;
  data: SemanticHandoffResult;
}

/** POST /api/v1/semantic/review; GET /api/v1/semantic/review/{dataset_id} */
export interface Team2SemanticReviewData {
  dataset_id: string;
  goal: string | null;
  target: string | null;
  problem_type: SemanticProblemType | null;
  approved_feature_columns: string[] | null;
  target_status: "approved" | "pending";
  problem_type_status: "confirmed" | "pending";
  features_status: "approved" | "pending";
  review_complete: boolean;
  training_allowed: boolean;
}

export interface Team2SemanticReviewApiResponse {
  status: "success";
  message: string;
  data: Team2SemanticReviewData;
}
