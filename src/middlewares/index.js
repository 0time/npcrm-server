const cors = require('cors');
const logger = require('./logger');

module.exports = context => [logger(context), cors(context.config.cors)];
