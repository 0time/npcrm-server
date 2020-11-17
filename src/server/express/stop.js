const { get } = require('@0ti.me/tiny-pfp');
const rejectAfterTimeout = require('../../lib/reject-after-timeout');

module.exports = (context) => {
  return new context.Promise((resolve, reject) => {
    context.logger.info('Server shutting down');

    let resolved = false;

    const timeout = get(context, 'config.webServer.stopTimeoutMs');

    rejectAfterTimeout(context)({ reject, resolved, timeout });

    if (context.webServer.instance) {
      const handler = () => {
        if (!resolved) {
          resolved = true;

          resolve(context);
        }
      };

      context.webServer.instance.on('close', handler);

      context.webServer.instance.close();
    }

    setTimeout(() => {
      if (!resolved) {
        resolved = true;

        context.process.exit(127);

        reject(
          new Error(
            `Express webServer stop timeout limit exceeded (${context.config.webServer.stopTimeoutMs})`,
          ),
        );
      }
    }, context.config.webServer.stopTimeoutMs);
  }).catch((err) => {
    context.process.exit(127);

    throw err;
  });
};
