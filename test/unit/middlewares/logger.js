const getMockLogger = require('../../lib/get-mock-logger');
const { set } = require('@0ti.me/tiny-pfp');

const {
  d,
  expect,
  sinon: { stub },
  pquire,
  uuid,
} = deps;

const me = __filename;

d(me, () => {
  let context = null;
  let err = null;
  let ignoredProperty = null;
  let ignoredValue = null;
  let logger = null;
  let mockIp = null;
  let mocks = null;
  let next = null;
  let nextResult = null;
  let req = null;
  let res = null;

  beforeEach(() => {
    context = {};
    mocks = {};

    err = new Error(`err-${uuid()}`);
    ignoredProperty = `ignored-property-${uuid()}`;
    ignoredValue = `ignored-value-${uuid()}`;
    req = {};
    res = `res-${uuid()}`;
    mockIp = `mock-ip-${uuid()}`;
    nextResult = `next-result-${uuid()}`;
    next = stub().returns(nextResult);

    set(context, 'logger', getMockLogger());
    set(req, 'ip', mockIp);
    set(req, ignoredProperty, ignoredValue);

    logger = () => pquire(me, mocks)(context)(req, res, next);
  });

  describe('given an error', () => {
    beforeEach(() => {
      mocks['@0ti.me/tiny-pfp'] = { pick: stub().throws(err) };
    });

    it('should log the error', () => {
      logger();

      expect(context.logger.error.args).to.deep.equal([[err]]);
    });

    it('should still call next without any args and return the result', () => {
      expect(logger()).to.equal(nextResult);

      expect(next).to.have.been.calledOnceWithExactly();
    });
  });

  it('should log an object', () => {
    logger();

    expect(context.logger.info.args.length).to.equal(1);
    expect(context.logger.info.args[0].length).to.equal(1);

    let loggedValue = context.logger.info.args[0][0];

    expect(loggedValue).to.be.an('object');
    expect(loggedValue).to.have.property(
      'message',
      'Logger express middleware triggered',
    );
    expect(loggedValue).to.have.property('ip', mockIp);
    expect(loggedValue).not.to.have.property(ignoredProperty);
  });

  it('should call next with no args once and return the result of the next call', () => {
    expect(logger()).to.equal(nextResult);

    expect(next).to.have.been.calledOnceWithExactly();
  });
});
