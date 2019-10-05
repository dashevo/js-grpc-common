const grpc = require('grpc');

const {
  service: healthCheckServiceDefinition,
  Implementation: HealthCheck,
} = require('grpc-health-check/health');

const {
  HealthCheckResponse: { ServingStatus: healthCheckStatuses },
} = require('grpc-health-check/v1/health_pb');

const loadPackageDefinition = require('../loadPackageDefinition');

/**
 * Create GRPC server with a health check service
 *
 * @typedef createServer
 *
 * @param {string} projectName
 * @param {string} serviceName
 * @param {string} version
 * @param {string} protoPath
 * @param {Object.<string, Function>} handlers
 *
 * @return {module:grpc.Server}
 */
function createServer(projectName, serviceName, version, protoPath, handlers) {
  const statusMap = {
    '': healthCheckStatuses.SERVING,
    [`org.dash.platform.${projectName}.v${version}.${serviceName}`]: healthCheckStatuses.SERVING,
  };

  const Service = loadPackageDefinition(
    protoPath,
    `org.dash.platform.${projectName}.v${version}`,
  )[serviceName];

  const server = new grpc.Server();
  server.addService(healthCheckServiceDefinition, new HealthCheck(statusMap));
  server.addService(Service.service, handlers);

  return server;
}

module.exports = createServer;
