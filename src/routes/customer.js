const {
  HTTP_METHODS: { GET },
} = require('../lib/constants');
const sendResolution = require('../lib/send-resolution');

module.exports = (context) => ({
  route: '/customer',
  method: GET,
  impl: sendResolution(context, () => [
    {
      name: 'Fred',
    },
    {
      name: 'John',
    },
  ]),
});
