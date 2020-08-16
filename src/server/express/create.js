const express = require('express');
const { get } = require('@0ti.me/tiny-pfp');
const middlewares = require('../../middlewares');
const routes = require('../../routes');

module.exports = () => {
  let connections = [];
  let server = null;

  return {
    start: (context) => {
      const app = express();
      const router = express.Router();

      let resolved = false;

      // Promise to resolve if the server starts
      // and reject if it fails to start
      return new context.Promise((resolve, reject) => {
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            reject(new Error('Express server start timeout limit exceeded'));
          }
        }, context.config.server.startTimeoutMs);

        middlewares(context).forEach((mw) => app.use(mw));

        // TODO: This needs work, probably. Nested keys would not work at all, I think.
        // Probably need to generalize this and put it into a library for re-use anyway.
        Object.values(routes)
          .map((ea) => ea(context))
          .forEach((routeConfig) =>
            router[get(routeConfig, 'method', 'get')](
              get(routeConfig, 'route'),
              get(routeConfig, 'impl'),
            ),
          );

        router.use(require('../../middlewares/logger')(context));

        const errorMiddleware = (err, req, res, next) => {
          context.logger.error(
            new Date().toISOString(),
            req.ip,
            req.method,
            req.path,
            err,
          );

          return next(err);
        };

        router.use(errorMiddleware);

        app.use(context.config.server.basePath, router);

        app.use(require('../../middlewares/logger')(context));

        app.use(errorMiddleware);

        server = app.listen(context.config.server.port, () => {
          resolved = true;

          context.logger.info(
            `Server is up and listening on ${context.config.server.port}`,
          );

          resolve(context);
        });

        server.on('connection', (connection) => {
          connections.push(connection);
          connection.on(
            'close',
            () =>
              (connections = connections.filter((curr) => curr !== connection)),
          );
        });
      });
    },
    stop: (context) => {
      return new context.Promise((resolve, reject) => {
        let resolved = false;

        if (server) {
          server.close(() => {
            resolved = true;

            resolve(context);
          });

          server.on('connection', (connection) => {
            connections.push(connection);
            connection.on(
              'close',
              () =>
                (connections = connections.filter(
                  (curr) => curr !== connection,
                )),
            );
          });
        }

        setTimeout(() => {
          if (!resolved) {
            resolved = true;

            context.process.exit(-1);

            reject(
              new Error(
                `Express server stop timeout limit exceeded (${context.config.server.stopTimeoutMs})`,
              ),
            );
          }
        }, context.config.server.stopTimeoutMs);
      });
    },
  };
};
