const CONTEXT_DEFAULTS = require('./defaults/context');
const config = require('config');
const merge = require('lodash.merge');
const routes = require('./routes');

module.exports = (appContext) => {
  const context = merge({}, CONTEXT_DEFAULTS, { config, routes }, appContext);

  return context.server.start(context);
};
