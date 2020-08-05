const sendResolution = require('./lib/send-resolution');

module.exports = context => [
  {
    route: '/hello-world',
    method: 'get',
    impl: sendResolution(context, () =>
      context.Promise.resolve({ jsonResponse: { msg: 'hello world' } }).then(
        x => console.error(x) || x,
      ),
    ),
  },
];
