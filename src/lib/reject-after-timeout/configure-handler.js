const { get } = require('@0ti.me/tiny-pfp');

module.exports = (obj) => () => {
  if (!obj.resolved) {
    obj.resolved = true;
    obj.reject(new Error(get(obj, 'message', 'timeout limit exceeded')));
  }
};
