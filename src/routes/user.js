const { get } = require('@0ti.me/tiny-pfp');
const {
  HTTP_METHODS: { GET },
  JSON_SELECTORS: { POOL_QUERY },
} = require('../lib/constants');
const sendResolution = require('../lib/send-resolution');

module.exports = (context) => ({
  route: '/user',
  method: GET,
  impl: sendResolution(context, () => get(context, POOL_QUERY)('SELECT 1')),
});
