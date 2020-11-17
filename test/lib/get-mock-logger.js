const loggingLevels = require('../../config/lib/logging-levels');
const { mapValues } = require('@0ti.me/tiny-pfp');

const {
  env: { TESTING_VERBOSE },
} = process;

const { _ } = deps;

let savedLoggers = [];

module.exports = () => {
  const orderedArgs = [];

  const logger = mapValues(loggingLevels, (value, level) => {
    const args = [];

    const logFn = (...callArgs) => {
      const orderedArg = {
        level,
        message: _.clone(
          callArgs.map((ea) => {
            if (_.isError(ea)) {
              return ea.stack.split('\n');
            } else {
              return ea;
            }
          }),
        ),
      };

      args.push(_.clone(callArgs));
      orderedArgs.push(orderedArg);
    };

    logFn.args = args;

    return logFn;
  });

  logger.orderedArgs = orderedArgs;

  savedLoggers.push(logger);

  return logger;
};

afterEach(function () {
  if (TESTING_VERBOSE !== undefined || this.currentTest.state === 'failed') {
    const logs = ['', '=== All Logs ==='];

    savedLoggers.forEach((logger, i1) =>
      logger.orderedArgs.forEach((args) =>
        logs.push(`${args.level} [i1: ${i1}]: ${JSON.stringify(args.message)}`),
      ),
    );

    if (logs.length > 2) {
      logs.push('=== End of Logs ====');
      logs.push('');

      // eslint-disable-next-line no-console
      console.error(logs.join('\n'));

      logs[0] = '\n';

      this.currentTest.err.message += logs.join('\n');
    }
  }

  savedLoggers = [];
});
