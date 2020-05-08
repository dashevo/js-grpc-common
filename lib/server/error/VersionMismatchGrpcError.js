const GrpcError = require('./GrpcError');

class VersionMismatchGrpcError extends GrpcError {
  /**
   * @param {string} message
   * @param {Object} [metadata]
   */
  constructor(message, metadata = undefined) {
    super(GrpcError.CODES.VERSION_MISMATCH, message, metadata);
  }
}

module.exports = VersionMismatchGrpcError;
