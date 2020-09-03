const {
  lib: {
    index: { isString },
  },
} = require('@0ti.me/tiny-pfp');
const {
  _,
  sinon: { spy, stub },
} = deps;

module.exports = () => {
  const mockDbConnPool = {
    start: stub().resolves(),
    stop: stub().resolves(),
  };
  const responses = [];

  mockDbConnPool.bindQueryAndResponse = (query, response) => {
    responses.push({ query, response });

    return mockDbConnPool;
  };

  mockDbConnPool.query = spy((query) => {
    const result = responses.reduce((acc, each) => {
      if (acc) return acc;

      if (isString(each.query)) {
        // If the expected query is a string, expect an exact match for the actual query string,
        // and return the matching response if the strings match exactly.
        if (query === each.query) {
          return each.response;
        }
      } else if (_.isRegExp(each.query)) {
        // If the expected query is a regular expression, use it to test the actual query string,
        // and return the matching response if a match is found on the query string.
        if (each.query.test(query)) {
          return each.response;
        }
      } else {
        // If the expected query is anything else, throw an error.
        throw new Error('invalid query expectation');
      }

      return acc;
    }, false);

    if (!result) {
      return Promise.reject(`unexpected query ${query}`);
    } else {
      return Promise.resolve().then(() =>
        _.isFunction(result) ? result() : result,
      );
    }
  });

  return mockDbConnPool;
};
