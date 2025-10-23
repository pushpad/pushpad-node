import test from 'node:test';
import assert from 'node:assert/strict';
import Pushpad from '../src/index.js';
import { createFetchStub } from './helpers/fetchStub.js';
import { parseLastCall } from './helpers/inspectFetch.js';

test('sender.create posts to /senders', async () => {
  const senderPayload = { name: 'My Sender' };
  const senderResponse = {
    id: 321,
    vapid_private_key: '-----BEGIN EC PRIVATE KEY----- ...',
    vapid_public_key: '-----BEGIN PUBLIC KEY----- ...',
    created_at: '2025-09-13T10:30:00.123Z',
    ...senderPayload
  };

  const fetchStub = createFetchStub([{ status: 201, body: senderResponse }]);
  const client = new Pushpad({ authToken: 'token', fetch: fetchStub });

  const result = await client.sender.create(senderPayload);

  assert.deepEqual(result, senderResponse);
  const { call, url } = parseLastCall(fetchStub);
  assert.equal(call.options.method, 'POST');
  assert.equal(url.pathname, '/api/v1/senders');
  assert.equal(call.options.body, JSON.stringify(senderPayload));
});

test('sender.findAll lists senders', async () => {
  const senders = [{ id: 1, name: 'Sender A' }];
  const fetchStub = createFetchStub([{ status: 200, body: senders }]);
  const client = new Pushpad({ authToken: 'token', fetch: fetchStub });

  const result = await client.sender.findAll();

  assert.deepEqual(result, senders);
  const { call, url } = parseLastCall(fetchStub);
  assert.equal(call.options.method, 'GET');
  assert.equal(url.pathname, '/api/v1/senders');
});

test('sender.find retrieves sender by id', async () => {
  const sender = { id: 77, name: 'Sender B' };
  const fetchStub = createFetchStub([{ status: 200, body: sender }]);
  const client = new Pushpad({ authToken: 'token', fetch: fetchStub });

  const result = await client.sender.find(77);

  assert.deepEqual(result, sender);
  const { call, url } = parseLastCall(fetchStub);
  assert.equal(call.options.method, 'GET');
  assert.equal(url.pathname, '/api/v1/senders/77');
});

test('sender.update patches sender resource', async () => {
  const updatePayload = { name: 'Updated Sender' };
  const response = { id: 5, name: 'Updated Sender' };
  const fetchStub = createFetchStub([{ status: 200, body: response }]);
  const client = new Pushpad({ authToken: 'token', fetch: fetchStub });

  const result = await client.sender.update(5, updatePayload);

  assert.deepEqual(result, response);
  const { call, url } = parseLastCall(fetchStub);
  assert.equal(call.options.method, 'PATCH');
  assert.equal(url.pathname, '/api/v1/senders/5');
  assert.equal(call.options.body, JSON.stringify(updatePayload));
});

test('sender.delete sends DELETE to sender resource', async () => {
  const fetchStub = createFetchStub([{ status: 204 }]);
  const client = new Pushpad({ authToken: 'token', fetch: fetchStub });

  await client.sender.delete(333);

  const { call, url } = parseLastCall(fetchStub);
  assert.equal(call.options.method, 'DELETE');
  assert.equal(url.pathname, '/api/v1/senders/333');
});
