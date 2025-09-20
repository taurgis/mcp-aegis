import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

/**
 * Get the current version from package.json
 * @returns {string} The version string from package.json
 */
export function getVersion() {
  try {
    // Get the directory of this module
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    // Navigate to project root and read package.json
    const packageJsonPath = path.join(__dirname, '../../package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

    return packageJson.version;
  } catch {
    // Fallback version if package.json can't be read
    return '1.0.0';
  }
}

/**
 * Get client info object with current version
 * @param {string} name - The client name
 * @returns {object} Client info object
 */
export function getClientInfo(name = 'MCP Aegis') {
  return {
    name,
    version: getVersion(),
  };
}

// Central protocol version constant used in all handshake operations.
// Single source of truth to avoid divergence between programmatic and YAML runners.
export const PROTOCOL_VERSION = '2025-06-18';
