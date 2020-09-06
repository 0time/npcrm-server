const express = require('express');
const { get, set } = require('@0ti.me/tiny-pfp');
const {
  HTTP_METHODS: { GET },
  JSON_SELECTORS: {
    EXPRESS_IMPLEMENTATION,
    HTTP_METHOD,
    MIDDLEWARES,
    ROUTE,
    WEB_SERVER_APP,
    WEB_SERVER_BASE_PATH,
    WEB_SERVER_CONNECTIONS,
    WEB_SERVER_INSTANCE,
    WEB_SERVER_START_TIMEOUT,
  },
} = require('../../../lib/constants');
const listen = require('./listen');
const logErrorMiddleware = require('../../../middlewares/log-error-middleware');
const onConnectionHandler = require('./instance-on-connection-handler');
const middlewares = require('../../../middlewares');
const processParameters = require('../../../middlewares/process-parameters');
const rejectAfterTimeout = require('../../../lib/reject-after-timeout');
const routes = require('../../../routes');

module.exports = (context) =>
  // Promise to resolve if the webServer starts
  // and reject if it fails to start
  new context.Promise((resolve, reject) => {
    let resolved = false;

    const timeout = get(context, WEB_SERVER_START_TIMEOUT);

    context.logger.trace(`Setting a rejection timeout for ${timeout}ms`);
    rejectAfterTimeout(context)({ reject, resolved, timeout });

    const app = express();
    const basePath = get(context, WEB_SERVER_BASE_PATH);
    const router = express.Router();

    middlewares(context).forEach((mw) => app.use(mw));

    // If not specified, we'll use these default middlewares to set up the routes,
    // if you set the MIDDLEWARES key and you want processParameters, be sure to specify it in your
    // MIDDLEWARES list.
    const DEFAULT_DYNAMIC_ROUTE_MIDDLEWARES = [processParameters(context)];

    // TODO: This needs work, probably. Nested keys would not work at all, I think.
    // Probably need to generalize this and put it into a library for re-use anyway.
    Object.values(routes)
      .map((ea) => ea(context))
      .forEach((route) => {
        const setupRoute = (routeConfig) => {
          const route = get(routeConfig, ROUTE, false);
          const impl = get(routeConfig, EXPRESS_IMPLEMENTATION, false);
          const mws = get(
            routeConfig,
            MIDDLEWARES,
            DEFAULT_DYNAMIC_ROUTE_MIDDLEWARES,
          );
          const method = get(routeConfig, HTTP_METHOD, GET);

          const register = (...expressCb) =>
            router[method](route, ...expressCb);

          return register(...mws, impl);
        };

        if (Array.isArray(route)) {
          return route.forEach(setupRoute);
        } else {
          return setupRoute(route);
        }
      });

    app.use(basePath, router);
    app.use(logErrorMiddleware(context));

    set(context, WEB_SERVER_APP, app);
    set(context, WEB_SERVER_CONNECTIONS, []);

    return listen(context).then(() => {
      const instance = get(context, WEB_SERVER_INSTANCE);

      instance.on('connection', onConnectionHandler(context));

      if (resolved === false) {
        resolved = true;
        resolve(context);
      }
    });
  });
