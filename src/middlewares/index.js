const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('./logger');

module.exports = (context) => [
  logger(context),
  bodyParser.json(),
  cors(context.config.cors),
];
