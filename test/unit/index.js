const proxyquire = require('proxyquire')
  .noPreserveCache()
  .noCallThru();

const {
  d,
  expect,
  sinon: { stub },
  tquire,
} = deps;

const me = __filename;

d(me, () => {
  const mockAppResult = Symbol();

  let index = null;
  let mocks = null;
  let mockApp = null;

  beforeEach(() => {
    mockApp = stub().returns(mockAppResult);

    mocks = {};

    mocks['./app'] = mockApp;

    index = () => proxyquire(tquire(me, false), mocks);
  });

  it('should call app with no args', () => {
    index();

    expect(mockApp).to.have.been.calledOnceWithExactly();
  });

  it('should return the result of app', () =>
    expect(index()).to.equal(mockAppResult));
});
