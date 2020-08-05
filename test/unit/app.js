const { d, expect, sinon, tquire } = deps;

const me = __filename;

d(me, () => {
  const app = tquire(me);

  const startSymbol = Symbol();

  const start = sinon.stub().returns(startSymbol);

  const context = {
    server: {
      start,
    },
  };

  it('should try to start the server and return the result', () => {
    expect(app(context)).to.equal(startSymbol);
  });
});
