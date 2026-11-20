# Semantic Understanding implementation

## Files added
- `src/types/semantic.ts` — teammate's Team 1/Team 2 semantic handoff, target candidate, semantic column, column-role, leakage and review types.
- `src/components/datasets/semantic/DatasetSemantic.tsx` — semantic workspace wrapper.
- `src/app/datasets/[datasetId]/semantic/page.tsx` — Next.js semantic route.

## Files updated
- `src/api/team2-contract.ts` — adds the actual `POST /api/v1/semantic/` request/response contract and `requestTeam2Semantic()`.
- `src/api/datasets.ts` — types the saved `semantic_analysis` field in the combined dataset processing result.
- `src/components/datasets/workspace/DatasetWorkspaceController.tsx` — adds Semantic Understanding navigation, loads saved semantic output, renders target suggestions, problem type, confidence, evidence, candidate ranking, semantic column roles, feature lists, leakage checks, warnings and alternatives. Adds target-column override and business-goal controls that re-run semantic detection through Team 2.

## Actual backend behaviour verified from the supplied Team 2 ZIP
1. Dataset upload processing calls `run_dataset_services()`.
2. `run_dataset_services()` runs profiling, quality and semantic analysis.
3. Semantic analysis is invoked with `profiles: [profiling_result]`; it returns a list of handoff results.
4. The combined result is saved and exposed through `GET /api/v1/datasets/{dataset_id}/profile` as `semantic_analysis`.
5. The backend also exposes `POST /api/v1/semantic/` with required `profiles` and optional `goal`, `overrides`, `problem_type_override`, and other semantic settings.

## Important API limitation
The teammate TypeScript file describes handoff/review GET/POST endpoints. The supplied Team 2 FastAPI source does not define those routes; its `semantic.py` exposes only `POST /api/v1/semantic/`. The implementation therefore does not fake a saved approval action. The UI can display the proposed result and re-run detection with a target override/business goal, but final review persistence and `training_allowed` require Team 2 to implement the review endpoints.

## How to test
1. Start Team 2 FastAPI.
2. Start the frontend.
3. Open a dataset that has reached `ready`.
4. Open `/datasets/<datasetId>/semantic`.
5. Confirm saved semantic handoff appears.
6. Choose a target override and/or enter a business goal, then select **Run semantic analysis**.
7. Confirm candidate target, problem type, column roles and leakage details update from the response.

## Note
This ZIP contains the frontend `src` tree supplied for this task, updated with semantic implementation. A full Next.js build could not be run because the uploaded archive contains only `src` and no `package.json`, lockfile or TypeScript configuration.
