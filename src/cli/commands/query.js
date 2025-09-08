/**
 * Query Command Handler - Handles direct tool queries for debugging
 * Single responsibility: Execute individual tool queries and display results
 */

import { existsSync } from 'fs';
import { loadConfig } from '../../core/configParser.js';
import { MCPClient } from '../../programmatic/MCPClient.js';

/**
 * Execute query command to call a specific tool
 * @param {string} toolName - Name of the tool to call
 * @param {Object} toolArgs - Arguments for the tool (parsed JSON)
 * @param {Object} options - Parsed CLI options
 * @param {OutputManager} output - Output manager for logging
 * @returns {Promise<boolean>} Success status
 */
export async function executeQueryCommand(toolName, toolArgs, options, output) {
  let client = null;

  try {
    // Validate configuration file exists
    if (!existsSync(options.config)) {
      throw new Error(`Configuration file not found: ${options.config}`);
    }

    // Load configuration
    const config = await loadConfig(options.config);
    output.logInfo(`🔧 Loaded server: ${config.name}`);

    // Create and connect client
    client = new MCPClient(config);
    output.logInfo('🚀 Starting server and performing handshake...');
    await client.connect();
    output.logInfo('✅ Connected to server');

    if (!toolName) {
      // List all available tools
      output.logInfo('📋 Listing available tools:');
      const tools = await client.listTools();

      if (tools.length === 0) {
        output.logInfo('   No tools available');
        return true;
      }

      tools.forEach((tool, index) => {
        output.logInfo(`   ${index + 1}. ${tool.name}`);
        output.logInfo(`      Description: ${tool.description || 'No description'}`);
        if (tool.inputSchema && tool.inputSchema.properties) {
          output.logInfo(`      Parameters: ${Object.keys(tool.inputSchema.properties).join(', ')}`);
        }
        output.logInfo('');
      });
      return true;
    }

    // Call specific tool
    output.logInfo(`🔧 Calling tool: ${toolName}`);
    if (Object.keys(toolArgs).length > 0) {
      output.logInfo(`   Arguments: ${JSON.stringify(toolArgs, null, 2)}`);
    }

    const result = await client.callTool(toolName, toolArgs);

    // Display result
    output.logInfo('📤 Result:');
    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(JSON.stringify(result, null, 2));
    }

    // Check stderr for additional information
    const stderr = client.getStderr();
    if (stderr && stderr.length > 0) {
      output.logInfo('\n📝 Server stderr output:');
      output.logInfo(stderr);
    }

    return true;

  } catch (error) {
    output.logError(`❌ Query failed: ${error.message}`);

    if (client) {
      const stderr = client.getStderr();
      if (stderr && stderr.length > 0) {
        output.logError('\n📝 Server stderr output:');
        output.logError(stderr);
      }
    }

    return false;
  } finally {
    if (client) {
      try {
        await client.disconnect();
        output.logInfo('🔌 Disconnected from server');
      } catch (error) {
        output.logError(`⚠️  Error disconnecting: ${error.message}`);
      }
    }
  }
}

/**
 * Validate query command parameters
 * @param {string} toolName - Tool name to validate
 * @param {string} toolArgsString - JSON string of tool arguments
 * @param {Object} rawOptions - Raw CLI options to validate
 * @returns {Object} Parsed tool arguments
 */
export function validateQueryCommand(toolName, toolArgsString, rawOptions) {
  // Validate config file path (will be parsed in parseOptions)
  if (!rawOptions.config && !existsSync('./conductor.config.json')) {
    throw new Error('Configuration file path is required');
  }

  // Parse tool arguments if provided
  let toolArgs = {};
  if (toolArgsString) {
    try {
      toolArgs = JSON.parse(toolArgsString);
      if (typeof toolArgs !== 'object' || toolArgs === null || Array.isArray(toolArgs)) {
        throw new Error('Tool arguments must be a JSON object');
      }
    } catch (error) {
      if (error.message.includes('Tool arguments must be')) {
        throw error;
      }
      throw new Error(`Invalid JSON for tool arguments: ${error.message}`);
    }
  }

  return toolArgs;
}
