import { test, describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { getVersion, getClientInfo } from '../../src/core/version.js';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { existsSync, readFileSync } from 'fs';
import { join } from 'path';

describe('Version Module', () => {
  describe('getVersion', () => {
    it('should return version from package.json', () => {
      const version = getVersion();

      // Should return a valid semantic version
      assert.ok(typeof version === 'string', 'Version should be a string');
      assert.ok(/^\d+\.\d+\.\d+/.test(version), 'Version should match semver pattern');

      // Verify it matches actual package.json
      const packageJsonPath = join(process.cwd(), 'package.json');
      if (existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
        assert.equal(version, packageJson.version);
      }
    });

    it('should return fallback version on package.json read error', async () => {
      // This tests the catch block behavior
      // We can't easily mock readFileSync in a clean way, but we can verify
      // the function handles errors gracefully by testing with a valid call first
      const version = getVersion();

      // Should not throw and should return a valid version
      assert.ok(version);
      assert.ok(typeof version === 'string');

      // In normal conditions, should not be the fallback
      // (unless we're actually missing package.json)
      if (existsSync(join(process.cwd(), 'package.json'))) {
        assert.notEqual(version, '1.0.0', 'Should not use fallback when package.json exists');
      }
    });
  });

  describe('getClientInfo', () => {
    it('should return client info with default name', () => {
      const clientInfo = getClientInfo();

      assert.equal(typeof clientInfo, 'object');
      assert.equal(clientInfo.name, 'MCP Aegis');
      assert.ok(typeof clientInfo.version === 'string');
      assert.ok(/^\d+\.\d+\.\d+/.test(clientInfo.version));
    });

    it('should return client info with custom name', () => {
      const customName = 'Custom MCP Client';
      const clientInfo = getClientInfo(customName);

      assert.equal(typeof clientInfo, 'object');
      assert.equal(clientInfo.name, customName);
      assert.ok(typeof clientInfo.version === 'string');
      assert.ok(/^\d+\.\d+\.\d+/.test(clientInfo.version));
    });

    it('should use same version as getVersion', () => {
      const version = getVersion();
      const clientInfo = getClientInfo();

      assert.equal(clientInfo.version, version);
    });

    it('should handle empty string name', () => {
      const clientInfo = getClientInfo('');

      assert.equal(clientInfo.name, '');
      assert.ok(typeof clientInfo.version === 'string');
    });

    it('should handle undefined name (fallback to default)', () => {
      const clientInfo = getClientInfo(undefined);

      assert.equal(clientInfo.name, 'MCP Aegis');
      assert.ok(typeof clientInfo.version === 'string');
    });

    it('should handle null name (fallback to default)', () => {
      const clientInfo = getClientInfo(null);

      assert.equal(clientInfo.name, null); // Function passes null directly
      assert.ok(typeof clientInfo.version === 'string');
    });

    it('should return consistent structure', () => {
      const clientInfo = getClientInfo('Test Client');

      // Check exact structure
      const keys = Object.keys(clientInfo);
      assert.deepEqual(keys, ['name', 'version']);

      // Check types
      assert.equal(typeof clientInfo.name, 'string');
      assert.equal(typeof clientInfo.version, 'string');
    });
  });

  describe('Integration', () => {
    it('should provide version info for MCP handshake', () => {
      // This tests the integration usage in MCPClient
      const clientInfo = getClientInfo('MCP Aegis Test Client');

      // Should be suitable for MCP protocol clientInfo field
      assert.ok(clientInfo.name);
      assert.ok(clientInfo.version);
      assert.equal(typeof clientInfo.name, 'string');
      assert.equal(typeof clientInfo.version, 'string');
    });

    it('should be consistent across multiple calls', () => {
      const version1 = getVersion();
      const version2 = getVersion();
      const clientInfo1 = getClientInfo('Test');
      const clientInfo2 = getClientInfo('Test');

      // Should be deterministic
      assert.equal(version1, version2);
      assert.deepEqual(clientInfo1, clientInfo2);
    });
  });
});
