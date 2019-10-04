const jsonToProtobufFactory = require('./lib/client/converters/jsonToProtobufFactory');
const protobufToJsonFactory = require('./lib/client/converters/protobufToJsonFactory');
const jsonToProtobufInterceptorFactory = require(
  './lib/client/interceptors/jsonToProtobufInterceptorFactory',
);

const createServer = require('./lib/server/createServer');
const jsonToProtobufHandlerWrapper = require(
  './lib/server/jsonToProtobufHandlerWrapper',
);
const wrapInErrorHandlerFactory = require('./lib/server/error/wrapInErrorHandlerFactory');

module.exports = {
  client: {
    converters: {
      jsonToProtobufFactory,
      protobufToJsonFactory,
    },
    interceptors: {
      jsonToProtobufInterceptorFactory,
    },
  },
  server: {
    createServer,
    jsonToProtobufHandlerWrapper,
    error: {
      wrapInErrorHandlerFactory,
    },
  },
};
