export type DatasetStatus = "uploaded" | "processing" | "ready" | "failed";

export interface Dataset {
  id: string;
  name: string;
  description?: string;
  status?: DatasetStatus;
  rowCount?: number;
  columnCount?: number;
  createdAt?: string;
  updatedAt?: string;
}
