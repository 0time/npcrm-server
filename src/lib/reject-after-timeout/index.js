const configureHandler = require('./configure-handler');

module.exports = (context) => (obj) =>
  context.setTimeout(configureHandler(obj), obj.timeout);
