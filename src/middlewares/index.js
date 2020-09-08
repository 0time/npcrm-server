const bodyParser = require('body-parser');
const cors = require('cors');
const { get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { CORS_CONFIG },
} = require('../lib/constants');
const logger = require('./logger');

// Only put mandatory middlewares here, and put them in the order they should execute
module.exports = (context) => [
  logger(context),
  cors(get(context, CORS_CONFIG)),
  bodyParser.json(),
];
