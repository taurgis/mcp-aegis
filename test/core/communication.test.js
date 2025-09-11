/**
 * Communication Layer Tests
 * Tests for MCP communication components including MCPCommunicator,
 * MessageHandler, ProcessManager, and StreamBuffer
 */

import { test, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'events';
import { MCPCommunicator } from '../../src/core/MCPCommunicator.js';
import { MessageHandler } from '../../src/core/MessageHandler.js';
import { ProcessManager } from '../../src/core/ProcessManager.js';
import { StreamBuffer } from '../../src/core/StreamBuffer.js';

// Mock child process for testing
class MockChildProcess extends EventEmitter {
  constructor() {
    super();
    this.stdout = new EventEmitter();
    this.stderr = new EventEmitter();
    this.stdin = { write: () => {}, end: () => {} };
    this.killed = false;
    this.exitCode = null;
  }

  kill(signal = 'SIGTERM') {
    this.killed = true;
    setTimeout(() => {
      this.emit('exit', 0, signal);
    }, 10);
  }
}

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

    it('should set up event handlers correctly', () => {
      const config = {
        name: 'Test Server',
        command: 'node',
        args: ['test.js'],
        startupTimeout: 5000,
      };

      const communicator = new MCPCommunicator(config);

      // Test that communicator has all expected methods
      assert.equal(typeof communicator.readMessage, 'function');
      assert.equal(typeof communicator.getStderr, 'function');
      assert.equal(typeof communicator.clearStderr, 'function');
      assert.equal(typeof communicator.clearAllBuffers, 'function');
      assert.equal(typeof communicator.isRunning, 'function');
    });

    it('should handle process startup without ready pattern', async () => {
      const config = {
        name: 'Test Server',
        command: 'echo',
        args: ['test'],
        startupTimeout: 1000,
      };

      const communicator = new MCPCommunicator(config);

      // Mock the process manager to simulate successful start
      const originalStart = communicator.processManager.start;
      communicator.processManager.start = async () => {
        return Promise.resolve();
      };

      // Should resolve immediately when no ready pattern is configured
      await assert.doesNotReject(async () => {
        await communicator.start();
      });

      // Restore original method
      communicator.processManager.start = originalStart;

      await communicator.stop();
    });

    it('should handle process startup with ready pattern', async () => {
      const config = {
        name: 'Test Server',
        command: 'echo',
        args: ['Server ready'],
        startupTimeout: 1000,
        readyPattern: 'Server ready',
      };

      const communicator = new MCPCommunicator(config);

      // Mock the process manager to simulate successful start
      const originalStart = communicator.processManager.start;
      communicator.processManager.start = async () => {
        // Simulate the ready signal after a short delay
        setTimeout(() => {
          communicator.streamBuffer.emit('ready');
        }, 50);
        return Promise.resolve();
      };

      // Should wait for ready signal
      await assert.doesNotReject(async () => {
        await communicator.start();
      });

      // Restore original method
      communicator.processManager.start = originalStart;

      await communicator.stop();
    });

    it('should handle startup timeout with ready pattern', async () => {
      const config = {
        name: 'Test Server',
        command: 'echo',
        args: ['test'],
        startupTimeout: 100, // Short timeout
        readyPattern: 'Server ready',
      };

      const communicator = new MCPCommunicator(config);

      // Mock the process manager to simulate start without emitting ready
      const originalStart = communicator.processManager.start;
      communicator.processManager.start = async () => {
        // Don't emit ready signal to trigger timeout
        return Promise.resolve();
      };

      // Should reject with timeout error
      await assert.rejects(
        async () => {
          await communicator.start();
        },
        {
          message: /Server startup timed out after 100ms/,
        },
      );

      // Restore original method
      communicator.processManager.start = originalStart;
    });

    it('should handle process startup errors', async () => {
      const config = {
        name: 'Test Server',
        command: 'nonexistent-command',
        args: ['test'],
        startupTimeout: 1000,
      };

      const communicator = new MCPCommunicator(config);

      // Mock the process manager to simulate start failure
      const originalStart = communicator.processManager.start;
      communicator.processManager.start = async () => {
        throw new Error('Process failed to start');
      };

      // Should reject with the process error
      await assert.rejects(
        async () => {
          await communicator.start();
        },
        {
          message: 'Process failed to start',
        },
      );

      // Restore original method
      communicator.processManager.start = originalStart;
    });

    it('should forward stderr events', (t, done) => {
      const config = {
        name: 'Test Server',
        command: 'node',
        args: ['test.js'],
      };

      const communicator = new MCPCommunicator(config);

      // Listen for stderr event
      communicator.on('stderr', (chunk) => {
        assert.equal(chunk, 'error message');
        done();
      });

      // Simulate stderr from process manager
      communicator.processManager.emit('stderr', 'error message');
    });

    it('should forward exit events and cancel reads', (t, done) => {
      const config = {
        name: 'Test Server',
        command: 'node',
        args: ['test.js'],
      };

      const communicator = new MCPCommunicator(config);

      // Mock cancelAllReads to verify it gets called
      let cancelCalled = false;
      communicator.messageHandler.cancelAllReads = () => {
        cancelCalled = true;
      };

      // Listen for exit event
      communicator.on('exit', (code, signal) => {
        assert.equal(code, 0);
        assert.equal(signal, 'SIGTERM');
        assert.equal(cancelCalled, true);
        done();
      });

      // Simulate exit from process manager
      communicator.processManager.emit('exit', 0, 'SIGTERM');
    });

    it('should forward ready events from stream buffer', (t, done) => {
      const config = {
        name: 'Test Server',
        command: 'node',
        args: ['test.js'],
      };

      const communicator = new MCPCommunicator(config);

      // Listen for ready event
      communicator.on('ready', () => {
        done();
      });

      // Simulate ready from stream buffer
      communicator.streamBuffer.emit('ready');
    });

    it('should delegate message operations to message handler', async () => {
      const config = {
        name: 'Test Server',
        command: 'node',
        args: ['test.js'],
      };

      const communicator = new MCPCommunicator(config);

      // Mock message handler methods
      let sendCalled = false;
      let readCalled = false;
      const testMessage = { jsonrpc: '2.0', method: 'test' };

      communicator.messageHandler.sendMessage = async (msg) => {
        sendCalled = true;
        assert.deepEqual(msg, testMessage);
      };

      communicator.messageHandler.readMessage = async (timeout) => {
        readCalled = true;
        assert.equal(timeout, 5000);
        return { jsonrpc: '2.0', result: 'test' };
      };

      // Test sendMessage delegation
      await communicator.sendMessage(testMessage);
      assert.equal(sendCalled, true);

      // Test readMessage delegation
      const result = await communicator.readMessage(5000);
      assert.equal(readCalled, true);
      assert.deepEqual(result, { jsonrpc: '2.0', result: 'test' });
    });

    it('should delegate buffer operations to stream buffer', () => {
      const config = {
        name: 'Test Server',
        command: 'node',
        args: ['test.js'],
      };

      const communicator = new MCPCommunicator(config);

      // Mock stream buffer methods
      let getStderrCalled = false;
      let clearStderrCalled = false;
      let clearStdoutCalled = false;
      let resetStateCalled = false;

      communicator.streamBuffer.getStderr = () => {
        getStderrCalled = true;
        return 'stderr content';
      };

      communicator.streamBuffer.clearStderr = () => {
        clearStderrCalled = true;
      };

      communicator.streamBuffer.clearStdout = () => {
        clearStdoutCalled = true;
      };

      communicator.streamBuffer.resetState = () => {
        resetStateCalled = true;
      };

      // Mock message handler
      let cancelAllReadsCalled = false;
      communicator.messageHandler.cancelAllReads = () => {
        cancelAllReadsCalled = true;
      };

      // Test getStderr delegation
      const stderr = communicator.getStderr();
      assert.equal(getStderrCalled, true);
      assert.equal(stderr, 'stderr content');

      // Test clearStderr delegation
      communicator.clearStderr();
      assert.equal(clearStderrCalled, true);

      // Test clearAllBuffers delegation
      communicator.clearAllBuffers();
      assert.equal(clearStdoutCalled, true);
      assert.equal(resetStateCalled, true);
      assert.equal(cancelAllReadsCalled, true);
    });

    it('should delegate process operations to process manager', async () => {
      const config = {
        name: 'Test Server',
        command: 'node',
        args: ['test.js'],
      };

      const communicator = new MCPCommunicator(config);

      // Mock process manager methods
      let stopCalled = false;
      let isRunningCalled = false;
      let getProcessCalled = false;

      communicator.processManager.stop = async () => {
        stopCalled = true;
      };

      communicator.processManager.isRunning = () => {
        isRunningCalled = true;
        return true;
      };

      communicator.processManager.getProcess = () => {
        getProcessCalled = true;
        return { pid: 123 };
      };

      // Mock message handler to prevent actual reads cancellation
      communicator.messageHandler.cancelAllReads = () => {};

      // Test stop delegation
      await communicator.stop();
      assert.equal(stopCalled, true);

      // Test isRunning delegation
      const running = communicator.isRunning();
      assert.equal(isRunningCalled, true);
      assert.equal(running, true);

      // Test childProcess getter delegation
      const process = communicator.childProcess;
      assert.equal(getProcessCalled, true);
      assert.deepEqual(process, { pid: 123 });
    });

    it('should provide isReady getter from stream buffer', () => {
      const config = {
        name: 'Test Server',
        command: 'node',
        args: ['test.js'],
      };

      const communicator = new MCPCommunicator(config);

      // Mock stream buffer method
      let getReadyStatusCalled = false;
      communicator.streamBuffer.getReadyStatus = () => {
        getReadyStatusCalled = true;
        return true;
      };

      // Test isReady getter
      const ready = communicator.isReady;
      assert.equal(getReadyStatusCalled, true);
      assert.equal(ready, true);
    });

    it('should forward stdout events to stream buffer', () => {
      const config = {
        name: 'Test Server',
        command: 'node',
        args: ['test.js'],
      };

      const communicator = new MCPCommunicator(config);

      // Mock stream buffer method
      let processStdoutCalled = false;
      const testChunk = 'test stdout data';

      communicator.streamBuffer.processStdout = (chunk) => {
        processStdoutCalled = true;
        assert.equal(chunk, testChunk);
      };

      // Simulate stdout from process manager
      communicator.processManager.emit('stdout', testChunk);
      assert.equal(processStdoutCalled, true);
    });

    it('should forward stderr events to stream buffer and emit own stderr event', () => {
      const config = {
        name: 'Test Server',
        command: 'node',
        args: ['test.js'],
      };

      const communicator = new MCPCommunicator(config);

      // Mock stream buffer method
      let processStderrCalled = false;
      const testChunk = 'test stderr data';

      communicator.streamBuffer.processStderr = (chunk) => {
        processStderrCalled = true;
        assert.equal(chunk, testChunk);
      };

      // Track if stderr event is emitted
      let stderrEventEmitted = false;
      communicator.on('stderr', (chunk) => {
        stderrEventEmitted = true;
        assert.equal(chunk, testChunk);
      });

      // Simulate stderr from process manager
      communicator.processManager.emit('stderr', testChunk);
      assert.equal(processStderrCalled, true);
      assert.equal(stderrEventEmitted, true);
    });
  });
});
