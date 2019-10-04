const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

/**
 * Load GRPC package definition
 *
 * @param {string} protoPath
 *
 * @return {*}
 */
function loadPackageDefinition(protoPath) {
  const definition = protoLoader.loadSync(protoPath, {
    keepCase: false,
    longs: String,
    enums: String,
    bytes: Uint8Array,
    defaults: true,
  });

  const packageDefinition = grpc.loadPackageDefinition(definition);

  return packageDefinition;
}

module.exports = loadPackageDefinition;
