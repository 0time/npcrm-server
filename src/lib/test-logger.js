const loggingLevels = require('../../config/lib/logging-levels');

module.exports = (context) => {
  Object.keys(loggingLevels).forEach((level) => {
    context.logger[level]('testing log level with a string');
    context.logger[level](new Error('testing log level with an error'));
    context.logger[level]({ msg: 'testing log level with an object' });
  });
};
