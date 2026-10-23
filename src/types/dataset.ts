export type DatasetStatus =
  | "uploaded"
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
}

export interface DatasetListResponse {
  success: boolean;
  data: Dataset[];
  pagination: {
    page: number;
    page_size: number;
    total: number;
  };
}