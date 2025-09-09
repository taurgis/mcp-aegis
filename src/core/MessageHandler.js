/**
 * MessageHandler handles JSON-RPC message communication
 * Single responsibility: Message sending and reading with timeout management
 */
export class MessageHandler {
  constructor(processManager, streamBuffer, config) {
    this.processManager = processManager;
    this.streamBuffer = streamBuffer;
    this.config = config;
    this.pendingReads = new Map();
    this.readTimeoutMs = config.startupTimeout || 5000;
  }

  /**
   * Sends a JSON-RPC message
   * @param {Object} messageObject - The JSON-RPC message object
   * @returns {Promise<void>}
   */
  async sendMessage(messageObject) {
    const messageString = `${JSON.stringify(messageObject)}\n`;
    await this.processManager.writeToStdin(messageString);
  }

  /**
   * Reads the next complete JSON message with timeout
   * @param {number} [timeoutMs] - Optional timeout override
   * @returns {Promise<Object>} The parsed JSON message
   */
  async readMessage(timeoutMs = this.readTimeoutMs) {
    const readId = this._generateReadId();

    return new Promise((resolve, reject) => {
      // Set up listeners FIRST if this will be the first pending read
      // This prevents the race condition where messages arrive before listeners are attached
      if (this.pendingReads.size === 0) {
        this._setupMessageListeners();
      }

      // Set up timeout
      const timeout = setTimeout(() => {
        this.pendingReads.delete(readId);
        reject(new Error('Read timeout: No message received within timeout period'));
      }, timeoutMs);

      // Store the pending read AFTER listeners are set up
      this.pendingReads.set(readId, {
        resolve: (value) => {
          clearTimeout(timeout);
          this.pendingReads.delete(readId);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timeout);
          this.pendingReads.delete(readId);
          reject(error);
        },
      });
    });
  }

  /**
   * Sets up message listeners for handling incoming messages
   * @private
   */
  _setupMessageListeners() {
    // Use persistent listeners instead of recursive 'once' listeners to prevent accumulation
    const messageHandler = (message) => {
      // Get the first pending read (FIFO)
      const firstReadId = this.pendingReads.keys().next().value;
      if (firstReadId) {
        const pendingRead = this.pendingReads.get(firstReadId);
        this.pendingReads.delete(firstReadId); // Remove before resolving
        pendingRead.resolve(message);

        // Clean up listeners if no more pending reads
        if (this.pendingReads.size === 0) {
          this._cleanupListeners();
        }
      }
    };

    const errorHandler = (error) => {
      // Get the first pending read (FIFO)
      const firstReadId = this.pendingReads.keys().next().value;
      if (firstReadId) {
        const pendingRead = this.pendingReads.get(firstReadId);
        this.pendingReads.delete(firstReadId); // Remove before rejecting
        pendingRead.reject(error);

        // Clean up listeners if no more pending reads
        if (this.pendingReads.size === 0) {
          this._cleanupListeners();
        }
      }
    };

    // Store references for cleanup
    this.messageHandler = messageHandler;
    this.errorHandler = errorHandler;

    // Add persistent listeners (not 'once' to avoid recursive re-addition)
    this.streamBuffer.on('message', messageHandler);
    this.streamBuffer.on('parseError', errorHandler);
  }

  /**
   * Cancels all pending read operations
   */
  cancelAllReads() {
    for (const [_readId, pendingRead] of this.pendingReads) {
      pendingRead.reject(new Error('Read operation cancelled'));
    }
    this.pendingReads.clear();
    this._cleanupListeners();
  }

  /**
   * Clean up listeners when no pending reads remain
   * @private
   */
  _cleanupListeners() {
    // Remove the specific listeners we added to prevent memory leaks
    if (this.messageHandler) {
      this.streamBuffer.removeListener('message', this.messageHandler);
      this.messageHandler = null;
    }
    if (this.errorHandler) {
      this.streamBuffer.removeListener('parseError', this.errorHandler);
      this.errorHandler = null;
    }
  }

  /**
   * Gets the number of pending read operations
   * @returns {number}
   */
  getPendingReadCount() {
    return this.pendingReads.size;
  }

  /**
   * Generates a unique ID for read operations
   * @returns {string}
   * @private
   */
  _generateReadId() {
    return `read-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Cleanup method to ensure all listeners are properly removed
   * Should be called when the MessageHandler is no longer needed
   */
  cleanup() {
    this.cancelAllReads();
  }
}
