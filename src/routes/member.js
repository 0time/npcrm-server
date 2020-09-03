const member = require('../lib/model/member');
const { pick } = require('@0ti.me/tiny-pfp');
const sendResolution = require('../lib/send-resolution');

// This should be a middleware with validation based on the method of the request.
const getOptions = (context, req) => {
  const inputs = pick(req, ['body', 'params', 'query']);
  const options = Object.assign({}, inputs.params, inputs.query, inputs.body);

  context.logger.trace({ inputs, options });

  return options;
};

module.exports = (context) => [
  {
    route: '/member',
    method: 'get',
    impl: sendResolution(context, ({ req }) =>
      member(context).get(getOptions(context, req)),
    ),
  },
  {
    route: '/member',
    method: 'put',
    impl: sendResolution(context, ({ req }) =>
      member(context).put(getOptions(context, req)),
    ),
  },
  {
    route: '/member',
    method: 'delete',
    impl: sendResolution(context, ({ req }) =>
      member(context).delete(getOptions(context, req)),
    ),
  },
];
