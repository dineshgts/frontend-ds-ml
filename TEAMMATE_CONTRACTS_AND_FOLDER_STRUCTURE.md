# Team 3 frontend structure update

## Added shared API schema files

- `src/types/profiling.ts` — Team mate's complete Data Profiling request/response contract.
- `src/types/data-quality.ts` — Team mate's complete Data Quality request/response contract.
- `src/api/team2-contract.ts` — API endpoint paths and HTTP adapter functions. It now imports the shared types instead of maintaining a second copy of the profiling/quality response interfaces.

## Existing feature-oriented folders retained

- `src/components/datasets/overview/`
- `src/components/datasets/quality/`
- `src/components/datasets/columns/`
- `src/components/datasets/distributions/`
- `src/components/datasets/correlations/`
- `src/components/datasets/recommendations/`
- `src/components/datasets/workspace/`

Route files remain under `src/app/datasets/[datasetId]/...`; each route imports its feature component.

## Important API contract mismatch to resolve with Team 2

The teammate's `src/types/data-quality.ts` describes a request with `dataset_name`, `file_path`, optional `rules_to_apply`, `target_col`, `id_cols`, and `numeric_columns`.

The current frontend's Team 2 endpoint adapter sends `{ dataset_id, version }` to `POST /api/v1/quality/`. These are different request shapes. To avoid breaking the currently integrated endpoint, this update preserves the existing live request adapter as `Team2QualityRequest` and separately adds the teammate's exact `DataQualityRequest` contract. Confirm with Team 2 which request schema is actually deployed before switching the API payload.

## Notes

- The teammate-provided schema files are included without changing their field names or unions.
- Existing dataset/profile/quality API URLs and component routes are preserved.
- The existing `TEAM2_UNVERSIONED_DATASET_VERSION` fallback remains for compatibility with the current source; verify it with Team 2 before production use.
