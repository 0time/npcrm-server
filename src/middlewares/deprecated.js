const {
  HTTP_HEADERS: { DEPRECATED },
} = require('../lib/constants');

module.exports = (req, res, next) => {
  if (req.headersSent === true) {
    throw new Error(
      `${__filename.substr(
        __dirname.length + 1,
      )} middleware called after headers sent`,
    );
  }

  res.set(DEPRECATED, true);

  return next();
};
