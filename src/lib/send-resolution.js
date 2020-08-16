const { get } = require('@0ti.me/tiny-pfp');
const { INTERNAL_SERVER_ERROR, OK } = require('http-status-codes');
const parseResponse = require('./parse-response');

// The function should promise an object with a response (response for text or jsonRespone for json)
// and an optional status code (200 OK is assumed if absent)
module.exports = (context, fnMayPromise, singleArgumentCall = true) => (
  req,
  res,
  next,
) =>
  Promise.resolve()
    .then(() =>
      singleArgumentCall === true
        ? fnMayPromise({ context, next, req, res })
        : fnMayPromise(req, res, next, context),
    )
    .then((result) =>
      res.status(get(result, 'status', OK)).send(parseResponse(result)),
    )
    .then(() => next())
    .catch((error) => {
      context.logger.error({
        message: `This was an unhandled route implementation error detected in ${__filename}`,
        error,
      });

      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: 'Internal server error' });

      next();
    });
