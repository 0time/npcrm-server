const config = require('config');
const getMockLogger = require('../../../lib/get-mock-logger');

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
  let logger = null;
  let mocks = null;
  let queryResponse = null;
  let queryStub = null;
  let start = null;

  class Pool {
    constructor() {
      this.query = queryStub;
    }
  }

  beforeEach(() => {
    logger = getMockLogger();

    context = { config, logger, Promise };
    mocks = {};

    queryResponse = `query-response-${uuid()}`;

    queryStub = stub().resolves(queryResponse);

    mocks['pg'] = { Pool };

    start = () => pquire(me, mocks)(context);
  });

  it('should promise to start a db connection pool and resolve with a simple query testing the connection', () =>
    expect(start()).to.eventually.be.fulfilled.then((resp) =>
      expect(resp).to.equal(queryResponse),
    ));

  describe('given a failing query', () => {
    let queryRejection = null;

    beforeEach(() => {
      queryRejection = new Error(`query-rejection-${uuid()}`);
      queryStub = stub().rejects(queryRejection);
    });

    it('should reject with an error', () =>
      expect(start()).to.eventually.be.rejectedWith(queryRejection));
  });
});
