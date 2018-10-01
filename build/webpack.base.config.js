const HappyPack = require('happypack');
const happyThreadPool = HappyPack.ThreadPool({ size: 4 });
const autoprefixer = require('autoprefixer');
const path = require('path');

module.exports = {
    entry: {
        vendor: ['@babel/polyfill', 'react', 'react-dom'],
        main: './src/page/main',
        builtIn: './src/built-in'
    },
    output: {
        path: path.join(__dirname, '../dist/')
    },
    module: {
        rules: [
            {
                test: /\.(css|less)$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            minimize: process.env.NODE_ENV === 'production'
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: [
                                autoprefixer({
                                    browsers: ['ios >= 8']
                                })
                            ]
                        }
                    },
                    {
                        loader: 'less-loader'
                    }
                ]
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: 'happypack/loader?id=babel'
            },
            {
                test: /\.(jpg|jpeg|gif|png)$/,
                use: [{
                    loader: 'url-loader',
                    options: {
                        name: '[hash:8].[ext]',
                        limit: 50000
                    }
                }],
            }
        ]
    },
    plugins: [
        new HappyPack({
            id: 'babel',
            loaders: ['babel-loader'],
            threadPool: happyThreadPool,
            verbose: true
        })
    ],
    resolve: {
        alias: {
            '@': path.join(__dirname, '../src')
        },
        extensions: ['.js', '.jsx']
    }
};
