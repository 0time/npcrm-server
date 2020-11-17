const {
  fp: { flow },
} = require('@0ti.me/tiny-pfp');
const addDeleteMethod = require('./add-delete-method');
const addGetMethod = require('./add-get-method');
const addPutMethod = require('./add-put-method');
const validate = require('./validate');

module.exports = (context, config) =>
  flow([
    validate(context, config),
    addDeleteMethod(context, config),
    addGetMethod(context, config),
    addPutMethod(context, config),
  ])({});
