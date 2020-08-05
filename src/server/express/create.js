const express = require('express');
const middlewares = require('../../middlewares');
const routes = require('../../routes');

module.exports = () => {
  let connections = [];
  let server = null;

  return {
    start: context => {
      const app = express();
      const router = express.Router();

      let resolved = false;

      return new Promise((resolve, reject) => {
        setTimeout(() => {
          if (!resolved) {
            resolved = true;
            reject(new Error('Express server start timeout limit exceeded'));
          }
        }, context.config.startTimeoutMs);

        middlewares(context).forEach(mw => app.use(mw));

        routes(context).forEach(({ impl, method, route }) =>
          router[method](route, impl),
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

        server.on('connection', connection => {
          connections.push(connection);
          connection.on(
            'close',
            () =>
              (connections = connections.filter(curr => curr !== connection)),
          );
        });
      });
    },
    stop: context => {
      return new Promise((resolve, reject) => {
        let server = null;

        let resolved = false;

        if (server) {
          server.close(() => {
            resolved = true;

            resolve(context);
          });

          server.on('connection', connection => {
            connections.push(connection);
            connection.on(
              'close',
              () =>
                (connections = connections.filter(curr => curr !== connection)),
            );
          });
        }

        setTimeout(() => {
          if (!resolved) {
            resolved = true;

            context.process.exit(-1);

            reject(new Error('Express server stop timeout limit exceeded'));
          }
        }, context.config.stopTimeoutMs);
      });
    },
  };
};
