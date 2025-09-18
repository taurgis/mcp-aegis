import assert from 'node:assert/strict';
import { before, after, beforeEach, test } from 'node:test';
import { connect } from '../../src/index.js';

let client;

before(async () => {
  client = await connect('./examples/stateful-session-server/config.json');
});

after(async () => {
  await client?.disconnect();
});

beforeEach(() => {
  client.clearAllBuffers();
});

test('session lifecycle', async () => {
  const init = await client.callTool('session_store', { action: 'init', session_id: 'p1' });
  assert.equal(init.isError, false);

  const set = await client.callTool('session_store', { action: 'set', session_id: 'p1', key: 'notes', value: 'alpha' });
  assert.equal(set.isError, false);

  const append = await client.callTool('session_store', { action: 'append', session_id: 'p1', key: 'notes', value: '-beta' });
  assert.equal(append.isError, false);

  const get = await client.callTool('session_store', { action: 'get', session_id: 'p1', key: 'notes' });
  assert.equal(get.isError, false);
  assert.ok(get.content[0].text.includes('alpha-beta'));

  const clear = await client.callTool('session_store', { action: 'clear', session_id: 'p1' });
  assert.equal(clear.isError, false);
});
