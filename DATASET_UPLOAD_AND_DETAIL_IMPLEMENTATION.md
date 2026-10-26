# Dataset listing, upload, and detail-page frontend

## Included
- Dataset listing metadata and status fields with pagination.
- Clickable dataset names that open the corresponding dataset workspace.
- Upload form at `/datasets/upload`.
- File selection and validation for CSV, TSV, XLS, XLSX, and JSON, with a 50 MB demo limit.
- File-type feedback, required-field validation, submitting/success/error states.
- Dataset detail Overview with metadata, row/column/project values, status, profiling status and available actions.
- Shared empty/error presentation components and retry-friendly UI.
- Mock-only behavior: no backend or FastAPI request is made by the upload form or detail actions.

## Important
The upload and profiling actions are intentionally simulated. They do not upload, store, or process the file. Connect them to the agreed backend endpoints when the backend team provides the upload/profiling API contract.

## Test routes
- `/datasets`
- `/datasets/upload`
- `/datasets/ds_001`
- `/datasets/ds_002`
- `/datasets/ds_004` (failed status)
- `/datasets/not-a-real-id` (dataset-not-found state)

## Apply
Merge the `src/` directory into the existing Next.js project. Keep project-root configuration and dependencies. Then run `npm run dev`, `npx tsc --noEmit`, and `npm run build` in the full project root.
