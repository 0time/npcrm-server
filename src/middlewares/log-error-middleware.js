module.exports = (context) => (err, req, res, next) => {
  context.logger.error(err);

  return next(err);
};
