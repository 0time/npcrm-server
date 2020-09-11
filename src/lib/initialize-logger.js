const { get, has, set } = require('@0ti.me/tiny-pfp');
const getWinstonConfig = require('./winston/get-winston-config');
const winston = require('winston');

module.exports = (context) => {
  if (has(context, 'logger') === false) {
    set(context, 'logger', winston.createLogger(getWinstonConfig(context)));

    winston.addColors(get(context, 'config.logger.winstonColors'));
  }

  return context;
};
