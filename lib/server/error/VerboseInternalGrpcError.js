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

    const metadata = {
      stack: JSON.stringify(originalError.stack),
    };

    if (originalError.metadata) {
      Object.entries(metadata.getMap()).forEach(([key, value]) => {
        error.metadata.set(key, value);
      });
    } else {
      error.setMetadata(metadata);
    }

    super(
      originalError,
      metadata,
    );

    this.setMessage(message);
  }
}

module.exports = VerboseInternalGrpcError;
