const customFormatters = require('./custom-formatters');
const { get } = require('@0ti.me/tiny-pfp');
const winston = require('winston');

module.exports = (config) => {
  const key = get(config, 'key', '');

  const winstonFormatIt = (x) => (x ? winston.format(x) : x);

  const fn = winstonFormatIt(get(config, 'fn'));
  const winstonFormat = get(winston, `format.${key}`);
  const customFormat = winstonFormatIt(get(customFormatters, key));

  const result = [fn, winstonFormat, customFormat].reduce(
    (acc, ea) => acc || ea,
  );

  if (!result) {
    throw new Error(
      `Invalid config ${JSON.stringify({
        config,
        customFormat,
        fn,
        winstonFormat,
      })}`,
    );
  }

  return result(get(config, 'options', {}));
};
