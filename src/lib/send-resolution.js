const { get } = require('@0ti.me/tiny-pfp');
const { INTERNAL_SERVER_ERROR, OK } = require('http-status-codes');
const parseResponse = require('./parse-response');

// The function should promise an object with a response (response for text or jsonRespone for json)
// and an optional status code (OK is assumed if absent)
module.exports = (context, fnMayPromise, singleArgumentCall = true) => (
  req,
  res,
  next,
) =>
  context.Promise.resolve()
    .then(() =>
      singleArgumentCall === true
        ? fnMayPromise({ context, next, req, res })
        : fnMayPromise(req, res, next, context),
    )
    .then((result) => {
      const response = parseResponse(result);

      context.logger.trace({ response, result });

      return res.status(get(result, 'status', OK)).send(response);
    })
    .then(() => next())
    .catch((error) => {
      context.logger.error(error);

      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Internal server error' });

      next();
    });
