import { apiGet } from "@/lib/api/client";
import type { DatasetListResponse } from "@/types/dataset";

export interface GetDatasetsParams {
  page?: number;
  page_size?: number;
}

export function getDatasets({
  page = 1,
  page_size = 10,
}: GetDatasetsParams = {}): Promise<DatasetListResponse> {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(page_size),
  });

  return apiGet<DatasetListResponse>(
    `/api/v1/datasets?${params.toString()}`
  );
}