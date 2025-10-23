import test from 'node:test';
import assert from 'node:assert/strict';
import Pushpad from '../src/index.js';
import { createFetchStub } from './helpers/fetchStub.js';
import { parseLastCall } from './helpers/inspectFetch.js';

test('notification.create posts to the project notifications endpoint', async () => {
  const fetchStub = createFetchStub([
    { status: 201, body: { id: 99 } }
  ]);

  const client = new Pushpad({ authToken: 'token', projectId: 42, fetch: fetchStub });
  const response = await client.notification.create({ body: 'Hello world' });

  assert.deepEqual(response, { id: 99 });
  const { call, url } = parseLastCall(fetchStub);
  assert.equal(call.options.method, 'POST');
  assert.equal(url.pathname, '/api/v1/projects/42/notifications');
  assert.equal(call.options.headers.get('Authorization'), 'Bearer token');
  assert.equal(call.options.body, JSON.stringify({ body: 'Hello world' }));
});

test('notification.findAll supports overriding projectId per call', async () => {
  const fetchStub = createFetchStub([
    { status: 200, body: [] }
  ]);

  const client = new Pushpad({ authToken: 'token', projectId: 1, fetch: fetchStub });
  await client.notification.findAll({ page: 3 }, { projectId: 77 });

  const { url } = parseLastCall(fetchStub);
  assert.equal(url.pathname, '/api/v1/projects/77/notifications');
  assert.equal(url.searchParams.get('page'), '3');
});

test('notification.cancel issues DELETE without body', async () => {
  const fetchStub = createFetchStub([{ status: 204 }]);
  const client = new Pushpad({ authToken: 'token', projectId: 7, fetch: fetchStub });

  await client.notification.cancel(888);

  const { call, url } = parseLastCall(fetchStub);
  assert.equal(call.options.method, 'DELETE');
  assert.equal(url.pathname, '/api/v1/notifications/888/cancel');
  assert.equal(call.options.body, undefined);
});
