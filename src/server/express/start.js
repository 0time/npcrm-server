const express = require('express');
const { get, set } = require('@0ti.me/tiny-pfp');
const {
  HTTP_METHODS: { GET },
  JSON_SELECTORS: {
    APP,
    EXPRESS_IMPLEMENTATION,
    HTTP_METHOD,
    MIDDLEWARES,
    ROUTE,
    WEB_SERVER_START_TIMEOUT,
  },
} = require('../../lib/constants');
const middlewares = require('../../middlewares');
const processParameters = require('../../middlewares/process-parameters');
const rejectAfterTimeout = require('../../lib/reject-after-timeout');
const routes = require('../../routes');

module.exports = (context) => {
  const app = express();
  const router = express.Router();

  set(context, APP, app);

  // Promise to resolve if the webServer starts
  // and reject if it fails to start
  return new context.Promise((resolve, reject) => {
    let resolved = false;

    const timeout = get(context, WEB_SERVER_START_TIMEOUT);

    rejectAfterTimeout(context)({ reject, resolved, timeout });

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

    const errorMiddleware = (err, req, res, next) => {
      context.logger.error(err);

      return next(err);
    };

    app.use(context.config.webServer.basePath, router);

    app.use(errorMiddleware);

    context.webServer.instance = app.listen(
      context.config.webServer.port,
      () => {
        resolved = true;

        context.logger.info(
          `Server is up and listening on ${context.config.webServer.port}`,
        );

        resolve(context);
      },
    );

    context.webServer.connections = [];

    context.webServer.instance.on('connection', (connection) => {
      context.webServer.connections.push(connection);
      connection.on(
        'close',
        () =>
          (context.webServer.connections = context.webServer.connections.filter(
            (curr) => curr !== connection,
          )),
      );
    });
  });
};
