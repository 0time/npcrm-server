const getMockLogger = require('../../../lib/get-mock-logger');
const {
  JSON_SELECTORS: {
    ASSUME_ID_FIELD_MEANS_UPDATE,
    FIELDS,
    PUT_SEL,
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
  const addPutMethod = tquire(me);

  let config = null;
  let context = null;
  let fields = null;
  let logger = null;
  let model = null;
  let options = null;
  let pool = null;
  let PUT = null;
  let query = null;
  let queryResult = null;
  let tableName = null;

  const shortcutPut = () =>
    expect(
      addPutMethod(context, config)(model).put(options),
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
    PUT = {};
    model = {};
    options = {};
    pool = {};

    set(pool, 'query', query);

    set(context, LOGGER, logger);
    set(context, 'Promise', Promise);
    set(context, POOL, pool);
    set(config, TABLE_NAME, tableName);

    set(config, PUT_SEL, PUT);
  });

  describe('model.put', () => {
    describe('given an id and a field', () => {
      let id = null;
      let name = null;

      beforeEach(() => {
        id = nextInt();
        name = `name-${uuid()}`;

        options = { id, name };
      });

      it('should try to update the record', () =>
        shortcutPut().then(() =>
          expect(
            query,
          ).to.have.been.calledOnceWithExactly(
            `UPDATE "${tableName}" SET name = $1 WHERE id = $2;`,
            [name, id],
          ),
        ));

      describe('and another field', () => {
        let email = null;

        beforeEach(() => {
          email = `email-${uuid()}`;

          set(options, 'email', email);
        });

        it('should try to update the record, separating each set of key/values by commas', () =>
          shortcutPut().then(() =>
            expect(
              query,
            ).to.have.been.calledOnceWithExactly(
              `UPDATE "${tableName}" SET name = $1 , email = $2 WHERE id = $3;`,
              [name, email, id],
            ),
          ));
      });
    });

    describe('given only a non-id field', () => {
      let name = null;

      beforeEach(() => {
        name = `name-${uuid()}`;

        options = { name };
      });

      it('should try to insert the record', () =>
        shortcutPut().then(() =>
          expect(
            query,
          ).to.have.been.calledOnceWithExactly(
            `INSERT INTO "${tableName}" ( name ) VALUES ( $1 );`,
            [name],
          ),
        ));

      describe('and another non-id field', () => {
        let email = null;

        beforeEach(() => {
          email = `email-${uuid()}`;

          options = { email, name };
        });

        it('should try to insert the record and separate fields by commas properly', () =>
          shortcutPut().then(() =>
            expect(
              query,
            ).to.have.been.calledOnceWithExactly(
              `INSERT INTO "${tableName}" ( email , name ) VALUES ( $1 , $2 );`,
              [email, name],
            ),
          ));
      });
    });

    describe('given assumeIdFieldMeansUpdate is set to something other than false', () => {
      beforeEach(() => {
        set(PUT, ASSUME_ID_FIELD_MEANS_UPDATE, false);
        set(config, PUT_SEL, PUT);
      });

      it('should reject with an error', () =>
        expect(
          addPutMethod(context, config)(model).put(options),
        ).to.eventually.be.rejectedWith(''));
    });

    describe('given a where clause', () => {
      beforeEach(() => {
        set(options, WHERE, null);
      });

      it('should reject with an error while it is not implemented', () =>
        expect(
          addPutMethod(context, config)(model).put(options),
        ).to.eventually.be.rejectedWith(
          'TODO: Implement default where implementation',
        ));
    });

    describe('given invalid fields', () => {
      beforeEach(() => {
        fields = null;

        set(options, FIELDS, fields);
      });

      it('should reject with an error', () =>
        expect(
          addPutMethod(context, config)(model).put(options),
        ).to.eventually.be.rejectedWith(
          'fields property was supplied but not an array as expected',
        ));
    });

    describe('given a custom put implementation', () => {
      beforeEach(() => {
        set(PUT, 'custom', null);
        set(config, PUT_SEL, PUT);
      });

      it('should throw an error upon trying to create the model', () =>
        expect(() => addPutMethod(context, config)(model)).to.throw(
          'TODO: Implement custom PUT',
        ));
    });

    describe('given that PUT_SEL is not set', () => {
      beforeEach(() => {
        unset(config, PUT_SEL);
      });

      it('should not define model.put', () =>
        expect(addPutMethod(context, config)(model)).to.not.have.property(
          'put',
        ));
    });
  });
});
