const getMockLogger = require('../../../../lib/get-mock-logger');
const {
  JSON_SELECTORS: {
    EXPRESS_IMPLEMENTATION,
    HTTP_METHOD,
    ROUTE,
    WEB_SERVER_APP,
    WEB_SERVER_CONNECTIONS,
    WEB_SERVER_PORT,
    WEB_SERVER_START_TIMEOUT,
  },
} = require('../../../../../src/lib/constants');
const { set } = require('@0ti.me/tiny-pfp');

const {
  d,
  expect,
  pquire,
  sinon: { spy, stub },
  uuid,
} = deps;

const me = __filename;

d(me, () => {
  let config = null;
  let context = null;
  let mockExpress = null;
  let getMockRouter = null;
  let mockApp = null;
  let mockDefineMethodHandler = null;
  let mockImplementation1 = null;
  let mockImplementation2 = null;
  let mockInstance = null;
  let mockInstanceOnConnectionHandler = null;
  let mockInstanceOnConnectionHandlerCreator = null;
  let mockListen = null;
  let mockLogger = null;
  let mockMethod = null;
  let mockMiddlewares = null;
  let mockInstanceOn = null;
  let mockListenDeliberateWait = null;
  let mockPort = null;
  let mockProcessParameters = null;
  let mockProcessParametersMiddleware = null;
  let mockRejectAfterTimeout = null;
  let mockRejectAfterTimeoutCreator = null;
  let mockRoute = null;
  let mockRoute1 = null;
  let mockRoute2 = null;
  let mockRouter = null;
  let mockRoutes = null;
  let mocks = null;
  let mockUse = null;
  let mw1 = null;
  let mw2 = null;
  let start = null;

  beforeEach(() => {
    config = {};
    context = {};
    mocks = {};

    mockLogger = getMockLogger();

    mockMethod = `mock-method-${uuid()}`;
    mockDefineMethodHandler = stub();
    mockRouter = { [mockMethod]: mockDefineMethodHandler };
    getMockRouter = stub().returns(mockRouter);

    mockImplementation1 = `mock-implementation-1-${uuid()}`;
    mockRoute1 = stub().returns({
      [EXPRESS_IMPLEMENTATION]: mockImplementation1,
      [HTTP_METHOD]: mockMethod,
      [ROUTE]: mockRoute,
    });

    mockImplementation2 = `mock-implementation-2-${uuid()}`;
    mockRoute2 = stub().returns({
      [EXPRESS_IMPLEMENTATION]: mockImplementation2,
      [HTTP_METHOD]: mockMethod,
      [ROUTE]: mockRoute,
    });
    mockRoutes = [mockRoute1, mockRoute2];
    mocks['../../../routes'] = mockRoutes;

    mw1 = `mw1-${uuid()}`;
    mw2 = `mw2-${uuid()}`;
    mockMiddlewares = stub().returns([mw1, mw2]);
    mocks['../../../middlewares'] = mockMiddlewares;

    mockProcessParametersMiddleware = `mock-process-parameters-middleware-${uuid()}`;
    mockProcessParameters = stub().returns(mockProcessParametersMiddleware);
    mocks['../../../middlewares/process-parameters'] = mockProcessParameters;

    mockRejectAfterTimeout = stub();
    mockRejectAfterTimeoutCreator = stub().returns(mockRejectAfterTimeout);
    mocks['../../../lib/reject-after-timeout'] = mockRejectAfterTimeoutCreator;

    mockInstanceOnConnectionHandler = `mock-instance-on-connection-handler-${uuid()}`;
    mockInstanceOnConnectionHandlerCreator = stub().returns(
      mockInstanceOnConnectionHandler,
    );
    mocks[
      './instance-on-connection-handler'
    ] = mockInstanceOnConnectionHandlerCreator;

    set(context, 'config', config);
    set(context, 'logger', mockLogger);
    set(context, 'Promise', Promise);
    set(context, WEB_SERVER_PORT, mockPort);

    mockInstanceOn = spy((eventName, handler) => {
      expect(eventName).to.equal('connection');
      expect(handler).to.equal(mockInstanceOnConnectionHandler);
    });
    mockInstance = { on: mockInstanceOn };
    // override mockListenDeliberateWait to make it wait a different amount of time before calling back after listen
    mockListenDeliberateWait = 0;
    mockListen = spy((port, callback) => {
      expect(port).to.equal(mockPort);
      setTimeout(callback, mockListenDeliberateWait);

      return mockInstance;
    });
    mockUse = stub();
    mockApp = { listen: mockListen, use: mockUse };
    mockExpress = Object.assign(() => mockApp, { Router: getMockRouter });
    mocks['express'] = mockExpress;

    start = () => pquire(me, mocks)(context);
  });

  it('should eventually be fulfilled', () =>
    expect(start()).to.eventually.be.fulfilled);

  it('should set the app property', () =>
    expect(start()).to.eventually.be.fulfilled.then(() => {
      expect(context).to.have.nested.property(WEB_SERVER_APP, mockApp);
    }));

  it('should initialize the connections list and add/remove as connections come and go', () =>
    expect(start()).to.eventually.be.fulfilled.then(() => {
      expect(context).to.have.deep.nested.property(WEB_SERVER_CONNECTIONS, []);

      expect(
        mockInstanceOnConnectionHandlerCreator,
      ).to.have.been.calledOnceWithExactly(context);
      expect(mockInstanceOn).to.have.been.calledOnceWithExactly(
        'connection',
        mockInstanceOnConnectionHandler,
      );
    }));

  it('should resolve with the context', () =>
    expect(start()).to.eventually.be.fulfilled.and.equal(context));

  describe('given a timeout', () => {
    let mockTimeoutError = null;

    beforeEach(() => {
      mockListenDeliberateWait = 500;
      mockListen = spy((port, callback) => {
        expect(port).to.equal(mockPort);
        setTimeout(callback, mockListenDeliberateWait);

        return mockInstance;
      });
      mockUse = stub();
      mockApp = { listen: mockListen, use: mockUse };
      mockExpress = Object.assign(() => mockApp, { Router: getMockRouter });
      mocks['express'] = mockExpress;

      set(context, WEB_SERVER_START_TIMEOUT, 1);

      mockTimeoutError = `mock-timeout-error-${uuid()}`;
      mockRejectAfterTimeout = ({ reject }) =>
        setTimeout(() => reject(mockTimeoutError), 0);
      mockRejectAfterTimeoutCreator = stub().returns(mockRejectAfterTimeout);
      mocks[
        '../../../lib/reject-after-timeout'
      ] = mockRejectAfterTimeoutCreator;

      start = () => pquire(me, mocks)(context);
    });

    it('should reject with the timeout error', () =>
      expect(start()).to.eventually.be.rejectedWith(mockTimeoutError));
  });
});
