const {
  d,
  expect,
  sinon: { spy, stub },
  uuid,
} = deps;

const me = __filename;

d(me, () => {
  let mockInstanceOn = null;
  let mockInstanceOnConnectionHandler = null;
  let mockInstanceOnConnectionHandlerCreator = null;
  let mocks = null;

  beforeEach(() => {
    mocks = {};
    mockInstanceOnConnectionHandler = `mock-instance-on-connection-handler-${uuid()}`;
    mockInstanceOnConnectionHandlerCreator = stub().returns(
      mockInstanceOnConnectionHandler,
    );
    mocks[
      './instance-on-connection-handler'
    ] = mockInstanceOnConnectionHandlerCreator;
    mockInstanceOn = spy((eventName, handler) => {
      expect(eventName).to.equal('connection');
      expect(handler).to.equal(mockInstanceOnConnectionHandler);
    });

    return mockInstanceOn;
  });
});
