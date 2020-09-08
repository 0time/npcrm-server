const getMockLogger = require('../../lib/get-mock-logger');
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
  let context = null;
  let err = null;
  let logErrorMiddleware = null;
  let next = null;
  let nextResult = null;
  let req = null;
  let res = null;

  beforeEach(() => {
    context = {};

    set(context, 'logger', getMockLogger());

    err = `err-${uuid()}`;
    req = `req-${uuid()}`;
    res = `res-${uuid()}`;
    nextResult = `next-result-${uuid()}`;
    next = stub().returns(nextResult);

    logErrorMiddleware = () => tquire(me)(context)(err, req, res, next);
  });

  it('should log the error', () => {
    logErrorMiddleware();

    expect(context.logger.error.args).to.deep.equal([[err]]);
  });

  it('should call next with the err once and return the result of the next call', () => {
    expect(logErrorMiddleware()).to.equal(nextResult);

    expect(next).to.have.been.calledOnceWithExactly(err);
  });
});
