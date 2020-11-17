const getMockLogger = require('../../../lib/get-mock-logger');
const {
  JSON_SELECTORS: {
    ALLOW_DELETE_MULTIPLE,
    DELETE_SEL,
    ID_FIELD,
    LOGGER,
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
  const addDeleteMethod = tquire(me);

  let config = null;
  let context = null;
  let DELETE = null;
  let logger = null;
  let model = null;
  let options = null;
  let pool = null;
  let query = null;
  let queryResult = null;
  let tableName = null;

  const shortcutDelete = () =>
    expect(
      addDeleteMethod(context, config)(model).delete(options),
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
    DELETE = {};
    model = {};
    options = {};
    pool = {};

    set(pool, 'query', query);

    set(context, LOGGER, logger);
    set(context, 'Promise', Promise);
    set(context, POOL, pool);
    set(config, TABLE_NAME, tableName);

    set(config, DELETE_SEL, DELETE);
  });

  describe('model.delete', () => {
    describe('given an id', () => {
      let id = null;

      beforeEach(() => {
        id = nextInt();

        set(options, 'id', id);
      });

      it('should try to delete where the id matches', () =>
        shortcutDelete().then(() =>
          expect(
            query,
          ).to.have.been.calledOnceWithExactly(
            `DELETE FROM "${tableName}" WHERE id = $1;`,
            [id],
          ),
        ));
    });

    describe('given allowDeleteMultiple and a where', () => {
      let where = null;

      beforeEach(() => {
        where = null;

        set(DELETE, ALLOW_DELETE_MULTIPLE, true);
        set(options, DELETE_SEL, DELETE);
        set(options, WHERE, where);
      });

      it('should reject with an error', () =>
        expect(
          addDeleteMethod(context, config)(model).delete(options),
        ).to.eventually.be.rejectedWith(
          `implement deletion using where ${where}`,
        ));
    });

    describe('given no id field', () => {
      let idField = null;

      beforeEach(() => {
        idField = `id-field-${uuid()}`;

        set(DELETE, ID_FIELD, idField);
        set(config, DELETE_SEL, DELETE);
      });

      it('should error indicating the id field is missing', () =>
        expect(
          addDeleteMethod(context, config)(model).delete(options),
        ).to.eventually.be.rejectedWith(
          `a single delete attempt failed because the ${idField} (${tableName}.${idField}) was not found`,
        ));
    });

    describe('given a custom delete implementation', () => {
      beforeEach(() => {
        set(DELETE, 'custom', null);
        set(config, DELETE_SEL, DELETE);
      });

      it('should throw an error upon trying to create the model', () =>
        expect(() => addDeleteMethod(context, config)(model)).to.throw(
          'TODO: Implement custom DELETE',
        ));
    });

    describe('given that DELETE_SEL is not set', () => {
      beforeEach(() => {
        unset(config, DELETE_SEL);
      });

      it('should not define model.delete', () =>
        expect(addDeleteMethod(context, config)(model)).to.not.have.property(
          'delete',
        ));
    });
  });
});
