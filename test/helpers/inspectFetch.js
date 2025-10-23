import assert from 'node:assert/strict';

export function parseLastCall(fetchStub) {
  const call = fetchStub.calls.at(-1);
  assert(call, 'Expected fetch to be called');
  const url = new URL(call.url);
  return { call, url };
}

export default parseLastCall;
