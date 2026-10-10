/** Request and response types follow the backend HTTP API contract. */
export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthUser {
  id: number;
  username: string;
  role: string;
  displayName: string;
}

export interface LoginResponse {
  token: string;
  expiresAt: string;
  user: AuthUser;
}

export interface CurrentUserResponse {
  user: AuthUser;
  sessionRemainingSeconds: number;
}

export interface LogoutResponse {
  status: 'ok';
}

export interface StoredSession {
  token: string;
  expiresAt: string;
}
