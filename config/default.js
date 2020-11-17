const levels = require('./lib/logging-levels');
const util = require('util');

module.exports = {
  // express-style cors config https://npmjs.org/package/cors
  cors: {
    origin: '*',
  },
  db: {
    type: 'postgres',
    host: 'db',
    port: 5432,
    /** change me with config/local.js(on)? or process.env.DB_PASSWORD **/
    password: 'change-me',
    /** change me with config/local.js(on)? or process.env.DB_USER **/
    user: 'npcrm',
    /** database should match user for the DB to automatically be created **/
    database: 'npcrm',
  },
  enableDbVersioning: true,
  logger: {
    winstonFormats: [
      {
        fn: (info) => {
          if (info instanceof Error) {
            info.message = info.stack;
          } else if (typeof info.message === 'object') {
            info.message = util.inspect(info.message, { depth: 5 });
          }

          return info;
        },
      },
      { key: 'timestamp' },
      {
        key: 'printf',
        options: (info) => `${info.timestamp} ${info.level}: ${info.message}`,
      },
      { key: 'colorize', options: { all: true } },
      //{ key: 'cli', options: { all: true } },
    ],
    winstonTransportConfigs: [
      {
        key: 'Console',
        options: {
          handleExceptions: true,
          handleRejections: true,
        },
      },
    ],
    winston: {
      levels,
    },
    winstonColors: {
      levels,
      colors: {
        fatal: 'bold white redBG',
        alert: 'bold white yellowBG',
        error: 'bold red',
        warn: 'bold yellow',
        info: 'bold cyan',
        debug: 'cyan',
        trace: 'italic gray',
      },
    },
  },
  webServer: {
    basePath: '/api',
    port: 3000,
    startTimeoutMs: 5000,
    stopTimeoutMs: 5000,
  },
};
