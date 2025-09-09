import { MCPCommunicator } from '../core/MCPCommunicator.js';
import { getClientInfo } from '../core/version.js';

/**
 * MCPClient provides a Jest-friendly interface for testing MCP servers
 */
export class MCPClient {
  constructor(config) {
    this.config = config;
    this.communicator = null;
    this.connected = false;
    this.handshakeCompleted = false;
  }

  /**
   * Connect to the MCP server and perform handshake
   * @returns {Promise<void>}
   */
  async connect() {
    if (this.connected) {
      throw new Error('Client is already connected');
    }

    this.communicator = new MCPCommunicator(this.config);

    try {
      // Start the server
      await this.communicator.start();
      this.connected = true;

      // Perform MCP handshake
      await this._performHandshake();
      this.handshakeCompleted = true;
    } catch (error) {
      if (this.communicator) {
        try {
          await this.communicator.stop();
        } catch {
          // Ignore stop errors during cleanup
        }
      }
      this.connected = false;
      this.handshakeCompleted = false;
      throw error;
    }
  }

  /**
   * Disconnect from the MCP server
   * @returns {Promise<void>}
   */
  async disconnect() {
    if (!this.connected || !this.communicator) {
      return;
    }

    try {
      await this.communicator.stop();
    } finally {
      this.connected = false;
      this.handshakeCompleted = false;
      this.communicator = null;
    }
  }

  /**
   * List available tools
   * @returns {Promise<Array>} Array of available tools
   */
  async listTools() {
    this._ensureConnected();

    await this.communicator.sendMessage({
      jsonrpc: '2.0',
      id: `list-${Date.now()}`,
      method: 'tools/list',
      params: {},
    });

    const response = await this.communicator.readMessage();

    if (response.error) {
      throw new Error(`Failed to list tools: ${response.error.message}`);
    }

    return response.result.tools || [];
  }

  /**
   * Call a specific tool
   * @param {string} toolName - Name of the tool to call
   * @param {Object} arguments_ - Arguments to pass to the tool
   * @returns {Promise<Object>} Tool execution result
   */
  async callTool(toolName, arguments_ = {}) {
    this._ensureConnected();

    await this.communicator.sendMessage({
      jsonrpc: '2.0',
      id: `call-${toolName}-${Date.now()}`,
      method: 'tools/call',
      params: {
        name: toolName,
        arguments: arguments_,
      },
    });

    const response = await this.communicator.readMessage();

    if (response.error) {
      throw new Error(`Failed to call tool '${toolName}': ${response.error.message}`);
    }

    return response.result;
  }

  /**
   * Send a raw JSON-RPC message to the server
   * @param {Object} message - JSON-RPC message
   * @returns {Promise<Object>} Server response
   */
  async sendMessage(message) {
    this._ensureConnected();
    await this.communicator.sendMessage(message);
    return await this.communicator.readMessage();
  }

  /**
   * Get the current stderr buffer content
   * @returns {string} Current stderr content
   */
  getStderr() {
    if (!this.communicator) {
      return '';
    }
    return this.communicator.stderrBuffer;
  }

  /**
   * Clear the stderr buffer
   */
  clearStderr() {
    if (this.communicator) {
      this.communicator.stderrBuffer = '';
    }
  }

  /**
   * Check if client is connected and ready
   * @returns {boolean} True if connected and handshake is completed
   */
  isConnected() {
    return this.connected && this.handshakeCompleted;
  }

  /**
   * Ensure the client is connected, throw error if not
   * @private
   */
  _ensureConnected() {
    if (!this.connected || !this.handshakeCompleted) {
      throw new Error('Client is not connected. Call connect() first.');
    }
  }

  /**
   * Perform the MCP handshake protocol
   * @private
   * @returns {Promise<void>}
   */
  async _performHandshake() {
    // Step 1: Send initialize request
    await this.communicator.sendMessage({
      jsonrpc: '2.0',
      id: 'init-1',
      method: 'initialize',
      params: {
        protocolVersion: '2025-06-18',
        capabilities: {
          tools: {},
        },
        clientInfo: getClientInfo('MCP Conductor Programmatic Client'),
      },
    });

    const initResponse = await this.communicator.readMessage();

    if (initResponse.error) {
      throw new Error(`Handshake failed during initialize: ${initResponse.error.message}`);
    }

    // Step 2: Send initialized notification
    await this.communicator.sendMessage({
      jsonrpc: '2.0',
      method: 'notifications/initialized',
    });

    // Small delay to let server process the notification
    await new Promise(resolve => setTimeout(resolve, 100));
  }
}
