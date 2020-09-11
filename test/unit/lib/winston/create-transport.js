const { set, unset } = require('@0ti.me/tiny-pfp');

const { d, expect, pquire, uuid } = deps;

const me = __filename;

d(me, () => {
  let config = null;
  let createTransport = null;
  let key = null;
  let mockConsole = null;
  let mockConsoleTransportClass = null;
  let mockKey = null;
  let mockKeyTransportClass = null;
  let mocks = null;
  let mockWinston = null;
  let options = null;

  beforeEach(() => {
    config = {};
    mocks = {};

    mockConsoleTransportClass = class {
      constructor(arg) {
        expect(arg).to.equal(options);
      }
    };

    mockKeyTransportClass = class {
      constructor(arg) {
        expect(arg).to.equal(options);
      }
    };

    key = `key-${uuid()}`;
    options = `options-${uuid()}`;

    set(config, 'key', key);
    set(config, 'options', options);

    mockConsole = mockConsoleTransportClass;
    mockKey = mockKeyTransportClass;
    mockWinston = { transports: { [key]: mockKey, Console: mockConsole } };

    mocks['winston'] = mockWinston;

    createTransport = () => pquire(me, mocks)(config);
  });

  it('should return the configured keyed transport', () =>
    expect(createTransport()).to.be.an.instanceof(mockKeyTransportClass));

  describe('given key is not set', () => {
    beforeEach(() => {
      unset(config, 'key');
    });

    it('should return the configured console transport', () =>
      expect(createTransport()).to.be.an.instanceof(mockConsoleTransportClass));
  });
});
