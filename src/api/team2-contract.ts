/**
 * Team 2 FastAPI endpoint adapters.
 * Shared request/response schemas live in src/types/profiling.ts and
 * src/types/data-quality.ts (provided by the team).
 */
import { apiGet, apiPost } from "@/api/client";
import type {
  ProfilingRequest,
  ProfilingResponse,
} from "@/types/profiling";
import type {
  SemanticHandoffResult,
  SemanticProblemType,
} from "@/types/semantic";
import type {
  DataQualityResponse,
  DataQualityRequest,
} from "@/types/data-quality";

export const TEAM2_API_PATHS = {
  health: "/health",
  profiling: "/api/v1/profiling/",
  quality: "/api/v1/quality/",
  orchestration: "/api/v1/orchestration/",
} as const;

// Preserve the established API-facing names used by existing components.
export type Team2ProfileRequest = ProfilingRequest;
export type {
  ProfilingResponse,
  DataQualityRequest,
};
export type Team2QualityResponse = DataQualityResponse;

export interface Team2QualityRequest {
  dataset_id: string;
  version: string;
}

/**
 * Compatibility value retained for the existing UI flow.
 * Confirm with Team 2 whether this placeholder is accepted in production.
 */
export const TEAM2_UNVERSIONED_DATASET_VERSION = "unversioned";

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
  dataset_context: {
    dataset_id: string;
    dataset_name: string;
    source_type: string;
  };
  status: string;
  service_status: {
    profiling: string;
    quality: string;
    semantic_analysis: string;
  };
  downstream_context: {
    profiling_output_available: boolean;
    quality_findings_available: boolean;
    semantic_output_available: boolean;
    quality_issue_count: number;
  };
  profiling: ProfilingResponse | Record<string, unknown>;
  quality: Team2QualityResponse | Record<string, unknown>;
  semantic_analysis: { status: string; message?: string };
}

export function requestTeam2Profiling(
  payload: Team2ProfileRequest,
  options: { signal?: AbortSignal } = {}
) {
  return apiPost<ProfilingResponse, Team2ProfileRequest>(
    TEAM2_API_PATHS.profiling,
    payload,
    options
  );
}

export function requestTeam2Quality(
  payload: Team2QualityRequest,
  options: { signal?: AbortSignal } = {}
) {
  return apiPost<Team2QualityResponse, Team2QualityRequest>(
    TEAM2_API_PATHS.quality,
    payload,
    options
  );
}

export function requestTeam2Orchestration(
  payload: Team2OrchestrationRequest,
  options: { signal?: AbortSignal } = {}
) {
  return apiPost<Team2OrchestrationResponse, Team2OrchestrationRequest>(
    TEAM2_API_PATHS.orchestration,
    payload,
    options
  );
}

export function getTeam2Health(options: { signal?: AbortSignal } = {}) {
  return apiGet<{ status: string }>(TEAM2_API_PATHS.health, options);
}


/**
 * Actual Team 2 semantic route contract from app/routes/semantic.py.
 * The backend currently exposes POST /api/v1/semantic/ only.
 */
export interface Team2SemanticRequest {
  profiles: ProfilingResponse[];
  quality?: unknown;
  goal?: string | null;
  overrides?: Record<string, string>;
  problem_type_override?: SemanticProblemType | Record<string, SemanticProblemType>;
  quality_dataset?: string;
  quality_settings?: Record<string, unknown>;
  approved_feature_columns?: string[] | Record<string, string[]>;
  leakage_settings?: Record<string, unknown>;
}

export type Team2SemanticResponse = SemanticHandoffResult[];

export function requestTeam2Semantic(
  payload: Team2SemanticRequest,
  options: { signal?: AbortSignal } = {}
) {
  return apiPost<Team2SemanticResponse, Team2SemanticRequest>(
    "/api/v1/semantic/",
    payload,
    options
  );
}
