const semver = require('semver');

const { InterceptingCall } = require('grpc');

const FailedPreconditionGrpcError = require('../../server/error/FailedPreconditionGrpcError');

const {
  convertVersionToInt32,
  convertInt32VersionToString,
} = require('../../utils/semanticVersioningConversion');

/**
 * Client-side `add protocol version` interceptor (factory)
 *
 * @param {string} clientProtocolVersionString
 *
 * @returns {protocolVersionInterceptor}
 */
function protocolVersionInterceptorFactory(clientProtocolVersionString) {
  /**
   * Client-side `add protocol version` interceptor
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
        metadata.set(
          'protocolVersion', convertVersionToInt32(clientProtocolVersionString),
        );

        next(metadata, {
          onReceiveMetadata: (receivedMetadata, onReceiveMetadataNext) => {
            const [serverProtocolVersionFromMeta] = receivedMetadata.get('protocolVersion');

            if (!serverProtocolVersionFromMeta) {
              throw new FailedPreconditionGrpcError('client and server versions mismatch');
            }

            const serverProtocolVersionNumber = parseInt(serverProtocolVersionFromMeta, 10);
            const serverProtocolVersionString = convertInt32VersionToString(
              serverProtocolVersionNumber,
            );

            const clientVersion = semver.coerce(clientProtocolVersionString);
            const serverVersion = semver.coerce(serverProtocolVersionString);

            const majorMismatch = clientVersion.major !== serverVersion.major;
            const minorMismatch = clientVersion.minor !== serverVersion.minor;

            if (majorMismatch || minorMismatch) {
              throw new FailedPreconditionGrpcError('client and server versions mismatch');
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
