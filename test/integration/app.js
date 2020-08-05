const { bluebird, d, expect, tquire } = deps;

const me = __filename;

d(me, () => {
  const app = tquire(me);

  it('should eventually resolve with a started express server', () =>
    app({ Promise: bluebird })
      .tap(context => expect(context).to.have.nested.property('server.stop'))
      .then(context => context.server.stop()));
});
