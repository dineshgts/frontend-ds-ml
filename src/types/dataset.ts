export type DatasetStatus =
  | "uploaded"
  | "validating"
  | "profiling"
  | "ready"
  | "failed";

export interface Dataset {
  id: string;
  name: string;
  project_id: string | null;
  row_count: number | null;
  column_count: number | null;
  status: DatasetStatus;
  created_at: string;
  version?: string | null;
  file_name?: string | null;
  file_format?: string | null;
  processing_error?: string | null;
  profiled_at?: string | null;
}

export interface DatasetListResponse {
  datasets: Dataset[];
  total: number;
}
