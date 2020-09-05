const getMockLogger = require('../../../lib/get-mock-logger');
const {
  JSON_SELECTORS: {
    GET_SEL,
    LOGGER,
    OFFSET,
    PAGE_SIZE,
    POOL,
    TABLE_NAME,
    WHERE,
  },
} = require('../../../../src/lib/constants');
const { set, unset } = require('@0ti.me/tiny-pfp');

const {
  d,
  expect,
  nextInt,
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
  let options = null;
  let pool = null;
  let query = null;
  let queryResult = null;
  let tableName = null;

  const shortcutGet = () =>
    expect(
      addGetMethod(context, config)(model).get(options),
    ).to.eventually.be.fulfilled.then((resolution) =>
      expect(resolution).to.have.nested.property('response.data', queryResult),
    );

  beforeEach(() => {
    logger = getMockLogger();
    queryResult = `query-result-${uuid()}`;
    query = stub().resolves({ rows: queryResult });
    tableName = `table-name-${uuid()}`;

    context = {};
    config = {};
    GET = {};
    model = {};
    options = {};
    pool = {};

    set(pool, 'query', query);

    set(context, LOGGER, logger);
    set(context, 'Promise', Promise);
    set(context, POOL, pool);
    set(config, TABLE_NAME, tableName);

    set(config, GET_SEL, GET);
  });

  describe('model.get', () => {
    describe('given no fields', () => {
      beforeEach(() => {
        fields = undefined;

        set(options, 'fields', fields);
      });

      it('should use an asterisk', () =>
        shortcutGet().then(() =>
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
        shortcutGet().then(() =>
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
        shortcutGet().then(() =>
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

    describe('given a where clause', () => {
      beforeEach(() => {
        set(options, WHERE, null);
      });

      it('should reject with an error while it is not implemented', () =>
        expect(
          addGetMethod(context, config)(model).get(options),
        ).to.eventually.be.rejectedWith(
          'TODO: Implement default where implementation',
        ));
    });

    describe('given a custom get implementation', () => {
      beforeEach(() => {
        set(GET, 'custom', null);
        set(config, GET_SEL, GET);
      });

      it('should throw an error upon trying to create the model', () =>
        expect(() => addGetMethod(context, config)(model)).to.throw(
          'TODO: Implement custom GET',
        ));
    });

    describe('given a false pageSize', () => {
      beforeEach(() => {
        set(options, PAGE_SIZE, false);
      });

      describe('and an offset', () => {
        let offset = null;

        beforeEach(() => {
          offset = nextInt();
          set(options, OFFSET, offset);
        });

        it('should ignore the offset', () =>
          shortcutGet().then(() =>
            expect(query).to.have.been.calledOnceWithExactly(
              `SELECT * FROM "${tableName}"`,
            ),
          ));
      });

      it('should omit the pageSize', () =>
        shortcutGet().then(() =>
          expect(query).to.have.been.calledOnceWithExactly(
            `SELECT * FROM "${tableName}"`,
          ),
        ));
    });

    describe('given a pageSize', () => {
      let pageSize = null;

      beforeEach(() => {
        pageSize = nextInt();
        set(options, PAGE_SIZE, pageSize);
      });

      describe('and an offset', () => {
        let offset = null;

        beforeEach(() => {
          offset = nextInt();
          set(options, OFFSET, offset);
        });

        it('should take the offset into account', () =>
          shortcutGet().then(() =>
            expect(query).to.have.been.calledOnceWithExactly(
              `SELECT * FROM "${tableName}" LIMIT '${pageSize}' OFFSET '${offset}'`,
            ),
          ));
      });

      it('should take the pageSize into account', () =>
        shortcutGet().then(() =>
          expect(query).to.have.been.calledOnceWithExactly(
            `SELECT * FROM "${tableName}" LIMIT '${pageSize}'`,
          ),
        ));
    });

    describe('given that GET_SEL is not set', () => {
      beforeEach(() => {
        unset(config, GET_SEL);
      });

      it('should not define model.get', () =>
        expect(addGetMethod(context, config)(model)).to.not.have.property(
          'get',
        ));
    });
  });
});
