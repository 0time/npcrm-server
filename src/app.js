const CONTEXT_DEFAULTS = require('./defaults/context');
const config = require('config');
const db = require('../db');
const { get, set } = require('@0ti.me/tiny-pfp');
const initializeLogger = require('./lib/initialize-logger');
const {
  JSON_SELECTORS: { ENABLE_DB_VERSIONING, POSTGRES_DB_VERSIONING },
} = require('./lib/constants');
const merge = require('lodash.merge');
const postgresDbVersioning = require('@0ti.me/postgres-db-versioning');
const routes = require('./routes');
const testLogger = require('./lib/test-logger');

const {
  env: { NODE_ENV },
} = process;

module.exports = (context) =>
  Promise.resolve()
    .then(() =>
      Object.assign(
        context,
        merge({}, CONTEXT_DEFAULTS, { config, routes }, context),
      ),
    )
    .then(initializeLogger)
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
      // eslint-disable-next-line no-console
      console.error('early error detected above, exiting hard');

      process.exit(0);
    })
    .then(() => context.logger.info(`Starting up in ${NODE_ENV}`))
    /* This is a silly call just to make a noisy logger (if configured) so we can validate coloring and formatting */
    .then(() => testLogger(context))
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
