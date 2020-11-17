const { get, set } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { WEB_SERVER_CONNECTIONS },
} = require('../../../lib/constants');

module.exports = (context) => (connection) => {
  const connections = get(context, WEB_SERVER_CONNECTIONS);

  connections.push(connection);

  connection.on('close', () =>
    set(
      context,
      WEB_SERVER_CONNECTIONS,
      connections.filter((curr) => curr !== connection),
    ),
  );
};
