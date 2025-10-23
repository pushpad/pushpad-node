import test from 'node:test';
import assert from 'node:assert/strict';
import Pushpad from '../src/index.js';
import { createFetchStub } from './helpers/fetchStub.js';
import { parseLastCall } from './helpers/inspectFetch.js';

test('notification.create creates a notification', async () => {
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

test('notification.findAll lists notifications for the default project', async () => {
  const fetchStub = createFetchStub([
    { status: 200, body: [{ id: 1 }, { id: 2 }] }
  ]);

  const client = new Pushpad({ authToken: 'token', projectId: 42, fetch: fetchStub });
  const response = await client.notification.findAll();

  assert.deepEqual(response, [{ id: 1 }, { id: 2 }]);
  const { call, url } = parseLastCall(fetchStub);
  assert.equal(call.options.method, 'GET');
  assert.equal(url.pathname, '/api/v1/projects/42/notifications');
});

test('notification.findAll accepts per-call project overrides', async () => {
  const fetchStub = createFetchStub([
    { status: 200, body: [] }
  ]);

  const client = new Pushpad({ authToken: 'token', projectId: 1, fetch: fetchStub });
  await client.notification.findAll({ page: 3 }, { projectId: 77 });

  const { url } = parseLastCall(fetchStub);
  assert.equal(url.pathname, '/api/v1/projects/77/notifications');
  assert.equal(url.searchParams.get('page'), '3');
});

test('notification.find retrieves a notification', async () => {
  const fetchStub = createFetchStub([
    { status: 200, body: { id: 5, body: 'Hello world' } }
  ]);

  const client = new Pushpad({ authToken: 'token', fetch: fetchStub });
  const response = await client.notification.find(5);

  assert.deepEqual(response, { id: 5, body: 'Hello world' });
  const { call, url } = parseLastCall(fetchStub);
  assert.equal(call.options.method, 'GET');
  assert.equal(url.pathname, '/api/v1/notifications/5');
});

test('notification.cancel cancels a notification', async () => {
  const fetchStub = createFetchStub([{ status: 204 }]);
  const client = new Pushpad({ authToken: 'token', projectId: 7, fetch: fetchStub });

  await client.notification.cancel(888);

  const { call, url } = parseLastCall(fetchStub);
  assert.equal(call.options.method, 'DELETE');
  assert.equal(url.pathname, '/api/v1/notifications/888/cancel');
  assert.equal(call.options.body, undefined);
});

test('notification.create requires an object payload', async () => {
  const fetchStub = createFetchStub();
  const client = new Pushpad({ authToken: 'token', projectId: 9, fetch: fetchStub });

  await assert.rejects(
    client.notification.create(),
    (error) => {
      assert(error instanceof Error);
      assert.match(error.message, /non-empty object/);
      return true;
    }
  );

  assert.equal(fetchStub.calls.length, 0);
});

test('notification.create requires a project id', async () => {
  const fetchStub = createFetchStub();
  const client = new Pushpad({ authToken: 'token', fetch: fetchStub });

  await assert.rejects(
    client.notification.create({ body: 'Hello' }),
    (error) => {
      assert(error instanceof Error);
      assert.match(error.message, /projectId is required/);
      return true;
    }
  );

  assert.equal(fetchStub.calls.length, 0);
});
