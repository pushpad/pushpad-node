import test from 'node:test';
import assert from 'node:assert/strict';
import Pushpad from '../src/index.js';
import { createFetchStub } from './helpers/fetchStub.js';
import { parseLastCall } from './helpers/inspectFetch.js';

test('subscription.create creates a subscription', async () => {
  const subscriptionPayload = {
    endpoint: 'https://example.com/push/f7Q1Eyf7EyfAb1',
    p256dh: 'BCQVDTlYWdl05lal3lG5SKr3VxTrEWpZErbkxWrzknHrIKFwihDoZpc_2sH6Sh08h-CacUYI-H8gW4jH-uMYZQ4=',
    auth: 'cdKMlhgVeSPzCXZ3V7FtgQ==',
    uid: 'user1',
    tags: ['tag1', 'tag2']
  };

  const subscriptionResponse = {
    id: 12345,
    project_id: 55,
    ...subscriptionPayload,
    last_click_at: null,
    created_at: '2025-09-15T10:30:00.123Z'
  };

  const fetchStub = createFetchStub([{ status: 201, body: subscriptionResponse }]);
  const client = new Pushpad({ authToken: 'token', projectId: 55, fetch: fetchStub });

  const result = await client.subscription.create(subscriptionPayload);

  assert.deepEqual(result, subscriptionResponse);
  const { call, url } = parseLastCall(fetchStub);
  assert.equal(call.options.method, 'POST');
  assert.equal(url.pathname, '/api/v1/projects/55/subscriptions');
  assert.equal(call.options.body, JSON.stringify(subscriptionPayload));
});

test('subscription.findAll lists subscriptions for a project', async () => {
  const fetchStub = createFetchStub([{ status: 200, body: [{ id: 1 }, { id: 2 }] }]);
  const client = new Pushpad({ authToken: 'token', projectId: 55, fetch: fetchStub });

  const response = await client.subscription.findAll();

  assert.deepEqual(response, [{ id: 1 }, { id: 2 }]);
  const { call, url } = parseLastCall(fetchStub);
  assert.equal(call.options.method, 'GET');
  assert.equal(url.pathname, '/api/v1/projects/55/subscriptions');
});

test('subscription.findAll normalises query params', async () => {
  const fetchStub = createFetchStub([{ status: 200, body: [] }]);
  const client = new Pushpad({ authToken: 'token', projectId: 55, fetch: fetchStub });

  await client.subscription.findAll({ per_page: 10, uids: 'user1', tags: ['a', 'b'] });

  const { url } = parseLastCall(fetchStub);
  assert.equal(url.pathname, '/api/v1/projects/55/subscriptions');
  assert.equal(url.searchParams.get('per_page'), '10');
  assert.deepEqual(url.searchParams.getAll('uids[]'), ['user1']);
  assert.deepEqual(url.searchParams.getAll('tags[]'), ['a', 'b']);
});

test('subscription.count returns total using HEAD request', async () => {
  const fetchStub = createFetchStub([{ status: 200, headers: { 'X-Total-Count': '123' } }]);
  const client = new Pushpad({ authToken: 'token', projectId: 77, fetch: fetchStub });

  const total = await client.subscription.count({ uids: 'user1', tags: ['vip'] });

  assert.equal(total, 123);
  const { call, url } = parseLastCall(fetchStub);
  assert.equal(call.options.method, 'HEAD');
  assert.equal(url.pathname, '/api/v1/projects/77/subscriptions');
  assert.deepEqual(url.searchParams.getAll('uids[]'), ['user1']);
  assert.deepEqual(url.searchParams.getAll('tags[]'), ['vip']);
});

test('subscription.find retrieves a subscription', async () => {
  const subscriptionResponse = { id: 999, uid: 'user1', tags: ['a'] };
  const fetchStub = createFetchStub([{ status: 200, body: subscriptionResponse }]);
  const client = new Pushpad({ authToken: 'token', projectId: 12, fetch: fetchStub });

  const response = await client.subscription.find(999);

  assert.deepEqual(response, subscriptionResponse);
  const { call, url } = parseLastCall(fetchStub);
  assert.equal(call.options.method, 'GET');
  assert.equal(url.pathname, '/api/v1/projects/12/subscriptions/999');
});

test('subscription.find allows overriding projectId per call', async () => {
  const subscriptionResponse = { id: 321, uid: 'user2' };
  const fetchStub = createFetchStub([{ status: 200, body: subscriptionResponse }]);
  const client = new Pushpad({ authToken: 'token', fetch: fetchStub });

  const response = await client.subscription.find(321, { projectId: 44 });

  assert.deepEqual(response, subscriptionResponse);
  const { call, url } = parseLastCall(fetchStub);
  assert.equal(url.pathname, '/api/v1/projects/44/subscriptions/321');
});

test('subscription.find requires a project id', async () => {
  const fetchStub = createFetchStub();
  const client = new Pushpad({ authToken: 'token', fetch: fetchStub });

  await assert.rejects(
    client.subscription.find(1),
    (error) => {
      assert(error instanceof Error);
      assert.match(error.message, /projectId is required/);
      return true;
    }
  );
});

test('subscription.update updates a subscription', async () => {
  const fetchStub = createFetchStub([{ status: 200, body: { id: 99, uid: 'user2' } }]);
  const client = new Pushpad({ authToken: 'token', projectId: 101, fetch: fetchStub });

  const updatePayload = { uid: 'user2', tags: ['vip'] };
  const response = await client.subscription.update(4321, updatePayload);

  assert.deepEqual(response, { id: 99, uid: 'user2' });
  const { call, url } = parseLastCall(fetchStub);
  assert.equal(call.options.method, 'PATCH');
  assert.equal(url.pathname, '/api/v1/projects/101/subscriptions/4321');
  assert.equal(call.options.body, JSON.stringify(updatePayload));
});

test('subscription.delete deletes a subscription', async () => {
  const fetchStub = createFetchStub([{ status: 204 }]);
  const client = new Pushpad({ authToken: 'token', projectId: 502, fetch: fetchStub });

  await client.subscription.delete(777);

  const { call, url } = parseLastCall(fetchStub);
  assert.equal(call.options.method, 'DELETE');
  assert.equal(url.pathname, '/api/v1/projects/502/subscriptions/777');
  assert.equal(call.options.body, undefined);
});

test('subscription.create requires an object payload', async () => {
  const fetchStub = createFetchStub();
  const client = new Pushpad({ authToken: 'token', projectId: 88, fetch: fetchStub });

  await assert.rejects(
    client.subscription.create(),
    (error) => {
      assert(error instanceof Error);
      assert.match(error.message, /non-empty object/);
      return true;
    }
  );

  assert.equal(fetchStub.calls.length, 0);
});

test('subscription.update requires an object payload', async () => {
  const fetchStub = createFetchStub();
  const client = new Pushpad({ authToken: 'token', projectId: 91, fetch: fetchStub });

  await assert.rejects(
    client.subscription.update(5),
    (error) => {
      assert(error instanceof Error);
      assert.match(error.message, /non-empty object/);
      return true;
    }
  );

  assert.equal(fetchStub.calls.length, 0);
});
