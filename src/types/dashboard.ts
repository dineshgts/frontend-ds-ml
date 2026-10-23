export interface DashboardCount { total: number; }
export interface DashboardSummary {
  projects: { total: number; active: number };
  datasets: DashboardCount;
  experiments: DashboardCount;
  training_jobs: { total: number; running: number; completed: number; failed: number };
  models: { total: number; deployed: number };
}
export interface DashboardSummaryResponse {
  success: boolean;
  data: DashboardSummary;
  meta: { source: string; generated_at: string };
}
