const getMockLogger = require('../../../../lib/get-mock-logger');
const {
  JSON_SELECTORS: {
    WEB_SERVER_BASE_PATH,
    EXPRESS_IMPLEMENTATION,
    HTTP_METHOD,
    MIDDLEWARES,
    ROUTE,
    WEB_SERVER_APP,
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
  let mockBasePath = null;
  let mockDefineMethodHandler = null;
  let mockFinalizeAfterListen = null;
  let mockImplementation1 = null;
  let mockImplementation2 = null;
  let mockInstance = null;
  let mockListen = null;
  let mockLogErrorMiddleware = null;
  let mockLogErrorMiddlewareCreator = null;
  let mockLogger = null;
  let mockMethod = null;
  let mockMiddlewares = null;
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
    mockRoute = `mock-route-${uuid()}`;
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

    mockLogErrorMiddleware = `mock-log-error-middleware-${uuid()}`;
    mockLogErrorMiddlewareCreator = stub().returns(mockLogErrorMiddleware);
    mocks[
      '../../../middlewares/log-error-middleware'
    ] = mockLogErrorMiddlewareCreator;

    mockFinalizeAfterListen = spy((context, obj) => obj.resolve(context));
    mocks['./finalize-after-listen'] = mockFinalizeAfterListen;

    mockBasePath = `mock-base-path-${uuid()}`;
    set(context, 'config', config);
    set(context, 'logger', mockLogger);
    set(context, 'Promise', Promise);
    set(context, WEB_SERVER_PORT, mockPort);
    set(context, WEB_SERVER_BASE_PATH, mockBasePath);

    mockInstance = `mock-instance-${uuid()}`;
    // override mockListenDeliberateWait to make it wait a different amount of time before calling back after listen
    mockListenDeliberateWait = 0;
    mockListen = spy((port, callback) => {
      expect(port).to.equal(mockPort);
      expect(callback).to.be.a('function');
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

  it('should resolve with the context', () =>
    expect(start()).to.eventually.be.fulfilled.and.equal(context));

  describe('router', () => {
    it('should use the expected routes', () =>
      expect(start()).to.eventually.be.fulfilled.then(() =>
        expect(mockDefineMethodHandler.args).to.deep.equal([
          [mockRoute, mockProcessParametersMiddleware, mockImplementation1],
          [mockRoute, mockProcessParametersMiddleware, mockImplementation2],
        ]),
      ));

    describe('given an array of routes', () => {
      beforeEach(() => {
        mockRoutes = [stub().returns([mockRoute1(), mockRoute2()])];
        mocks['../../../routes'] = mockRoutes;

        start = () => pquire(me, mocks)(context);
      });

      it('should still set them all up', () =>
        expect(start()).to.eventually.be.fulfilled.then(() =>
          expect(mockDefineMethodHandler.args).to.deep.equal([
            [mockRoute, mockProcessParametersMiddleware, mockImplementation1],
            [mockRoute, mockProcessParametersMiddleware, mockImplementation2],
          ]),
        ));
    });

    describe('given custom middlewares for a route', () => {
      let getMockImplementationByIndex = null;
      let testRunner = null;

      beforeEach(() => {
        getMockImplementationByIndex = (index) =>
          `mock-implementation-${index}`;

        testRunner = (customMws, numRoutes = 1) => {
          let lMockDefineMethodHandler = stub();

          mockRouter = { [mockMethod]: lMockDefineMethodHandler };
          getMockRouter = stub().returns(mockRouter);

          mockExpress = Object.assign(() => mockApp, { Router: getMockRouter });
          mocks['express'] = mockExpress;

          start = () => pquire(me, mocks)(context);

          mockRoutes = new Array(numRoutes)
            .fill({
              [HTTP_METHOD]: mockMethod,
              [MIDDLEWARES]: customMws,
              [ROUTE]: mockRoute,
            })
            .map((ea, index) => (...args) => {
              expect(args).to.deep.equal([context]);

              return Object.assign(ea, {
                [EXPRESS_IMPLEMENTATION]: getMockImplementationByIndex(index),
              });
            });

          mocks['../../../routes'] = mockRoutes;

          return expect(start()).to.eventually.be.fulfilled.then(() =>
            expect(lMockDefineMethodHandler.args).to.deep.equal(
              new Array(numRoutes)
                .fill([mockRoute, ...customMws])
                .map((ea, index) =>
                  ea.concat([getMockImplementationByIndex(index)]),
                ),
            ),
          );
        };
      });

      it('should use those custom middlewares', () =>
        Promise.all([
          testRunner([]),
          testRunner(['custom-mw-1']),
          testRunner(['custom-mw-1', 'custom-mw-2']),
        ]));
    });
  });

  describe('app.use', () => {
    let expected = null;

    beforeEach(() => {
      expected = mockMiddlewares()
        .map((ea) => [ea])
        .concat([[mockBasePath, mockRouter], [mockLogErrorMiddleware]]);
    });

    it('should use the expected middlewares', () =>
      expect(start()).to.eventually.be.fulfilled.then(() =>
        expect(mockUse.args).to.deep.equal(expected),
      ));
  });

  describe('given a timeout', () => {
    let mockTimeoutError = null;
    let savedCallback = null;
    let savedObj = null;

    beforeEach(() => {
      savedCallback = null;

      // eslint-disable-next-line no-unused-vars
      mockListen = spy((port, callback) => {
        expect(port).to.equal(mockPort);
        expect(callback).to.be.a('function');
        // Never callback
        //setTimeout(callback, mockListenDeliberateWait);
        expect(savedCallback).to.equal(null);
        savedCallback = callback;

        return mockInstance;
      });

      mockUse = stub();
      mockApp = { listen: mockListen, use: mockUse };
      mockExpress = Object.assign(() => mockApp, { Router: getMockRouter });
      mocks['express'] = mockExpress;

      set(context, WEB_SERVER_START_TIMEOUT, 1);

      mockTimeoutError = `mock-timeout-error-${uuid()}`;
      savedObj = null;
      mockRejectAfterTimeout = (obj) => {
        expect(savedObj).to.equal(null);
        savedObj = obj;
        return setTimeout(() => obj.reject(mockTimeoutError), 0);
      };
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
