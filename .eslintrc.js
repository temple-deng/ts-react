/**
 * @file eslint 配置文件
 * @author dengbo01 <dengbo01@baidu.com>
 * @version 1.0.0 | 2021-02-05 | dengbo01 - 添加文件
 */
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: true,
        },
    },
    env: {
        browser: true,
        node: true,
        es2020: true,
    },
    plugins: [
        'react',
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
        'prettier/react',
        'prettier/@typescript-eslint'
    ],
    settings: {
        react: {
            version: 'detect',
        }
    },
    rules: {
        'react/jsx-uses-react': 'off',
        'react/react-in-jsx-scope': 'off',
        'eqeqeq': ['error', 'always', {'null': 'ignore'}],
        'max-len': ['error', 80],
        'comma-dangle': ['error', 'only-multiline']
    }
};