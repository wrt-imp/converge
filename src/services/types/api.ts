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
