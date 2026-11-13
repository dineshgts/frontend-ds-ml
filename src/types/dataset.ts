export type DatasetStatus = "uploaded" | "validating" | "profiling" | "ready" | "failed";
export interface Dataset { id: string; name: string; project_id: string | null; row_count: number | null; column_count: number | null; status: DatasetStatus; created_at: string; version?: string | null; }
export interface DatasetListResponse { datasets: Dataset[]; total: number; }
