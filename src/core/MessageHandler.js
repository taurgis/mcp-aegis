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
      // Set up timeout
      const timeout = setTimeout(() => {
        this.pendingReads.delete(readId);
        reject(new Error('Read timeout: No message received within timeout period'));
      }, timeoutMs);

      // Store the pending read
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

      // If this is the first pending read, set up listeners
      if (this.pendingReads.size === 1) {
        this._setupMessageListeners();
      }
    });
  }

  /**
   * Sets up message listeners for handling incoming messages
   * @private
   */
  _setupMessageListeners() {
    const messageHandler = (message) => {
      // Get the first pending read (FIFO)
      const firstReadId = this.pendingReads.keys().next().value;
      if (firstReadId) {
        const pendingRead = this.pendingReads.get(firstReadId);
        pendingRead.resolve(message);
      }
      
      // Keep listening if there are more pending reads
      if (this.pendingReads.size > 0) {
        this.streamBuffer.once('message', messageHandler);
      }
    };

    const errorHandler = (error) => {
      // Get the first pending read (FIFO)
      const firstReadId = this.pendingReads.keys().next().value;
      if (firstReadId) {
        const pendingRead = this.pendingReads.get(firstReadId);
        pendingRead.reject(error);
      }
      
      // Keep listening if there are more pending reads
      if (this.pendingReads.size > 0) {
        this.streamBuffer.once('parseError', errorHandler);
      }
    };

    // Add listeners
    this.streamBuffer.once('message', messageHandler);
    this.streamBuffer.once('parseError', errorHandler);
  }

  /**
   * Cancels all pending read operations
   */
  cancelAllReads() {
    for (const [_readId, pendingRead] of this.pendingReads) {
      pendingRead.reject(new Error('Read operation cancelled'));
    }
    this.pendingReads.clear();
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
}
