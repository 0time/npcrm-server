const { get, has } = require('@0ti.me/tiny-pfp');
const winston = require('winston');

module.exports = (config) =>
  (has(config, 'fn')
    ? winston.format(get(config, 'fn'))
    : winston.format[get(config, 'key')])(get(config, 'options', {}));
