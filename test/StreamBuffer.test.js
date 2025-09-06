import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { StreamBuffer } from '../src/core/StreamBuffer.js';

describe('StreamBuffer', () => {
  let streamBuffer;

  beforeEach(() => {
    streamBuffer = new StreamBuffer();
  });

  describe('constructor', () => {
    test('should initialize with empty buffers', () => {
      assert.equal(streamBuffer.getStderr(), '');
      assert.equal(streamBuffer.getStdoutBuffer(), '');
      assert.equal(streamBuffer.getReadyStatus(), true); // No ready pattern
    });

    test('should initialize with ready pattern', () => {
      const configBuffer = new StreamBuffer({ readyPattern: 'Server ready' });
      assert.equal(configBuffer.getReadyStatus(), false); // Has ready pattern, not ready yet
    });
  });

  describe('processStdout', () => {
    test('should emit complete JSON messages', (t, done) => {
      const testMessage = { test: 'message', id: 1 };

      streamBuffer.on('message', (message) => {
        assert.deepEqual(message, testMessage);
        done();
      });

      streamBuffer.processStdout(`${JSON.stringify(testMessage)}\n`);
    });

    test('should handle multiple messages in one chunk', (t, done) => {
      const message1 = { id: 1, test: 'first' };
      const message2 = { id: 2, test: 'second' };
      
      let messageCount = 0;
      const receivedMessages = [];

      streamBuffer.on('message', (message) => {
        receivedMessages.push(message);
        messageCount++;
        
        if (messageCount === 2) {
          assert.deepEqual(receivedMessages[0], message1);
          assert.deepEqual(receivedMessages[1], message2);
          done();
        }
      });

      const chunk = `${JSON.stringify(message1)}\n${JSON.stringify(message2)}\n`;
      streamBuffer.processStdout(chunk);
    });

    test('should buffer incomplete messages', (t, done) => {
      const testMessage = { test: 'incomplete', id: 1 };
      const messageString = JSON.stringify(testMessage);

      streamBuffer.on('message', (message) => {
        assert.deepEqual(message, testMessage);
        done();
      });

      // Send partial message
      streamBuffer.processStdout(messageString.substring(0, 10));
      
      // Complete the message
      streamBuffer.processStdout(`${messageString.substring(10)}\n`);
    });

    test('should emit parse error for invalid JSON', (t, done) => {
      streamBuffer.on('parseError', (error) => {
        assert.ok(error instanceof Error);
        assert.ok(error.message.includes('Failed to parse JSON message'));
        done();
      });

      streamBuffer.processStdout('invalid json\n');
    });

    test('should skip empty lines', (t, done) => {
      const testMessage = { test: 'after empty', id: 1 };

      streamBuffer.on('message', (message) => {
        assert.deepEqual(message, testMessage);
        done();
      });

      // Send empty line then valid message
      streamBuffer.processStdout('\n');
      streamBuffer.processStdout(`${JSON.stringify(testMessage)}\n`);
    });
  });

  describe('processStderr', () => {
    test('should accumulate stderr data', () => {
      streamBuffer.processStderr('Error message 1\n');
      streamBuffer.processStderr('Error message 2\n');

      const stderr = streamBuffer.getStderr();
      assert.ok(stderr.includes('Error message 1'));
      assert.ok(stderr.includes('Error message 2'));
    });

    test('should detect ready pattern', (t, done) => {
      const readyBuffer = new StreamBuffer({ readyPattern: 'Server ready' });

      readyBuffer.on('ready', () => {
        assert.equal(readyBuffer.getReadyStatus(), true);
        done();
      });

      readyBuffer.processStderr('Starting server...\n');
      assert.equal(readyBuffer.getReadyStatus(), false);

      readyBuffer.processStderr('Server ready on port 8080\n');
    });

    test('should not emit ready multiple times', () => {
      const readyBuffer = new StreamBuffer({ readyPattern: 'ready' });
      let readyCount = 0;

      readyBuffer.on('ready', () => {
        readyCount++;
      });

      readyBuffer.processStderr('Server is ready\n');
      readyBuffer.processStderr('Still ready\n');

      assert.equal(readyCount, 1);
      assert.equal(readyBuffer.getReadyStatus(), true);
    });
  });

  describe('clearStderr', () => {
    test('should clear stderr buffer', () => {
      streamBuffer.processStderr('Some error\n');
      assert.ok(streamBuffer.getStderr().length > 0);

      streamBuffer.clearStderr();
      assert.equal(streamBuffer.getStderr(), '');
    });
  });

  describe('getReadyStatus', () => {
    test('should return true when no ready pattern', () => {
      const noPatternBuffer = new StreamBuffer();
      assert.equal(noPatternBuffer.getReadyStatus(), true);
    });

    test('should return false when ready pattern not matched', () => {
      const patternBuffer = new StreamBuffer({ readyPattern: 'Server ready' });
      patternBuffer.processStderr('Server starting...\n');
      assert.equal(patternBuffer.getReadyStatus(), false);
    });

    test('should return true when ready pattern matched', () => {
      const patternBuffer = new StreamBuffer({ readyPattern: 'Server ready' });
      patternBuffer.processStderr('Server ready on port 8080\n');
      assert.equal(patternBuffer.getReadyStatus(), true);
    });
  });
});
