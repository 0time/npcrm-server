const {
  HTTP_METHODS: { GET },
  JSON_SELECTORS: { EXPRESS_IMPLEMENTATION, HTTP_METHOD, MIDDLEWARES, ROUTE },
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
  let customer = null;
  let mockDeprecated = null;
  let mocks = null;
  let mockSendResolution = null;
  let mockSendResolutionResult = null;

  beforeEach(() => {
    context = {};

    mocks = [];

    mockSendResolutionResult = `mock-send-resolution-result-${uuid()}`;
    mockSendResolution = stub().returns(mockSendResolutionResult);
    mocks['../lib/send-resolution'] = mockSendResolution;

    mockDeprecated = `deprecated-${uuid()}`;
    mocks['../middlewares/deprecated'] = mockDeprecated;

    customer = () => pquire(me, mocks)(context);
  });

  it('should return an object defining the /customer route', () =>
    expect(customer()).to.have.property(ROUTE, '/customer'));

  it('should indicate it is a deprecated endpoint using the deprecated middleware', () =>
    expect(customer()).to.have.deep.property(MIDDLEWARES, [mockDeprecated]));

  it('should define a GET method', () =>
    expect(customer()).to.have.property(HTTP_METHOD, GET));

  it('should compose the sendResolution function', () => {
    const c = customer();

    expect(c).to.have.property(
      EXPRESS_IMPLEMENTATION,
      mockSendResolutionResult,
    );
    expect(mockSendResolution).to.have.been.calledOnce;
    expect(mockSendResolution.args[0].length).to.equal(2);
    expect(mockSendResolution.args[0][0]).to.equal(context);
    expect(mockSendResolution.args[0][1]()).to.deep.equal(
      ['Fred', 'John'].map((name) => ({ name })),
    );
  });
});
