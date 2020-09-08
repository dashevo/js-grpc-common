const InternalGrpcError = require('./InternalGrpcError');

class VerboseInternalGrpcError extends InternalGrpcError {
  /**
   *
   * @param {InternalGrpcError} error
   */
  constructor(error) {
    const originalError = error.getError();
    const [, errorPath] = originalError.stack.toString().split(/\r\n|\n/);

    const message = `${originalError.message} ${errorPath.trim()}`;

    const metadataObject = error.getMetadata() || {};
    metadataObject.stack = JSON.stringify(originalError.stack);

    super(
      originalError,
      metadataObject,
    );

    this.setMessage(message);
  }
}

module.exports = VerboseInternalGrpcError;
