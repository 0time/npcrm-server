module.exports = {
  // express-style cors config https://npmjs.org/package/cors
  cors: {
    origin: '*',
  },
  server: {
    basePath: '/api',
    port: 3000,
    startTimeoutMs: 5000,
    stopTimeoutMs: 5000,
  },
};
