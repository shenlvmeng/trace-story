/* eslint-disable */
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const webpackBaseConfig = require('./webpack.base.config.js');
const path = require('path');

module.exports = merge(webpackBaseConfig, {
    output: {
        filename: '[name].[chunkhash:8].js',
        chunkFilename: '[name].[chunkhash:8].js'
    },
    plugins: [
        new cleanWebpackPlugin(['output/*'], {
            root: path.resolve(__dirname, '../')
        }),
        new webpack.HashedModuleIdsPlugin(),
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/templates/index.html',
            chunks: ['vendor', 'main']
        })
    ]
});