# Dataset page separation fix

## Root cause
The six route components all rendered `DatasetWorkspaceController` with a section prop. The controller placed the Data profiling action panel on Overview, Columns, Distributions, and Correlations, and rendered profiling warnings/errors globally. This made profiling UI appear repeatedly across detail routes.

## Changes
- The Data profiling action panel is shown only on Overview.\n- The Column profile table and column statistics are shown only on Columns (not Overview).\n- Target class distribution is shown only on Distributions.
- The saved profiling result is loaded automatically on Overview, Columns, Distributions, and Correlations because Next.js route navigation recreates page-local component state.
- Profiling warnings and errors are shown only on Overview rather than repeated on every detail page.
- Data Quality and Recommendations remain separate route-specific views.
- Existing API service calls and endpoint paths were not changed.

## Route behavior
- `/datasets/[datasetId]`: dataset summary + profiling load/action + profiling warnings/errors only.
- `/datasets/[datasetId]/quality`: Data Quality only.
- `/datasets/[datasetId]/columns`: column profile table and per-column statistics.
- `/datasets/[datasetId]/distributions`: histograms, top values and target class distribution.
- `/datasets/[datasetId]/correlations`: correlation results.
- `/datasets/[datasetId]/recommendations`: recommendations placeholder until backend support exists.

## Note
This fixes the repeated profiling panel and shared warning/error content. It assumes Team 2's saved processing endpoint returns `result.profiling` as expected by the existing API service.
