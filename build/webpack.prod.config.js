/* eslint-disable */
const webpack = require('webpack');
const merge = require('webpack-merge');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const cleanWebpackPlugin = require('clean-webpack-plugin');
const webpackBaseConfig = require('./webpack.base.config.js');
const path = require('path');

module.exports = merge(webpackBaseConfig, {
    output: {
        filename: (chunkData) => {
            return chunkData.chunk.name === 'builtIn' ? '[name].min.js': '[name].[chunkhash:8].js';
        },
        chunkFilename: '[name].[chunkhash:8].js'
    },
    plugins: [
        new cleanWebpackPlugin(['dist/*'], {
            root: path.resolve(__dirname, '../')
        }),
        new webpack.HashedModuleIdsPlugin(),
        new HtmlWebpackPlugin({
            filename: './index.html',
            template: './src/templates/index.html',
            chunks: ['vendor', 'main']
        })
        // new BundleAnalyzerPlugin()
    ]
});