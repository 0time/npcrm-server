const { get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { POOL, TABLE_NAME },
} = require('../constants');

module.exports = (context, config) => (model) => {
  const pool = get(context, POOL, false);
  const tableName = get(config, TABLE_NAME, false);

  if (!pool) {
    throw new Error(
      `Could not find a pool on the context object with keys: "${Object.keys(
        context,
      )}"`,
    );
  }

  if (!pool.query) {
    throw new Error(`pool.query is missing ${Object.keys(pool)}`);
  }

  /*
  if (!Object.prototype.hasOwnProperty.call(pool.query, 'call')) {
    throw new Error('pool.query is not a function');
  }
  */

  if (!tableName) {
    throw new Error(
      `Table name was not defined in the options "${JSON.stringify(config)}"`,
    );
  }

  return model;
};
