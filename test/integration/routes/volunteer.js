const routeTestCreator = require('../../lib/route-test-creator');

routeTestCreator({
  lowerSnakeCase: 'volunteer',
  me: __filename,
  upperCamelCase: 'Volunteer',
});
