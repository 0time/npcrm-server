const {
  HTTP_METHODS: { DELETE, GET, PUT },
  JSON_SELECTORS: {
    EXPRESS_IMPLEMENTATION,
    HTTP_METHOD,
    OPTIONS_ON_REQUEST,
    ROUTE,
  },
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
  let client = null;
  let mockDeprecated = null;
  let mockClient = null;
  let mockClientDelete = null;
  let mockClientDeleteResult = null;
  let mockClientGet = null;
  let mockClientGetResult = null;
  let mockClientPut = null;
  let mockClientPutResult = null;
  let mockClientResult = null;
  let mockOptionsOnRequest = null;
  let mocks = null;
  let mockSendResolution = null;
  let mockSendResolutionResult = null;
  let req = null;

  beforeEach(() => {
    context = {};

    context.Promise = Promise;

    mocks = [];

    mockSendResolutionResult = `mock-send-resolution-result-${uuid()}`;
    mockSendResolution = stub().returns(mockSendResolutionResult);
    mocks['../lib/send-resolution'] = mockSendResolution;

    mockDeprecated = `deprecated-${uuid()}`;
    mocks['../middlewares/deprecated'] = mockDeprecated;

    mockClientResult = {};

    mockClientGet = stub().returns(mockClientGetResult);
    set(mockClientResult, GET, mockClientGet);

    mockClientPut = stub().returns(mockClientPutResult);
    set(mockClientResult, PUT, mockClientPut);

    mockClientDelete = stub().returns(mockClientDeleteResult);
    set(mockClientResult, DELETE, mockClientDelete);

    mockClient = stub().returns(mockClientResult);
    mocks['../lib/model/client'] = mockClient;

    req = {};
    mockOptionsOnRequest = `mock-options-on-request-${uuid()}`;
    set(req, OPTIONS_ON_REQUEST, mockOptionsOnRequest);

    client = () => pquire(me, mocks)(context);
  });

  it('should return an array of length 3', () =>
    expect(client().length).to.equal(3));

  it('should return an array of objects each defining the /client route', () =>
    client().forEach((each) =>
      expect(each).to.have.property(ROUTE, '/client'),
    ));

  it('should return an array of objects each defining the expected method', () => {
    const expected = [GET, PUT, DELETE];

    client().forEach((each, i) =>
      expect(each).to.have.property(HTTP_METHOD, expected[i]),
    );
  });

  it('should return an array of objects each composing the sendResolution function', () => {
    const expectedCallbackResult = [
      mockClientGetResult,
      mockClientPutResult,
      mockClientDeleteResult,
    ];
    const expectedStubsToHaveBeenCalled = [
      mockClientGet,
      mockClientPut,
      mockClientDelete,
    ];

    const m = client();

    m.forEach((each, index) => {
      const e = `index: ${index}`;

      expect(each, e).to.have.property(
        EXPRESS_IMPLEMENTATION,
        mockSendResolutionResult,
      );
      expect(mockSendResolution, e).to.have.been.calledThrice;
      expect(mockSendResolution.args[index].length, e).to.equal(2);
      expect(mockSendResolution.args[index][0], e).to.equal(context);
      expect(mockSendResolution.args[index][1]({ req }), e).to.equal(
        expectedCallbackResult[index],
      );
      expect(mockClient, e).to.have.callCount(index + 1);
      mockClient.args.forEach((args) => {
        expect(args.length).to.equal(1);
        expect(args[0]).to.equal(context);
      });
      expectedStubsToHaveBeenCalled.forEach((stub, j) => {
        if (j <= index) {
          expect(stub, e).to.have.been.calledOnceWithExactly(
            mockOptionsOnRequest,
          );
        } else {
          expect(stub, e).to.have.callCount(0);
        }
      });
    });
  });
});
