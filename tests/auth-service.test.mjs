import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {URL} from 'node:url';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';

// Reuse the project's TypeScript compiler; no new test dependency or generated source files.
const source = readFileSync(new URL('../src/services/auth/auth-service.ts', import.meta.url), 'utf8');
const {outputText} = ts.transpileModule(source, {compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS}});
const exports = {};
runInNewContext(outputText, {exports});
const {authService, createHttpAuthService} = exports;
const user = {id: 1, username: 'student', role: 'student', displayName: '学习者'};

test('unconfigured auth rejects all operations without a request or fake login', async () => {
  await assert.rejects(authService.login({username: 'student', password: 'test-only'}), /尚未接入/);
  await assert.rejects(authService.logout('test-only'), /尚未接入/);
  await assert.rejects(authService.getCurrentUser('test-only'), /尚未接入/);
});

test('login adapter uses only the documented contract and preserves the password verbatim', async () => {
  let called = false;
  const expected = {user, token: 'test-only', expiresAt: '2030-01-01T00:00:00Z'};
  const service = createHttpAuthService({post: async (path, body, options) => {
    called = true;
    assert.equal(path, '/api/auth/login');
    assert.equal(body.username, 'student');
    assert.equal(body.password, ' test-only ');
    assert.equal(options.signal, 'signal-placeholder');
    return expected;
  }});
  assert.equal(await service.login({username: ' student ', password: ' test-only '}, 'signal-placeholder'), expected);
  assert.equal(called, true);
});

test('empty credentials do not reach the transport', async () => {
  const service = createHttpAuthService({post: () => {assert.fail('must not send');}});
  await assert.rejects(service.login({username: ' ', password: 'test-only'}), /请填写/);
  await assert.rejects(service.login({username: 'student', password: ''}), /请填写/);
});

test('invalid login responses fail instead of authenticating', async () => {
  for (const response of [null, {}, {user, token: '', expiresAt: '2030-01-01'}, {user, token: 'test-only', expiresAt: 'invalid'}, {user: {...user, id: '1'}, token: 'test-only', expiresAt: '2030-01-01'}]) {
    const service = createHttpAuthService({post: async () => response});
    await assert.rejects(service.login({username: 'student', password: 'test-only'}), /响应格式/);
  }
});

test('logout and current user use documented paths and Bearer headers', async () => {
  const service = createHttpAuthService({
    post: async (path, body, options) => {
      assert.equal(path, '/api/auth/logout'); assert.equal(body, undefined);
      assert.equal(options.headers.Authorization, 'Bearer test-only'); return {status: 'ok'};
    },
    get: async (path, options) => {
      assert.equal(path, '/api/auth/me'); assert.equal(options.headers.Authorization, 'Bearer test-only');
      return {user, sessionRemainingSeconds: 30};
    },
  });
  await service.logout('test-only');
  assert.equal((await service.getCurrentUser('test-only')).user, user);
});

test('invalid tokens, malformed me and failed logout are rejected', async () => {
  const service = createHttpAuthService({post: async () => ({status: 'failed'}), get: async () => ({user, sessionRemainingSeconds: -1})});
  await assert.rejects(service.logout(''), /无效/);
  await assert.rejects(service.getCurrentUser('unsafe\r\nheader'), /无效/);
  await assert.rejects(service.logout('test-only'), /退出响应格式/);
  await assert.rejects(service.getCurrentUser('test-only'), /用户响应格式/);
});

test('transport errors are preserved for caller handling', async () => {
  const failure = new Error('network unavailable');
  const service = createHttpAuthService({post: async () => {throw failure;}});
  await assert.rejects(service.login({username: 'student', password: 'test-only'}), error => error === failure);
});

test('oversized credentials and unsafe tokens never reach transport', async () => {
  const service = createHttpAuthService({post: () => assert.fail('must not send'), get: () => assert.fail('must not send')});
  await assert.rejects(service.login({username: 'a'.repeat(65), password: 'test-only'}), /长度/);
  await assert.rejects(service.login({username: 'student', password: 'a'.repeat(257)}), /长度/);
  for (const token of ['with space', 'tab\there', '中文', 'a'.repeat(8193)]) {
    await assert.rejects(service.getCurrentUser(token), /无效/);
  }
});
