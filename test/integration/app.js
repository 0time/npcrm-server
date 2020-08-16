const { bluebird, d, expect, tquire } = deps;

const getMockProcess = require('../lib/get-mock-process');

const me = __filename;

d(me, () => {
  const app = tquire(me);

  it('should eventually resolve with a started express server', () =>
    app({ process: getMockProcess(), Promise: bluebird })
      .tap((context) => expect(context).to.have.nested.property('server.stop'))
      .then((context) => context.server.stop(context)));
});
