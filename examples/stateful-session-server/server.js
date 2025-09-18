#!/usr/bin/env node
import process from 'node:process';

/**
 * Stateful session example MCP server.
 * Tool: session_store
 * Actions: init, set, append, get, clear
 */

const sessions = new Map();

function writeJson(obj) {
  process.stdout.write(`${JSON.stringify(obj)}\n`);
}

process.stdin.setEncoding('utf8');
let buffer = '';
process.stdin.on('data', chunk => {
  buffer += chunk;
  let idx;
  while ((idx = buffer.indexOf('\n')) !== -1) {
    const line = buffer.slice(0, idx).trim();
    buffer = buffer.slice(idx + 1);
    if (!line) {
      continue;
    }
    handleMessage(line);
  }
});

function handleMessage(line) {
  let msg;
  try {
    msg = JSON.parse(line);
  } catch {
    return;
  }

  if (msg.method === 'initialize') {
    writeJson({ jsonrpc: '2.0', id: msg.id, result: { capabilities: { tools: {} } } });
    return;
  }
  if (msg.method === 'initialized') {
    return;
  }
  if (msg.method === 'tools/list') {
    writeJson({ jsonrpc: '2.0', id: msg.id, result: { tools: [sessionToolDescriptor()] } });
    return;
  }
  if (msg.method === 'tools/call') {
    const { name, arguments: args } = msg.params || {};
    if (name === 'session_store') {
      const result = handleSessionTool(args || {});
      writeJson({ jsonrpc: '2.0', id: msg.id, result });
      return;
    }
    writeJson({ jsonrpc: '2.0', id: msg.id, error: { code: -32601, message: 'Unknown tool' } });
  }
}

function sessionToolDescriptor() {
  return {
    name: 'session_store',
    description: 'Manage ephemeral session key/value state (actions: init, set, append, get, clear)',
    inputSchema: {
      type: 'object',
      properties: {
        action: { type: 'string' },
        session_id: { type: 'string' },
        key: { type: 'string' },
        value: { type: 'string' },
      },
      required: ['action', 'session_id'],
    },
  };
}

function handleSessionTool(args) {
  const { action, session_id, key, value } = args;
  if (!action || !session_id) {
    return { isError: true, content: [{ type: 'text', text: 'Missing required fields action/session_id' }] };
  }
  switch (action) {
    case 'init': {
      sessions.set(session_id, {});
      return { isError: false, content: [{ type: 'text', text: `Session ${session_id} initialized` }], session_id };
    }
    case 'set': {
      const s = ensure(session_id);
      if (!key) {
        return { isError: true, content: [{ type: 'text', text: 'Missing key' }] };
      }
      s[key] = value ?? '';
      return { isError: false, content: [{ type: 'text', text: `Set ${key}` }], session_id };
    }
    case 'append': {
      const s = ensure(session_id);
      if (!key) {
        return { isError: true, content: [{ type: 'text', text: 'Missing key' }] };
      }
      s[key] = (s[key] || '') + (value ?? '');
      return { isError: false, content: [{ type: 'text', text: `Appended ${key}` }], session_id };
    }
    case 'get': {
      const s = ensure(session_id);
      if (!key) {
        return { isError: true, content: [{ type: 'text', text: 'Missing key' }] };
      }
      return { isError: false, content: [{ type: 'text', text: String(s[key] ?? '') }], session_id };
    }
    case 'clear': {
      sessions.delete(session_id);
      return { isError: false, content: [{ type: 'text', text: `Cleared ${session_id}` }], session_id };
    }
    default:
      return { isError: true, content: [{ type: 'text', text: 'Unknown action' }] };
  }
}

function ensure(id) {
  if (!sessions.has(id)) {
    sessions.set(id, {});
  }
  return sessions.get(id);
}

process.stderr.write('Stateful Session Server started\n');
