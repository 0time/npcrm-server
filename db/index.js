const { get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { LOGGER, POOL_KEY },
} = require('../src/lib/constants');
const migrations = require('./migrations');
const scratch = require('./scratch');

module.exports = (context) => ({
  connectionConfig: null,
  logger: get(context, LOGGER),
  migrations,
  // To backtest an older version of the DB, try using requestedVersion
  // requestedVersion: 4
  pool: get(context, POOL_KEY),
  scratch,
  // This version should be set at the migration equivalent of the state of the scratch array
  version: 4,
});
