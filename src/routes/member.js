const {
  HTTP_METHODS: { DELETE, GET, PUT },
} = require('../lib/constants');
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

const MEMBER_ROUTE = '/member';

module.exports = (context) => [
  {
    route: MEMBER_ROUTE,
    method: GET,
    impl: sendResolution(context, ({ req }) =>
      member(context).get(getOptions(context, req)),
    ),
  },
  {
    route: MEMBER_ROUTE,
    method: PUT,
    impl: sendResolution(context, ({ req }) =>
      member(context).put(getOptions(context, req)),
    ),
  },
  {
    route: MEMBER_ROUTE,
    method: DELETE,
    impl: sendResolution(context, ({ req }) =>
      member(context).delete(getOptions(context, req)),
    ),
  },
];
