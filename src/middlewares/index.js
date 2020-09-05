const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('./logger');

// Only put mandatory middlewares here, and put them in the order they should execute
module.exports = (context) => [
  logger(context),
  bodyParser.json(),
  cors(context.config.cors),
];
