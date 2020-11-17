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
  let staff = null;
  let mockDeprecated = null;
  let mockStaff = null;
  let mockStaffDelete = null;
  let mockStaffDeleteResult = null;
  let mockStaffGet = null;
  let mockStaffGetResult = null;
  let mockStaffPut = null;
  let mockStaffPutResult = null;
  let mockStaffResult = null;
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

    mockStaffResult = {};

    mockStaffGet = stub().returns(mockStaffGetResult);
    set(mockStaffResult, GET, mockStaffGet);

    mockStaffPut = stub().returns(mockStaffPutResult);
    set(mockStaffResult, PUT, mockStaffPut);

    mockStaffDelete = stub().returns(mockStaffDeleteResult);
    set(mockStaffResult, DELETE, mockStaffDelete);

    mockStaff = stub().returns(mockStaffResult);
    mocks['../lib/model/staff'] = mockStaff;

    req = {};
    mockOptionsOnRequest = `mock-options-on-request-${uuid()}`;
    set(req, OPTIONS_ON_REQUEST, mockOptionsOnRequest);

    staff = () => pquire(me, mocks)(context);
  });

  it('should return an array of length 3', () =>
    expect(staff().length).to.equal(3));

  it('should return an array of objects each defining the /staff route', () =>
    staff().forEach((each) => expect(each).to.have.property(ROUTE, '/staff')));

  it('should return an array of objects each defining the expected method', () => {
    const expected = [GET, PUT, DELETE];

    staff().forEach((each, i) =>
      expect(each).to.have.property(HTTP_METHOD, expected[i]),
    );
  });

  it('should return an array of objects each composing the sendResolution function', () => {
    const expectedCallbackResult = [
      mockStaffGetResult,
      mockStaffPutResult,
      mockStaffDeleteResult,
    ];
    const expectedStubsToHaveBeenCalled = [
      mockStaffGet,
      mockStaffPut,
      mockStaffDelete,
    ];

    const m = staff();

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
      expect(mockStaff, e).to.have.callCount(index + 1);
      mockStaff.args.forEach((args) => {
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
