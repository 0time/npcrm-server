const {
  lib: {
    index: { isString },
  },
} = require('@0ti.me/tiny-pfp');
const {
  _,
  sinon: { spy, stub },
} = deps;

const UNSET_SYMBOL = Symbol();

module.exports = () => {
  const mockDbConnPool = {
    start: stub().resolves(),
    stop: stub().resolves(),
  };
  const responses = [];

  mockDbConnPool.bindQueryAndResponse = (
    query,
    args,
    response = UNSET_SYMBOL,
  ) => {
    if (response === UNSET_SYMBOL) {
      response = args;
      args = null;
    }

    responses.push({ args, query, response });

    return mockDbConnPool;
  };

  mockDbConnPool.query = spy((query, args = null) => {
    let foundUnmatchedArgs = false;

    const result = responses.reduce((acc, each) => {
      if (acc) return acc;

      if (isString(each.query)) {
        // If the expected query is a string, expect an exact match for the actual query string,
        // and return the matching response if the strings match exactly.
        if (query === each.query) {
          if (_.isEqual(each.args, args)) {
            return each.response;
          } else {
            foundUnmatchedArgs = true;
          }
        }
      } else if (_.isRegExp(each.query)) {
        // If the expected query is a regular expression, use it to test the actual query string,
        // and return the matching response if a match is found on the query string.
        if (each.query.test(query)) {
          if (_.isEqual(each.args, args)) {
            return each.response;
          } else {
            foundUnmatchedArgs = true;
          }
        }
      } else {
        // If the expected query is anything else, throw an error.
        throw new Error('invalid query expectation');
      }

      return acc;
    }, false);

    if (!result) {
      return Promise.reject(
        `unexpected query ${query}${
          foundUnmatchedArgs ? ' with at least one set of unmatched args' : ''
        }`,
      );
    } else {
      return Promise.resolve().then(() =>
        _.isFunction(result) ? result() : result,
      );
    }
  });

  return mockDbConnPool;
};
