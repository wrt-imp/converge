import type {ApiErrorBody} from '../types';
import {clearStoredSession} from '../auth/token-store';

export type HttpMethod = 'DELETE' | 'GET' | 'POST' | 'PUT';

export interface ApiRequestOptions {
  authenticated?: boolean;
  body?: unknown;
  headers?: HeadersInit;
  signal?: AbortSignal;
}

export interface ApiClientOptions {
  baseUrl?: string;
  fetch?: typeof globalThis.fetch;
  getToken?: () => string | undefined;
  debug?: boolean;
  requireBaseUrl?: boolean;
  timeoutMs?: number;
}

export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly body?: ApiErrorBody,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiClientError';
  }
}

/** Shared transport: timeout, JSON, authorization and safe user-facing errors. */
export class ApiClient {
  private readonly baseUrl: string;
  private readonly fetchImpl: typeof globalThis.fetch;
  private readonly getToken: () => string | undefined;
  private readonly debug: boolean;
  private readonly requireBaseUrl: boolean;
  private readonly timeoutMs: number;

  constructor({baseUrl = '', fetch = globalThis.fetch, getToken = () => undefined, debug = false, requireBaseUrl = false, timeoutMs = 30_000}: ApiClientOptions = {}) {
    this.baseUrl = baseUrl.replace(/\/$/, '');
    this.fetchImpl = fetch;
    this.getToken = getToken;
    this.debug = debug;
    this.requireBaseUrl = requireBaseUrl;
    this.timeoutMs = timeoutMs;
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
    {authenticated = true, body, headers, signal}: ApiRequestOptions = {},
  ): Promise<TResponse> {
    if (this.requireBaseUrl && !this.baseUrl) {
      throw new ApiClientError('尚未配置远端 API 地址，请设置 API_BASE_URL。', 0, undefined, 'configuration_error');
    }

    const requestHeaders = new Headers(headers);
    const hasBody = body !== undefined;
    if (hasBody && !requestHeaders.has('Content-Type')) {
      requestHeaders.set('Content-Type', 'application/json');
    }

    const token = authenticated ? this.getToken() : undefined;
    if (token) requestHeaders.set('Authorization', `Bearer ${token}`);

    const controller = new AbortController();
    let timedOut = false;
    const abortFromCaller = () => controller.abort();
    if (signal?.aborted) controller.abort();
    else signal?.addEventListener('abort', abortFromCaller, {once: true});
    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, this.timeoutMs);
    const url = `${this.baseUrl}${path}`;

    if (this.debug) {
      const safeHeaders: Record<string, string> = {};
      requestHeaders.forEach((value, name) => {
        safeHeaders[name] = isSensitiveKey(name) ? '[REDACTED]' : value;
      });
      console.debug('[Converge API] Request', {method, url, headers: safeHeaders, body: sanitizeForLog(body)});
    }

    try {
      const response = await this.fetchImpl(url, {
        method,
        headers: requestHeaders,
        body: hasBody ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });
      const payload = await response.json().catch(() => undefined);
      if (this.debug) console.debug('[Converge API] Response', {method, url, status: response.status, body: sanitizeForLog(payload)});

      if (!response.ok) {
        const errorBody = isApiErrorBody(payload) ? payload : undefined;
        const code = errorBody?.error.code;
        if (response.status === 401 && authenticated) clearStoredSession();
        throw new ApiClientError(getUserFacingError(response.status, code), response.status, errorBody, code);
      }

      return payload as TResponse;
    } catch (error) {
      if (error instanceof ApiClientError) throw error;
      if (this.debug) console.debug('[Converge API] Network error', {method, url, timedOut});
      if (timedOut) throw new ApiClientError('请求超时，请稍后重试。', 408, undefined, 'timeout');
      if (controller.signal.aborted) throw new ApiClientError('请求已取消。', 0, undefined, 'request_aborted');
      throw new ApiClientError('无法连接服务，请检查网络后重试。', 0, undefined, 'network_error');
    } finally {
      clearTimeout(timeoutId);
      signal?.removeEventListener('abort', abortFromCaller);
    }
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

function isSensitiveKey(key: string): boolean {
  return /authorization|cookie|password|token|secret|api.?key/i.test(key);
}

function sanitizeForLog(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(sanitizeForLog);
  if (!value || typeof value !== 'object') return value;
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [key, isSensitiveKey(key) ? '[REDACTED]' : sanitizeForLog(item)]),
  );
}

export function getUserFacingError(status: number, code?: string): string {
  if (code === 'configuration_error') return '服务地址尚未配置，请联系管理员。';
  if (code === 'invalid_credentials' || code === 'account_locked') return '用户名或密码错误，请检查后重试。';
  if (code === 'unauthorized' || status === 401) return '登录状态已失效，请重新登录。';
  if (status === 400) return '请求内容不正确，请检查后重试。';
  if (status === 403) return '当前账号没有权限执行此操作。';
  if (status === 404) return '请求的内容不存在或已被移除。';
  if (status === 409) return '当前操作与已有数据冲突，请刷新后重试。';
  if (status === 422) return '提交的信息无法处理，请检查后重试。';
  if (status === 429) return code === 'account_locked' ? '用户名或密码错误，请检查后重试。' : '操作过于频繁，请稍后再试。';
  if (status === 502 || status === 503) return '服务暂时不可用，请稍后重试。';
  if (status >= 500) return '服务暂时遇到问题，请稍后重试。';
  return '请求未能完成，请稍后重试。';
}
