import {apiClient} from '../api/client-instance';
import {useApiMock} from '../api/runtime-config';
import {mockCurrentUser, mockLogin} from '../mock/auth';
import type {CurrentUserResponse, LoginRequest, LoginResponse, LogoutResponse} from '../types';
import {clearStoredSession, getStoredToken, readStoredSession, saveStoredSession} from './token-store';

export class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const result = useApiMock
      ? mockLogin()
      : await apiClient.post<LoginResponse>('/api/auth/login', credentials, {authenticated: false});
    saveStoredSession({token: result.token, expiresAt: result.expiresAt});
    return result;
  }

  async logout(): Promise<LogoutResponse> {
    if (!getStoredToken()) {
      clearStoredSession();
      return {status: 'ok'};
    }

    try {
      if (!useApiMock) await apiClient.post<LogoutResponse>('/api/auth/logout');
      return {status: 'ok'};
    } finally {
      clearStoredSession();
    }
  }

  async getCurrentUser(): Promise<CurrentUserResponse | null> {
    if (!readStoredSession()) return null;
    if (useApiMock) return mockCurrentUser();

    try {
      return await apiClient.get<CurrentUserResponse>('/api/auth/me');
    } catch (error) {
      if (error instanceof Error && 'status' in error && error.status === 401) clearStoredSession();
      throw error;
    }
  }

  isAuthenticated(): boolean {
    return Boolean(readStoredSession());
  }
}

export const authService = new AuthService();
