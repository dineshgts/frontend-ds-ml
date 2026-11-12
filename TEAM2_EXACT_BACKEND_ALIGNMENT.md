# Frontend alignment with Team 2 FastAPI

This source update follows the actual backend implementation and `FINAL_API_CONTRACT.md`
inside `team2-profiling-api-main.zip`.

## Exact API routes

- `GET /health`
- `POST /api/v1/profiling/`
- `POST /api/v1/quality/`
- `POST /api/v1/orchestration/`

The frontend continues to call profiling and quality separately, matching the two
standalone routes. The TypeScript API layer also defines the orchestration request and
response types for later use.

## Exact profiling request

The frontend sends `schema_version`, `request_id`, `dataset_reference` (including
`dataset_id`, `source_type: "file"`, `name`, and `location`), plus optional `metadata`
and `options`. The location must be a path readable by the FastAPI server.

## Exact profiling response

The frontend models the response fields from Team 2: `schema_version`, `request_id`,
`module`, `status`, `generated_at`, `duration_ms`, `dataset_reference`, `dataset`,
`columns`, `warnings`, `errors`, and `correlations`.

The UI displays dataset row/column counts, duplicate rows, column types, missing and
unique values, numeric summaries, histograms, categorical top values, correlation
pairs, and warnings/errors. Class distribution is optional and is shown only if it is
present in a response.

## Exact quality request and response

Request: `{ "dataset_id": "...", "version": "v1" }`.

The actual Team 2 route wraps quality results inside `quality_metadata`:
- `quality_metadata.validation_summary`
- `quality_metadata.issue_logs`
- `quality_metadata.errors`

The UI reads this wrapper and shows the message, dataset ID/version, summary and each
issue's category, severity, affected column, affected row count, description and
recommended action.

## Important backend constraints from Team 2

- Profiling reads a server-side file path; it does not accept a browser upload in this API.
- Quality uses IDs in the backend's `DATASET_REGISTRY`; the current backend source
  registers `hr_department` and `hr_employee`.
- The quality route uses the registered file paths configured in the backend source.
- Orchestration accepts `dataset_id`, `dataset_source`, optional request/name/target,
  `id_cols`, `options`, and `metadata`. Its response includes service status,
  downstream context, profiling, quality and semantic-analysis status.
- Semantic analysis currently returns `not_configured`.

## Environment

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_TEAM2_PROFILE_DATASET_LOCATION=app/data/sample.csv
```

`NEXT_PUBLIC_TEAM2_PROFILE_DATASET_LOCATION` is sent as a string to FastAPI; it must
refer to a file accessible from the backend process. It is not a browser-local path.

## Scope and verification

Only the profiling and quality contract/types/presentation were aligned. Dataset
listing, upload, and detail APIs remain separate and are not implemented by Team 2's
profiling/quality service.

ZIP integrity was checked. A complete Next.js build/type check was not run because the
provided frontend archive contains `src/` only, without `package.json`, `tsconfig.json`,
or installed dependencies.
