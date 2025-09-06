/**
 * MCP Handshake - Handles MCP protocol handshake operations
 * Follows single responsibility principle for handshake logic
 */

/**
 * Performs the MCP initialization handshake
 * @param {MCPCommunicator} communicator - The communicator instance
 * @param {Reporter} _reporter - The reporter instance (unused)
 * @throws {Error} If handshake fails
 */
export async function performMCPHandshake(communicator, _reporter) {
  await sendInitializeRequest(communicator);
  const initResponse = await communicator.readMessage();

  validateInitializeResponse(initResponse);
  await sendInitializedNotification(communicator);

  // Small delay to let server process the notification
  await new Promise(resolve => setTimeout(resolve, 100));
}

/**
 * Send the initialize request
 * @param {MCPCommunicator} communicator - The communicator instance
 */
async function sendInitializeRequest(communicator) {
  const initializeRequest = {
    jsonrpc: '2.0',
    id: 'init-1',
    method: 'initialize',
    params: {
      protocolVersion: '2025-06-18',
      clientInfo: {
        name: 'MCP Conductor',
        version: '1.0.0',
      },
      capabilities: {},
    },
  };

  await communicator.sendMessage(initializeRequest);
}

/**
 * Validate the initialize response
 * @param {Object} initResponse - The server's response
 * @throws {Error} If response is invalid
 */
function validateInitializeResponse(initResponse) {
  if (initResponse.error) {
    throw new Error(`Server initialization failed: ${JSON.stringify(initResponse.error)}`);
  }

  if (!initResponse.result) {
    throw new Error('Server initialization failed: No result in initialize response');
  }
}

/**
 * Send the initialized notification
 * @param {MCPCommunicator} communicator - The communicator instance
 */
async function sendInitializedNotification(communicator) {
  const initializedNotification = {
    jsonrpc: '2.0',
    method: 'notifications/initialized',
  };

  await communicator.sendMessage(initializedNotification);
}
