import type { ApiErrorResponse } from "./types";

const API_CONFIG = {
  baseURL: import.meta.env.LOCAL_BACKEND_URL || "http://localhost:8000/v1",
  timeout: parseInt(import.meta.env.API_TIMEOUT || "10000"),
  headers: {
    "Content-Type": "application/json",
    // "User-Agent": "MyApp/1.0", // Example of custom header
  },
};

export class ApiError extends Error {
  status: number;
  errorId?: string;
  supportMessage?: string;
  messages?: string[];

  constructor(
    message: string,
    status: number,
    details?: Partial<ApiErrorResponse>
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorId = details?.errorId;
    this.supportMessage = details?.supportMessage;
    this.messages = details?.messages;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

async function handleApiError(
  response: Response,
  defaultMessage: string,
  options?: { skipRedirect?: boolean }
): Promise<never> {
  const status = response.status;
  let errorData: ApiErrorResponse | null = null;
  let errorMessage = `${defaultMessage} (${status})`;

  try {
    const responseText = await response.text();

    if (responseText) {
      try {
        errorData = JSON.parse(responseText) as ApiErrorResponse;

        // Extract the most relevant message
        if (errorData.messages && errorData.messages.length > 0) {
          errorMessage = errorData.messages.join(" ");
        } else if (
          errorData.errors &&
          Array.isArray(errorData.errors) &&
          errorData.errors.length > 0
        ) {
          errorMessage = errorData.errors[0].message;
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.exception) {
          errorMessage = errorData.exception;
        } else if (errorData.supportMessage) {
          errorMessage = errorData.supportMessage;
        }
      } catch {
        // If JSON parsing fails, use raw text if it's reasonable
        if (
          responseText.length < 200 &&
          !responseText.toLowerCase().includes("<html")
        ) {
          errorMessage = `${defaultMessage}: ${responseText.trim()} (${status})`;
        }
      }
    }
  } catch {
    // If we can't read the response, stick with default message
    errorMessage = `${defaultMessage} (${status})`;
  }

  // Handle 401 errors with automatic redirect (unless explicitly skipped)
  if (status === 401 && !options?.skipRedirect) {
    console.warn("401 Unauthorized - authentication required");
    // Don't redirect here - let the calling Server Action handle it
  }

  throw new ApiError(errorMessage, status, errorData ?? undefined);
}

class ApiClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;

  constructor(
    baseURL: string,
    defaultHeaders: Record<string, string> = {},
    timeout: number = 10000
  ) {
    this.baseURL = baseURL;
    this.defaultHeaders = defaultHeaders;
    this.timeout = timeout;
  }

  /**
   * Make a request to the API
   */
  async request<T>(
    endpoint: string,
    options: RequestInit = {},
    errorMessage: string,
    requestOptions?: { skipRedirect?: boolean }
  ): Promise<T> {
    const url = endpoint.startsWith("http")
      ? endpoint
      : `${this.baseURL}${endpoint}`;

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const requestHeaders = {
        ...this.defaultHeaders,
        ...options.headers,
      };

      // Log detailed request information for debugging
      console.log(`API Request to ${endpoint}:`);
      console.log(`  URL: ${url}`);
      console.log(`  Method: ${options.method || "GET"}`);
      console.log(`  Headers:`, requestHeaders);
      if (options.body) {
        console.log(`  Body:`, options.body);
      }

      const response = await fetch(url, {
        ...options,
        headers: requestHeaders,
        signal: controller.signal,
        credentials: "include",
      });

      clearTimeout(timeoutId);

      console.log(
        `API Response for ${endpoint}: ${response.status} ${response.statusText}`
      );
      console.log(
        `  Response Headers:`,
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        await handleApiError(response, errorMessage, requestOptions);
      }

      return await this.parseResponse<T>(response, endpoint);
    } catch (error) {
      console.log(`API Error for ${endpoint}: ${error}`);
      clearTimeout(timeoutId);

      if (error instanceof ApiError) {
        throw error;
      }

      // Handle network errors and timeouts
      if (error && typeof error === "object" && "name" in error) {
        if (error.name === "AbortError") {
          throw new ApiError(`Request timeout: ${errorMessage}`, 408);
        }
        if ("message" in error && typeof error.message === "string") {
          throw new ApiError(`Network Error: ${errorMessage}`, 503);
        }
      }

      throw new ApiError(`Unknown Error: ${errorMessage}`, 500);
    }
  }

  /**
   * Parse response based on content type
   */
  private async parseResponse<T>(
    response: Response,
    endpoint: string
  ): Promise<T> {
    const contentType = response.headers.get("content-type");

    // Handle No Content response
    if (response.status === 204) {
      console.log(`API No Content for ${endpoint}`);
      return {} as T;
    }

    // Handle plain text responses
    if (contentType?.includes("text/plain")) {
      const text = await response.text();
      console.log(`API Text Response for ${endpoint}:`, text);
      return { message: text } as T;
    }

    // Handle JSON responses (default)
    try {
      const responseText = await response.text();
      if (!responseText.trim()) {
        console.warn(`API success response for ${endpoint} was empty.`);
        return {} as T;
      }

      const jsonData = JSON.parse(responseText) as T;
      // console.log(`API JSON Response for ${endpoint}:`, jsonData);
      return jsonData;
    } catch (error) {
      console.error(
        `Failed to parse successful API response for ${endpoint} as JSON:`,
        error
      );
      throw new ApiError(
        `API Error: Unexpected response format from ${endpoint}`,
        500
      );
    }
  }

  /**
   * Convenience method for GET requests
   */
  async get<T>(
    endpoint: string,
    token?: string,
    options?: { skipRedirect?: boolean }
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "GET",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
      "GET request failed",
      options
    );
  }

  /**
   * Convenience method for POST requests
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    token?: string,
    options?: { skipRedirect?: boolean }
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: data ? JSON.stringify(data) : undefined,
      },
      "POST request failed",
      options
    );
  }

  /**
   * Convenience method for PUT requests
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    token?: string,
    options?: { skipRedirect?: boolean }
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "PUT",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: data ? JSON.stringify(data) : undefined,
      },
      "PUT request failed",
      options
    );
  }

  /**
   * Convenience method for PATCH requests
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    token?: string,
    options?: { skipRedirect?: boolean }
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "PATCH",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: data ? JSON.stringify(data) : undefined,
      },
      "PATCH request failed",
      options
    );
  }

  /**
   * Convenience method for DELETE requests
   */
  async delete<T>(
    endpoint: string,
    token?: string,
    options?: { skipRedirect?: boolean }
  ): Promise<T> {
    return this.request<T>(
      endpoint,
      {
        method: "DELETE",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      },
      "DELETE request failed",
      options
    );
  }
}

export const apiClient = new ApiClient(
  API_CONFIG.baseURL!,
  API_CONFIG.headers,
  API_CONFIG.timeout
);
