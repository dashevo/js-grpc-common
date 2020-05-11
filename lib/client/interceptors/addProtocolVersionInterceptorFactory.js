const { InterceptingCall } = require('grpc');

/**
 * Client-side `add protocol version` interceptor (factory)
 *
 * @param {string} protocolVersion
 *
 * @returns {addVersionInterceptor}
 */
function addProtocolVersionInterceptorFactory(protocolVersion) {
  /**
   * Client-side `add protocol version` interceptor
   *
   * @typedef addVersionInterceptor
   *
   * @param {Object} options
   * @param {module:grpc.InterceptingCall} nextCall
   *
   * @return {module:grpc.InterceptingCall}
   */
  function addVersionInterceptor(options, nextCall) {
    const methods = {
      start(metadata, listener, next) {
        metadata.set('protocolVersion', protocolVersion);
        next(metadata, listener);
      },
    };
    return new InterceptingCall(nextCall(options), methods);
  }

  return addVersionInterceptor;
}

module.exports = addProtocolVersionInterceptorFactory;
