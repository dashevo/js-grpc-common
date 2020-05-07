const { InterceptingCall } = require('grpc');

/**
 * Client-side metadata interceptor
 * @param {Object} options
 * @param {module:grpc.InterceptingCall} nextCall
 * @return {module:grpc.InterceptingCall}
 */
function addMetadataInterceptor(options, nextCall) {
  const methods = {
    start(metadata, listener, nextStart) {
      nextStart(metadata, {
        onReceiveMetadata(data, next) {
          this.metadata = data;
          next(data);
        },
        onReceiveMessage(response, next) {
          if (!response) {
            return next();
          }

          response.metadata = this.metadata;
          delete this.metadata;

          return next(response);
        },
      });
    },
  };
  return new InterceptingCall(nextCall(options), methods);
}

module.exports = addMetadataInterceptor;
