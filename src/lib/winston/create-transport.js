const { get } = require('@0ti.me/tiny-pfp');
const winston = require('winston');

const DEFAULT_TRANSPORT = 'Console';

module.exports = (config) =>
  new winston.transports[get(config, 'key', DEFAULT_TRANSPORT)](
    get(config, 'options', {}),
  );
