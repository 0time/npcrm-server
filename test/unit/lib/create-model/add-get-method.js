const getMockLogger = require('../../../lib/get-mock-logger');
const {
  JSON_SELECTORS: { GET_SEL, LOGGER, POOL, TABLE_NAME },
} = require('../../../../src/lib/constants');
const { set } = require('@0ti.me/tiny-pfp');

const {
  d,
  expect,
  sinon: { stub },
  tquire,
  uuid,
} = deps;

const me = __filename;

d(me, () => {
  const addGetMethod = tquire(me);

  let config = null;
  let context = null;
  let fields = null;
  let GET = null;
  let logger = null;
  let model = null;
  let pool = null;
  let query = null;
  let queryResult = null;
  let tableName = null;

  beforeEach(() => {
    logger = getMockLogger();
    queryResult = `query-result-${uuid()}`;
    query = stub().resolves({ rows: queryResult });
    tableName = `table-name-${uuid()}`;

    context = {};
    config = {};
    GET = {};
    model = {};
    pool = {};

    set(pool, 'query', query);

    set(context, POOL, pool);
    set(context, LOGGER, logger);
    set(config, TABLE_NAME, tableName);

    set(config, GET_SEL, GET);
  });

  describe('model.get', () => {
    let options = null;

    describe('given no fields', () => {
      beforeEach(() => {
        fields = undefined;

        options = {};

        set(options, 'fields', fields);
      });

      it('should use an asterisk', () =>
        expect(addGetMethod(context, config)(model).get(options))
          .to.eventually.be.fulfilled.then((resolution) =>
            expect(resolution).to.have.nested.property(
              'response.data',
              queryResult,
            ),
          )
          .then(() =>
            expect(query).to.have.been.calledOnceWithExactly(
              `SELECT * FROM "${tableName}" LIMIT '10'`,
            ),
          ));
    });
  });
});
