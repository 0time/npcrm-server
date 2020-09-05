module.exports = {
  // express-style cors config https://npmjs.org/package/cors
  cors: {
    origin: '*',
  },
  enableDbVersioning: false,
  webServer: {
    basePath: '/api',
    port: 53241,
    startTimeoutMs: 500,
    stopTimeoutMs: 50,
  },
};
