const { get, set } = require('@0ti.me/tiny-pfp');
const {
  HTTP_METHODS: { DELETE, GET, PUT },
  JSON_SELECTORS: { POOL },
} = require('../../../src/lib/constants');
const { OK } = require('http-status-codes');
const supertestCreator = require('../../lib/supertest');

const { _, d, nextInt, uuid } = deps;

const me = __filename;

d(me, () => {
  let argSets = null;
  let config = null;
  let context = null;
  let data = null;
  let getASupertest = null;

  beforeEach(() => {
    context = {};

    config = _.clone(require('config'));

    set(context, 'config', config);

    getASupertest = (queryAndResponseArgSets = argSets) =>
      supertestCreator.initializeSupertest(context).then((supertest) => {
        queryAndResponseArgSets.forEach((argSet) =>
          get(context, POOL).bindQueryAndResponse(...argSet),
        );

        return supertest;
      });
  });

  describe(GET, () => {
    describe('given a list of fields is not provided', () => {
      beforeEach(() => {
        data = `method-${GET}-data-${uuid()}`;

        argSets = [
          [
            'SELECT * FROM "Member" LIMIT \'10\'',
            {
              rows: data,
            },
          ],
        ];
      });

      it('should respond with OK and the result of the query', () =>
        getASupertest().then((supertest) =>
          supertest.get('/api/member').expect(OK, { data }),
        ));
    });

    describe('given a list of fields is provided', () => {
      let field1 = null;
      let field2 = null;

      beforeEach(() => {
        data = `method-${GET}-data-${uuid()}`;

        field1 = `field-1-${uuid()}`;
        field2 = `field-2-${uuid()}`;

        argSets = [
          [
            `SELECT "${field1}" , "${field2}" FROM "Member" LIMIT '10'`,
            {
              rows: data,
            },
          ],
        ];
      });

      it('should only select relevant fields', () =>
        getASupertest().then((supertest) =>
          supertest
            .get('/api/member')
            .send({ fields: [field1, field2] })
            .expect(OK, { data }),
        ));
    });
  });

  describe(DELETE, () => {
    let id = null;

    beforeEach(() => {
      data = `method-${DELETE}-data-${uuid()}`;

      id = nextInt();

      argSets = [
        [
          `DELETE FROM "Member" WHERE id = $1;`,
          [id],
          {
            rows: data,
          },
        ],
      ];
    });

    it('should respond with OK and the empty data rows result', () =>
      getASupertest().then((supertest) =>
        supertest.delete('/api/member').send({ id }).expect(OK, { data }),
      ));
  });

  describe(PUT, () => {
    let name = null;

    beforeEach(() => {
      data = `method-${PUT}-data-${uuid()}`;

      name = `name-${uuid()}`;
    });

    describe('create', () => {
      beforeEach(() => {
        data = `method-${PUT}-data-${uuid()}`;

        argSets = [
          [
            `INSERT INTO "Member" ( name ) VALUES ( $1 );`,
            [name],
            { rows: data },
          ],
        ];
      });

      it('should respond with OK and the empty data rows result', () =>
        getASupertest().then((supertest) =>
          supertest.put('/api/member').send({ name }).expect(OK, { data }),
        ));
    });

    describe('update', () => {
      let id = null;

      beforeEach(() => {
        data = `method-${PUT}-data-${uuid()}`;

        id = nextInt();
        argSets = [
          [
            `UPDATE "Member" SET name = $1 WHERE id = $2;`,
            [name, id],
            { rows: data },
          ],
        ];
      });

      it('should respond with OK and the empty data rows result', () =>
        getASupertest().then((supertest) =>
          supertest.put('/api/member').send({ id, name }).expect(OK, { data }),
        ));
    });
  });
});
