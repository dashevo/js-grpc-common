const { InterceptingCall } = require('grpc');

/**
 * Client-side `add version` interceptor (factory)
 *
 * @param {string} version
 *
 * @returns {addVersionInterceptor}
 */
function addVersionInterceptorFactory(version) {
  /**
   * Client-side `add version` interceptor
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
        metadata.set('version', version);
        next(metadata, listener);
      },
    };
    return new InterceptingCall(nextCall(options), methods);
  }

  return addVersionInterceptor;
}

module.exports = addVersionInterceptorFactory;
