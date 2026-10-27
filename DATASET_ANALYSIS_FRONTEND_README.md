# Dataset Analysis UI (Frontend-only)

This patch updates the dataset workspace UI to use the existing frontend API client and FastAPI dataset/profile endpoints. It does not include or modify backend code.

## Files

- `src/components/workspaces/DatasetWorkspaceView.tsx` — Main dataset workspace layout. Loads dataset metadata and profile status, presents summary metrics, column profiling table, data-quality findings, and loading/error/empty states. It maps backend profile status to Pending, Running, Completed, and Failed.
- `src/api/datasets.ts` — Existing API functions used without changing the endpoint contract: `getDataset`, `getDatasetProfile`, and `profileDataset`.
- `src/api/client.ts` — Existing fetch wrapper and API base URL handling.
- `src/app/datasets/[datasetId]/page.tsx` — Dataset overview route that renders the workspace.
- `src/app/datasets/[datasetId]/columns/page.tsx` — Columns section route.
- `src/app/datasets/[datasetId]/quality/page.tsx` — Data-quality section route.
- `src/app/datasets/[datasetId]/distributions/page.tsx`, `correlations/page.tsx`, `recommendations/page.tsx` — Workspace section routes.

## API endpoints used

- `GET /datasets/{dataset_id}` — Dataset metadata (resolved against `NEXT_PUBLIC_API_URL`).
- `GET /api/v1/datasets/{dataset_id}/profile` — Profile status/results.
- `POST /api/v1/datasets/{dataset_id}/profile` — Request profiling.

The current backend profile response supports `dataset_id`, `status`, `row_count`, `column_count`, `columns[]` with `name`, `non_empty_count`, `missing_count`, and `sample_values`, plus an optional `message`. The UI displays these values when available.

## Contract limitations handled honestly

- The current backend does not return inferred data types, numeric statistics, or a dedicated quality-findings array. The UI leaves those fields unavailable instead of inventing values. It can display optional `quality_findings`, `findings`, `warnings`, `validation_issues`, or `issues` if the backend adds one of those fields.
- The backend profile endpoint currently supports CSV profiling; Excel and metadata-only demo datasets can return `unsupported` or `unavailable`. The UI surfaces the backend message.
- The current status endpoint returns `not_started` for uploaded files and the POST endpoint performs profiling synchronously. `running` is displayed while the request is in progress; `completed` and `failed` reflect the API response/result.
- The backend status vocabulary is not expanded or changed by this frontend patch.

## Integration

1. Copy the `src/` directory from this archive into the existing Next.js frontend repository, merging folders and replacing `src/components/workspaces/DatasetWorkspaceView.tsx`.
2. Keep the existing `package.json`, lockfile, AppShell, layout, navigation, and backend unchanged.
3. Set `NEXT_PUBLIC_API_URL` in `.env.local` to the FastAPI origin, for example `http://localhost:8000`.
4. Ensure the FastAPI service is running and CORS permits the frontend origin.
5. Open a dataset from the dataset listing so the URL is `/datasets/{datasetId}`.

This archive is a source patch, not a standalone Next.js application; the provided project archive did not include `package.json` or `tsconfig.json`.
