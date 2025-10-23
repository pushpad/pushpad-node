import test from 'node:test';
import assert from 'node:assert/strict';
import { HttpClient } from '../src/httpClient.js';
import { PushpadError } from '../src/errors.js';
import { createFetchStub } from './helpers/fetchStub.js';

test('HttpClient sends JSON payloads with auth header', async () => {
  const fetchStub = createFetchStub([{ status: 200, body: { ok: true } }]);
  const client = new HttpClient({ authToken: 'token', fetch: fetchStub });

  const response = await client.request('POST', 'foo', { body: { bar: 1 } });

  assert.deepEqual(response, { ok: true });
  assert.equal(fetchStub.calls.length, 1);
  const [call] = fetchStub.calls;
  assert.equal(call.url, 'https://pushpad.xyz/api/v1/foo');
  assert.equal(call.options.method, 'POST');
  assert.equal(call.options.headers.get('Authorization'), 'Bearer token');
  assert.equal(call.options.headers.get('Content-Type'), 'application/json');
  assert.equal(call.options.body, JSON.stringify({ bar: 1 }));
});

test('HttpClient serialises query parameters including arrays', async () => {
  const fetchStub = createFetchStub([{ status: 200, body: {} }]);
  const client = new HttpClient({ authToken: 'token', fetch: fetchStub });

  await client.request('GET', 'resources', {
    query: { tags: ['a', 'b'], single: 'value', truthy: true, maybe: undefined }
  });

  const call = fetchStub.calls.at(-1);
  const url = new URL(call.url);
  assert.equal(url.pathname, '/api/v1/resources');
  assert.deepEqual(url.searchParams.getAll('tags'), ['a', 'b']);
  assert.equal(url.searchParams.get('single'), 'value');
  assert.equal(url.searchParams.get('truthy'), 'true');
  assert.equal(url.searchParams.has('maybe'), false);
});

test('HttpClient throws PushpadError for unsuccessful statuses', async () => {
  const fetchStub = createFetchStub([
    { status: 400, body: { error: 'invalid' } }
  ]);
  const client = new HttpClient({ authToken: 'token', fetch: fetchStub });

  await assert.rejects(
    client.request('GET', 'resources'),
    (error) => {
      assert(error instanceof PushpadError);
      assert.equal(error.status, 400);
      assert.deepEqual(error.body, { error: 'invalid' });
      assert.equal(error.request.method, 'GET');
      return true;
    }
  );
});

test('HttpClient respects custom expected status codes', async () => {
  const fetchStub = createFetchStub([{ status: 202 }]);
  const client = new HttpClient({ authToken: 'token', fetch: fetchStub });

  await assert.doesNotReject(
    client.request('POST', 'resources', { expectedStatuses: 202 })
  );
});

test('HttpClient propagates timeout errors as PushpadError', async () => {
  let abortSignal;
  const fetchStub = async (_url, options = {}) => {
    abortSignal = options.signal;
    return new Promise((resolve, reject) => {
      options.signal?.addEventListener('abort', () => {
        const error = new Error('Aborted');
        error.name = 'AbortError';
        reject(error);
      });
    });
  };

  const client = new HttpClient({ authToken: 'token', fetch: fetchStub, timeout: 10 });

  await assert.rejects(
    client.request('GET', 'will-timeout'),
    (error) => {
      assert(error instanceof PushpadError);
      assert.equal(error.message, 'Request timed out');
      assert.equal(error.status, 0);
      return true;
    }
  );

  assert(abortSignal.aborted);
});
