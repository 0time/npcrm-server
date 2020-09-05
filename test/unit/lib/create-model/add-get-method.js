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

    set(context, LOGGER, logger);
    set(context, 'Promise', Promise);
    set(context, POOL, pool);
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

    describe('given valid fields', () => {
      let field1 = null;
      let field2 = null;

      beforeEach(() => {
        field1 = `field-1-${uuid()}`;
        field2 = `field-2-${uuid()}`;

        fields = [field1, field2];

        set(options, 'fields', fields);
      });

      it('should select by those fields and separate them by a comma', () =>
        expect(addGetMethod(context, config)(model).get(options))
          .to.eventually.be.fulfilled.then((resolution) =>
            expect(resolution).to.have.nested.property(
              'response.data',
              queryResult,
            ),
          )
          .then(() =>
            expect(query).to.have.been.calledOnceWithExactly(
              `SELECT "${field1}", "${field2}" FROM "${tableName}" LIMIT '10'`,
            ),
          ));
    });

    describe('given one valid field', () => {
      let field1 = null;

      beforeEach(() => {
        field1 = `field-1-${uuid()}`;

        fields = [field1];

        set(options, 'fields', fields);
      });

      it('should select by that field', () =>
        expect(addGetMethod(context, config)(model).get(options))
          .to.eventually.be.fulfilled.then((resolution) =>
            expect(resolution).to.have.nested.property(
              'response.data',
              queryResult,
            ),
          )
          .then(() =>
            expect(query).to.have.been.calledOnceWithExactly(
              `SELECT "${field1}" FROM "${tableName}" LIMIT '10'`,
            ),
          ));
    });

    describe('given invalid fields', () => {
      beforeEach(() => {
        fields = null;

        set(options, 'fields', fields);
      });

      it('should reject with an error', () =>
        expect(
          addGetMethod(context, config)(model).get(options),
        ).to.eventually.be.rejectedWith('fields must be an array of strings'));
    });
  });
});
