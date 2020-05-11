const semver = require('semver');

const { InterceptingCall } = require('grpc');

const FailedPreconditionGrpcError = require('../../server/error/FailedPreconditionGrpcError');

/**
 * Client-side `add version` interceptor (factory)
 *
 * @param {string} clientVersionString
 *
 * @returns {protocolVersionInterceptor}
 */
function protocolVersionInterceptorFactory(clientVersionString) {
  /**
   * Client-side `add version` interceptor
   *
   * @typedef protocolVersionInterceptor
   *
   * @param {Object} options
   * @param {module:grpc.InterceptingCall} nextCall
   *
   * @return {module:grpc.InterceptingCall}
   */
  function protocolVersionInterceptor(options, nextCall) {
    const methods = {
      start(metadata, listener, next) {
        metadata.set('protocolVersion', clientVersionString);
        next(metadata, {
          onReceiveMetadata: (receivedMetadata, onReceiveMetadataNext) => {
            const [serverVersionString] = receivedMetadata.get('protocolVersion');

            if (serverVersionString) {
              const clientVersion = semver.coerce(clientVersionString);
              const serverVersion = semver.coerce(serverVersionString);

              const majorMismatch = clientVersion.major !== serverVersion.major;
              const minorMismatch = clientVersion.minor !== serverVersion.minor;

              if (majorMismatch || minorMismatch) {
                throw new FailedPreconditionGrpcError('client and server versions mismatch');
              }
            }

            onReceiveMetadataNext(receivedMetadata);
          },
        });
      },
    };
    return new InterceptingCall(nextCall(options), methods);
  }

  return protocolVersionInterceptor;
}

module.exports = protocolVersionInterceptorFactory;
