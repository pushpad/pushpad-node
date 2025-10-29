import test from 'node:test';
import assert from 'node:assert/strict';
import Pushpad from '../src/index.js';

test('signatureFor creates an HMAC signature', () => {
  const pushpad = new Pushpad({ authToken: '5374d7dfeffa2eb49965624ba7596a09' });
  const actual = pushpad.signatureFor('user12345');
  const expected = '6627820dab00a1971f2a6d3ff16a5ad8ba4048a02b2d402820afc61aefd0b69f';
  assert.equal(actual, expected);
});
