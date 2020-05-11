const semver = require('semver');

const FailedPreconditionGrpcError = require('../error/FailedPreconditionGrpcError');

/**
 * Check version wrapper hanldler (factory)
 *
 * @param {string} serverVersionString
 *
 * @returns {checkVersionWrapper}
 */
function checkVersionWrapperFactory(serverVersionString) {
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
      const { metadata } = call;

      if (metadata && metadata.get('protocolVersion') && metadata.get('protocolVersion').length > 0) {
        const [clientVersionString] = metadata.get('protocolVersion');

        const clientVersion = semver.coerce(clientVersionString);
        const serverVersion = semver.coerce(serverVersionString);

        const majorMismatch = clientVersion.major !== serverVersion.major;
        const minorMismatch = clientVersion.minor !== serverVersion.minor;

        if (majorMismatch || minorMismatch) {
          throw new FailedPreconditionGrpcError('client and server versions mismatch');
        }
      }

      return method(call, callback);
    }

    return handler;
  }

  return checkVersionWrapper;
}

module.exports = checkVersionWrapperFactory;
