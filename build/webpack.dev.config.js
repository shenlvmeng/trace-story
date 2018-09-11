/* eslint-disable */
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const base = require('./webpack.base.config');
module.exports = merge({
    devServer: {
        host: '0.0.0.0',
        hot: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: './src/templates/index.html',
            chunks: ['vendor', 'main']
        }),
        new HtmlWebpackPlugin({
            filename: 'built-in.html',
            template: './src/templates/built-in.html',
            chunks: ['vendor', 'builtIn']
        })
    ]
}, base);
