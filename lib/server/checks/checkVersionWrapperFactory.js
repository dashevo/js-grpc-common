const semver = require('semver');

const FailedPreconditionGrpcError = require('../error/FailedPreconditionGrpcError');

function checkVersionWrapperFactory(serverVersionString) {
  function checkVersionWrapper(method) {
    /**
     *
     * @param {grpc.ServerWriteableStream} call
     * @param callback
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
