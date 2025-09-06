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
    it('should initialize with config', () => {
      assert.equal(communicator.config, mockConfig);
      assert.equal(communicator.childProcess, null);
      assert.equal(communicator.stdoutBuffer, '');
      assert.equal(communicator.stderrBuffer, '');
      assert.equal(communicator.isReady, false);
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
          message: /Server process is not available/,
        },
      );
    });
  });

  describe('readMessage', () => {
    it('should reject if another read is in progress', async () => {
      const longRunningConfig = {
        ...mockConfig,
        command: 'sleep',
        args: ['1'],
      };
      const longRunningCommunicator = new MCPCommunicator(longRunningConfig);

      await longRunningCommunicator.start();

      // Start first read
      const firstRead = longRunningCommunicator.readMessage();

      // Try to start second read
      await assert.rejects(
        longRunningCommunicator.readMessage(),
        {
          message: /Another read operation is already in progress/,
        },
      );

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

  describe('buffer processing', () => {
    it('should process complete JSON messages from buffer', async () => {
      communicator.stdoutBuffer = '{"test": "message"}\n{"another": "message"}\n';
      communicator.resolveCurrentRead = {
        resolve: (message) => {
          assert.deepEqual(message, { test: 'message' });
        },
        reject: () => assert.fail('Should not reject'),
      };

      communicator._processStdoutBuffer();

      // Should have processed first message and left second in buffer
      assert.equal(communicator.stdoutBuffer, '{"another": "message"}\n');
    });

    it('should handle JSON parse errors', async () => {
      communicator.stdoutBuffer = 'invalid json\n';
      communicator.resolveCurrentRead = {
        resolve: () => assert.fail('Should not resolve'),
        reject: (error) => {
          assert.ok(error.message.includes('Failed to parse JSON message'));
        },
      };

      communicator._processStdoutBuffer();
    });

    it('should skip empty lines', async () => {
      communicator.stdoutBuffer = '\n{"test": "message"}\n';
      communicator.resolveCurrentRead = {
        resolve: (message) => {
          assert.deepEqual(message, { test: 'message' });
        },
        reject: () => assert.fail('Should not reject'),
      };

      communicator._processStdoutBuffer();
    });
  });

  describe('stderr handling', () => {
    it('should get stderr output', () => {
      communicator.stderrBuffer = 'test stderr';
      assert.equal(communicator.getStderr(), 'test stderr');
    });

    it('should clear stderr buffer', () => {
      communicator.stderrBuffer = 'test stderr';
      communicator.clearStderr();
      assert.equal(communicator.stderrBuffer, '');
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
    it('should emit stderr events', async () => {
      let stderrReceived = false;

      communicator.on('stderr', (data) => {
        stderrReceived = true;
      });

      // Simulate stderr data
      communicator.stderrBuffer = 'test stderr';
      communicator.emit('stderr', 'test stderr');

      assert.equal(stderrReceived, true);
    });

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
