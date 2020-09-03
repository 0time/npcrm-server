const CONTEXT_DEFAULTS = require('./defaults/context');
const config = require('config');
const db = require('../db');
const { get, set } = require('@0ti.me/tiny-pfp');
const initializeLogger = require('./lib/initialize-logger');
const {
  JSON_SELECTORS: { ENABLE_DB_VERSIONING, POSTGRES_DB_VERSIONING, TEST_LOGGER },
} = require('./lib/constants');
const merge = require('lodash.merge');
const postgresDbVersioning = require('@0ti.me/postgres-db-versioning');
const routes = require('./routes');
const testLogger = require('./lib/test-logger');

const {
  env: { NODE_ENV },
} = process;

module.exports = (context) => {
  let tempContext = merge({}, CONTEXT_DEFAULTS, { config, routes }, context);

  initializeLogger(tempContext);

  Object.assign(context, merge(tempContext, context));

  const shouldTestLogger = get(context, TEST_LOGGER, false) === true;

  return Promise.resolve()
    .then(() => context.logger.info(`Starting up in ${NODE_ENV}`))
    .then(() => (shouldTestLogger ? testLogger(context) : null))
    .then(() => context.dbConnPool.start(context))
    .catch((err) => context.logger.fatal(err))
    .then(() => context.webServer.start(context))
    .catch((err) => context.logger.fatal(err))
    .then(() => {
      if (get(context, ENABLE_DB_VERSIONING, false) === true) {
        const versioningConfig = db(context);

        set(context, POSTGRES_DB_VERSIONING, versioningConfig);

        return postgresDbVersioning(versioningConfig)
          .catch((err) => context.logger.fatal(err))
          .then(() => context);
      }

      return context;
    });
};
