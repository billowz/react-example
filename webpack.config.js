var webpack = require('webpack');
var pkg = require('./package.json');
module.exports = {
    entry: {
        app: [
            './lib/index.js'
        ]
    },
    output: {
        publicPath: 'assets/',
        filename: '[name].js',
        library: 'MyComponentExample',
        libraryTarget: 'amd'
    },
    stats: {
        colors: true,
        reasons: false
    },
    resolve: {
        root: ['./lib'],
        extensions: ['', '.js', '.jsx']
    },
    externals: {
        react: "react"
    },
    module: {
        loaders: [{
            test: /\.less$/,
            loader: 'style-loader!css-loader!autoprefixer-loader!less-loader'
        }, {
            test: /\.css$/,
            loader: 'style-loader!css-loader'
        }, {
            test: /\.(png|jpg|woff|woff2)$/,
            loader: 'url-loader?limit=8192'
        }]
    },
    plugins: [new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'common.js',
            chunks: [
                'app'
            ]
        }),
        new webpack.ProvidePlugin({
            React: "react"
        })
    ]
};
