const {
  bluebird,
  d,
  expect,
  sinon: { stub },
  uuid,
} = deps;

const supertestCreator = require('../lib/supertest');

const me = __filename;

d(me, () => {
  let context = null;
  let supertest = null; // eslint-disable-line no-unused-vars

  beforeEach(() => {
    context = {};

    supertest = () => supertestCreator.initializeSupertest(context);
  });

  describe('given a purposefully failing dbConnPool.start', () => {
    let mockError = null;

    beforeEach(() => {
      mockError = new Error(uuid());

      context = {
        dbConnPool: {
          start: stub().usingPromise(bluebird).rejects(mockError),
        },
        webServer: {
          start: () => Promise.resolve(),
          stop: () => Promise.resolve(),
        },
      };
    });

    it('should log an error if one occurs', () =>
      supertest().then(() => [
        expect(context.logger.fatal.args.length).to.equal(1),
        expect(context.logger.fatal.args).to.have.deep.nested.property(
          '0.0',
          mockError,
        ),
      ]));
  });
});
