const routeTestCreator = require('../../lib/route-test-creator');

routeTestCreator({
  lowerSnakeCase: 'member',
  me: __filename,
  upperCamelCase: 'Member',
});
