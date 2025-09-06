import { test, describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { MCPCommunicator } from '../src/core/MCPCommunicator.js';
import { spawn } from 'child_process';

describe('MCPCommunicator', () => {
  let communicator;
  let mockConfig;

  beforeEach(() => {
    mockConfig = {
      name: 'Test Server',
      command: 'echo',
      args: ['test'],
      cwd: process.cwd(),
      env: process.env,
      startupTimeout: 1000,
    };
    communicator = new MCPCommunicator(mockConfig);
  });

  afterEach(async () => {
    if (communicator && communicator.isRunning()) {
      await communicator.stop();
    }
  });

  describe('constructor', () => {
    it('should initialize with config and modular components', () => {
      assert.equal(communicator.config, mockConfig);
      assert.ok(communicator.processManager);
      assert.ok(communicator.streamBuffer);
      assert.ok(communicator.messageHandler);
      
      // Backward compatibility properties
      assert.equal(communicator.childProcess, null);
      assert.equal(communicator.isReady, true); // No ready pattern
    });
  });

  describe('start', () => {
    it('should start process without ready pattern', async () => {
      await communicator.start();

      assert.ok(communicator.childProcess);
      assert.equal(communicator.isReady, true);
      assert.equal(communicator.isRunning(), true);
    });

    it('should handle process start error', async () => {
      const badConfig = {
        ...mockConfig,
        command: 'nonexistent-command-12345',
        readyPattern: 'Server started', // Force timeout path
        startupTimeout: 500, // Shorter timeout for faster test
      };
      const badCommunicator = new MCPCommunicator(badConfig);

      try {
        await badCommunicator.start();
        assert.fail('Should have thrown an error');
      } catch (error) {
        // Accept either spawn error or timeout error
        const isValidError = error.message.includes('Failed to start server process') ||
                            error.message.includes('Server startup timed out');
        assert.ok(isValidError, `Expected spawn or timeout error, got: ${error.message}`);
      }
    });

    it('should timeout if ready pattern not found', async () => {
      const timeoutConfig = {
        ...mockConfig,
        readyPattern: 'never-matching-pattern',
        startupTimeout: 100,
      };
      const timeoutCommunicator = new MCPCommunicator(timeoutConfig);

      await assert.rejects(
        timeoutCommunicator.start(),
        {
          message: /Server startup timed out/,
        },
      );
    });
  });

  describe('sendMessage', () => {
    it('should send JSON message to stdin', async () => {
      // Use a long-running command for this test
      const longRunningConfig = {
        ...mockConfig,
        command: 'cat', // cat will read from stdin and echo to stdout
        args: [],
      };
      const longRunningCommunicator = new MCPCommunicator(longRunningConfig);

      await longRunningCommunicator.start();

      const testMessage = { test: 'message' };
      await longRunningCommunicator.sendMessage(testMessage);

      // Give a moment for the message to be processed
      await new Promise(resolve => setTimeout(resolve, 50));

      await longRunningCommunicator.stop();
    });

    it('should reject if process not available', async () => {
      await assert.rejects(
        communicator.sendMessage({ test: 'message' }),
        {
          message: /Process is not available/,
        },
      );
    });
  });

  describe('readMessage', () => {
    it('should support concurrent reads with FIFO queuing', async () => {
      const longRunningConfig = {
        ...mockConfig,
        command: 'sleep',
        args: ['1'],
      };
      const longRunningCommunicator = new MCPCommunicator(longRunningConfig);

      await longRunningCommunicator.start();

      // Both reads should be queued and not reject
      const firstRead = longRunningCommunicator.readMessage(100); // Short timeout
      const secondRead = longRunningCommunicator.readMessage(100); // Short timeout

      // Both should timeout (no messages available) but not reject due to concurrency
      await assert.rejects(firstRead, { message: /Read timeout/ });
      await assert.rejects(secondRead, { message: /Read timeout/ });

      await longRunningCommunicator.stop();
    });

    it('should timeout on read', async () => {
      const quickTimeoutConfig = {
        ...mockConfig,
        command: 'sleep',
        args: ['1'],
        startupTimeout: 100,
      };
      const quickTimeoutCommunicator = new MCPCommunicator(quickTimeoutConfig);

      await quickTimeoutCommunicator.start();

      await assert.rejects(
        quickTimeoutCommunicator.readMessage(),
        {
          message: /Read timeout/,
        },
      );

      await quickTimeoutCommunicator.stop();
    });
  });

  describe('stop', () => {
    it('should stop running process gracefully', async () => {
      const longRunningConfig = {
        ...mockConfig,
        command: 'sleep',
        args: ['10'],
      };
      const longRunningCommunicator = new MCPCommunicator(longRunningConfig);

      await longRunningCommunicator.start();
      assert.equal(longRunningCommunicator.isRunning(), true);

      await longRunningCommunicator.stop();
      // Give a moment for the process to fully terminate
      await new Promise(resolve => setTimeout(resolve, 100));
      assert.equal(longRunningCommunicator.isRunning(), false);
    });

    it('should handle already stopped process', async () => {
      // Should not throw error when stopping already stopped process
      await communicator.stop();
    });
  });

  describe('isRunning', () => {
    it('should return false when no process', () => {
      assert.equal(communicator.isRunning(), false);
    });

    it('should return true when process is running', async () => {
      const longRunningConfig = {
        ...mockConfig,
        command: 'sleep',
        args: ['1'],
      };
      const longRunningCommunicator = new MCPCommunicator(longRunningConfig);

      await longRunningCommunicator.start();
      assert.equal(longRunningCommunicator.isRunning(), true);

      await longRunningCommunicator.stop();
    });
  });

  describe('event handling', () => {
    it('should emit exit events', async () => {
      let exitReceived = false;

      communicator.on('exit', (code, signal) => {
        exitReceived = true;
      });

      communicator.emit('exit', 0, null);

      assert.equal(exitReceived, true);
    });
  });
});
