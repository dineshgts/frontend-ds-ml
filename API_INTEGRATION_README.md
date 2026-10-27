# API integration notes

## Configure the frontend
Create `.env.local` in the Next.js project root:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```
Restart `npm run dev` after changing environment variables.

## Start the backend
From the extracted `ds_fastapi` folder, install its requirements and start:
```powershell
python -m pip install -r requirements.txt
python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
If `requirements.txt` is missing, install `fastapi`, `uvicorn`, `python-multipart`, and `openpyxl` (Excel support).

- API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/health

## Integrated in this frontend
- Dataset list/details use the FastAPI `/datasets` endpoints.
- Dataset upload uses `POST /api/v1/datasets/upload` with multipart field `file`.
- Dataset profile helpers call `GET/POST /api/v1/datasets/{id}/profile`.
- Experiment list/details/create use `/api/v1/experiments`.

## Current backend limitations
- Upload accepts `.csv`, `.xlsx`, `.xls` only and has a 25 MB limit.
- The dataset name is currently derived from the uploaded filename; the upload API does not accept the form's custom dataset name or project association.
- Metadata is stored in memory and resets when the backend restarts.
- Project listing returns an empty array. Model registry, reports, and prediction inference are not implemented by this backend; prediction returns HTTP 501.
- Training jobs are prototype records only; no actual model training worker is connected.
- CORS in `main.py` permits localhost:3000 and 127.0.0.1:3000. Add your frontend origin there if using another host or port.
