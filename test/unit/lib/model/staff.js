const {
  JSON_SELECTORS: { DELETE_SEL, GET_SEL, PAGE_SIZE, PUT_SEL, TABLE_NAME },
} = require('../../../../src/lib/constants');

const {
  d,
  expect,
  pquire,
  sinon: { spy, stub },
  uuid,
} = deps;

const me = __filename;

d(me, () => {
  let context = null;
  let staff = null;
  let mockCreateModel = null;
  let mocks = null;
  let promiseStaff = null;

  beforeEach(() => {
    context = {};
    mocks = {};

    mockCreateModel = spy((shouldBeContext, shouldBeOptions) => {
      expect(shouldBeContext).to.equal(context);

      return shouldBeOptions;
    });

    mocks['../create-model'] = mockCreateModel;

    staff = () => pquire(me, mocks)(context);
    promiseStaff = () => Promise.resolve(pquire(me, mocks)(context));
  });

  describe('given a custom createModel', () => {
    let mockCreateModelResult = null;

    beforeEach(() => {
      mockCreateModelResult = `mock-create-model-result-${uuid()}`;
      mockCreateModel = stub().returns(mockCreateModelResult);

      mocks['../create-model'] = mockCreateModel;
    });

    it('should return the result of createModel', () =>
      expect(staff()).to.equal(mockCreateModelResult));
  });

  it('should set DELETE_SEL', () =>
    promiseStaff().then((options) =>
      expect(options).to.have.deep.nested.property(DELETE_SEL, {}),
    ));

  it('should set GET_SEL', () =>
    promiseStaff().then((options) =>
      expect(options).to.have.deep.nested.property(GET_SEL, {}),
    ));

  it('should set PUT_SEL', () =>
    promiseStaff().then((options) =>
      expect(options).to.have.deep.nested.property(PUT_SEL, {}),
    ));

  it('should set PAGE_SIZE', () =>
    promiseStaff().then((options) =>
      expect(options).to.have.nested.property(PAGE_SIZE, 100),
    ));

  it('should set TABLE_NAME', () =>
    promiseStaff().then((options) =>
      expect(options).to.have.nested.property(TABLE_NAME, 'Staff'),
    ));
});
