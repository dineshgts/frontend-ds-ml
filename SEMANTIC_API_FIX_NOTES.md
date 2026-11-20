# Semantic API integration fix

## Changes
- When the Semantic Understanding route loads, the frontend fetches the saved processing result from `GET /api/v1/datasets/{dataset_id}/profile`.
- If the saved result has `semantic_analysis`, it displays that result.
- If the saved result has `profiling` but no saved `semantic_analysis`, it automatically calls `POST /api/v1/semantic/` with `{ "profiles": [profiling] }` and displays the returned result.
- The target override and business-goal controls are visible whenever profiling data is available, even when there is no existing semantic result.
- The user can manually re-run semantic analysis.
- The retry action also attempts the semantic POST when the saved semantic result is missing.

## Backend prerequisites
- Dataset processing must finish with status `ready`.
- `GET /api/v1/datasets/{dataset_id}/profile` must return a `profiling` object.
- The backend must be running and reachable at the frontend `NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:8000`).
- CORS must allow the frontend origin.

## Scope
Only the frontend `src/` tree is included from the latest source archive. This is not a complete application package; keep your existing root configuration files and replace the `src/` folder with this one after backing up your current source.
