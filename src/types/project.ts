export interface Project {
  id: string;
  name: string;
  description: string;
  status: "active" | "draft" | "completed";
  updatedAt: string;
}

export interface ApiError {
  detail?: string;
  message?: string;
}
