const { fp, get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: {
    ASSUME_ID_FIELD_MEANS_UPDATE,
    FIELDS,
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
      model.put = (options) =>
        Promise.resolve().then(() => {
          context.logger.trace({ putOptions: options, tableName });

          const assumeIdFieldMeansUpdate = get(
            PUT,
            ASSUME_ID_FIELD_MEANS_UPDATE,
            true,
          );
          const fields = get(options, FIELDS, Object.keys(options));
          const idField = get(PUT, ID_FIELD, 'id');
          const where = get(options, WHERE, false);

          if (assumeIdFieldMeansUpdate !== true) {
            // What should we do if this is the case? Are we going to allow inserting a new record with a hardcoded ID?
            // That seems weird.
            throw new Error(
              `assume id field means update is not implemented tableName=${tableName}`,
            );
          }

          let pgFormatBuilder = [];
          let queryStringBuilder = [];
          let queryStringParameters = [];

          if (get(options, idField, false) === false) {
            queryStringBuilder.push('INSERT INTO %I');
            pgFormatBuilder.push(tableName);

            if (Array.isArray(fields)) {
              queryStringBuilder.push('(');

              let addToEnd = [];

              fields.forEach((field, i, ray) => {
                queryStringParameters.push(get(options, field));

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

              queryStringBuilder.push(');');
            } else {
              throw new Error(
                'fields property was supplied but not an array as expected',
              );
            }

            if (where !== false) {
              throw new Error('TODO: Implement default where implementation');
            }
          } else {
            queryStringBuilder.push('UPDATE %I SET');
            pgFormatBuilder.push(tableName);

            let fixLast = false;

            for (let i = 0; i < fields.length; ++i) {
              if (fields[i] !== idField) {
                queryStringBuilder.push(
                  `%I = $${queryStringParameters.length + 1} ,`,
                );
                pgFormatBuilder.push(fields[i]);
                queryStringParameters.push(options[fields[i]]);

                fixLast = true;
              }
            }

            if (fixLast === true) {
              const i = queryStringBuilder.length - 1;
              queryStringBuilder[i] = queryStringBuilder[i].slice(0, -2);
            } else {
              throw new Error('did not find any fields to update');
            }

            // TODO: find every instance of shoving numbers into strings like this and use pgFormat instead.
            queryStringBuilder.push(
              `WHERE %I = $${queryStringParameters.length + 1};`,
            );
            pgFormatBuilder.push(idField);
            queryStringParameters.push(options[idField]);
          }

          const formattedQuery = pgFormat(
            queryStringBuilder.join(' '),
            ...pgFormatBuilder,
          );

          return pool
            .query(formattedQuery, queryStringParameters)
            .then(fp.get('rows'))
            .then((data) => ({ response: { data } }));
        });
    } else {
      throw new Error('TODO: Implement custom PUT');
    }
  }

  return model;
};
