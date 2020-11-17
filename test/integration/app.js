const { bluebird, d, expect } = deps;

const supertestCreator = require('../lib/supertest');

const me = __filename;

d(me, () => {
  let context = null;
  let supertest = null; // eslint-disable-line no-unused-vars

  beforeEach(() => {
    context = {};
    const promises = {};

    promises.supertest = supertestCreator.initializeSupertest(context);

    return bluebird.props(promises).then((resolutions) => {
      supertest = resolutions.supertest;
    });
  });

  it('should eventually resolve with a started express webServer', () =>
    expect(context).to.have.nested.property('webServer.stop'));
});
