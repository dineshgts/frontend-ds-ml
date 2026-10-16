
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
};

export async function apiGet<T>(
  path: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, 10000);

  const abortRequest = () => controller.abort();

  options.signal?.addEventListener("abort", abortRequest);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      signal: controller.signal,
    });

    const body = await response.json().catch(() => null);

    if (!response.ok) {
      const errorDetails = body?.error;

      const defaultMessages: Record<number, string> = {
        400: "Invalid request.",
        401: "Authentication is required.",
        403: "You do not have permission to access this resource.",
        404: "The requested resource was not found.",
        422: "Please check the submitted data.",
        429: "Too many requests. Please try again later.",
        500: "Something went wrong on the server.",
        502: "The server is temporarily unavailable.",
        503: "The service is temporarily unavailable.",
        504: "The server took too long to respond.",
      };

      throw new ApiRequestError(
        response.status,
        errorDetails?.code ?? "REQUEST_FAILED",
        errorDetails?.message ??
          defaultMessages[response.status] ??
          "The request could not be completed."
      );
    }

    return body as T;
  } catch (error: unknown) {
    if (error instanceof ApiRequestError) {
      throw error;
    }

    // Preserve cancellation from the calling component.
    if (options.signal?.aborted) {
      throw error;
    }

    // Handle the client's own timeout.
    if (controller.signal.aborted) {
      throw new ApiRequestError(
        408,
        "TIMEOUT",
        "The request timed out. Please try again."
      );
    }

    // Handle network errors and an unavailable backend.
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
