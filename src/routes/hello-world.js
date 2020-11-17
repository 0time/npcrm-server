const {
  HTTP_METHODS: { GET },
  JSON_SELECTORS: { EXPRESS_IMPLEMENTATION, HTTP_METHOD, ROUTE },
} = require('../lib/constants');
const sendResolution = require('../lib/send-resolution');

module.exports = (context) => ({
  [ROUTE]: '/hello-world',
  [HTTP_METHOD]: GET,
  [EXPRESS_IMPLEMENTATION]: sendResolution(context, () =>
    context.Promise.resolve({ jsonResponse: { msg: 'hello world' } }),
  ),
});
