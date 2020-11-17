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
  let volunteer = null;
  let mockDeprecated = null;
  let mockVolunteer = null;
  let mockVolunteerDelete = null;
  let mockVolunteerDeleteResult = null;
  let mockVolunteerGet = null;
  let mockVolunteerGetResult = null;
  let mockVolunteerPut = null;
  let mockVolunteerPutResult = null;
  let mockVolunteerResult = null;
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

    mockVolunteerResult = {};

    mockVolunteerGet = stub().returns(mockVolunteerGetResult);
    set(mockVolunteerResult, GET, mockVolunteerGet);

    mockVolunteerPut = stub().returns(mockVolunteerPutResult);
    set(mockVolunteerResult, PUT, mockVolunteerPut);

    mockVolunteerDelete = stub().returns(mockVolunteerDeleteResult);
    set(mockVolunteerResult, DELETE, mockVolunteerDelete);

    mockVolunteer = stub().returns(mockVolunteerResult);
    mocks['../lib/model/volunteer'] = mockVolunteer;

    req = {};
    mockOptionsOnRequest = `mock-options-on-request-${uuid()}`;
    set(req, OPTIONS_ON_REQUEST, mockOptionsOnRequest);

    volunteer = () => pquire(me, mocks)(context);
  });

  it('should return an array of length 3', () =>
    expect(volunteer().length).to.equal(3));

  it('should return an array of objects each defining the /volunteer route', () =>
    volunteer().forEach((each) =>
      expect(each).to.have.property(ROUTE, '/volunteer'),
    ));

  it('should return an array of objects each defining the expected method', () => {
    const expected = [GET, PUT, DELETE];

    volunteer().forEach((each, i) =>
      expect(each).to.have.property(HTTP_METHOD, expected[i]),
    );
  });

  it('should return an array of objects each composing the sendResolution function', () => {
    const expectedCallbackResult = [
      mockVolunteerGetResult,
      mockVolunteerPutResult,
      mockVolunteerDeleteResult,
    ];
    const expectedStubsToHaveBeenCalled = [
      mockVolunteerGet,
      mockVolunteerPut,
      mockVolunteerDelete,
    ];

    const m = volunteer();

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
      expect(mockVolunteer, e).to.have.callCount(index + 1);
      mockVolunteer.args.forEach((args) => {
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
