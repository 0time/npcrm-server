const { fp, get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: {
    ASSUME_ID_FIELD_MEANS_UPDATE,
    ID_FIELD,
    POOL,
    PUT_SEL,
    TABLE_NAME,
    WHERE,
  },
} = require('../constants');
const pgFormat = require('pg-format');

module.exports = (context, config) => (model) => {
  const PUT = get(config, PUT_SEL, false);
  const pool = get(context, POOL, false);
  const tableName = get(config, TABLE_NAME, false);

  if (PUT !== false) {
    if (get(PUT, 'custom', false) === false) {
      model.put = (entity, options = {}) => {
        context.logger.trace(options);

        const assumeIdFieldMeansUpdate = get(
          PUT,
          ASSUME_ID_FIELD_MEANS_UPDATE,
          true,
        );
        const fields = Object.keys(entity);
        const idField = get(PUT, ID_FIELD, 'id');
        const where = get(options, WHERE, false);

        if (assumeIdFieldMeansUpdate !== true) {
          throw new Error('not implemented');
        }

        let pgFormatBuilder = [];
        let queryStringBuilder = [];
        let queryStringParameters = [];

        if (get(entity, idField, false) === false) {
          queryStringBuilder.push('INSERT INTO %I');
          pgFormatBuilder.push(tableName);

          if (Array.isArray(fields)) {
            queryStringBuilder.push('(');

            let addToEnd = [];

            fields.forEach((field, i, ray) => {
              queryStringParameters.push(get(entity, field));

              if (i === ray.length - 1) {
                queryStringBuilder.push('%I');
                pgFormatBuilder.push(field);
                addToEnd.push(`$${i + 1}`);
              } else {
                queryStringBuilder.push('%I ,');
                pgFormatBuilder.push(field);
                addToEnd.push(`$${i + 1} ,`);
              }
            });

            queryStringBuilder.push(') VALUES (');

            queryStringBuilder = queryStringBuilder.concat(addToEnd);

            queryStringBuilder.push(')');
          } else {
            throw new Error('TODO: Implement fields implementation');
          }

          if (where !== false) {
            throw new Error('TODO: Implement default where implementation');
          }
        } else {
          throw new Error('implement updating an existing record');
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
      };
    } else {
      throw new Error('TODO: Implement custom PUT');
    }
  }

  return model;
};
