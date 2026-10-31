/* global AbortController */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {URL} from 'node:url';
import {runInNewContext} from 'node:vm';
import ts from 'typescript';

function loadService() {
  const source = readFileSync(new URL('../src/services/auth/registration-service.ts', import.meta.url), 'utf8');
  const {outputText} = ts.transpileModule(source, {compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS}});
  const exports = {};
  runInNewContext(outputText, {exports});
  return exports;
}

test('registration is unconfigured and cannot simulate account creation', async () => {
  const source = readFileSync(new URL('../src/services/auth/registration-service.ts', import.meta.url), 'utf8');
  const {outputText} = ts.transpileModule(source, {compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS}});
  const exports = {};
  runInNewContext(outputText, {exports});
  await assert.rejects(exports.registrationService.register({username: 'preview-user', password: 'test-only'}), /注册服务尚未接入/);
});

test('successful registration continues only after the service resolves', async () => {
  const {registerAndContinue} = loadService();
  const order = [];
  await registerAndContinue({register: async () => {order.push('registered');}}, {username: 'preview-user', password: 'test-only'}, () => order.push('navigate'));
  assert.deepEqual(order, ['registered', 'navigate']);
});

test('failed or unconfigured registration never navigates', async () => {
  const {registerAndContinue, registrationService} = loadService();
  let navigated = false;
  const failure = new Error('test service failure');
  for (const service of [registrationService, {register: async () => {throw failure;}}]) {
    await assert.rejects(registerAndContinue(service, {username: 'preview-user', password: 'test-only'}, () => {navigated = true;}));
    assert.equal(navigated, false);
  }
});

test('an aborted registration does not navigate on a late response', async () => {
  const {registerAndContinue} = loadService();
  const controller = new AbortController();
  controller.abort();
  let navigated = false;
  await registerAndContinue({register: async () => {}}, {username: 'preview-user', password: 'test-only'}, () => {navigated = true;}, controller.signal);
  assert.equal(navigated, false);
});
