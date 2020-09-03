const loggingLevels = require('../../config/lib/logging-levels');
const { mapValues } = require('@0ti.me/tiny-pfp');

const {
  env: { TESTING_VERBOSE },
} = process;

const { _ } = deps;

let savedLoggers = [];

module.exports = () => {
  const logger = mapValues(loggingLevels, () => {
    const args = [];

    const logFn = (...callArgs) => {
      args.push(
        _.clone(
          callArgs.map((ea) => {
            if (_.isError(ea)) {
              return ea.stack.split('\n');
            } else {
              return ea;
            }
          }),
        ),
      );
    };

    logFn.args = args;

    return logFn;
  });

  savedLoggers.push(logger);

  return logger;
};

afterEach(function () {
  if (TESTING_VERBOSE !== undefined || this.currentTest.state === 'failed') {
    const logs = [];

    savedLoggers.forEach((logger, i1) =>
      mapValues(logger, (fn, level) =>
        fn.args.length > 0
          ? logs.push(
              `${level} [i1: ${i1}]: ${JSON.stringify(fn.args, null, 2)}`,
            )
          : fn,
      ),
    );

    // eslint-disable-next-line no-console
    console.error(logs.join('\n'));
  }

  savedLoggers = [];
});
