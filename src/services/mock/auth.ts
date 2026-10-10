import type {AuthUser, LoginResponse} from '../types';

const MOCK_USER: AuthUser = {
  id: 1,
  username: 'student-demo',
  role: 'student',
  displayName: '演示学习者',
};

export function mockLogin(): LoginResponse {
  return {
    token: 'local-mock-session',
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    user: MOCK_USER,
  };
}

export function mockCurrentUser() {
  return {user: MOCK_USER, sessionRemainingSeconds: 24 * 60 * 60};
}
