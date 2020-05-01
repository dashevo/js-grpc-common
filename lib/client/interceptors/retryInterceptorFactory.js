const grpc = require('grpc');

const {
  RequesterBuilder,
  ListenerBuilder,
  StatusBuilder,
  InterceptingCall,
} = require('grpc/src/client');

/**
 * Interceptor function factory
 *
 * @param {number} maxRetries
 *
 * @returns {retryInterceptor}
 */
function retryInterceptorFactory(maxRetries = 3) {
  /**
   * Interceptor function
   *
   * @typedef retryInterceptor
   *
   * @param {Object} options
   * @param {module:grpc.InterceptingCall} nextCall
   *
   * @returns {module:grpc.InterceptingCall}
   */
  function retryInterceptor(options, nextCall) {
    let savedMetadata;
    let savedSendMessage;
    let savedReceiveMessage;
    let savedMessageNext;

    const requester = (new RequesterBuilder())
      .withStart((topLevelMetadata, listener, topLevelNext) => {
        savedMetadata = topLevelMetadata;

        const newListener = (new ListenerBuilder())
          .withOnReceiveMessage((message, next) => {
            savedReceiveMessage = message;
            savedMessageNext = next;
          })
          .withOnReceiveStatus((status, next) => {
            let retries = 0;

            const retry = (message, metadata) => {
              retries++;

              const newCall = nextCall(options);

              let receivedMessage;
              newCall.start(metadata, {
                onReceiveMessage: (_message) => {
                  receivedMessage = _message;
                },
                onReceiveStatus: (_status) => {
                  if (_status.code !== grpc.status.OK) {
                    if (retries <= maxRetries) {
                      retry(message, metadata);
                    } else {
                      savedMessageNext(receivedMessage);
                      next(_status);
                    }
                  } else {
                    const newStatus = (new StatusBuilder())
                      .withCode(grpc.status.OK)
                      .build();
                    savedMessageNext(receivedMessage);
                    next(newStatus);
                  }
                },
              });
              newCall.sendMessage(message);
              newCall.halfClose();
            };

            if (status.code !== grpc.status.OK) {
              retry(savedSendMessage, savedMetadata);
            } else {
              savedMessageNext(savedReceiveMessage);
              next(status);
            }
          })
          .build();
        topLevelNext(topLevelMetadata, newListener);
      })
      .withSendMessage((message, next) => {
        savedSendMessage = message;
        next(message);
      })
      .build();

    return new InterceptingCall(nextCall(options), requester);
  }

  return retryInterceptor;
}

module.exports = retryInterceptorFactory;
