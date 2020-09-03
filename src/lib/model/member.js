const createModel = require('../create-model');
const {
  JSON_SELECTORS: { GET_SEL, PAGE_SIZE, PUT_SEL, TABLE_NAME },
} = require('../constants');
const { set } = require('@0ti.me/tiny-pfp');

const options = {};

set(options, GET_SEL, {});
set(options, PUT_SEL, {});
set(options, PAGE_SIZE, 100);
set(options, TABLE_NAME, 'Member');

module.exports = (context) => createModel(context, options);
