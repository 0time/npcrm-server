const { bluebird } = deps;

const app = require('../../src/app');
const config = require('config');
const getMockDbConnPool = require('./get-mock-db-conn-pool');
const getMockLogger = require('./get-mock-logger');
const getMockProcess = require('./get-mock-process');
const { get, has, set } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { APP, LOGGER, POOL },
} = require('../../src/lib/constants');
const supertest = require('supertest');

let savedContext = null;
let instance = null;

const initializeSupertest = (context) =>
  bluebird
    .try(() => {
      if (instance !== null) {
        // stop and restart the server
        return savedContext.webServer.stop(savedContext);
      }
    })
    .then(() => {
      if (context === null || context === undefined) {
        throw new Error(
          'initialize the context to an object so you can use its properties',
        );
      }

      savedContext = context;

      if (!has(context, POOL)) {
        set(context, POOL, getMockDbConnPool());
      }

      if (!has(context, LOGGER)) {
        set(context, LOGGER, getMockLogger());
      }

      if (!has(context, 'process')) {
        set(context, 'process', getMockProcess());
      }

      if (!has(context, 'config')) {
        set(context, 'config', config);
      }

      return app(context).then(() => {
        instance = supertest(get(context, APP));

        return instance;
      });
    });

module.exports = () => {
  if (instance === null) {
    return initializeSupertest({});
  }

  return Promise.resolve(instance);
};

module.exports.initializeSupertest = initializeSupertest;

after(() => {
  if (instance !== null) {
    return savedContext.webServer.stop(savedContext);
  }
});
