import { describe, it, mock } from 'node:test';
import assert from 'node:assert';
import { StreamBuffer } from '../../src/core/StreamBuffer.js';

describe('StreamBuffer Comprehensive Tests', () => {
  describe('constructor and initialization', () => {
    it('should initialize with default config', () => {
      const buffer = new StreamBuffer();
      assert.ok(buffer);
      assert.equal(buffer.stdoutBuffer, '');
      assert.equal(buffer.stderrBuffer, '');
      assert.equal(buffer.readyPattern, undefined);
      assert.equal(buffer.isReady, false);
    });

    it('should initialize with ready pattern config', () => {
      const buffer = new StreamBuffer({ readyPattern: 'Server ready' });
      assert.equal(buffer.readyPattern, 'Server ready');
      assert.equal(buffer.isReady, false);
    });

    it('should set high max listeners limit', () => {
      const buffer = new StreamBuffer();
      assert.equal(buffer.getMaxListeners(), 500);
    });
  });

  describe('stdout processing', () => {
    it('should buffer incomplete JSON messages', () => {
      const buffer = new StreamBuffer();
      buffer.processStdout('{"jsonrpc": "2.0",');
      assert.equal(buffer.getStdoutBuffer(), '{"jsonrpc": "2.0",');
    });

    it('should emit complete JSON messages', (t, done) => {
      const buffer = new StreamBuffer();
      const expectedMessage = { jsonrpc: '2.0', id: 1, result: { test: 'data' } };

      buffer.once('message', (message) => {
        assert.deepEqual(message, expectedMessage);
        done();
      });

      buffer.processStdout(`${JSON.stringify(expectedMessage)}\n`);
    });

    it('should emit multiple complete messages from buffer', (t, done) => {
      const buffer = new StreamBuffer();
      const messages = [];
      const expectedMessages = [
        { jsonrpc: '2.0', id: 1, result: { test: 'first' } },
        { jsonrpc: '2.0', id: 2, result: { test: 'second' } },
      ];

      buffer.on('message', (message) => {
        messages.push(message);
        if (messages.length === 2) {
          assert.deepEqual(messages, expectedMessages);
          done();
        }
      });

      const combinedMessage = `${expectedMessages
        .map(msg => JSON.stringify(msg))
        .join('\n')}\n`;

      buffer.processStdout(combinedMessage);
    });

    it('should handle partial messages across multiple chunks', (t, done) => {
      const buffer = new StreamBuffer();
      const expectedMessage = { jsonrpc: '2.0', id: 1, result: { test: 'split' } };

      buffer.once('message', (message) => {
        assert.deepEqual(message, expectedMessage);
        done();
      });

      const messageStr = `${JSON.stringify(expectedMessage)}\n`;
      const splitPoint = Math.floor(messageStr.length / 2);

      buffer.processStdout(messageStr.slice(0, splitPoint));
      buffer.processStdout(messageStr.slice(splitPoint));
    });

    it('should emit parseError for invalid JSON', (t, done) => {
      const buffer = new StreamBuffer();

      buffer.once('parseError', (error) => {
        assert.ok(error instanceof Error);
        assert.ok(error.message.includes('Failed to parse JSON message'));
        assert.ok(error.message.includes('invalid json'));
        done();
      });

      buffer.processStdout('invalid json\n');
    });

    it('should ignore empty lines', () => {
      const buffer = new StreamBuffer();
      let messageEmitted = false;

      buffer.on('message', () => {
        messageEmitted = true;
      });

      buffer.processStdout('\n\n  \n');
      assert.equal(messageEmitted, false);
      assert.equal(buffer.getStdoutBuffer(), '');
    });

    it('should handle mixed valid and invalid JSON', (t, done) => {
      const buffer = new StreamBuffer();
      const validMessage = { jsonrpc: '2.0', id: 1, result: {} };
      let messageReceived = false;
      let errorReceived = false;

      buffer.on('message', (message) => {
        assert.deepEqual(message, validMessage);
        messageReceived = true;
        checkComplete();
      });

      buffer.on('parseError', (error) => {
        assert.ok(error.message.includes('invalid'));
        errorReceived = true;
        checkComplete();
      });

      function checkComplete() {
        if (messageReceived && errorReceived) {
          done();
        }
      }

      buffer.processStdout(`${JSON.stringify(validMessage)}\ninvalid\n`);
    });
  });

  describe('stderr processing and ready pattern detection', () => {
    it('should accumulate stderr without ready pattern', () => {
      const buffer = new StreamBuffer();
      buffer.processStderr('error message 1\n');
      buffer.processStderr('error message 2\n');
      assert.equal(buffer.getStderr(), 'error message 1\nerror message 2\n');
      assert.equal(buffer.isReady, false);
    });

    it('should detect ready pattern and emit ready event', (t, done) => {
      const buffer = new StreamBuffer({ readyPattern: 'Server ready' });

      buffer.once('ready', () => {
        assert.equal(buffer.isReady, true);
        done();
      });

      buffer.processStderr('Starting server...\n');
      assert.equal(buffer.isReady, false);

      buffer.processStderr('Server ready\n');
    });

    it('should handle regex ready patterns', (t, done) => {
      const buffer = new StreamBuffer({ readyPattern: 'Server.*ready.*port.*\\d+' });

      buffer.once('ready', () => {
        assert.equal(buffer.isReady, true);
        done();
      });

      buffer.processStderr('Server is ready on port 3000\n');
    });

    it('should only emit ready event once', () => {
      const buffer = new StreamBuffer({ readyPattern: 'ready' });
      let readyEmissions = 0;

      buffer.on('ready', () => {
        readyEmissions++;
      });

      buffer.processStderr('server is ready\n');
      buffer.processStderr('still ready\n');
      buffer.processStderr('ready again\n');

      assert.equal(readyEmissions, 1);
      assert.equal(buffer.isReady, true);
    });

    it('should not emit ready without pattern match', () => {
      const buffer = new StreamBuffer({ readyPattern: 'READY' });
      let readyEmitted = false;

      buffer.on('ready', () => {
        readyEmitted = true;
      });

      buffer.processStderr('server started\n');
      buffer.processStderr('listening on port 3000\n');

      assert.equal(readyEmitted, false);
      assert.equal(buffer.isReady, false);
    });

    it('should handle ready pattern with special regex characters', (t, done) => {
      const buffer = new StreamBuffer({ readyPattern: 'Server\\s+\\[ready\\]\\s*$' });

      buffer.once('ready', () => {
        done();
      });

      buffer.processStderr('Server [ready]\n');
    });
  });

  describe('buffer management methods', () => {
    it('should clear stderr buffer', () => {
      const buffer = new StreamBuffer();
      buffer.processStderr('error data');
      assert.ok(buffer.getStderr().length > 0);

      buffer.clearStderr();
      assert.equal(buffer.getStderr(), '');
    });

    it('should clear stdout buffer', () => {
      const buffer = new StreamBuffer();
      buffer.processStdout('incomplete json');
      assert.ok(buffer.getStdoutBuffer().length > 0);

      buffer.clearStdout();
      assert.equal(buffer.getStdoutBuffer(), '');
    });

    it('should reset all state', () => {
      const buffer = new StreamBuffer({ readyPattern: 'ready' });
      buffer.processStdout('incomplete');
      buffer.processStderr('Server ready\nerror');

      // Ensure state is set
      assert.ok(buffer.getStdoutBuffer().length > 0);
      assert.ok(buffer.getStderr().length > 0);
      assert.equal(buffer.isReady, true);

      buffer.resetState();

      assert.equal(buffer.getStdoutBuffer(), '');
      assert.equal(buffer.getStderr(), '');
      assert.equal(buffer.isReady, false);
    });

    it('should get ready status with pattern', () => {
      const buffer = new StreamBuffer({ readyPattern: 'ready' });
      assert.equal(buffer.getReadyStatus(), false);

      buffer.processStderr('Server ready');
      assert.equal(buffer.getReadyStatus(), true);
    });

    it('should get ready status without pattern (always true)', () => {
      const buffer = new StreamBuffer();
      assert.equal(buffer.getReadyStatus(), true);
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle very large stdout chunks', () => {
      const buffer = new StreamBuffer();
      const largeMessage = {
        jsonrpc: '2.0',
        id: 1,
        result: {
          data: 'x'.repeat(10000),
        },
      };

      let messageReceived = false;
      buffer.on('message', (message) => {
        assert.deepEqual(message, largeMessage);
        messageReceived = true;
      });

      buffer.processStdout(`${JSON.stringify(largeMessage)}\n`);
      assert.equal(messageReceived, true);
    });

    it('should handle newlines within JSON strings', (t, done) => {
      const buffer = new StreamBuffer();
      const messageWithNewlines = {
        jsonrpc: '2.0',
        id: 1,
        result: {
          text: 'line 1\nline 2\nline 3',
        },
      };

      buffer.once('message', (message) => {
        assert.deepEqual(message, messageWithNewlines);
        done();
      });

      buffer.processStdout(`${JSON.stringify(messageWithNewlines)}\n`);
    });

    it('should handle malformed JSON with special characters', (t, done) => {
      const buffer = new StreamBuffer();

      buffer.once('parseError', (error) => {
        assert.ok(error.message.includes('Failed to parse JSON message'));
        assert.ok(error.message.includes('{invalid: "json", missing: quotes}'));
        done();
      });

      buffer.processStdout('{invalid: "json", missing: quotes}\n');
    });

    it('should handle empty stderr chunks without pattern', () => {
      const buffer = new StreamBuffer({ readyPattern: 'ready' });

      assert.doesNotThrow(() => {
        buffer.processStderr('');
        buffer.processStderr('\n');
        buffer.processStderr('   ');
      });

      assert.equal(buffer.isReady, false);
    });

    it('should handle ready pattern that never matches', () => {
      const buffer = new StreamBuffer({ readyPattern: 'NEVER_MATCHING_PATTERN_12345' });

      buffer.processStderr('Server started\n');
      buffer.processStderr('Ready to accept connections\n');
      buffer.processStderr('Listening on port 3000\n');

      assert.equal(buffer.isReady, false);
      assert.equal(buffer.getReadyStatus(), false);
    });
  });

  describe('event emitter functionality', () => {
    it('should support multiple listeners', (t, done) => {
      const buffer = new StreamBuffer();
      const message = { jsonrpc: '2.0', id: 1, result: {} };
      let listener1Called = false;
      let listener2Called = false;

      buffer.on('message', () => {
        listener1Called = true;
        checkComplete();
      });

      buffer.on('message', () => {
        listener2Called = true;
        checkComplete();
      });

      function checkComplete() {
        if (listener1Called && listener2Called) {
          done();
        }
      }

      buffer.processStdout(`${JSON.stringify(message)}\n`);
    });

    it('should handle listener removal', () => {
      const buffer = new StreamBuffer();
      const message = { jsonrpc: '2.0', id: 1, result: {} };
      let callCount = 0;

      const listener = () => {
        callCount++;
      };

      buffer.on('message', listener);
      buffer.processStdout(`${JSON.stringify(message)}\n`);
      assert.equal(callCount, 1);

      buffer.removeListener('message', listener);
      buffer.processStdout(`${JSON.stringify(message)}\n`);
      assert.equal(callCount, 1); // Should not increment
    });

    it('should handle parseError listeners', (t, done) => {
      const buffer = new StreamBuffer();
      let errorCount = 0;

      buffer.on('parseError', (error) => {
        errorCount++;
        if (errorCount === 2) {
          assert.equal(errorCount, 2);
          done();
        }
      });

      buffer.processStdout('invalid1\ninvalid2\n');
    });
  });
});
