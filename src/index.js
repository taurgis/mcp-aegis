import { MCPClient } from './programmatic/MCPClient.js';
import { loadConfig } from './core/configParser.js';

/**
 * Connect to an MCP server for testing
 * @param {Object|string} serverConfig - Server configuration object or path to config file
 * @returns {Promise<MCPClient>} Connected MCP client instance
 */
export async function connect(serverConfig) {
  let config;

  if (typeof serverConfig === 'string') {
    // Load from file path
    config = await loadConfig(serverConfig);
  } else if (typeof serverConfig === 'object' && serverConfig !== null) {
    // Use provided config object directly
    config = serverConfig;
  } else {
    throw new Error('serverConfig must be a configuration object or path to config file');
  }

  const client = new MCPClient(config);
  await client.connect();
  return client;
}

/**
 * Create an MCP client instance without connecting
 * @param {Object|string} serverConfig - Server configuration object or path to config file
 * @returns {Promise<MCPClient>} MCP client instance (not connected)
 */
export async function createClient(serverConfig) {
  let config;

  if (typeof serverConfig === 'string') {
    config = await loadConfig(serverConfig);
  } else if (typeof serverConfig === 'object' && serverConfig !== null) {
    config = serverConfig;
  } else {
    throw new Error('serverConfig must be a configuration object or path to config file');
  }

  return new MCPClient(config);
}

export { MCPClient } from './programmatic/MCPClient.js';
export { loadConfig } from './core/configParser.js';
