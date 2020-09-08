const convertObjectToMetadata = require('../../convertObjectToMetadata');

class GrpcError extends Error {
  /**
   * @param {string} message
   * @param {number} code
   * @param {Object} [metadata]
   */
  constructor(code, message, metadata = undefined) {
    super(message);

    this.code = code;

    if (metadata) {
      this.metadata = convertObjectToMetadata(metadata);
    }

    this.metadataObject = metadata;
  }

  /**
   * Get message
   *
   * @return {string}
   */
  getMessage() {
    return this.message;
  }

  /**
   * Get error code
   *
   * @return {number}
   */
  getCode() {
    return this.code;
  }

  /**
   * Get metadata
   *
   * @return {Object}
   */
  getMetadata() {
    return this.metadataObject;
  }

  /**
   *
   * @param {Object} metadata
   * @return {GrpcError}
   */
  setMetadata(metadata) {
    this.metadata = convertObjectToMetadata(metadata);

    this.metadataObject = metadata;

    return this;
  }

  /**
   *
   * @param {string} message
   * @return {GrpcError}
   */
  setMessage(message) {
    this.message = message;

    return this;
  }
}

module.exports = GrpcError;
