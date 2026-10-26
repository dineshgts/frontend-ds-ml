const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "/api/demo";

export class ApiRequestError extends Error {
  constructor(
    public status: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "ApiRequestError";
  }
}

type ApiRequestOptions = {
  signal?: AbortSignal;
  headers?: HeadersInit;
};

async function apiRequest<T>(
  path: string,
  init: RequestInit,
  options: ApiRequestOptions = {}
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  const abortRequest = () => controller.abort();
  options.signal?.addEventListener("abort", abortRequest);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...options.headers,
        ...init.headers,
      },
      signal: controller.signal,
      cache: "no-store",
    });

    const body: unknown = await response.json().catch(() => null);

    if (!response.ok) {
      const payload = typeof body === "object" && body !== null
        ? body as Record<string, unknown>
        : {};
      const nestedError = typeof payload.error === "object" && payload.error !== null
        ? payload.error as Record<string, unknown>
        : {};
      const defaultMessages: Record<number, string> = {
        400: "Invalid request.",
        401: "Authentication is required.",
        403: "You do not have permission to access this resource.",
        404: "The requested resource was not found.",
        413: "The uploaded file is too large.",
        422: "Please check the submitted data.",
        429: "Too many requests. Please try again later.",
        500: "Something went wrong on the server.",
        502: "The server is temporarily unavailable.",
        503: "The service is temporarily unavailable.",
        504: "The server took too long to respond.",
      };

      const message =
        (typeof nestedError.message === "string" && nestedError.message) ||
        (typeof payload.detail === "string" && payload.detail) ||
        (typeof payload.message === "string" && payload.message) ||
        defaultMessages[response.status] ||
        "The request could not be completed.";

      throw new ApiRequestError(
        response.status,
        typeof nestedError.code === "string" ? nestedError.code : "REQUEST_FAILED",
        message
      );
    }

    return body as T;
  } catch (error: unknown) {
    if (error instanceof ApiRequestError) throw error;
    if (options.signal?.aborted) throw error;

    if (controller.signal.aborted) {
      throw new ApiRequestError(408, "TIMEOUT", "The request timed out. Please try again.");
    }

    throw new ApiRequestError(
      0,
      "BACKEND_UNAVAILABLE",
      "Cannot connect to the server. Please check your connection and try again."
    );
  } finally {
    clearTimeout(timeout);
    options.signal?.removeEventListener("abort", abortRequest);
  }
}

export function apiGet<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  return apiRequest<T>(path, { method: "GET" }, options);
}

export function apiPost<T, TBody = unknown>(
  path: string,
  body: TBody,
  options: ApiRequestOptions = {}
): Promise<T> {
  return apiRequest<T>(
    path,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
    options
  );
}

export function apiUpload<T>(
  path: string,
  file: File,
  fieldName = "file",
  options: ApiRequestOptions = {}
): Promise<T> {
  const form = new FormData();
  form.append(fieldName, file);
  // Do not set Content-Type manually; the browser adds the multipart boundary.
  return apiRequest<T>(path, { method: "POST", body: form }, options);
}
