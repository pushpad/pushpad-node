import test from 'node:test';
import assert from 'node:assert/strict';
import Pushpad from '../src/index.js';
import { createFetchStub } from './helpers/fetchStub.js';
import { parseLastCall } from './helpers/inspectFetch.js';

test('project.create posts project definition to /projects', async () => {
  const projectPayload = {
    sender_id: 98765,
    name: 'My Project',
    website: 'https://example.com',
    icon_url: 'https://example.com/icon.png',
    badge_url: 'https://example.com/badge.png'
  };

  const projectResponse = {
    id: 12345,
    created_at: '2025-09-14T10:30:00.123Z',
    ...projectPayload
  };

  const fetchStub = createFetchStub([{ status: 201, body: projectResponse }]);
  const client = new Pushpad({ authToken: 'token', fetch: fetchStub });

  const result = await client.project.create(projectPayload);

  assert.deepEqual(result, projectResponse);
  const { call, url } = parseLastCall(fetchStub);
  assert.equal(call.options.method, 'POST');
  assert.equal(url.pathname, '/api/v1/projects');
  assert.equal(call.options.body, JSON.stringify(projectPayload));
});

test('project.findAll retrieves all projects', async () => {
  const projects = [
    { id: 1, name: 'Project A', website: 'https://a.test', sender_id: 5 }
  ];
  const fetchStub = createFetchStub([{ status: 200, body: projects }]);
  const client = new Pushpad({ authToken: 'token', fetch: fetchStub });

  const result = await client.project.findAll();

  assert.deepEqual(result, projects);
  const { call, url } = parseLastCall(fetchStub);
  assert.equal(call.options.method, 'GET');
  assert.equal(url.pathname, '/api/v1/projects');
});

test('project.find fetches project by id', async () => {
  const project = { id: 99, name: 'Sample', website: 'https://sample.test', sender_id: 3 };
  const fetchStub = createFetchStub([{ status: 200, body: project }]);
  const client = new Pushpad({ authToken: 'token', fetch: fetchStub });

  const result = await client.project.find(99);

  assert.deepEqual(result, project);
  const { call, url } = parseLastCall(fetchStub);
  assert.equal(call.options.method, 'GET');
  assert.equal(url.pathname, '/api/v1/projects/99');
});

test('project.update patches existing project', async () => {
  const updatePayload = { name: 'Updated Project', notifications_ttl: 604800 };
  const response = { id: 44, ...updatePayload };
  const fetchStub = createFetchStub([{ status: 200, body: response }]);
  const client = new Pushpad({ authToken: 'token', fetch: fetchStub });

  const result = await client.project.update(44, updatePayload);

  assert.deepEqual(result, response);
  const { call, url } = parseLastCall(fetchStub);
  assert.equal(call.options.method, 'PATCH');
  assert.equal(url.pathname, '/api/v1/projects/44');
  assert.equal(call.options.body, JSON.stringify(updatePayload));
});

test('project.delete sends DELETE and expects 202 status', async () => {
  const fetchStub = createFetchStub([{ status: 202 }]);
  const client = new Pushpad({ authToken: 'token', fetch: fetchStub });

  await client.project.delete(51);

  const { call, url } = parseLastCall(fetchStub);
  assert.equal(call.options.method, 'DELETE');
  assert.equal(url.pathname, '/api/v1/projects/51');
});
