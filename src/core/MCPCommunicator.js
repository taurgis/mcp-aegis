import { EventEmitter } from 'events';
import { ProcessManager } from './ProcessManager.js';
import { StreamBuffer } from './StreamBuffer.js';
import { MessageHandler } from './MessageHandler.js';

/**
 * MCPCommunicator orchestrates MCP server communication using modular components
 * Single responsibility: High-level MCP protocol communication orchestration
 */
export class MCPCommunicator extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    
    // Initialize modular components
    this.processManager = new ProcessManager(config);
    this.streamBuffer = new StreamBuffer(config);
    this.messageHandler = new MessageHandler(this.processManager, this.streamBuffer, config);
    
    this._setupEventHandlers();
  }

  /**
   * Sets up event handlers between components
   * @private
   */
  _setupEventHandlers() {
    // Forward process events
    this.processManager.on('stdout', (chunk) => {
      this.streamBuffer.processStdout(chunk);
    });

    this.processManager.on('stderr', (chunk) => {
      this.streamBuffer.processStderr(chunk);
      this.emit('stderr', chunk);
    });

    this.processManager.on('exit', (code, signal) => {
      this.messageHandler.cancelAllReads();
      this.emit('exit', code, signal);
    });

    // Forward stream buffer events
    this.streamBuffer.on('ready', () => {
      this.emit('ready');
    });
  }

  /**
   * Starts the MCP server process and sets up communication
   * @returns {Promise<void>}
   */
  async start() {
    return new Promise((resolve, reject) => {
      // Start the process (this is async, so handle it properly)
      this.processManager.start()
        .then(() => {
          // Set up startup timeout if ready pattern is specified
          if (this.config.readyPattern) {
            const timeout = setTimeout(() => {
              reject(new Error(`Server startup timed out after ${this.config.startupTimeout}ms`));
            }, this.config.startupTimeout);

            // Wait for ready signal
            this.streamBuffer.once('ready', () => {
              clearTimeout(timeout);
              resolve();
            });
          } else {
            // No ready pattern, consider ready immediately
            resolve();
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * Sends a JSON-RPC message to the server
   * @param {Object} messageObject - The JSON-RPC message object
   * @returns {Promise<void>}
   */
  async sendMessage(messageObject) {
    return this.messageHandler.sendMessage(messageObject);
  }

  /**
   * Reads the next complete JSON message from stdout
   * @param {number} [timeoutMs] - Optional timeout override
   * @returns {Promise<Object>} The parsed JSON message
   */
  async readMessage(timeoutMs) {
    return this.messageHandler.readMessage(timeoutMs);
  }

  /**
   * Gets the accumulated stderr output
   * @returns {string}
   */
  getStderr() {
    return this.streamBuffer.getStderr();
  }

  /**
   * Clears the stderr buffer
   */
  clearStderr() {
    this.streamBuffer.clearStderr();
  }

  /**
   * Stops the server process gracefully
   * @returns {Promise<void>}
   */
  async stop() {
    this.messageHandler.cancelAllReads();
    return this.processManager.stop();
  }

  /**
   * Checks if the server process is running
   * @returns {boolean}
   */
  isRunning() {
    return this.processManager.isRunning();
  }

  /**
   * Gets the ready status (for backward compatibility)
   * @returns {boolean}
   */
  get isReady() {
    return this.streamBuffer.getReadyStatus();
  }

  /**
   * Gets the child process (for backward compatibility)
   * @returns {ChildProcess|null}
   */
  get childProcess() {
    return this.processManager.getProcess();
  }
}

