const getMockLogger = require('../../lib/get-mock-logger');
const {
  JSON_SELECTORS: { OPTIONS_ON_REQUEST },
} = require('../../../src/lib/constants');
const { get, set } = require('@0ti.me/tiny-pfp');

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
  let expectedOptions = null;
  let logger = null;
  let mocks = null;
  let next = null;
  let nextResult = null;
  let processParameters = null;
  let req = null;
  let res = null;

  beforeEach(() => {
    context = {};
    mocks = {};

    logger = getMockLogger();

    req = {
      body: {
        a: `body-a-${uuid()}`,
        b: `body-b-${uuid()}`,
        c: `body-c-${uuid()}`,
      },
      params: {
        a: `params-a-${uuid()}`,
        c: `params-c-${uuid()}`,
        d: `params-d-${uuid()}`,
        e: `params-e-${uuid()}`,
      },
      query: {
        a: `query-a-${uuid()}`,
        b: `query-b-${uuid()}`,
        d: `query-d-${uuid()}`,
        f: `query-f-${uuid()}`,
      },
      someOtherField: uuid(),
    };
    res = {};
    expectedOptions = {
      a: req.body.a,
      b: req.body.b,
      c: req.body.c,
      d: req.query.d,
      e: req.params.e,
      f: req.query.f,
    };

    nextResult = `next-result-${uuid()}`;
    next = stub().returns(nextResult);

    set(context, 'logger', logger);

    processParameters = () => pquire(me, mocks)(context)(req, res, next);
  });

  it('should context.logger.trace the inputs and options', () => {
    processParameters();

    expect(context.logger.trace.args).to.deep.equal([
      [
        {
          inputs: { body: req.body, params: req.params, query: req.query },
          options: expectedOptions,
        },
      ],
    ]);
  });

  it('should set the options on request', () => {
    processParameters();

    expect(get(req, OPTIONS_ON_REQUEST)).to.deep.equal(expectedOptions);
  });

  it('should call next', () => {
    expect(processParameters).to.not.throw().and.to.equal(nextResult);

    expect(next).to.have.been.calledOnceWithExactly();
  });
});
