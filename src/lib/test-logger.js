/* istanbul ignore file */
const { get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { TEST_LOGGER },
} = require('./constants');
const loggingLevels = require('../../config/lib/logging-levels');

module.exports = (context) => {
  try {
    const shouldTestLogger = get(context, TEST_LOGGER, false) === true;

    if (shouldTestLogger) {
      Object.keys(loggingLevels).forEach((level) => {
        context.logger[level](`testing log level ${level} with a string`);
        context.logger[level](
          new Error(`testing log level ${level} with an error`),
        );
        context.logger[level]({
          msg: `testing log level ${level} with an object`,
        });
      });
    }
  } catch (err) {
    try {
      context.logger.debug(err);
    } catch (ign) {
      // Since we're struggling to log, just swallow the error
    }
  }
};
