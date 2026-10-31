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
    if (baseUrl) {
      const url = new URL(baseUrl);
      const local = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);
      if ((url.protocol !== 'https:' && !(url.protocol === 'http:' && local)) ||
          url.username || url.password || url.search || url.hash) {
        throw new Error('API 地址必须使用 HTTPS（本机调试除外），且不能包含凭据、查询参数或片段');
      }
    }
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
    // Keep all calls on the configured origin; never accept a user-supplied URL.
    const hasControl = (value: string) => Array.from(value).some(char => char.charCodeAt(0) < 32 || char.charCodeAt(0) === 127);
    if (!path.startsWith('/') || path.startsWith('//') || /[\\\s#]/.test(path) || hasControl(path)) {
      throw new Error('API 路径必须是以单个 / 开头的站内路径');
    }
    const decodedPath = decodeURIComponent(path.split('?')[0]);
    if (decodedPath.includes('\\') || hasControl(decodedPath) || decodedPath.split('/').some(part => part === '.' || part === '..')) {
      throw new Error('API 路径不能包含目录跳转或控制字符');
    }
    const requestHeaders = new Headers(headers);
    requestHeaders.set('Accept', 'application/json');
    const hasBody = body !== undefined;
    if (hasBody && !requestHeaders.has('Content-Type')) {
      requestHeaders.set('Content-Type', 'application/json');
    }

    const response = await this.fetchImpl(`${this.baseUrl}${path}`, {
      method,
      headers: requestHeaders,
      body: hasBody ? JSON.stringify(body) : undefined,
      signal,
      credentials: 'omit',
      redirect: 'error',
      cache: 'no-store',
      referrerPolicy: 'no-referrer',
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
