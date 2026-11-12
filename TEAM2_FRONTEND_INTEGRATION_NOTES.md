# Team 2 frontend integration changes

This source archive contains the corrected `src/` folder only. It does not include package.json, lockfile, Next.js config, or other repository-root files. Copy/merge this `src/` folder into the existing frontend repository; do not replace the repository root.

## Files changed

- `src/api/datasets.ts`: maps Team 2 dataset list (`{status,total,datasets}`), detail (`{status,dataset}`), and upload (`{status,message,dataset}`) responses into the frontend Dataset type. Adds calls for the existing background processing start, result retrieval, and retry routes.
- `src/types/dataset.ts`: adds Team 2's `validating` status and keeps the normalized frontend dataset model.
- `src/components/workspaces/DatasetWorkspaceView.tsx`: reads saved profiling and quality output from the uploaded dataset processing result endpoint instead of sending an unrelated fixed file path or using the standalone quality registry.
- `src/components/datasets/DatasetStatusBadge.tsx`: renders both `validating` and `profiling` backend states.
- `src/app/datasets/upload/page.tsx`: file picker and validation now accept only `.csv` and `.xlsx`, matching Team 2. Upload response is treated as accepted while backend background processing continues.
- `src/components/datasets/DatasetStatusBadge.tsx`: supports the backend `validating` state where the existing component mapping was present.

## Backend endpoints used

- `GET /datasets` — returns `{ status, total, datasets }`.
- `GET /datasets/{dataset_id}` — returns `{ status, dataset }`.
- `POST /api/v1/datasets/upload` — multipart field `file`; returns HTTP 202 and `{ status, message, dataset }`.
- `POST /api/v1/datasets/{dataset_id}/profile` — starts background profiling and quality processing.
- `GET /api/v1/datasets/{dataset_id}/profile` — returns saved combined processing results after status becomes `ready`.
- `POST /api/v1/datasets/{dataset_id}/retry` — retries failed background processing.

## Important integration notes

The backend performs profiling and quality automatically after upload. For uploaded datasets, use the saved combined result endpoint above. The separate `POST /api/v1/profiling/` route expects a server-accessible file path; a browser File object or local browser path cannot be passed as that server path. The separate `POST /api/v1/quality/` route uses its own registered-ID flow and should not be used as the uploaded-dataset workflow.

The backend upload route derives the dataset name from the original filename and does not currently save `project_id`. The frontend project-name field therefore remains informational only. The backend code currently has no pagination query parameters. The frontend list page paginates the returned list in the browser.

The upload page applies a 50 MB client-side limit; the inspected backend upload route does not enforce a corresponding server-side maximum. Ask the backend team to add a server-side size limit before production use.

## Not changed / not claimed

Dashboard model/training-job values remain mock data because the supplied backend does not expose those dashboard endpoints. Recommendations remain unavailable because there is no matching endpoint in the supplied backend.
