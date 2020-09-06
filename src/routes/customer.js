const deprecated = require('../middlewares/deprecated');
const {
  HTTP_METHODS: { GET },
  JSON_SELECTORS: { EXPRESS_IMPLEMENTATION, HTTP_METHOD, MIDDLEWARES, ROUTE },
} = require('../lib/constants');
const sendResolution = require('../lib/send-resolution');

module.exports = (context) => ({
  [ROUTE]: '/customer',
  [MIDDLEWARES]: [deprecated],
  [HTTP_METHOD]: GET,
  [EXPRESS_IMPLEMENTATION]: sendResolution(context, () => [
    {
      name: 'Fred',
    },
    {
      name: 'John',
    },
  ]),
});
