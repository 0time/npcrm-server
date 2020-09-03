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
          // What should we do if this is the case? Are we going to allow inserting a new record with a hardcoded ID?
          // That seems weird.
          throw new Error(
            `assume id field means update is not implemented tableName=${tableName}`,
          );
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
          queryStringBuilder.push('UPDATE %I SET');
          pgFormatBuilder.push(tableName);

          let fixLast = false;

          for (let i = 0; i < fields.length; ++i) {
            if (fields[i] !== idField) {
              queryStringBuilder.push(
                `%I = $${queryStringParameters.length + 1},`,
              );
              pgFormatBuilder.push(fields[i]);
              queryStringParameters.push(entity[fields[i]]);

              fixLast = true;
            }
          }

          if (fixLast === true) {
            const i = queryStringBuilder.length - 1;
            queryStringBuilder[i] = queryStringBuilder[i].slice(0, -1);
          }

          // TODO: find every instance of shoving numbers into strings like this and use pgFormat instead.
          queryStringBuilder.push(
            `WHERE %I = $${queryStringParameters.length + 1}`,
          );
          pgFormatBuilder.push(idField);
          queryStringParameters.push(entity[idField]);
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
