const routeTestCreator = require('../../lib/route-test-creator');

routeTestCreator({
  lowerSnakeCase: 'donor',
  me: __filename,
  upperCamelCase: 'Donor',
});
