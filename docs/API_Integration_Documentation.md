# API Integration Documentation
## Data Science Intelligence & Automated Machine Learning Engine

**Module:** Python Backend API Integration  
**Framework:** FastAPI  
**Frontend:** Next.js / React  
**API Version:** Prototype v1  
**Status:** Initial integration and testing completed

---

## 1. Objective

The objective of this task is to establish communication between the frontend application and the FastAPI backend. This includes configuring the API client, fetching dataset information, handling API errors, and testing the API endpoints.

The current implementation is a prototype for integration testing. The final API contract must be confirmed with Team 2 before production integration.

## 2. Technology Stack

- Python
- FastAPI
- Uvicorn
- Pydantic
- React / Next.js
- TypeScript
- REST API
- Swagger UI
- Visual Studio Code

## 3. Project Setup

### Backend Setup

Navigate to the FastAPI project directory:

```bash
cd C:\Users\admin\Documents\fastapi
```

Activate and run the backend using:

```bash
.\venv\Scripts\python.exe -m uvicorn main:app --reload
```

Backend base URL:

```text
http://127.0.0.1:8000
```

Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

### Frontend Setup

The frontend project is located at:

```text
C:\front-end-main\frontend-ds-ml
```

The environment configuration in `.env.local` is:

```env
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

The frontend runs at:

```text
http://localhost:3000
```

## 4. API Endpoint Documentation

The following endpoints describe the current prototype. They are not yet confirmed as the final Team 2 API contract.
## 4. API Endpoint Documentation

### 4.1 Existing Endpoints

| HTTP Method | Endpoint    | Description                     |
|-------------|-------------|---------------------------------|
| GET         | `/datasets` | Retrieves the list of datasets. |
| GET         | `/projects` | Retrieves the list of projects. |

### 4.2 Prototype API Endpoints (Version 1)

| HTTP Method | Endpoint                                | Description                           |
|-------------|-----------------------------------------|---------------------------------------|
| GET         | `/api/v1/health`                        | Checks backend health.                |
| POST        | `/api/v1/datasets/upload`               | Demonstrates a dataset upload request.|
| GET         | `/api/v1/datasets/{dataset_id}`         | Retrieves a dataset by its ID.        |
| POST        | `/api/v1/datasets/{dataset_id}/profile` | Requests dataset profiling.           |
| GET         | `/api/v1/datasets/{dataset_id}/profile` | Retrieves dataset profiling results.  |
| POST        | `/api/v1/automl/jobs`                   | Submits an AutoML job request.        |
| GET         | `/api/v1/automl/jobs/{job_id}`          | Retrieves the status of an AutoML job.|
| GET         | `/api/v1/automl/jobs/{job_id}/results`  | Retrieves AutoML job results.         |
| GET         | `/api/v1/experiments`                   | Retrieves the list of experiments.    |
| GET         | `/api/v1/experiments/{experiment_id}`   | Retrieves an experiment by its ID.    |
 
### 4.3 Development and Validation Endpoint

| HTTP Method | Endpoint                  | Description                                      |
|-------------|---------------------------|--------------------------------------------------|
| POST        | `/api/v1/test-validation` | Tests request validation using a Pydantic model. |

**Note:** The endpoints listed in Sections 4.2 and 4.3 belong to the current prototype. Some return placeholder responses or simulated results. The dataset upload, profiling, AutoML execution, and experiment functionality are not fully implemented. The final endpoints must be confirmed with Team 2 before production integration.

## 5. Sample API Responses

### 5.1 Health Check

**Request:**

```http
GET /api/v1/health
```

**Response:**

```json
{
  "status": "healthy"
}
```

### 5.2 Dataset List

**Request:**

```http
GET /datasets
```

**Response:**

```json
[
  {
    "id": "ds_001",
    "name": "Customer Churn",
    "status": "ready",
    "rowCount": 1000,
    "columnCount": 12
  },
  {
    "id": "ds_002",
    "name": "Sales Analysis",
    "status": "ready",
    "rowCount": 2500,
    "columnCount": 8
  }
]
```

These are sample datasets returned by the current prototype.

### 5.3 AutoML Job Request

**Request:**

```http
POST /api/v1/automl/jobs
```

**Example response:**

```json
{
  "job_id": "job_demo_001",
  "status": "queued"
}
```

This is a demonstration response. It does not confirm that an actual machine learning job has been started.

## 6. Request Validation

Pydantic models are used to validate request data.

The current validation test checks the following fields:

- `target_column`: Required string with at least one character.
- `problem_type`: Required string.

**Example request:**

```json
{
  "target_column": "customer_status",
  "problem_type": "classification"
}
```

**Example successful response:**

```json
{
  "message": "Validation passed",
  "target_column": "customer_status",
  "problem_type": "classification"
}
```

An invalid request, such as an empty `target_column`, returns HTTP 422.

The `/api/v1/test-validation` endpoint is intended for development testing only.

## 7. Error Handling

The backend uses standardized error responses for selected error conditions.

### 7.1 Validation Error — HTTP 422

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Please check the submitted data."
  }
}
```

### 7.2 Resource Not Found — HTTP 404

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "The requested resource was not found."
  }
}
```

The frontend API client also includes user-friendly handling for common HTTP errors, request timeouts, and backend connection failures.

8. Frontend Integration

The frontend API integration includes the following changes:

Configured the API base URL using an environment variable.

Created a reusable API client in src/api/client.ts.

Added dataset API functions in src/api/datasets.ts.

Added project API functions in src/api/projects.ts.

Integrated the dataset list into the dashboard.

Added loading, error, and retry handling.

Added handling for common API errors and request timeouts.

Verified that the dashboard retrieves the dataset list from the local FastAPI backend.

The dashboard displays the dataset count retrieved from the API. Other dashboard information, including experiments, models, jobs, and activity, still uses mock data.

9. CORS Configuration

Cross-Origin Resource Sharing (CORS) is configured in the FastAPI application to allow requests from:

http://localhost:3000

The current prototype allows all HTTP methods and headers and enables credentials.

For production, CORS settings should be restricted to the approved frontend origins.

10. Authentication and Authorization

Authentication and authorization requirements have not yet been confirmed by Team 2.

The current prototype does not implement a complete authentication or authorization flow. The required authentication mechanism, token format, and permission rules must be documented when the backend contract becomes available.

## 11. Testing and Verification

The following tests have been performed to verify the backend API and frontend integration.

### 11.1 Test Results

|Sl.No| Test Case                                 | Status           |
|:--|---------------------------------------------|------------------|
| 1 | Backend health endpoint                     | Passed           |
| 2 | Dataset list endpoint                       | Passed           |
| 3 | Frontend dashboard dataset count            | Passed           |
| 4 | Missing dataset error handling (HTTP 404)   | Passed           |
| 5 | Request validation error handling(HTTP 422) | Passed           |
| 6 | Request timeout handling                    | Not Yet Verified |
| 7 | Backend unavailable handling                | Not Yet Verified |
| 8 | Actual dataset upload                       | Not Implemented  |
| 9 | Actual AutoML execution                     | Not Implemented  |
| 10| Persistent experiment storage and retrieval | Not Implemented  |

### 11.2 Summary

The backend health check, dataset retrieval, dashboard dataset count, and selected error-handling scenarios have been tested successfully. Timeout and backend-unavailable scenarios require further testing. Actual dataset upload, AutoML execution, and persistent experiment storage are pending implementation.


12. Limitations and Pending Work

The following items require further implementation or confirmation:

Confirm actual API endpoints and HTTP methods with Team 2.

Confirm the backend base URL and environment configuration for each environment.

Finalize request and response schemas.

Confirm supported dataset formats, upload size limits, and validation rules.

Define dataset and AutoML job lifecycle statuses.

Confirm job status polling or event-based updates.

Align error responses across frontend and backend.

Confirm authentication, authorization, and CORS requirements.

Implement and test real dataset upload, profiling, AutoML execution, and experiment retrieval.

Verify integration against the actual backend rather than placeholder responses.

13. Conclusion

The initial frontend-to-FastAPI integration prototype has been configured and tested for dataset retrieval, dashboard data display, health checking, and selected error-handling scenarios.

The reusable API client provides a foundation for future integration. Final production integration depends on receiving and validating the actual API contract from Team 2 and implementing the remaining backend functionality.

Document owner: Team 3 — API Integration
Document status: Prototype documentation; pending final API 