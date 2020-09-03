const {
  d,
  expect,
  sinon: { stub },
  tquire,
  uuid,
} = deps;

const me = __filename;

d(me, () => {
  let configureHandler = null;
  let getObj = null;
  let getObjWithMessage = null;
  let message = null;
  let reject = null;

  beforeEach(() => {
    configureHandler = tquire(me);
    message = `message-${uuid()}`;
    reject = stub();

    getObj = (resolved) => ({
      reject: reject,
      resolved,
    });

    getObjWithMessage = (message, resolved) =>
      Object.assign(
        {
          message,
        },
        getObj(resolved),
      );
  });

  it('should do nothing if resolved is true', () => {
    configureHandler(getObj(true))();

    expect(reject).to.not.have.been.called;
  });

  it('should reject with the message if one is provided', () => {
    configureHandler(getObjWithMessage(message, false))();

    expect(reject).to.have.been.calledOnce;

    const args = reject.args.pop();

    expect(args.length).to.equal(1);

    expect(args.pop())
      .to.be.an.instanceof(Error)
      .and.to.have.property('message', message);
  });
});
