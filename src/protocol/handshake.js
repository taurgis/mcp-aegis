/**
 * MCP Handshake - Handles MCP protocol handshake operations
 * Follows single responsibility principle for handshake logic
 */

import { getClientInfo } from '../core/version.js';

/**
 * Performs MCP handshake with the server
 * @param {MCPCommunicator} communicator - The communicator instance
 * @param {Reporter} reporter - The reporter instance for logging
 */
export async function performMCPHandshake(communicator, reporter) {
  const initializeMessage = {
    jsonrpc: '2.0',
    id: 'init',
    method: 'initialize',
    params: {
      protocolVersion: '2025-06-18',
      capabilities: {
        tools: {},
      },
      clientInfo: getClientInfo('MCP Conductor'),
    },
  };

  reporter.logDebug('Sending initialize request');
  reporter.logMCPCommunication('SEND', initializeMessage);

  await communicator.sendMessage(initializeMessage);
  const response = await communicator.readMessage();

  reporter.logMCPCommunication('RECV', response);

  if (response.error) {
    throw new Error(`Initialize failed: ${response.error.message}`);
  }

  const initializedMessage = {
    jsonrpc: '2.0',
    method: 'initialized',
    params: {},
  };

  reporter.logDebug('Sending initialized notification');
  reporter.logMCPCommunication('SEND', initializedMessage);

  await communicator.sendMessage(initializedMessage);

  reporter.logDebug('MCP handshake completed successfully');
}
