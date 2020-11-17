const {
  JSON_SELECTORS: { ENABLE_DB_VERSIONING },
} = require('../../src/lib/constants');
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
  let app = null;
  let context = null;
  let dbStart = null;
  let dbStartSymbol = null;
  let dbStop = null;
  let dbStopSymbol = null;
  let mockError = null;
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

    set(context, ENABLE_DB_VERSIONING, true);

    mockError = new Error(`mock-error-${uuid()}`);

    mocks = {};

    mockLogger = require('../lib/get-mock-logger')();

    mocks['./lib/initialize-logger'] = (context) =>
      Object.assign(context, { logger: mockLogger });

    mockPostgresDbVersioning = stub().resolves();

    mocks['@0ti.me/postgres-db-versioning'] = mockPostgresDbVersioning;

    app = () => pquire(me, mocks)(context);
  });

  it('should try to start the webServer and resolve the context', () =>
    expect(app()).to.eventually.deep.equal(context));

  describe('given the postgresDbVersioning is disabled', () => {
    beforeEach(() => {
      set(context, ENABLE_DB_VERSIONING, false);
    });

    it('should just return the context and not try to run that process', () =>
      expect(app())
        .to.eventually.deep.equal(context)
        .then(() => expect(mockPostgresDbVersioning).to.not.have.been.called));
  });

  describe('given the db rejects with an error', () => {
    beforeEach(() => {
      mockError = new Error(`mock-error-${uuid()}`);
      dbStart = stub().rejects(mockError);
      set(context, 'dbConnPool.start', dbStart);
    });

    it('should catch and log the error', () =>
      expect(app()).to.eventually.be.fulfilled.then(() =>
        expect(context.logger.fatal.args).to.have.nested.property(
          '0.0',
          mockError,
        ),
      ));
  });

  describe('given the webServer rejects with an error', () => {
    beforeEach(() => {
      mockError = new Error(`mock-error-${uuid()}`);
      webStart = stub().rejects(mockError);
      set(context, 'webServer.start', webStart);
    });

    it('should catch and log the error', () =>
      expect(app()).to.eventually.be.fulfilled.then(() =>
        expect(context.logger.fatal.args).to.have.nested.property(
          '0.0',
          mockError,
        ),
      ));
  });

  describe('given the postgresDbVersioning rejects with an error', () => {
    beforeEach(() => {
      mocks['@0ti.me/postgres-db-versioning'] = stub().rejects(mockError);
    });

    it('should catch and log the error', () =>
      expect(app()).to.eventually.be.fulfilled.then(() =>
        expect(context.logger.fatal.args).to.have.nested.property(
          '0.0',
          mockError,
        ),
      ));
  });
});
