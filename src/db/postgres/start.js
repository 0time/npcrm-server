const { get, mapValues, set } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { POOL_CONF, POOL_END, POOL_KEY, POOL_QUERY },
} = require('../../lib/constants');
const { Pool } = require('pg');

module.exports = (context) =>
  new context.Promise((resolve) => {
    const dbConf = get(context, POOL_CONF);
    const pool = new Pool(dbConf);

    const query = (...args) => {
      context.logger.debug({ query: args });

      return pool.query(...args);
    };

    const end = (...args) => pool.end(...args);

    context.logger.debug(
      mapValues(dbConf, (_, key) =>
        key === 'password' ? '<omitted protected value from log>' : _,
      ),
    );

    set(context, POOL_KEY, pool);
    set(context, POOL_QUERY, query);
    set(context, POOL_END, end);

    resolve(query('SELECT 1'));
  });
