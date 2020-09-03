const {
  HTTP_METHODS: { GET },
} = require('../lib/constants');
const sendResolution = require('../lib/send-resolution');

module.exports = (context) => ({
  route: '/hello-world',
  method: GET,
  impl: sendResolution(context, () =>
    context.Promise.resolve({ jsonResponse: { msg: 'hello world' } }),
  ),
});
