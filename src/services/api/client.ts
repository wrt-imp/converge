import type {ApiErrorBody} from '../types';

export type HttpMethod = 'DELETE' | 'GET' | 'POST' | 'PUT';

export interface ApiRequestOptions {
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

export interface ApiClientOptions {
  baseUrl?: string;
  fetch?: typeof globalThis.fetch;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: ApiErrorBody,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/** Generic transport only. It intentionally knows no Converge business route. */
export class ApiClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof globalThis.fetch;

  constructor({baseUrl = '', fetch = globalThis.fetch}: ApiClientOptions = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.fetchImpl = fetch;
  }

  request<TResponse>(path: string, method: HttpMethod, options: ApiRequestOptions = {}): Promise<TResponse> {
    return this.send<TResponse>(path, method, options);
  }

  get<TResponse>(path: string, options?: Omit<ApiRequestOptions, 'body'>): Promise<TResponse> {
    return this.send<TResponse>(path, 'GET', options);
  }

  post<TResponse>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, 'body'>): Promise<TResponse> {
    return this.send<TResponse>(path, 'POST', {...options, body});
  }

  put<TResponse>(path: string, body?: unknown, options?: Omit<ApiRequestOptions, 'body'>): Promise<TResponse> {
    return this.send<TResponse>(path, 'PUT', {...options, body});
  }

  delete<TResponse>(path: string, options?: Omit<ApiRequestOptions, 'body'>): Promise<TResponse> {
    return this.send<TResponse>(path, 'DELETE', options);
  }

  private async send<TResponse>(
    path: string,
    method: HttpMethod,
    {body, headers, signal}: ApiRequestOptions = {},
  ): Promise<TResponse> {
    const requestHeaders = new Headers(headers);
    const hasBody = body !== undefined;
    if (hasBody && !requestHeaders.has('Content-Type')) {
      requestHeaders.set('Content-Type', 'application/json');
    }

    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      method,
      headers: requestHeaders,
      body: hasBody ? JSON.stringify(body) : undefined,
      signal,
    });
    const payload = await response.json().catch(() => undefined);

    if (!response.ok) {
      const errorBody = isApiErrorBody(payload) ? payload : undefined;
      throw new ApiClientError(
        errorBody?.error.message ?? `Request failed with status ${response.status}`,
        response.status,
        errorBody,
      );
    }

    return payload as TResponse;
  }
}

export function createApiClient(options?: ApiClientOptions): ApiClient {
  return new ApiClient(options);
}

function isApiErrorBody(value: unknown): value is ApiErrorBody {
  if (!value || typeof value !== 'object' || !('error' in value)) return false;
  const error = value.error;
  return Boolean(error && typeof error === 'object' && 'code' in error && typeof error.code === 'string' && 'message' in error && typeof error.message === 'string');
}
