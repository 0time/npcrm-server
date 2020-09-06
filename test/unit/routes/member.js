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
  let member = null;
  let mockDeprecated = null;
  let mockMember = null;
  let mockMemberDelete = null;
  let mockMemberDeleteResult = null;
  let mockMemberGet = null;
  let mockMemberGetResult = null;
  let mockMemberPut = null;
  let mockMemberPutResult = null;
  let mockMemberResult = null;
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

    mockMemberResult = {};

    mockMemberGet = stub().returns(mockMemberGetResult);
    set(mockMemberResult, GET, mockMemberGet);

    mockMemberPut = stub().returns(mockMemberPutResult);
    set(mockMemberResult, PUT, mockMemberPut);

    mockMemberDelete = stub().returns(mockMemberDeleteResult);
    set(mockMemberResult, DELETE, mockMemberDelete);

    mockMember = stub().returns(mockMemberResult);
    mocks['../lib/model/member'] = mockMember;

    req = {};
    mockOptionsOnRequest = `mock-options-on-request-${uuid()}`;
    set(req, OPTIONS_ON_REQUEST, mockOptionsOnRequest);

    member = () => pquire(me, mocks)(context);
  });

  it('should return an array of length 3', () =>
    expect(member().length).to.equal(3));

  it('should return an array of objects each defining the /member route', () =>
    member().forEach((each) =>
      expect(each).to.have.property(ROUTE, '/member'),
    ));

  it('should return an array of objects each defining the expected method', () => {
    const expected = [GET, PUT, DELETE];

    member().forEach((each, i) =>
      expect(each).to.have.property(HTTP_METHOD, expected[i]),
    );
  });

  it('should return an array of objects each composing the sendResolution function', () => {
    const expectedCallbackResult = [
      mockMemberGetResult,
      mockMemberPutResult,
      mockMemberDeleteResult,
    ];
    const expectedStubsToHaveBeenCalled = [
      mockMemberGet,
      mockMemberPut,
      mockMemberDelete,
    ];

    const m = member();

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
      expect(mockMember, e).to.have.callCount(index + 1);
      mockMember.args.forEach((args) => {
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
