const semver = require('semver');

const { Metadata } = require('grpc');

const FailedPreconditionGrpcError = require('../error/FailedPreconditionGrpcError');

/**
 * Check version wrapper hanldler (factory)
 *
 * @param {string} serverProtocolVersionString
 *
 * @returns {checkVersionWrapper}
 */
function checkVersionWrapperFactory(serverProtocolVersionString) {
  /* Prepare server metadata on factory call */
  const serverMetadata = new Metadata();

  serverMetadata.set('protocolVersion', serverProtocolVersionString);

  /**
   *
   * @typedef checkVersionWrapper
   *
   * @param {Function(grpc.ServerWriteableStream, Function)} method
   *
   * @returns {internalHandler}
   */
  function checkVersionWrapper(method) {
    /**
     * @typedef internalHandler
     *
     * @param {grpc.ServerWriteableStream} call
     * @param {Function(Error|null, *|null)} [callback=undefined]
     *
     * @returns {Promise<void>}
     */
    async function handler(call, callback = undefined) {
      await call.sendMetadata(serverMetadata);

      const { metadata } = call;

      if (metadata && metadata.get('protocolVersion') && metadata.get('protocolVersion').length > 0) {
        const [clientProtocolVersionString] = metadata.get('protocolVersion');

        const clientVersion = semver.coerce(clientProtocolVersionString);
        const serverVersion = semver.coerce(serverProtocolVersionString);

        const majorMismatch = clientVersion.major !== serverVersion.major;
        const minorMismatch = clientVersion.minor !== serverVersion.minor;

        if (majorMismatch || minorMismatch) {
          throw new FailedPreconditionGrpcError('client and server versions mismatch');
        }

        return method(call, callback);
      }

      throw new FailedPreconditionGrpcError('client and server versions mismatch');
    }

    return handler;
  }

  return checkVersionWrapper;
}

module.exports = checkVersionWrapperFactory;
