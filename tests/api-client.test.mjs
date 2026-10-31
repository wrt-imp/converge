import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {URL} from 'node:url';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/services/api/client.ts', import.meta.url), 'utf8');
const {outputText} = ts.transpileModule(source, {compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS}});
const exports = {};
runInNewContext(outputText, {exports, URL, Headers: globalThis.Headers});
const {createApiClient} = exports;

test('rejects insecure remote origins, URL credentials and ambiguous base URLs', () => {
  for (const baseUrl of ['http://api.example.com', 'ftp://example.com', 'https://user:secret@example.com', 'https://example.com/?token=secret', 'https://example.com/#fragment']) {
    assert.throws(() => createApiClient({baseUrl}));
  }
  for (const baseUrl of ['', 'https://api.example.com', 'http://localhost:3000', 'http://127.0.0.1:3000']) {
    assert.doesNotThrow(() => createApiClient({baseUrl}));
  }
});

test('rejects external URLs and traversal before any request', async () => {
  const client = createApiClient({fetch: () => assert.fail('must not send')});
  for (const path of ['https://evil.example', '//evil.example', '/\\evil.example', '/api/../auth', '/api/%2e%2e/auth', '/api/%5c/escape', '/api/%0d%0aheader', '/api#fragment']) {
    await assert.rejects(client.get(path));
  }
});

test('JSON requests omit ambient cookies, caching, redirects and referrer', async () => {
  const client = createApiClient({baseUrl: 'https://api.example.com', fetch: async (url, options) => {
    assert.equal(url, 'https://api.example.com/api/auth/login');
    assert.equal(options.credentials, 'omit');
    assert.equal(options.redirect, 'error');
    assert.equal(options.cache, 'no-store');
    assert.equal(options.referrerPolicy, 'no-referrer');
    assert.equal(options.headers.get('Content-Type'), 'application/json');
    assert.equal(options.headers.get('Accept'), 'application/json');
    assert.equal(options.body, JSON.stringify({username: 'student', password: 'test-only'}));
    return {ok: true, json: async () => ({status: 'ok'})};
  }});
  assert.equal((await client.post('/api/auth/login', {username: 'student', password: 'test-only'})).status, 'ok');
});

test('HTTP failures retain status and structured error', async () => {
  const client = createApiClient({fetch: async () => ({ok: false, status: 401, json: async () => ({error: {code: 'invalid_credentials', message: 'invalid'}})})});
  await assert.rejects(client.get('/api/auth/me'), error => error.status === 401 && error.body.error.code === 'invalid_credentials');
});
