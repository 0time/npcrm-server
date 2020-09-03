const { pick } = require('@0ti.me/tiny-pfp');

module.exports = (context) => (req, _, next) => {
  try {
    context.logger.info({
      message: Object.assign(
        {
          message: 'Logger express middleware triggered',
        },
        pick(req, [
          'connection.remoteAddress',
          'ip',
          'headers',
          'method',
          'url',
        ]),
      ),
    });
  } catch (err) {
    context.logger.error(err);
  }

  next();
};
