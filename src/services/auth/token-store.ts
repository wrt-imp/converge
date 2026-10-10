import type {StoredSession} from '../types';

const SESSION_KEY = 'converge.auth.session';

function getStorage(): Storage | undefined {
  if (typeof window === 'undefined') return undefined;
  try {
    return window.sessionStorage;
  } catch {
    return undefined;
  }
}

export function readStoredSession(): StoredSession | undefined {
  const storage = getStorage();
  if (!storage) return undefined;

  try {
    const raw = storage.getItem(SESSION_KEY);
    if (!raw) return undefined;
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== 'object' || !('token' in value) || !('expiresAt' in value)) return undefined;
    const {token, expiresAt} = value;
    const expiry = typeof expiresAt === 'string' ? Date.parse(expiresAt) : Number.NaN;
    if (typeof token !== 'string' || typeof expiresAt !== 'string' || !Number.isFinite(expiry) || expiry <= Date.now()) {
      clearStoredSession();
      return undefined;
    }
    return {token, expiresAt};
  } catch {
    clearStoredSession();
    return undefined;
  }
}

export function getStoredToken(): string | undefined {
  return readStoredSession()?.token;
}

export function saveStoredSession(session: StoredSession): void {
  try {
    getStorage()?.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    throw new Error('浏览器无法保存当前会话，请检查存储权限后重试。');
  }
}

export function clearStoredSession(): void {
  try {
    getStorage()?.removeItem(SESSION_KEY);
  } catch {
    // Session storage may be unavailable in restricted browser contexts.
  }
}
