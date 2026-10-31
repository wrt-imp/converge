import type {ApiClient} from '../api/client';

/** Shapes and paths from integration/upstream-api-contract.md. Opt-in only. */
export interface LoginInput {username: string; password: string}
export interface AuthUser {id: number; username: string; role: string; displayName: string}
export interface LoginResult {token: string; expiresAt: string; user: AuthUser}
export interface CurrentUserResult {user: AuthUser; sessionRemainingSeconds: number}
export interface AuthService {
  login(input: LoginInput, signal?: AbortSignal): Promise<LoginResult>;
  logout(token: string, signal?: AbortSignal): Promise<void>;
  getCurrentUser(token: string, signal?: AbortSignal): Promise<CurrentUserResult>;
}

export class AuthNotConfiguredError extends Error {
  constructor() {super('登录服务尚未接入'); this.name = 'AuthNotConfiguredError';}
}

/** Safe default: fails explicitly, never creates a fake user or sends a request. */
export const authService: AuthService = {
  async login() {throw new AuthNotConfiguredError();},
  async logout() {throw new AuthNotConfiguredError();},
  async getCurrentUser() {throw new AuthNotConfiguredError();},
};

function validUser(user: unknown): user is AuthUser {
  if (!user || typeof user !== 'object') return false;
  const value = user as Record<string, unknown>;
  return Number.isSafeInteger(value.id) && Number(value.id) > 0 &&
    ['username', 'role', 'displayName'].every(key => typeof value[key] === 'string');
}

function authorization(token: string): HeadersInit {
  if (!token || token.length > 8192 || /[^\x21-\x7e]/.test(token)) throw new Error('无效的会话令牌');
  return {Authorization: `Bearer ${token}`};
}

/** Opt-in adapter for later integration; no token/password persistence or refresh endpoint. */
export function createHttpAuthService(client: ApiClient): AuthService {
  return {
    async login(input, signal) {
      if (!input.username.trim() || !input.password) throw new Error('请填写用户名和密码');
      if (input.username.trim().length > 64 || input.password.length > 256) throw new Error('用户名或密码长度超出限制');
      const result = await client.post<LoginResult>('/api/auth/login', {
        username: input.username.trim(), password: input.password,
      }, {signal});
      if (!result || !validUser(result.user) || typeof result.token !== 'string' ||
          !result.token || result.token.length > 8192 || /[^\x21-\x7e]/.test(result.token) ||
          typeof result.expiresAt !== 'string' || !Number.isFinite(Date.parse(result.expiresAt))) {
        throw new Error('登录响应格式不正确');
      }
      return result;
    },
    async logout(token, signal) {
      const result = await client.post<{status: string}>('/api/auth/logout', undefined, {headers: authorization(token), signal});
      if (result?.status !== 'ok') throw new Error('退出响应格式不正确');
    },
    async getCurrentUser(token, signal) {
      const result = await client.get<CurrentUserResult>('/api/auth/me', {headers: authorization(token), signal});
      if (!result || !validUser(result.user) || !Number.isFinite(result.sessionRemainingSeconds) || result.sessionRemainingSeconds < 0) {
        throw new Error('用户响应格式不正确');
      }
      return result;
    },
  };
}
