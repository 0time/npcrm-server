const { get, set } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { WEB_SERVER_APP, WEB_SERVER_INSTANCE, WEB_SERVER_PORT },
} = require('../../../lib/constants');
const listenCallback = require('./listen-callback');

module.exports = (context) =>
  new context.Promise((resolve) => {
    const port = get(context, WEB_SERVER_PORT);
    const instance = get(context, WEB_SERVER_APP).listen(
      port,
      listenCallback(context, resolve),
    );

    set(context, WEB_SERVER_INSTANCE, instance);
  });
