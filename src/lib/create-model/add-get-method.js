const { fp, get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: {
    FIELDS,
    GET_SEL,
    OFFSET,
    PAGE_SIZE,
    POOL,
    TABLE_NAME,
    WHERE,
  },
  MODEL: { DEFAULT_PAGE_SIZE },
} = require('../constants');
const pgFormat = require('pg-format');

module.exports = (context, config) => (model) => {
  const GET = get(config, GET_SEL, false);
  const pool = get(context, POOL, false);
  const tableName = get(config, TABLE_NAME, false);

  if (GET !== false) {
    if (get(GET, 'custom', false) === false) {
      model.get = (options) =>
        context.Promise.resolve().then(() => {
          context.logger.trace(options);

          const modelFields = get(GET, FIELDS, false);
          const fields = get(options, FIELDS, modelFields);
          const offset = get(options, OFFSET, false);
          const modelPageSize = get(GET, PAGE_SIZE, DEFAULT_PAGE_SIZE);
          const pageSize = get(options, PAGE_SIZE, modelPageSize);
          const where = get(options, WHERE, false);

          let queryStringBuilder = [];
          let pgFormatBuilder = [];

          queryStringBuilder.push('SELECT');

          if (fields === false) {
            queryStringBuilder.push('*');
          } else {
            if (!Array.isArray(fields)) {
              throw new Error('fields must be an array of strings');
            }

            fields.forEach((field, index) => {
              if (index < fields.length - 1) {
                queryStringBuilder.push('%I,');
              } else {
                queryStringBuilder.push('%I');
              }

              pgFormatBuilder.push(field);
            });
          }

          queryStringBuilder.push('FROM %I');
          pgFormatBuilder.push(tableName);

          if (where !== false) {
            throw new Error('TODO: Implement default where implementation');
          }

          if (pageSize !== false) {
            queryStringBuilder.push('LIMIT %L');
            pgFormatBuilder.push(pageSize);

            if (offset !== false) {
              queryStringBuilder.push('OFFSET %L');
              pgFormatBuilder.push(offset);
            }
          }

          // TODO: Order By / Sort By

          return pool
            .query(pgFormat(queryStringBuilder.join(' '), ...pgFormatBuilder))
            .then(fp.get('rows'))
            .then((data) => ({ response: { data } }));
        });
    } else {
      throw new Error('TODO: Implement custom GET');
    }
  }

  return model;
};
