import { EventEmitter } from 'events';

/**
 * StreamBuffer handles buffering and processing of stream data
 * Single responsibility: Stream data buffering and pattern matching
 */
export class StreamBuffer extends EventEmitter {
  constructor(config = {}) {
    super();
    this.stdoutBuffer = '';
    this.stderrBuffer = '';
    this.readyPattern = config.readyPattern;
    this.isReady = false;
  }

  /**
   * Processes stdout data and emits complete messages
   * @param {string} chunk - Raw stdout data
   */
  processStdout(chunk) {
    this.stdoutBuffer += chunk;
    this._extractCompleteMessages();
  }

  /**
   * Processes stderr data and checks for ready pattern
   * @param {string} chunk - Raw stderr data
   */
  processStderr(chunk) {
    this.stderrBuffer += chunk;
    this._checkReadyPattern(chunk);
  }

  /**
   * Extracts complete JSON messages from stdout buffer
   * @private
   */
  _extractCompleteMessages() {
    let newlineIndex;
    while ((newlineIndex = this.stdoutBuffer.indexOf('\n')) !== -1) {
      const messageString = this.stdoutBuffer.substring(0, newlineIndex).trim();
      this.stdoutBuffer = this.stdoutBuffer.substring(newlineIndex + 1);

      if (messageString) {
        try {
          const messageObject = JSON.parse(messageString);
          this.emit('message', messageObject);
        } catch (error) {
          this.emit('parseError', new Error(
            `Failed to parse JSON message: ${error.message}. Raw message: "${messageString}"`,
          ));
        }
      }
    }
  }

  /**
   * Checks if stderr contains the ready pattern
   * @param {string} _chunk - New stderr data (unused, pattern checked against full buffer)
   * @private
   */
  _checkReadyPattern(_chunk) {
    if (this.readyPattern && !this.isReady) {
      const regex = new RegExp(this.readyPattern);
      if (regex.test(this.stderrBuffer)) {
        this.isReady = true;
        this.emit('ready');
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
   * Gets the current stdout buffer (for debugging)
   * @returns {string}
   */
  getStdoutBuffer() {
    return this.stdoutBuffer;
  }

  /**
   * Checks if the server is ready (based on ready pattern)
   * @returns {boolean}
   */
  getReadyStatus() {
    return this.readyPattern ? this.isReady : true;
  }
}
