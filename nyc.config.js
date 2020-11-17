const nycConfig = require('@0ti.me/test-deps/configuration-templates/nyc.config');
const { NODE_ENV } = process.env;

let nycOverrides = {};

if (NODE_ENV === 'unit') {
  nycOverrides = nycConfig.setAllCategoriesTo(70);
}

module.exports = Object.assign({}, nycConfig, nycOverrides);

// This just prints everything if you execute this directly like so:
//   node nyc.config.js
if (require.main === module) {
  console.error(module.exports); // eslint-disable-line no-console
}
