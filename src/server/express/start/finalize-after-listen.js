const { get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { WEB_SERVER_INSTANCE },
} = require('../../../lib/constants');
const onConnectionHandler = require('./instance-on-connection-handler');

module.exports = (context, obj) => {
  const instance = get(context, WEB_SERVER_INSTANCE);

  instance.on('connection', onConnectionHandler(context));

  if (obj.resolved === false) {
    obj.resolved = true;
    obj.resolve(context);
  }
};
