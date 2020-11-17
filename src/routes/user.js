const { get } = require('@0ti.me/tiny-pfp');
const {
  HTTP_METHODS: { GET },
  JSON_SELECTORS: { EXPRESS_IMPLEMENTATION, HTTP_METHOD, POOL_QUERY, ROUTE },
} = require('../lib/constants');
const sendResolution = require('../lib/send-resolution');

module.exports = (context) => ({
  [ROUTE]: '/user',
  [HTTP_METHOD]: GET,
  [EXPRESS_IMPLEMENTATION]: sendResolution(context, () =>
    get(context, POOL_QUERY)('SELECT 1'),
  ),
});
