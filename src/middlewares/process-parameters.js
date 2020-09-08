const {
  JSON_SELECTORS: { OPTIONS_ON_REQUEST },
} = require('../lib/constants');
const { pick, set } = require('@0ti.me/tiny-pfp');

module.exports = (context) => (req, res, next) => {
  const inputs = pick(req, ['body', 'params', 'query']);
  const options = Object.assign({}, inputs.params, inputs.query, inputs.body);

  context.logger.trace({ inputs, options });

  set(req, OPTIONS_ON_REQUEST, options);

  return next();
};
