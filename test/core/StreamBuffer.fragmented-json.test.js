import { describe, it } from 'node:test';
import assert from 'node:assert';
import { StreamBuffer } from '../../src/core/StreamBuffer.js';

describe('StreamBuffer Fragmented JSON Handling', () => {
  it('should handle large JSON fragmented across multiple chunks with embedded newlines', (t, done) => {
    const buffer = new StreamBuffer();

    // Create a large JSON response similar to what SFCC MCP returns
    const largeContent = {
      jsonrpc: '2.0',
      id: 'call-get_sfra_document-1757828086189',
      result: {
        content: [{
          text: 'This is a large response with embedded\nnewlines and lots of text that might be split across multiple\nchunks when transmitted over stdout. The content includes:\n- Multiple lines\n- Special characters: "quotes" and \'apostrophes\'\n- Array elements\n- Object structures\nAnd continues for many more lines...',
          type: 'text',
        }],
        isError: false,
      },
    };

    const jsonString = JSON.stringify(largeContent);

    // Simulate the JSON being fragmented at an embedded newline
    const fragmentPoint = jsonString.indexOf('\\n') + 2; // Split just after an embedded newline
    const chunk1 = jsonString.substring(0, fragmentPoint);
    const chunk2 = jsonString.substring(fragmentPoint);

    let messageReceived = false;

    buffer.once('message', (message) => {
      assert.deepEqual(message, largeContent);
      messageReceived = true;
      done();
    });

    buffer.once('parseError', (error) => {
      assert.fail(`Should not emit parseError: ${error.message}`);
    });

    // Send the first chunk (should not trigger message emission)
    buffer.processStdout(chunk1);
    assert.equal(messageReceived, false, 'Should not emit message after first chunk');

    // Send the second chunk (should complete the JSON and emit message)
    buffer.processStdout(chunk2);
  });

  it('should handle JSON fragments without trailing newline', (t, done) => {
    const buffer = new StreamBuffer();

    const jsonMessage = {
      jsonrpc: '2.0',
      id: 'test-123',
      result: {
        content: 'Large content\nwith newlines\nthat spans\nmultiple lines',
      },
    };

    const jsonString = JSON.stringify(jsonMessage);
    // Split in the middle without any newline delimiter
    const splitPoint = Math.floor(jsonString.length / 2);
    const chunk1 = jsonString.substring(0, splitPoint);
    const chunk2 = jsonString.substring(splitPoint);

    buffer.once('message', (message) => {
      assert.deepEqual(message, jsonMessage);
      done();
    });

    buffer.once('parseError', (error) => {
      assert.fail(`Should not emit parseError: ${error.message}`);
    });

    // Send fragments
    buffer.processStdout(chunk1);
    buffer.processStdout(chunk2);
  });

  it('should handle multiple complete JSON objects in a single chunk', (t, done) => {
    const buffer = new StreamBuffer();

    const messages = [
      { jsonrpc: '2.0', id: 1, result: { content: 'First\nmessage' } },
      { jsonrpc: '2.0', id: 2, result: { content: 'Second\nmessage' } },
    ];

    const receivedMessages = [];

    buffer.on('message', (message) => {
      receivedMessages.push(message);
      if (receivedMessages.length === 2) {
        assert.deepEqual(receivedMessages, messages);
        done();
      }
    });

    // Send both JSON objects in a single chunk
    const combinedJson = messages.map(msg => JSON.stringify(msg)).join('');
    buffer.processStdout(combinedJson);
  });

  it('should handle mixed fragmented and complete JSON objects', (t, done) => {
    const buffer = new StreamBuffer();

    const completeMessage = { jsonrpc: '2.0', id: 1, result: { content: 'Complete\nmessage' } };
    const fragmentedMessage = { jsonrpc: '2.0', id: 2, result: { content: 'Fragmented\nmessage\nwith\nmore\nlines' } };

    const completeJson = JSON.stringify(completeMessage);
    const fragmentedJson = JSON.stringify(fragmentedMessage);

    // Split the fragmented message
    const splitPoint = Math.floor(fragmentedJson.length / 2);
    const fragment1 = fragmentedJson.substring(0, splitPoint);
    const fragment2 = fragmentedJson.substring(splitPoint);

    const receivedMessages = [];

    buffer.on('message', (message) => {
      receivedMessages.push(message);
      if (receivedMessages.length === 2) {
        assert.deepEqual(receivedMessages[0], completeMessage);
        assert.deepEqual(receivedMessages[1], fragmentedMessage);
        done();
      }
    });

    // Send complete message, then fragmented message
    buffer.processStdout(completeJson);
    buffer.processStdout(fragment1);
    buffer.processStdout(fragment2);
  });

  it('should reproduce the original SFCC error scenario', (t, done) => {
    const buffer = new StreamBuffer();

    // Reproduce the exact scenario from the error message
    const problematicJson = {
      jsonrpc: '2.0',
      id: 'call-get_sfra_document-1757828086189',
      result: {
        content: [{
          text: 'esses array\\n- `wallet` - Payment instruments collection\\n- `raw` - Reference to original customer object\\n\\n**For Unauthenticated Customers:**\\n- `credentials` - Username information\\n- `raw` - Reference to original customer object\\n\\n### geolocation\\n\\n**Type:** Object (Read Only)\\n\\n**Description:** Geographic location information:\\n- `countryCode` - Two-letter country code\\n- `latitude` - Geographic latitude coordinate\\n- `longitude` - Geographic longitude coordinate\\n\\n### pageMetaData\\n\\n**Type:** Object (Read Only)\\n\\n**Description:** SEO and page metadata management:\\n- `title` - Page title\\n- `description` - Page description\\n- `keywords` - Page keywords\\n- `pageMetaTags` - Collection of meta tags\\n- `addPageMetaTags(pageMetaTags)` - Method to add meta tags\\n- `setTitle(title)` - Method to set page title\\n- `setDescription(description)` - Method to set page description\\n- `setKeywords(keywords)` - Method to set page keywords\\n\\n---\\n',
          type: 'class',
          category: 'other',
          filename: 'REQUEST.md',
          lastModified: '2025-09-13T07:02:03.844Z',
          properties: [],
          methods: [],
        }],
        isError: false,
      },
    };

    const fullJson = JSON.stringify(problematicJson);

    // Simulate the scenario where the message starts with the problematic fragment
    const problematicStart = 'esses array\\n- `wallet` - Payment instruments collection\\n- `raw` - Reference to original customer object\\n\\n**For Unauthenticated Customers:**\\n- `credentials` - Username information\\n- `raw` - Reference to original customer object\\n\\n### geolocation\\n\\n**Type:** Object (Read Only)\\n\\n**Description:** Geographic location information:\\n- `countryCode` - Two-letter country code\\n- `latitude` - Geographic latitude coordinate\\n- `longitude` - Geographic longitude coordinate\\n\\n### pageMetaData\\n\\n**Type:** Object (Read Only)\\n\\n**Description:** SEO and page metadata management:\\n- `title` - Page title\\n- `description` - Page description\\n- `keywords` - Page keywords\\n- `pageMetaTags` - Collection of meta tags\\n- `addPageMetaTags(pageMetaTags)` - Method to add meta tags\\n- `setTitle(title)` - Method to set page title\\n- `setDescription(description)` - Method to set page description\\n- `setKeywords(keywords)` - Method to set page keywords\\n\\n---\\n",\n  "type": "class",\n  "category": "other",\n  "filename": "REQUEST.md",\n  "lastModified": "2025-09-13T07:02:03.844Z",\n  "properties": [],\n  "methods": []\n}"}],"isError":false},"jsonrpc":"2.0","id":"call-get_sfra_document-1757828086189"}';

    const fullMessage = `{"jsonrpc":"2.0","id":"call-get_sfra_document-1757828086189","result":{"content":[{"text":"Proc${  problematicStart}`;

    // Split to simulate the original error - first chunk ends mid-JSON
    const splitIndex = fullMessage.indexOf('esses array');
    const chunk1 = fullMessage.substring(0, splitIndex);
    const chunk2 = fullMessage.substring(splitIndex);

    buffer.once('message', (message) => {
      // Should successfully parse despite the fragmentation
      assert.equal(message.jsonrpc, '2.0');
      assert.equal(message.id, 'call-get_sfra_document-1757828086189');
      done();
    });

    buffer.once('parseError', (error) => {
      assert.fail(`Should not emit parseError: ${error.message}`);
    });

    // Send the fragmented chunks
    buffer.processStdout(chunk1);
    buffer.processStdout(chunk2);
  });
});
