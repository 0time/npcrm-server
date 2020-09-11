const { set, unset } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { POOL, TABLE_NAME },
} = require('../../../../src/lib/constants');

const { d, expect, tquire, uuid } = deps;

const me = __filename;

d(me, () => {
  let context = null;
  let config = null;
  let model = null;
  let query = null;
  let tableName = null;
  let validate = null;

  beforeEach(() => {
    context = {};
    config = {};
    model = `model-${uuid()}`;

    query = `query-${uuid()}`;
    tableName = `table-name-${uuid()}`;

    set(context, `${POOL}.query`, query);
    set(config, TABLE_NAME, tableName);

    validate = () => tquire(me)(context, config)(model);
  });

  it('should not throw an error if everything is set', () =>
    expect(validate).to.not.throw());

  it('should return the model', () => expect(validate()).to.equal(model));

  describe('given query is not set', () => {
    beforeEach(() => {
      unset(context, `${POOL}.query`);
    });

    it('should throw', () => expect(validate).to.throw());
  });

  describe('given pool is not set', () => {
    beforeEach(() => {
      unset(context, POOL);
    });

    it('should throw', () => expect(validate).to.throw());
  });

  describe('given tableName is not set', () => {
    beforeEach(() => {
      unset(config, TABLE_NAME);
    });

    it('should throw', () => expect(validate).to.throw());
  });
});
