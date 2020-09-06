const { get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { WEB_SERVER_PORT },
} = require('../../../lib/constants');

module.exports = (context, resolve) => () => {
  const port = get(context, WEB_SERVER_PORT);

  context.logger.info(`Server is up and listening on ${port}`);

  resolve(context);
};
