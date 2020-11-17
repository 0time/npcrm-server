const {
  JSON_SELECTORS: { CORS_CONFIG },
} = require('../../../src/lib/constants');
const { set } = require('@0ti.me/tiny-pfp');

const {
  d,
  expect,
  sinon: { stub },
  pquire,
  uuid,
} = deps;

const me = __filename;

d(me, () => {
  let context = null;
  let index = null;
  let mockBodyParser = null;
  let mockBodyParserJson = null;
  let mockBodyParserJsonResult = null;
  let mockCors = null;
  let mockCorsConfig = null;
  let mockCorsResult = null;
  let mockLogger = null;
  let mockLoggerResult = null;
  let mocks = null;

  beforeEach(() => {
    context = {};
    mocks = {};

    mockBodyParserJsonResult = `mock-body-parser-json-result-${uuid()}`;
    mockBodyParserJson = stub().returns(mockBodyParserJsonResult);
    mockBodyParser = { json: mockBodyParserJson };
    mocks['body-parser'] = mockBodyParser;

    mockCorsResult = `mock-cors-result-${uuid()}`;
    mockCors = stub().returns(mockCorsResult);
    mocks['cors'] = mockCors;

    mockLoggerResult = `mock-logger-result-${uuid()}`;
    mockLogger = stub().returns(mockLoggerResult);
    mocks['./logger'] = mockLogger;

    mockCorsConfig = `mock-cors-config-${uuid()}`;
    set(context, CORS_CONFIG, mockCorsConfig);

    index = () => pquire(me, mocks)(context);
  });

  it('should compose the middlewares', () =>
    expect(index()).to.deep.equal([
      mockLoggerResult,
      mockCorsResult,
      mockBodyParserJsonResult,
    ]));

  it('should pass context to the logger', () => {
    index();

    expect(mockLogger).to.have.been.calledOnceWithExactly(context);
  });

  it('should pass the cors config to the cors call', () => {
    index();

    expect(mockCors).to.have.been.calledOnceWithExactly(mockCorsConfig);
  });

  it('should call the bodyParser.json with no args', () => {
    index();

    expect(mockBodyParserJson).to.have.been.calledOnceWithExactly();
  });
});
