/**
 * Communication Layer Tests
 * Tests for MCP communication components including MCPCommunicator,
 * MessageHandler, ProcessManager, and StreamBuffer
 */

import { test, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { MCPCommunicator } from '../../src/core/MCPCommunicator.js';
import { MessageHandler } from '../../src/core/MessageHandler.js';
import { ProcessManager } from '../../src/core/ProcessManager.js';
import { StreamBuffer } from '../../src/core/StreamBuffer.js';

describe('Communication Layer', () => {
  describe('MessageHandler', () => {
    it('should initialize with valid configuration', () => {
      const mockProcessManager = {};
      const mockStreamBuffer = {};
      const config = {
        name: 'Test Server',
        command: 'node',
        args: ['test.js'],
        startupTimeout: 5000,
      };

      assert.doesNotThrow(() => {
        new MessageHandler(mockProcessManager, mockStreamBuffer, config);
      });
    });

    it('should have required methods', () => {
      const mockProcessManager = {};
      const mockStreamBuffer = {};
      const config = {
        name: 'Test Server',
        command: 'node',
        args: ['test.js'],
        startupTimeout: 5000,
      };

      const handler = new MessageHandler(mockProcessManager, mockStreamBuffer, config);
      assert.equal(typeof handler.sendMessage, 'function');
      assert.equal(typeof handler.readMessage, 'function');
    });
  });

  describe('StreamBuffer', () => {
    it('should create buffer with default capacity', () => {
      const buffer = new StreamBuffer();
      assert.ok(buffer);
      assert.equal(typeof buffer.processStdout, 'function');
      assert.equal(typeof buffer.processStderr, 'function');
    });

    it('should handle buffer operations', () => {
      const buffer = new StreamBuffer();

      // Should not throw on basic operations
      assert.doesNotThrow(() => {
        buffer.processStdout('test data');
        buffer.processStderr('error data');
        buffer.clearStdout();
        buffer.clearStderr();
      });
    });
  });

  describe('ProcessManager', () => {
    it('should initialize without errors', () => {
      assert.doesNotThrow(() => {
        new ProcessManager();
      });
    });

    it('should have required methods', () => {
      const processManager = new ProcessManager();
      assert.equal(typeof processManager.start, 'function');
      assert.equal(typeof processManager.stop, 'function');
      assert.equal(typeof processManager.isRunning, 'function');
    });
  });

  describe('MCPCommunicator', () => {
    it('should initialize with valid configuration', () => {
      const config = {
        name: 'Test Server',
        command: 'node',
        args: ['test.js'],
        startupTimeout: 5000,
      };

      assert.doesNotThrow(() => {
        new MCPCommunicator(config);
      });
    });

    it('should have required communication methods', () => {
      const config = {
        name: 'Test Server',
        command: 'node',
        args: ['test.js'],
      };

      const communicator = new MCPCommunicator(config);
      assert.equal(typeof communicator.start, 'function');
      assert.equal(typeof communicator.stop, 'function');
      assert.equal(typeof communicator.sendMessage, 'function');
    });
  });
});
