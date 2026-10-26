# Team 2 API Contract Integration Notes

**Frontend:** Next.js / TypeScript  
**Base URL:** `NEXT_PUBLIC_API_URL` (currently `http://127.0.0.1:8000`)  
**Status:** Contract adapters added; live endpoint availability is not confirmed by this frontend change.

## Important distinction

The locally tested prototype endpoint is `GET /datasets`, which previously returned a direct array with `id`, `name`, `status`, `rowCount`, and `columnCount`. The Team 2 sample contract documents `GET /api/v1/datasets` and an envelope with `success`, `message`, and `data`, using `dataset_id`, `dataset_name`, `row_count`, and `column_count`.

The visible Datasets page continues to call the previously tested `GET /datasets`. The normalizer accepts either documented data shape if that endpoint returns it. A separate adapter for the proposed Team 2 `/api/v1` routes is in `src/api/team2-contract.ts`; it must only be switched on after confirming the running backend's actual OpenAPI contract.

## Team 2 contract adapters added

| Method | Proposed path | Frontend function | Status |
|---|---|---|---|
| GET | `/health` | `getTeam2Health` | Confirm route/prefix in Swagger |
| GET | `/api/v1/datasets` | `getTeam2Datasets` | Proposed contract; prototype `/datasets` is the currently tested list call |
| POST | `/api/v1/datasets/upload` | `uploadTeam2Dataset` | Proposed; multipart field name `file` needs Team 2 confirmation |
| GET | `/api/v1/datasets/{dataset_id}` | `getTeam2Dataset` | Proposed |
| POST | `/api/v1/datasets/{dataset_id}/profile` | `requestTeam2DatasetProfile` | Proposed; request body may need to match actual schema |
| POST | `/api/v1/experiments` | `createTeam2Experiment` | Proposed |
| GET | `/api/v1/experiments/{experiment_id}` | `getTeam2Experiment` | Proposed |
| POST | `/api/v1/training/jobs` | `createTeam2TrainingJob` | Proposed |
| GET | `/api/v1/training/jobs/{job_id}` | `getTeam2TrainingJob` | Proposed |
| POST | `/api/v1/predict` | `requestTeam2Prediction` | Proposed |

These adapters do not claim the backend has implemented the routes. The sample contract documents use illustrative payloads and need to be verified against the live Swagger/OpenAPI schema. Team 2 should confirm authentication, upload field name/size limits, error response shape, required fields, enum values, and whether health is at `/health` or under `/api/v1`.

## Shared frontend configuration

Set the base URL in `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

The base URL is the server origin only. Endpoint functions append their paths. Restart the Next.js development server after changing `.env.local`.

## HR dataset added

`public/sample-data/HR_Sample_Dataset.csv` was assembled from the six HR tables supplied by Team 2:
- `HumanResources.Employee.xlsx`
- `HumanResources.Department.xlsx`
- `HumanResources.Shift.xlsx`
- `HumanResources.EmployeeDepartmentHistory.xlsx`
- `HumanResources.EmployeePayHistory.xlsx`
- `HumanResources.JobCandidate.xlsx` (not needed in the employee-level join)

The CSV contains 290 employee records and 11 columns. It uses each employee's current department/shift assignment (`EndDate` empty, latest `StartDate`) and latest pay-history row (`RateChangeDate`). The uploaded files did not include `Person.Person`, so employee first/last names are not present in this CSV. `JobCandidate` was not joined because it is a separate recruitment table and not required for the employee-level dataset.

This is a derived CSV from the provided Excel tables, not a claim that Team 2 supplied a pre-built CSV. Treat it as sample/test data and confirm the intended dataset schema with Team 2 before using it as a production contract.
