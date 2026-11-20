# Team 2 API mapping used by the frontend

This document records the mapping implemented in the frontend API layer. The
backend contract remains unchanged.

## Dataset registry and upload

| Frontend function | Backend endpoint | Frontend mapping |
|---|---|---|
| `getDatasets()` | `GET /datasets` | Reads `response.datasets[]` and maps each registry record into `Dataset`. |
| `getDataset(id)` | `GET /datasets/{dataset_id}` | Reads `response.dataset` and maps it into `Dataset`. |
| `uploadDataset(file)` | `POST /api/v1/datasets/upload` | Sends multipart form data with field name `file`; reads `response.dataset`. |

Registry fields mapped:
- `dataset_id` -> `Dataset.id`
- `dataset_name` -> `Dataset.name`
- `rows` -> `Dataset.row_count`
- `columns` -> `Dataset.column_count`
- `uploaded_at` -> `Dataset.created_at`
- `file_name` -> `Dataset.file_name`
- `file_format` -> `Dataset.file_format`
- `status` -> `Dataset.status`
- `processing_error` -> `Dataset.processing_error`
- `profiled_at` -> `Dataset.profiled_at`

Internal backend paths (`storage_path`, `result_path`) are intentionally not
exposed in the browser.

The current upload endpoint accepts the file and an optional `Idempotency-Key`
header. It does not accept a custom dataset name or project ID. The upload form
therefore shows the original filename as a read-only name preview and does not
send unsupported fields.

## Dataset processing and profiling

| Frontend function | Backend endpoint | Purpose |
|---|---|---|
| `startDatasetProcessing(id)` | `POST /api/v1/datasets/{id}/profile` | Starts background profiling and quality processing; returns HTTP 202. |
| `getDatasetProcessingResult(id)` | `GET /api/v1/datasets/{id}/profile` | Reads the saved combined orchestration result after the dataset is ready. |
| `retryDatasetProcessing(id)` | `POST /api/v1/datasets/{id}/retry` | Retries background processing for a failed dataset; returns HTTP 202. |

The saved profile endpoint does **not** return a bare `ProfilingResponse`.
It returns a combined object containing `dataset_context`, `status`,
`service_status`, `downstream_context`, `profiling`, `quality` and
`semantic_analysis`. The frontend reads the nested `profiling` result for the
Overview, Columns, Distributions and Correlations screens.

The direct `POST /api/v1/profiling/` route is a separate service endpoint. Its
current FastAPI request model requires `dataset_reference.location`; the
dataset workspace does not call it directly because the upload/background
processing flow invokes the profiling service and saves the combined result.

## Data Quality

| Frontend function | Backend endpoint | Request | Response |
|---|---|---|---|
| `requestTeam2Quality()` | `POST /api/v1/quality/` | `{ dataset_id, version }` | `{ dataset_name, execution_timestamp, total_rows_scanned, status, violations[] }` |

Each violation is mapped using:
- `rule_id`
- `column`
- `severity`
- `failed_count`
- `description`

The current Team 2 Pydantic model requires `version`, but the route resolves the
file using `dataset_id` and does not use `version` in its lookup. The uploaded
dataset registry record currently has no version field. The frontend therefore
sends the explicit `unversioned` compatibility value unless the backend later
provides a real version. This does not change the backend contract.

`POST /api/v1/quality/validate` is a separate Team 1-style adapter that accepts
`dataset_name`, `file_path`, and optional rule/column settings. It is not the
endpoint used by the Dataset Quality workspace.

## Workspace feature mapping

| Workspace route | Data source |
|---|---|
| `/datasets/[datasetId]` (Overview) | Dataset detail + saved nested profiling response |
| `/datasets/[datasetId]/quality` | Dataset detail + direct Team 2 quality validation endpoint |
| `/datasets/[datasetId]/columns` | Saved nested profiling `columns[]` |
| `/datasets/[datasetId]/distributions` | Saved profiling `columns[].histogram` and `columns[].top_values` |
| `/datasets/[datasetId]/correlations` | Saved profiling `correlations[]` |
| `/datasets/[datasetId]/recommendations` | No recommendations endpoint/response is present in the supplied Team 2 package; UI remains an explicit not-available state |

## Contract notes

- Dataset list and detail routes wrap records in `datasets` and `dataset`.
- The upload endpoint returns the new dataset record under `dataset` and may use
  `accepted` or `duplicate_request` as the response status.
- Profiling response `dataset` may be `null` on failure; `correlations` and
  `class_distribution` may be absent when not applicable.
- Team 2 profiling uses `status: success | warning | failed`; warning responses
  can still contain usable profiling data.
- Team 2 quality uses `status: PASSED | FAILED_VALIDATION` and a flat
  `violations` array. The frontend does not map the older sample-report shape
  (`compliance_status`, `validation_results`) into this endpoint.
- API endpoint paths, HTTP methods and backend schemas are not modified by
  this frontend mapping update.


## Semantic Understanding (added 20 November 2026)

- Saved dataset processing result: `GET /api/v1/datasets/{dataset_id}/profile`
  - The combined result includes `semantic_analysis`, generated automatically by Team 2 orchestration after profiling.
  - The semantic engine returns a list of `SemanticHandoffResult` objects; the frontend uses the first result for the selected dataset.
- Re-run semantic detection: `POST /api/v1/semantic/`
  - Required body: `{ "profiles": [<ProfilingResponse>] }`
  - Optional fields supported by the current Team 2 route: `quality`, `goal`, `overrides`, `problem_type_override`, `quality_dataset`, `quality_settings`, `approved_feature_columns`, `leakage_settings`.
  - The frontend currently sends `profiles`, and optional `goal` and `overrides` for a selected target column.
- The supplied backend ZIP exposes only `POST /api/v1/semantic/`. It does not implement `GET /api/v1/semantic/handoff/{dataset_id}`, `POST /api/v1/semantic/review`, or `GET /api/v1/semantic/review/{dataset_id}`. Those paths appear in the teammate TypeScript contract but are not live routes in this backend package. Therefore the current UI displays the handoff and allows re-analysis, but does not claim to persist review approval or training permission.
