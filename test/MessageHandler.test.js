import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { MessageHandler } from '../src/core/MessageHandler.js';
import { EventEmitter } from 'events';

// Mock ProcessManager for testing
class MockProcessManager {
  constructor() {
    this.writeToStdinCalled = [];
  }

  async writeToStdin(data) {
    this.writeToStdinCalled.push(data);
  }
}

// Mock StreamBuffer for testing
class MockStreamBuffer extends EventEmitter {
  constructor() {
    super();
  }

  simulateMessage(message) {
    this.emit('message', message);
  }

  simulateError(error) {
    this.emit('parseError', error);
  }
}

describe('MessageHandler', () => {
  let messageHandler;
  let mockProcessManager;
  let mockStreamBuffer;
  let mockConfig;

  beforeEach(() => {
    mockProcessManager = new MockProcessManager();
    mockStreamBuffer = new MockStreamBuffer();
    mockConfig = { startupTimeout: 1000 };
    messageHandler = new MessageHandler(mockProcessManager, mockStreamBuffer, mockConfig);
  });

  describe('constructor', () => {
    test('should initialize with dependencies', () => {
      assert.ok(messageHandler.processManager === mockProcessManager);
      assert.ok(messageHandler.streamBuffer === mockStreamBuffer);
      assert.ok(messageHandler.config === mockConfig);
      assert.equal(messageHandler.getPendingReadCount(), 0);
    });
  });

  describe('sendMessage', () => {
    test('should send JSON message to process manager', async () => {
      const testMessage = { jsonrpc: '2.0', id: 1, method: 'test' };

      await messageHandler.sendMessage(testMessage);

      assert.equal(mockProcessManager.writeToStdinCalled.length, 1);
      assert.equal(mockProcessManager.writeToStdinCalled[0], `${JSON.stringify(testMessage)}\n`);
    });

    test('should handle complex message objects', async () => {
      const complexMessage = {
        jsonrpc: '2.0',
        id: 'complex-id',
        method: 'tools/call',
        params: {
          name: 'test_tool',
          arguments: { nested: { data: [1, 2, 3] } },
        },
      };

      await messageHandler.sendMessage(complexMessage);

      assert.equal(mockProcessManager.writeToStdinCalled.length, 1);
      const sentData = mockProcessManager.writeToStdinCalled[0];
      assert.ok(sentData.includes('"jsonrpc":"2.0"'));
      assert.ok(sentData.endsWith('\n'));
    });
  });

  describe('readMessage', () => {
    test('should resolve with message from stream buffer', async () => {
      const testMessage = { jsonrpc: '2.0', id: 1, result: 'success' };

      const readPromise = messageHandler.readMessage(100);

      // Simulate message arrival
      setTimeout(() => {
        mockStreamBuffer.simulateMessage(testMessage);
      }, 10);

      const result = await readPromise;
      assert.deepEqual(result, testMessage);
    });

    test('should timeout if no message received', async () => {
      await assert.rejects(
        messageHandler.readMessage(50),
        { message: /Read timeout/ },
      );
    });

    test('should reject on parse error', async () => {
      const parseError = new Error('Invalid JSON');

      const readPromise = messageHandler.readMessage(100);

      // Simulate parse error
      setTimeout(() => {
        mockStreamBuffer.simulateError(parseError);
      }, 10);

      await assert.rejects(readPromise, parseError);
    });

    test('should handle multiple concurrent reads (FIFO)', async () => {
      const message1 = { id: 1, result: 'first' };
      const message2 = { id: 2, result: 'second' };

      const read1 = messageHandler.readMessage(100);
      const read2 = messageHandler.readMessage(100);

      assert.equal(messageHandler.getPendingReadCount(), 2);

      // Simulate messages in order
      setTimeout(() => {
        mockStreamBuffer.simulateMessage(message1);
        mockStreamBuffer.simulateMessage(message2);
      }, 10);

      const [result1, result2] = await Promise.all([read1, read2]);
      assert.deepEqual(result1, message1);
      assert.deepEqual(result2, message2);
      assert.equal(messageHandler.getPendingReadCount(), 0);
    });

    test('should use custom timeout', async () => {
      const startTime = Date.now();

      try {
        await messageHandler.readMessage(20); // Very short timeout
      } catch (error) {
        const duration = Date.now() - startTime;
        assert.ok(duration >= 15 && duration < 50, `Duration ${duration}ms should be around 20ms`);
        assert.ok(error.message.includes('Read timeout'));
      }
    });
  });

  describe('cancelAllReads', () => {
    test('should cancel pending read operations', async () => {
      const read1 = messageHandler.readMessage(1000);
      const read2 = messageHandler.readMessage(1000);

      assert.equal(messageHandler.getPendingReadCount(), 2);

      messageHandler.cancelAllReads();

      assert.equal(messageHandler.getPendingReadCount(), 0);

      await assert.rejects(read1, { message: /Read operation cancelled/ });
      await assert.rejects(read2, { message: /Read operation cancelled/ });
    });

    test('should handle cancelling with no pending reads', () => {
      assert.equal(messageHandler.getPendingReadCount(), 0);
      messageHandler.cancelAllReads(); // Should not throw
      assert.equal(messageHandler.getPendingReadCount(), 0);
    });
  });

  describe('getPendingReadCount', () => {
    test('should track pending read count correctly', async () => {
      assert.equal(messageHandler.getPendingReadCount(), 0);

      const read1 = messageHandler.readMessage(100);
      assert.equal(messageHandler.getPendingReadCount(), 1);

      const read2 = messageHandler.readMessage(100);
      assert.equal(messageHandler.getPendingReadCount(), 2);

      // Resolve one read
      setTimeout(() => {
        mockStreamBuffer.simulateMessage({ id: 1 });
      }, 10);

      await read1;
      assert.equal(messageHandler.getPendingReadCount(), 1);

      // Cancel remaining
      messageHandler.cancelAllReads();
      assert.equal(messageHandler.getPendingReadCount(), 0);

      try {
        await read2;
      } catch {
        // Expected to be cancelled
      }
    });
  });
});
