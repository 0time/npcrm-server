const {
  d,
  expect,
  pquire,
  sinon: { stub },
  uuid,
} = deps;

const me = __filename;

d(me, () => {
  let context = null;
  let config = null;
  let index = null;
  let mockAddDeleteMethod = null;
  let mockAddDeleteMethodCreator = null;
  let mockAddGetMethod = null;
  let mockAddGetMethodCreator = null;
  let mockAddPutMethod = null;
  let mockAddPutMethodCreator = null;
  let mockFlow = null;
  let mockFlowCreator = null;
  let mockFlowResult = null;
  let mocks = null;
  let mockValidate = null;
  let mockValidateCreator = null;

  beforeEach(() => {
    context = `context-${uuid()}`;
    config = `config-${uuid()}`;
    mocks = {};

    mockValidate = `mock-validate-method-${uuid()}`;
    mockValidateCreator = stub().returns(mockValidate);
    mocks['./validate'] = mockValidateCreator;

    mockAddDeleteMethod = `mock-add-delete-method-${uuid()}`;
    mockAddDeleteMethodCreator = stub().returns(mockAddDeleteMethod);
    mocks['./add-delete-method'] = mockAddDeleteMethodCreator;

    mockAddGetMethod = `mock-add-get-method-${uuid()}`;
    mockAddGetMethodCreator = stub().returns(mockAddGetMethod);
    mocks['./add-get-method'] = mockAddGetMethodCreator;

    mockAddPutMethod = `mock-add-put-method-${uuid()}`;
    mockAddPutMethodCreator = stub().returns(mockAddPutMethod);
    mocks['./add-put-method'] = mockAddPutMethodCreator;

    mockFlowResult = `mock-flow-result-${uuid()}`;
    mockFlow = stub().returns(mockFlowResult);
    mockFlowCreator = stub().returns(mockFlow);
    mocks['@0ti.me/tiny-pfp'] = { fp: { flow: mockFlowCreator } };

    index = () => pquire(me, mocks)(context, config);
  });

  it('should only call flow once with one parameter that is an array', () => {
    index();

    expect(mockFlowCreator.args.length).to.equal(1);
    expect(mockFlowCreator.args[0].length).to.equal(1);
    expect(mockFlowCreator.args[0]).to.be.an('array');
  });

  it('should flow validate first', () => {
    index();

    expect(mockFlowCreator.args[0][0][0]).to.deep.equal(mockValidate);
  });

  it('should add all the model calls', () => {
    index();

    [mockAddDeleteMethod, mockAddGetMethod, mockAddPutMethod].forEach((ea) =>
      expect(mockFlowCreator.args[0][0]).to.include(ea),
    );
  });

  it('should call the composed function (result of flow([...])) with an empty object', () => {
    index();

    expect(mockFlow).to.have.been.calledOnceWithExactly({});
  });

  it('should return the result of the flow call', () =>
    expect(index()).to.equal(mockFlowResult));

  it('should compose each of the functions with (context, config)', () => {
    index();

    [
      mockValidateCreator,
      mockAddDeleteMethodCreator,
      mockAddGetMethodCreator,
      mockAddPutMethodCreator,
    ].forEach((ea) =>
      expect(ea).to.have.been.calledOnceWithExactly(context, config),
    );
  });
});
