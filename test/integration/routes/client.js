const routeTestCreator = require('../../lib/route-test-creator');

routeTestCreator({
  lowerSnakeCase: 'client',
  me: __filename,
  upperCamelCase: 'Client',
});
