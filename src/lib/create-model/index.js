const {
  fp: { flow },
} = require('@0ti.me/tiny-pfp');
const addGetMethod = require('./add-get-method');
const addPutMethod = require('./add-put-method');
const validate = require('./validate');

module.exports = (context, config) =>
  flow([
    validate(context, config),
    addGetMethod(context, config),
    addPutMethod(context, config),
  ])({});
