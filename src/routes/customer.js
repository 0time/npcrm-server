const sendResolution = require('../lib/send-resolution');

module.exports = (context) => ({
  route: '/customer',
  method: 'get',
  impl: sendResolution(context, () => [
    {
      name: 'Fred',
    },
    {
      name: 'John',
    },
  ]),
});
