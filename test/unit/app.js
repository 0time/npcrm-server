const {
  d,
  expect,
  sinon: { stub },
  pquire,
  uuid,
} = deps;

const me = __filename;

d(me, () => {
  let app = null;
  let context = null;
  let dbStart = null;
  let dbStartSymbol = null;
  let dbStop = null;
  let dbStopSymbol = null;
  let mockLogger = null;
  let mockPostgresDbVersioning = null;
  let mocks = null;
  let webStart = null;
  let webStartSymbol = null;
  let webStop = null;
  let webStopSymbol = null;

  beforeEach(() => {
    dbStartSymbol = `db-start-${uuid()}`;
    dbStopSymbol = `db-stop-${uuid()}`;
    webStartSymbol = `web-start-${uuid()}`;
    webStopSymbol = `web-stop-${uuid()}`;

    webStart = stub().resolves(webStartSymbol);
    webStop = stub().resolves(webStopSymbol);

    dbStart = stub().resolves(dbStartSymbol);
    dbStop = stub().resolves(dbStopSymbol);

    context = {
      dbConnPool: {
        start: dbStart,
        stop: dbStop,
      },
      webServer: {
        start: webStart,
        stop: webStop,
      },
    };

    mocks = {};

    mockLogger = require('../lib/get-mock-logger')();

    mocks['./lib/initialize-logger'] = (context) =>
      Object.assign(context, { logger: mockLogger });

    mockPostgresDbVersioning = stub().resolves();

    mocks['@0ti.me/postgres-db-versioning'] = mockPostgresDbVersioning;

    app = pquire(me, mocks);
  });

  it('should try to start the webServer and resolve the context', () =>
    expect(app(context)).to.eventually.deep.equal(context));
});
