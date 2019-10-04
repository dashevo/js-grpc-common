const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

/**
 * Load GRPC package definition
 *
 * @param {string} protoPath
 * @param {string} projectName
 * @param {string} version
 *
 * @return {*}
 */
function loadPackageDefinition(protoPath, projectName, version) {
  const definition = protoLoader.loadSync(protoPath, {
    keepCase: false,
    longs: String,
    enums: String,
    bytes: Uint8Array,
    defaults: true,
  });

  const packageDefinition = grpc.loadPackageDefinition(definition);

  return packageDefinition[`org.dash.platform.${projectName}.${version}`];
}

module.exports = loadPackageDefinition;
