const path = require('path');

module.exports = {
    root: true,
    parser: '@babel/eslint-parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
        babelOptions: {
            configFile: path.resolve(__dirname, 'babel.config.json'),
        },
    },
    env: {
        browser: true,
        node: true,
        es2020: true,
    },
    extends: ['eslint:recommended', 'plugin:react/recommended'],
    plugins: ['@babel', 'react'],
    settings: {
        react: {
            version: 'detect',
        }
    },
    rules: {
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'eqeqeq': ['error', 'always', {'null': 'ignore'}],
        'max-len': ['error', 100],
        'comma-dangle': ['error', 'only-multiline']
    }
};