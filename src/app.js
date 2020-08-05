const CONTEXT_DEFAULTS = require('./defaults/context');
const config = require('config');
const routes = require('./routes');

module.exports = appContext => {
  const context = Object.assign(
    {},
    CONTEXT_DEFAULTS,
    { config, routes },
    appContext,
  );

  return context.server.start(context);
};
