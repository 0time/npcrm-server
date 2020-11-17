const routeTestCreator = require('../../lib/route-test-creator');

routeTestCreator({
  lowerSnakeCase: 'staff',
  me: __filename,
  upperCamelCase: 'Staff',
});
