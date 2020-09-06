const {
  HTTP_METHODS: { GET },
  JSON_SELECTORS: { EXPRESS_IMPLEMENTATION, HTTP_METHOD, ROUTE },
} = require('../../../src/lib/constants');

const {
  d,
  expect,
  pquire,
  sinon: { stub },
  uuid,
} = deps;

const me = __filename;

d(me, () => {
  let context = null;
  let helloWorld = null;
  let mockDeprecated = null;
  let mocks = null;
  let mockSendResolution = null;
  let mockSendResolutionResult = null;

  beforeEach(() => {
    context = {};

    context.Promise = Promise;

    mocks = [];

    mockSendResolutionResult = `mock-send-resolution-result-${uuid()}`;
    mockSendResolution = stub().returns(mockSendResolutionResult);
    mocks['../lib/send-resolution'] = mockSendResolution;

    mockDeprecated = `deprecated-${uuid()}`;
    mocks['../middlewares/deprecated'] = mockDeprecated;

    helloWorld = () => pquire(me, mocks)(context);
  });

  it('should return an object defining the /hello-world route', () =>
    expect(helloWorld()).to.have.property(ROUTE, '/hello-world'));

  it('should define a GET method', () =>
    expect(helloWorld()).to.have.property(HTTP_METHOD, GET));

  it('should compose the sendResolution function', () => {
    const h = helloWorld();

    expect(h).to.have.property(
      EXPRESS_IMPLEMENTATION,
      mockSendResolutionResult,
    );
    expect(mockSendResolution).to.have.been.calledOnce;
    expect(mockSendResolution.args[0].length).to.equal(2);
    expect(mockSendResolution.args[0][0]).to.equal(context);
    expect(
      mockSendResolution.args[0][1](),
    ).to.eventually.be.fulfilled.and.deep.equal({
      jsonResponse: { msg: 'hello world' },
    });
  });
});
