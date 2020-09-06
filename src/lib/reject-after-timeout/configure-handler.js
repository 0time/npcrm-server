const { get } = require('@0ti.me/tiny-pfp');

module.exports = (obj) => () => {
  if (obj.resolved === false) {
    obj.resolved = true;
    obj.reject(
      new Error(
        get(obj, 'message', `timeout limit exceeded (${obj.timeout}ms)`),
      ),
    );
  }
};
