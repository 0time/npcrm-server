const isCi = !!process.env.CI;
const isTerm = !!process.env.TERM;

module.exports = {
  env: {
    commonjs: true,
    es6: true,
    mocha: true,
    node: true,
  },
  extends: ['eslint:recommended', 'prettier'],
  globals: {
    deps: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-console': isCi ? 'error' : 'warn',
  },
};

if (isTerm) {
  console.error(module.exports);
}
