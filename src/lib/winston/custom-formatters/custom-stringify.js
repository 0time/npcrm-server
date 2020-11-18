const merge = require('lodash.merge');
const util = require('util');

const defaultOptions = {
  utilInspectOptions: {
    breakLength: Infinity,
    compact: true,
    depth: 5,
  },
};

module.exports = (info, lastOptions = {}) => {
  const options = merge({}, defaultOptions, lastOptions);

  if (info instanceof Error) {
    info.message = { stack: info.stack.split('\n') };
  }

  if (typeof info.message === 'object') {
    info.message = util.inspect(info.message, options.utilInspectOptions);
  }

  return info;
};
