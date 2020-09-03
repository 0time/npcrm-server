const { get } = require('@0ti.me/tiny-pfp');
const {
  JSON_SELECTORS: { POOL },
} = require('../../../src/lib/constants');
const supertestCreator = require('../../lib/supertest');

const { bluebird, d, uuid } = deps;

const me = __filename;

d(me, () => {
  let context = null;
  let supertest = null;

  beforeEach(() => {
    context = {};
    const promises = {};

    promises.supertest = supertestCreator.initializeSupertest(context);

    return bluebird.props(promises).then((resolutions) => {
      supertest = resolutions.supertest;
    });
  });

  describe('get', () => {
    let data = null;

    beforeEach(() => {
      data = `data-${uuid()}`;

      get(
        context,
        POOL,
      ).bindQueryAndResponse('SELECT * FROM "Member" LIMIT \'10\'', {
        rows: data,
      });
    });

    it('should respond with 200 and the result of the query', () =>
      supertest.get('/api/member').expect(200, { data }));
  });
});
