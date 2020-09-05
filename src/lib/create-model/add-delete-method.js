const { fp, get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: {
    ALLOW_DELETE_MULTIPLE,
    ID_FIELD,
    POOL,
    DELETE_SEL,
    TABLE_NAME,
    WHERE,
  },
} = require('../constants');
const pgFormat = require('pg-format');

module.exports = (context, config) => (model) => {
  const DELETE = get(config, DELETE_SEL, false);
  const pool = get(context, POOL, false);
  const tableName = get(config, TABLE_NAME, false);

  if (DELETE !== false) {
    if (get(DELETE, 'custom', false) === false) {
      model.delete = (entity, options = {}) =>
        Promise.resolve().then(() => {
          context.logger.trace(options);

          const allowDeleteMultiple = get(DELETE, ALLOW_DELETE_MULTIPLE, false);
          const idField = get(DELETE, ID_FIELD, 'id');
          const where = get(options, WHERE, false);

          let pgFormatBuilder = [];
          let queryStringBuilder = [];
          let queryStringParameters = [];

          if (allowDeleteMultiple === true && where !== false) {
            throw new Error(`implement deletion using where ${where}`);
          } else {
            const id = get(entity, idField, false);

            if (id === false) {
              throw new Error(
                `a single delete attempt failed because the ${idField} (${tableName}.${idField}) was not found`,
              );
            }

            queryStringBuilder.push('DELETE FROM %I WHERE %I = $1;');
            pgFormatBuilder.push(tableName);
            pgFormatBuilder.push(idField);
            queryStringParameters.push(id);
          }

          const formattedQuery = pgFormat(
            queryStringBuilder.join(' '),
            ...pgFormatBuilder,
          );

          return (queryStringParameters.length > 0
            ? pool.query(formattedQuery, queryStringParameters)
            : pool.query(formattedQuery)
          )
            .then(fp.get('rows'))
            .then((data) => ({ response: { data } }));
        });
    } else {
      throw new Error('TODO: Implement custom DELETE');
    }
  }

  return model;
};
