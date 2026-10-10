/** Shared response shapes documented by the current server HTTP API contract. */
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
  };
}

export interface HealthStatus {
  status: 'ok';
}

/** Error envelope documented by server/docs/api.md. */
export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
  };
}
