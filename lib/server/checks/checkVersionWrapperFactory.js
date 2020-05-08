const semver = require('semver');

const VersionMismatchGrpcError = require('../error/VersionMismatchGrpcError');

function checkVersionWrapperFactory(serverVersionString) {
  function checkVersionWrapper(method) {
    /**
     *
     * @param {grpc.ServerWriteableStream} call
     * @param callback
     * @returns {Promise<void>}
     */
    async function handler(call, callback = undefined) {
      const metadata = call.getMetadata();

      if (metadata && metadata.get('version') && metadata.get('version').length > 0) {
        const [clientVersionString] = metadata.get('version');

        const clientVersion = semver.coerce(clientVersionString);
        const serverVersion = semver.coerce(serverVersionString);

        const majorMismatch = clientVersion.major !== serverVersion.major;
        const minorMismatch = clientVersion.minor < serverVersion.minor;

        if (majorMismatch || minorMismatch) {
          throw new VersionMismatchGrpcError('Client and server versions mismatch');
        }
      }

      return method(call, callback);
    }

    return handler;
  }

  return checkVersionWrapper;
}

module.exports = checkVersionWrapperFactory;
