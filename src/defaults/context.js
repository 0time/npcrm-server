const express = require('../server/express');
const postgres = require('../db/postgres');

module.exports = {
  dbConnPool: postgres,
  process,
  Promise,
  setTimeout,
  webServer: express,
};
