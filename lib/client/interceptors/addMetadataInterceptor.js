const { InterceptingCall, status: grpcStatus } = require('grpc');

/**
 * Client-side metadata interceptor
 * @param {Object} options
 * @param {module:grpc.InterceptingCall} nextCall
 * @return {module:grpc.InterceptingCall}
 */
function addMetadataInterceptor(options, nextCall) {
  const methods = {
    start(metadata, listener, nextStart) {
      let receivedMessage;
      let receiveNext;

      nextStart(metadata, {
        onReceiveMessage(message, next) {
          receivedMessage = message;
          receiveNext = next;
        },
        onReceiveStatus(status, next) {
          if (status.code === grpcStatus.OK) {
            if (receivedMessage) {
              receivedMessage.metadata = status.metadata;
              receiveNext(receivedMessage);
            } else {
              receiveNext();
            }
          }

          next(status);
        },
      });
    },
  };
  return new InterceptingCall(nextCall(options), methods);
}

module.exports = addMetadataInterceptor;
