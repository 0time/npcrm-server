const { get, set } = require('@0ti.me/tiny-pfp');
const {
  HTTP_METHODS: { DELETE, GET, PUT },
  JSON_SELECTORS: { POOL },
} = require('../../../src/lib/constants');
const { OK } = require('http-status-codes');
const supertestCreator = require('../../lib/supertest');

const { _, bluebird, d, nextInt, uuid } = deps;

const me = __filename;

d(me, () => {
  let config = null;
  let context = null;
  let data = null;
  let supertest = null;

  beforeEach(() => {
    data = `data-${uuid()}`;

    context = {};

    config = _.clone(require('config'));

    set(context, 'config', config);

    const promises = {};

    promises.supertest = supertestCreator.initializeSupertest(context);

    return bluebird.props(promises).then((resolutions) => {
      supertest = resolutions.supertest;
    });
  });

  describe(GET, () => {
    beforeEach(() => {
      get(context, POOL).bindQueryAndResponse(
        'SELECT * FROM "Member" LIMIT \'10\'',
        {
          rows: data,
        },
      );
    });

    it('should respond with OK and the result of the query', () =>
      supertest.get('/api/member').expect(OK, { data }));
  });

  describe(DELETE, () => {
    let id = null;

    beforeEach(() => {
      id = nextInt();

      get(context, POOL).bindQueryAndResponse(
        `DELETE FROM "Member" WHERE id = $1;`,
        [id],
        {
          rows: data,
        },
      );
    });

    it('should respond with OK and the empty data rows result', () =>
      supertest.delete('/api/member').send({ id }).expect(OK, { data }));
  });

  describe(PUT, () => {
    let name = null;

    beforeEach(() => {
      name = `name-${uuid()}`;
    });

    describe('create', () => {
      beforeEach(() => {
        get(
          context,
          POOL,
        ).bindQueryAndResponse(
          `INSERT INTO "Member" ( name ) VALUES ( $1 );`,
          [name],
          { rows: data },
        );
      });

      it('should respond with OK and the empty data rows result', () =>
        supertest.put('/api/member').send({ name }).expect(OK, { data }));
    });

    describe('update', () => {
      let id = null;

      beforeEach(() => {
        id = nextInt();
        get(
          context,
          POOL,
        ).bindQueryAndResponse(
          `UPDATE "Member" SET name = $1 WHERE id = $2;`,
          [name, id],
          { rows: data },
        );
      });

      it('should respond with OK and the empty data rows result', () =>
        supertest.put('/api/member').send({ id, name }).expect(OK, { data }));
    });
  });
});
