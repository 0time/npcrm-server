const createFormat = require('./create-format');
const createTransport = require('./create-transport');
const { get } = require('@0ti.me/tiny-pfp');
const winston = require('winston');

module.exports = (context) =>
  Object.assign({}, get(context, 'config.logger.winston', {}), {
    format: winston.format.combine(
      ...get(context, 'config.logger.winstonFormats', []).map(createFormat),
    ),
    transports: get(context, 'config.logger.winstonTransportConfigs', []).map(
      createTransport,
    ),
  });
