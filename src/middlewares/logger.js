module.exports = context => (req, _, next) => {
  try {
    context.logger.info(new Date().toISOString(), req.ip, req.method, req.path);
  } catch (err) {
    context.logger.error(err);
  }

  next();
};
