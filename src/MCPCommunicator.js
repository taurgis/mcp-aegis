import { spawn } from 'child_process';
import { EventEmitter } from 'events';

/**
 * MCPCommunicator handles the low-level communication with MCP servers over stdio
 */
export class MCPCommunicator extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.childProcess = null;
    this.stdoutBuffer = '';
    this.stderrBuffer = '';
    this.resolveCurrentRead = null;
    this.isReady = false;
  }

  /**
   * Starts the MCP server process and sets up communication
   * @returns {Promise<void>}
   */
  async start() {
    return new Promise((resolve, reject) => {
      // Spawn the child process
      this.childProcess = spawn(this.config.command, this.config.args, {
        cwd: this.config.cwd,
        env: this.config.env,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      // Set up encoding
      this.childProcess.stdout.setEncoding('utf8');
      this.childProcess.stderr.setEncoding('utf8');

      // Handle stdout data
      this.childProcess.stdout.on('data', (chunk) => {
        this.stdoutBuffer += chunk;
        this._processStdoutBuffer();
      });

      // Handle stderr data
      this.childProcess.stderr.on('data', (chunk) => {
        this.stderrBuffer += chunk;
        this.emit('stderr', chunk);
        
        // Check for ready pattern if specified
        if (this.config.readyPattern && !this.isReady) {
          const regex = new RegExp(this.config.readyPattern);
          if (regex.test(this.stderrBuffer)) {
            this.isReady = true;
            this.emit('ready');
          }
        }
      });

      // Handle process exit
      this.childProcess.on('exit', (code, signal) => {
        this.emit('exit', code, signal);
      });

      // Handle process errors
      this.childProcess.on('error', (error) => {
        reject(new Error(`Failed to start server process: ${error.message}`));
      });

      // Set up startup timeout
      const startupTimeout = setTimeout(() => {
        reject(new Error(`Server startup timed out after ${this.config.startupTimeout}ms`));
      }, this.config.startupTimeout);

      // If no ready pattern specified, consider ready immediately
      if (!this.config.readyPattern) {
        this.isReady = true;
        clearTimeout(startupTimeout);
        resolve();
      } else {
        // Wait for ready pattern
        this.once('ready', () => {
          clearTimeout(startupTimeout);
          resolve();
        });
      }
    });
  }

  /**
   * Sends a JSON-RPC message to the server
   * @param {Object} messageObject - The JSON-RPC message object
   * @returns {Promise<void>}
   */
  async sendMessage(messageObject) {
    if (!this.childProcess || !this.childProcess.stdin.writable) {
      throw new Error('Server process is not available or stdin is not writable');
    }

    const messageString = JSON.stringify(messageObject) + '\n';
    
    return new Promise((resolve, reject) => {
      this.childProcess.stdin.write(messageString, (error) => {
        if (error) {
          reject(new Error(`Failed to send message: ${error.message}`));
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Reads the next complete JSON message from stdout
   * @returns {Promise<Object>} The parsed JSON message
   */
  async readMessage() {
    return new Promise((resolve, reject) => {
      if (this.resolveCurrentRead) {
        reject(new Error('Another read operation is already in progress'));
        return;
      }

      this.resolveCurrentRead = { resolve, reject };
      
      // Try to process any existing buffered data
      this._processStdoutBuffer();

      // Set up a timeout for reading
      const timeout = setTimeout(() => {
        if (this.resolveCurrentRead) {
          this.resolveCurrentRead.reject(new Error('Read timeout: No message received within timeout period'));
          this.resolveCurrentRead = null;
        }
      }, this.config.startupTimeout);

      // Modify the resolver to clear the timeout
      const originalResolve = this.resolveCurrentRead.resolve;
      const originalReject = this.resolveCurrentRead.reject;
      
      this.resolveCurrentRead.resolve = (value) => {
        clearTimeout(timeout);
        originalResolve(value);
      };
      
      this.resolveCurrentRead.reject = (error) => {
        clearTimeout(timeout);
        originalReject(error);
      };
    });
  }

  /**
   * Processes the stdout buffer to extract complete JSON messages
   * @private
   */
  _processStdoutBuffer() {
    if (!this.resolveCurrentRead) return;

    const newlineIndex = this.stdoutBuffer.indexOf('\n');
    if (newlineIndex !== -1) {
      const messageString = this.stdoutBuffer.substring(0, newlineIndex).trim();
      this.stdoutBuffer = this.stdoutBuffer.substring(newlineIndex + 1);

      if (messageString) {
        try {
          const messageObject = JSON.parse(messageString);
          this.resolveCurrentRead.resolve(messageObject);
          this.resolveCurrentRead = null;
        } catch (error) {
          this.resolveCurrentRead.reject(new Error(`Failed to parse JSON message: ${error.message}. Raw message: "${messageString}"`));
          this.resolveCurrentRead = null;
        }
      } else {
        // Empty line, continue processing
        this._processStdoutBuffer();
      }
    }
  }

  /**
   * Gets the accumulated stderr output
   * @returns {string}
   */
  getStderr() {
    return this.stderrBuffer;
  }

  /**
   * Clears the stderr buffer
   */
  clearStderr() {
    this.stderrBuffer = '';
  }

  /**
   * Stops the server process gracefully
   * @returns {Promise<void>}
   */
  async stop() {
    if (!this.childProcess) return;

    return new Promise((resolve) => {
      const cleanup = () => {
        this.childProcess = null;
        this.resolveCurrentRead = null;
        resolve();
      };

      // Try graceful shutdown first
      this.childProcess.once('exit', cleanup);
      
      try {
        this.childProcess.kill('SIGTERM');
      } catch (error) {
        // Process might already be dead
      }

      // Force kill after timeout
      setTimeout(() => {
        if (this.childProcess) {
          try {
            this.childProcess.kill('SIGKILL');
          } catch (error) {
            // Process might already be dead
          }
        }
        cleanup();
      }, 2000);
    });
  }

  /**
   * Checks if the server process is running
   * @returns {boolean}
   */
  isRunning() {
    return Boolean(this.childProcess && !this.childProcess.killed);
  }
}
