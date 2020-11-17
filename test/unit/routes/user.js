const {
  HTTP_METHODS: { GET },
  JSON_SELECTORS: { EXPRESS_IMPLEMENTATION, HTTP_METHOD, POOL_QUERY, ROUTE },
} = require('../../../src/lib/constants');
const { set } = require('@0ti.me/tiny-pfp');

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
  let user = null;
  let mockDeprecated = null;
  let mockPoolQuery = null;
  let mockPoolQueryResult = null;
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

    mockPoolQueryResult = `mock-pool-query-result-${uuid()}`;
    mockPoolQuery = stub().returns(mockPoolQueryResult);
    set(context, POOL_QUERY, mockPoolQuery);

    user = () => pquire(me, mocks)(context);
  });

  it('should return an object defining the /user route', () =>
    expect(user()).to.have.property(ROUTE, '/user'));

  it('should define a GET method', () =>
    expect(user()).to.have.property(HTTP_METHOD, GET));

  it('should compose the sendResolution function', () => {
    const h = user();

    expect(h).to.have.property(
      EXPRESS_IMPLEMENTATION,
      mockSendResolutionResult,
    );
    expect(mockSendResolution).to.have.been.calledOnce;
    expect(mockSendResolution.args[0].length).to.equal(2);
    expect(mockSendResolution.args[0][0]).to.equal(context);
    expect(mockSendResolution.args[0][1]()).to.equal(mockPoolQueryResult);
  });
});
