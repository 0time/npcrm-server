const nycConfig = require('@0ti.me/test-deps/configuration-templates/nyc.config');
const { NODE_ENV } = process.env;

let requiredPercent = 30;

if (NODE_ENV === 'unit') {
  requiredPercent = 10;
}

module.exports = Object.assign(
  {},
  nycConfig,
  nycConfig.setAllCategoriesTo(requiredPercent),
);

// This just prints everything if you execute this directly like so:
//   node nyc.config.js
if (require.main === module) {
  console.error(module.exports); // eslint-disable-line no-console
}
