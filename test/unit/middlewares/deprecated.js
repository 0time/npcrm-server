const {
  HTTP_HEADERS: { DEPRECATED },
} = require('../../../src/lib/constants');
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
  let deprecated = null;
  let mockSet = null;
  let next = null;
  let nextResult = null;
  let req = null;
  let res = null;

  beforeEach(() => {
    mockSet = stub();

    req = {};
    res = { set: mockSet };

    nextResult = `next-result-${uuid()}`;
    next = stub().returns(nextResult);

    deprecated = () => tquire(me)(req, res, next);
  });

  it('should set the res header for DEPRECATED', () => {
    expect(deprecated).to.not.throw();

    expect(res.set).to.have.been.calledOnceWithExactly(DEPRECATED, true);
  });

  it('should call next', () => {
    expect(deprecated).to.not.throw().and.to.equal(nextResult);

    expect(next).to.have.been.calledOnceWithExactly();
  });

  describe('given headers have been sent', () => {
    beforeEach(() => {
      set(req, 'headersSent', true);
    });

    it('should throw an error', () =>
      expect(deprecated).to.throw(
        `${__filename.substr(
          __dirname.length + 1,
        )} middleware called after headers sent`,
      ));
  });
});
