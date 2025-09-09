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

// Mock StreamBuffer that can simulate immediate message emission
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

  // Simulate immediate message emission (like what could happen in a race condition)
  simulateImmediateMessage(message) {
    // Emit message in next tick to simulate very fast server response
    setTimeout(() => {
      this.emit('message', message);
    }, 0);
  }
}

describe('MessageHandler - Race Condition Prevention', () => {
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

  test('should not miss first message when emitted immediately', async () => {
    const testMessage = { jsonrpc: '2.0', id: 1, result: 'immediate-response' };

    // Start the read operation
    const readPromise = messageHandler.readMessage(100);

    // Simulate immediate message emission (race condition scenario)
    // This happens before the next event loop tick
    mockStreamBuffer.simulateImmediateMessage(testMessage);

    // Should still receive the message despite immediate emission
    const result = await readPromise;
    assert.deepEqual(result, testMessage);
  });

  test('should handle multiple immediate messages correctly', async () => {
    const message1 = { id: 1, result: 'first-immediate' };
    const message2 = { id: 2, result: 'second-immediate' };

    // Start two reads
    const read1 = messageHandler.readMessage(100);
    const read2 = messageHandler.readMessage(100);

    // Simulate immediate messages (race condition scenario)
    mockStreamBuffer.simulateImmediateMessage(message1);
    mockStreamBuffer.simulateImmediateMessage(message2);

    // Both reads should succeed
    const [result1, result2] = await Promise.all([read1, read2]);
    assert.deepEqual(result1, message1);
    assert.deepEqual(result2, message2);
  });

  test('should set up listeners before storing pending read', async () => {
    // Verify initial state
    assert.equal(messageHandler.getPendingReadCount(), 0);
    assert.equal(mockStreamBuffer.listenerCount('message'), 0);
    assert.equal(mockStreamBuffer.listenerCount('parseError'), 0);

    // Create a read operation (don't await it yet)
    const readPromise = messageHandler.readMessage(100);

    // Listeners should be set up immediately
    assert.equal(mockStreamBuffer.listenerCount('message'), 1);
    assert.equal(mockStreamBuffer.listenerCount('parseError'), 1);
    assert.equal(messageHandler.getPendingReadCount(), 1);

    // Clean up to prevent unhandled promise rejection
    messageHandler.cancelAllReads();

    // Wait for the cancelled promise to resolve
    try {
      await readPromise;
    } catch (error) {
      // Expected to be cancelled
      assert.ok(error.message.includes('cancelled'));
    }
  });

  test('should handle synchronous message emission during listener setup', async () => {
    const testMessage = { jsonrpc: '2.0', id: 1, result: 'sync-message' };

    // Create a promise that we can resolve manually
    let resolveMessage;
    const messagePromise = new Promise((resolve) => {
      resolveMessage = resolve;
    });

    // Mock the StreamBuffer to track when listener is added
    const originalOn = mockStreamBuffer.on.bind(mockStreamBuffer);
    let messageListenerAdded = false;

    mockStreamBuffer.on = function(event, listener) {
      const result = originalOn(event, listener);
      if (event === 'message' && !messageListenerAdded) {
        messageListenerAdded = true;
        // Emit message immediately after listener is added
        resolveMessage();
      }
      return result;
    };

    // Start the read and wait for listener setup
    const readPromise = messageHandler.readMessage(100);
    await messagePromise;

    // Now emit the message
    mockStreamBuffer.simulateMessage(testMessage);

    // This should work even with immediate listener setup
    const result = await readPromise;
    assert.deepEqual(result, testMessage);
  });

  test('should cleanup listeners properly after race condition fix', async () => {
    const testMessage = { jsonrpc: '2.0', id: 1, result: 'test' };

    // Verify initial state
    assert.equal(mockStreamBuffer.listenerCount('message'), 0);
    assert.equal(mockStreamBuffer.listenerCount('parseError'), 0);

    // Create and resolve a read
    const readPromise = messageHandler.readMessage(100);

    // Listeners should be set up
    assert.equal(mockStreamBuffer.listenerCount('message'), 1);
    assert.equal(mockStreamBuffer.listenerCount('parseError'), 1);

    mockStreamBuffer.simulateMessage(testMessage);
    await readPromise;

    // Verify pending read is cleaned up AND listeners are cleaned up too
    assert.equal(messageHandler.getPendingReadCount(), 0);
    assert.equal(mockStreamBuffer.listenerCount('message'), 0);
    assert.equal(mockStreamBuffer.listenerCount('parseError'), 0);

    // Add another read to verify listeners are properly set up again
    const read2Promise = messageHandler.readMessage(100);
    assert.equal(messageHandler.getPendingReadCount(), 1);
    assert.equal(mockStreamBuffer.listenerCount('message'), 1);
    assert.equal(mockStreamBuffer.listenerCount('parseError'), 1);

    // Clean up and properly handle the promise
    messageHandler.cancelAllReads();
    try {
      await read2Promise;
    } catch (error) {
      // Expected to be cancelled
      assert.ok(error.message.includes('cancelled'));
    }

    assert.equal(mockStreamBuffer.listenerCount('message'), 0);
    assert.equal(mockStreamBuffer.listenerCount('parseError'), 0);
  });

  test('should handle edge case of multiple rapid reads with immediate messages', async () => {
    const messages = [
      { id: 1, result: 'rapid-1' },
      { id: 2, result: 'rapid-2' },
      { id: 3, result: 'rapid-3' },
    ];

    // Start multiple reads in rapid succession
    const reads = [
      messageHandler.readMessage(100),
      messageHandler.readMessage(100),
      messageHandler.readMessage(100),
    ];

    // Emit messages immediately
    messages.forEach(msg => {
      mockStreamBuffer.simulateImmediateMessage(msg);
    });

    // All reads should succeed
    const results = await Promise.all(reads);
    assert.deepEqual(results, messages);
    assert.equal(messageHandler.getPendingReadCount(), 0);
  });
});
