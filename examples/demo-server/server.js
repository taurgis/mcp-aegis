#!/usr/bin/env node

const serverInfo = { name: 'demo-server', version: '1.0.0' };
const tools = [
  {
    name: 'hello',
    description: 'Says hello with a friendly greeting',
    inputSchema: {
      type: 'object',
      properties: {
        name: { type: 'string', description: 'Name to greet' },
      },
      required: ['name'],
    },
  },
];

let initialized = false;

process.stdin.on('data', (data) => {
  try {
    const message = JSON.parse(data.toString().trim());

    if (message.method === 'initialize') {
      sendResponse(message.id, {
        protocolVersion: '2025-06-18',
        capabilities: { tools: {} },
        serverInfo,
      });
    } else if (message.method === 'initialized') {
      initialized = true;
      // Notifications don't get responses
    } else if (message.method === 'tools/list') {
      if (!initialized) {
        sendError(message.id, -32002, 'Server not initialized');
        return;
      }
      sendResponse(message.id, { tools });
    } else if (message.method === 'tools/call' && message.params?.name === 'hello') {
      if (!initialized) {
        sendError(message.id, -32002, 'Server not initialized');
        return;
      }
      const name = message.params.arguments?.name;
      if (!name) {
        sendResponse(message.id, {
          isError: true,
          content: [{ type: 'text', text: 'Missing required parameter: name' }],
        });
        return;
      }
      sendResponse(message.id, {
        content: [{ type: 'text', text: `Hello, ${name}! 👋 Welcome to MCP!` }],
        isError: false,
      });
    } else {
      sendError(message.id, -32601, 'Method not found');
    }
  } catch (error) {
    sendError(null, -32700, 'Parse error');
  }
});

function sendResponse(id, result) {
  console.log(JSON.stringify({ jsonrpc: '2.0', id, result }));
}

function sendError(id, code, message) {
  console.log(JSON.stringify({ jsonrpc: '2.0', id, error: { code, message } }));
}

// Signal server is ready
setTimeout(() => console.error('Server ready'), 100);
