module.exports = {
  // express-style cors config https://npmjs.org/package/cors
  cors: {
    origin: '*',
  },
  server: {
    basePath: '/api',
    port: 53241,
    startTimeoutMs: 50,
    stopTimeoutMs: 50,
  },
};
