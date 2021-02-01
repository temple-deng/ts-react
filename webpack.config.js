const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const CSSMinimizerPlugin = require('css-minimizer-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const PROD = 'production';
const mode = process.env.NODE_ENV || PROD;

module.exports = {
    entry: {
        main: './src/App.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].bundle.js',
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, 'page/index.html')
        }),
        new MiniCSSExtractPlugin({
            filename:  '[name].bundle.css',
        }),
        new ESLintPlugin({
            files: 'src/**/*.js',
            emitError: true,
            emitWarning: true,
        }),
        new StylelintPlugin({
            files: './src/**/*.(le|c)ss',
        }),
    ],
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            },
            {
                test: /\.(le|c)ss$/i,
                use: [
                    MiniCSSExtractPlugin.loader,
                    'css-loader',
                    'postcss-loader',
                    'less-loader',
                ],
            }
        ],
    }
};