# Team 2 profiling and data-quality frontend integration

This update changes only the frontend integration for Team 2's **Data Profiling** and **Data Quality** APIs. The Next.js + TypeScript + Tailwind framework and existing application shell are retained.

## API calls implemented

### Data profiling
- `POST /api/v1/profiling/`
- Sends `schema_version`, `request_id`, `dataset_reference`, `metadata`, and `options` according to Team 2's Pydantic request model.
- Reads the actual response nesting: row/column/duplicate counts from `dataset`, column details from `columns`, and warnings/errors/correlations from their response fields.
- The UI displays column types, missing counts and percentages, unique counts, likely identifiers, numerical summaries, histogram bins and categorical top values.

### Data quality
- `POST /api/v1/quality/`
- Sends `{ "dataset_id": "...", "version": "v1" }`.
- Displays `quality_metadata.validation_summary`, `issue_logs`, and `errors`.
- The quality screen has an editable backend dataset ID because Team 2 currently registers only `hr_department` and `hr_employee` in `app/routes/quality.py`. A frontend dataset ID such as `ds_001` will return 404 unless Team 2 adds it to the registry.

## Environment configuration

Set these in the frontend `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_TEAM2_PROFILE_DATASET_LOCATION=app/data/sample.csv
```

`NEXT_PUBLIC_TEAM2_PROFILE_DATASET_LOCATION` is the path as seen by the **FastAPI server**, not a path on the browser user's PC. The example path assumes FastAPI is started from the backend repository root and the sample file exists at `app/data/sample.csv`. For another dataset, use a path accessible to the backend process. Restart the Next.js dev server after changing environment variables.

The current profiling API accepts `csv` and `xlsx` format metadata. The backend currently receives a server-side path; it does not receive a browser file upload in this integration.

## Important backend dependencies / limitations

1. Team 2's `GET /datasets` and `GET /datasets/{id}` endpoints are not part of the supplied backend. The current frontend still uses its existing dataset list/detail API for dataset navigation. Profiling and quality calls are now corrected, but those dataset metadata calls must be provided by the dataset service or replaced with local/mock metadata.
2. Team 2's quality registry uses hard-coded Windows paths from the backend developer's machine. Those files must exist at the configured backend paths on the machine running FastAPI, or the backend team must update the registry to shared/deployed paths.
3. Quality validation currently supports registered dataset IDs only. Arbitrary uploaded datasets cannot be quality-checked until Team 2 adds dynamic dataset registration or a file-based quality request.
4. The current backend does not expose a profile GET endpoint. The frontend runs profiling by POST and keeps the result in page state; refreshing the page requires running profiling again.
5. Browser CORS must allow the frontend origin in FastAPI deployment. The supplied `main.py` does not configure CORS middleware.

## Files changed

- `src/api/client.ts` — prefers `NEXT_PUBLIC_API_BASE_URL`, retaining `NEXT_PUBLIC_API_URL` as a fallback.
- `src/api/team2-contract.ts` — exact Team 2 profiling and quality request/response types and API calls.
- `src/api/datasets.ts` — corrected profiling/quality wrappers and request payload builder.
- `src/components/workspaces/DatasetWorkspaceView.tsx` — integrated profiling, column statistics, distributions, correlations, and quality result UI.

## Test sequence

1. Start the Team 2 FastAPI server and verify `GET http://localhost:8000/health`.
2. Confirm the configured profile path exists from the FastAPI process working directory.
3. Start the Next.js frontend after setting `.env.local`.
4. Open a dataset detail page and click **Run profiling**.
5. Open its **Data Quality** tab, enter `hr_department` or `hr_employee`, and click **Run quality check**.

The archive contains only the `src/` tree because that is what was supplied for the frontend. It does not include the project's root `package.json`, lockfile, `tsconfig.json`, or Tailwind/Next configuration, so a full production build could not be run here.
