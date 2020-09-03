const { get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { POOL_QUERY },
} = require('../lib/constants');
const sendResolution = require('../lib/send-resolution');

module.exports = (context) => ({
  route: '/user',
  method: 'get',
  impl: sendResolution(context, () => get(context, POOL_QUERY)('SELECT 1')),
});
