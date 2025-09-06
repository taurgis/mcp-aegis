import { spawn } from 'child_process';
import { EventEmitter } from 'events';

/**
 * ProcessManager handles the lifecycle of child processes for MCP servers
 * Single responsibility: Process startup, monitoring, and shutdown
 */
export class ProcessManager extends EventEmitter {
  constructor(config) {
    super();
    this.config = config;
    this.childProcess = null;
  }

  /**
   * Starts the child process with the given configuration
   * @returns {Promise<void>}
   */
  async start() {
    if (this.childProcess) {
      throw new Error('Process is already running');
    }

    return new Promise((resolve, reject) => {
      try {
        this.childProcess = spawn(this.config.command, this.config.args, {
          cwd: this.config.cwd,
          env: this.config.env,
          stdio: ['pipe', 'pipe', 'pipe'],
        });

        // Set up encoding
        this.childProcess.stdout.setEncoding('utf8');
        this.childProcess.stderr.setEncoding('utf8');

        // Set up event forwarding
        this.childProcess.stdout.on('data', (chunk) => {
          this.emit('stdout', chunk);
        });

        this.childProcess.stderr.on('data', (chunk) => {
          this.emit('stderr', chunk);
        });

        this.childProcess.on('exit', (code, signal) => {
          this.emit('exit', code, signal);
        });

        this.childProcess.on('error', (error) => {
          reject(new Error(`Failed to start server process: ${error.message}`));
        });

        // Process started successfully
        resolve();
      } catch (error) {
        reject(new Error(`Failed to spawn process: ${error.message}`));
      }
    });
  }

  /**
   * Sends data to the process stdin
   * @param {string} data - Data to send
   * @returns {Promise<void>}
   */
  async writeToStdin(data) {
    if (!this.childProcess || !this.childProcess.stdin.writable) {
      throw new Error('Process is not available or stdin is not writable');
    }

    return new Promise((resolve, reject) => {
      this.childProcess.stdin.write(data, (error) => {
        if (error) {
          reject(new Error(`Failed to write to stdin: ${error.message}`));
        } else {
          resolve();
        }
      });
    });
  }

  /**
   * Stops the process gracefully
   * @returns {Promise<void>}
   */
  async stop() {
    if (!this.childProcess) {
      return;
    }

    return new Promise((resolve) => {
      const cleanup = () => {
        this.childProcess = null;
        resolve();
      };

      // Try graceful shutdown first
      this.childProcess.once('exit', cleanup);

      try {
        this.childProcess.kill('SIGTERM');
      } catch {
        // Process might already be dead
      }

      // Force kill after timeout
      setTimeout(() => {
        if (this.childProcess) {
          try {
            this.childProcess.kill('SIGKILL');
          } catch {
            // Process might already be dead
          }
        }
        cleanup();
      }, 2000);
    });
  }

  /**
   * Checks if the process is running
   * @returns {boolean}
   */
  isRunning() {
    return Boolean(this.childProcess && !this.childProcess.killed);
  }

  /**
   * Gets the child process instance (for advanced use cases)
   * @returns {ChildProcess|null}
   */
  getProcess() {
    return this.childProcess;
  }
}
