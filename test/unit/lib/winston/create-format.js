const { set, unset } = require('@0ti.me/tiny-pfp');

const {
  d,
  expect,
  pquire,
  sinon: { stub },
  uuid,
} = deps;

const me = __filename;

d(me, () => {
  let config = null;
  let createFormat = null;
  let definedCustomFormatterKey = null;
  let definedCustomFormatter = null;
  let definedCustomFormatterResult = null;
  let definedCustomFormatterResultResult = null;
  let key = null;
  let mockFormat = null;
  let mockFormatResult = null;
  let mockFormatResultResult = null;
  let mockFormatKey = null;
  let mockFormatKeyResult = null;
  let mocks = null;
  let options = null;
  let undefinedCustomFormatterKey = null;

  beforeEach(() => {
    mocks = {};
    config = {};

    key = `key-${uuid()}`;
    options = `options-${uuid()}`;

    mockFormatResultResult = `mock-format-result-result-${uuid()}`;
    mockFormatKeyResult = `mock-format-key-result-${uuid()}`;
    mockFormatResult = stub().returns(mockFormatResultResult);
    mockFormatKey = stub().returns(mockFormatKeyResult);
    mockFormat = stub().returns(mockFormatResult);
    set(mockFormat, key, mockFormatKey);
    mocks['winston'] = { format: mockFormat };

    definedCustomFormatterKey = `defined-custom-formatter-key-${uuid()}`;
    undefinedCustomFormatterKey = `undefined-custom-formatter-key-${uuid()}`;
    definedCustomFormatterResultResult = `defined-custom-formatter-result-result-${uuid()}`;
    definedCustomFormatterResult = stub().returns(
      definedCustomFormatterResultResult,
    );
    definedCustomFormatter = stub().returns(definedCustomFormatterResult);

    mocks['./custom-formatters'] = {
      [definedCustomFormatterKey]: definedCustomFormatter,
    };

    set(config, 'key', key);
    set(config, 'options', options);

    createFormat = () => pquire(me, mocks)(config);
  });

  describe('given a format function', () => {
    let mockFn = null;

    beforeEach(() => {
      mockFn = `fn-${uuid()}`;

      set(config, 'fn', mockFn);
    });

    it('should call winston.format with it', () => {
      createFormat();

      expect(mockFormat).to.have.been.calledOnceWithExactly(mockFn);
    });

    it('should return the result of winston.format', () =>
      expect(createFormat()).to.equal(mockFormatResultResult));

    it('should call the configured winston.format(fn) with options', () => {
      createFormat();

      expect(mockFormatResult).to.have.been.calledOnceWithExactly(options);
    });

    describe('given no key or options', () => {
      beforeEach(() => {
        unset(config, 'key');
        unset(config, 'options');
      });

      it('should call winston.format with it', () => {
        createFormat();

        expect(mockFormat).to.have.been.calledOnceWithExactly(mockFn);
      });

      it('should call the configured winston.format(fn) with an empty obj', () => {
        createFormat();

        expect(mockFormatResult).to.have.been.calledOnceWithExactly({});
      });

      it('should return the result of winston.format', () =>
        expect(createFormat()).to.equal(mockFormatResultResult));
    });
  });

  it('should call winston.format.${key} with the options', () => {
    createFormat();

    expect(mockFormatKey).to.have.been.calledOnceWithExactly(options);
  });

  it('should return the result of winston.format.${key}', () =>
    expect(createFormat()).to.equal(mockFormatKeyResult));

  describe('given a custom formatter', () => {
    beforeEach(() => {
      set(config, 'key', definedCustomFormatterKey);
    });

    it('should use the custom formatter', () => {
      createFormat();
      expect(mockFormat).to.have.been.calledOnceWithExactly(
        definedCustomFormatter,
      );
    });
  });

  describe('given a custom formatter that does not exist', () => {
    beforeEach(() => {
      set(config, 'key', undefinedCustomFormatterKey);
    });

    it('should throw', () => expect(createFormat).to.throw());
  });
});
