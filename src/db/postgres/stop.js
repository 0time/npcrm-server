const { get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { POOL_END },
} = require('../../lib/constants');

module.exports = (context) => get(context, POOL_END)().then(() => context);
