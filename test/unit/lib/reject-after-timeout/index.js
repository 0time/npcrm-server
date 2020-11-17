const {
  d,
  expect,
  sinon: { stub },
  pquire,
  uuid,
} = deps;

const me = __filename;

d(me, () => {
  let configureHandler = null;
  let context = null;
  let handler = null;
  let mocks = null;
  let obj = null;
  let reject = null;
  let rejectAfterTimeout = null;
  let resolved = null;
  let setTimeout = null;
  let setTimeoutResult = null;
  let timeout = null;

  beforeEach(() => {
    mocks = {};

    handler = `handler-${uuid()}`;

    configureHandler = stub().returns(handler);

    mocks['./configure-handler'] = configureHandler;

    reject = `reject-${uuid()}`;
    setTimeoutResult = `set-timeout-result-${uuid()}`;
    setTimeout = stub().returns(setTimeoutResult);
    timeout = `timeout-${uuid()}`;

    context = { setTimeout };
    obj = { reject, resolved, timeout };

    rejectAfterTimeout = pquire(me, mocks);
  });

  it('should return the setTimeout result', () =>
    expect(rejectAfterTimeout(context)(obj)).to.equal(setTimeoutResult));

  it('should execute setTimeout with the configured handler and the timeout', () => {
    rejectAfterTimeout(context)(obj);

    expect(setTimeout).to.have.been.calledOnceWithExactly(handler, timeout);
  });
});
