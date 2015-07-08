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
        library: pkg.name,
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
    plugins: [new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            filename: 'common.js',
            chunks: ['app']
        })
    ]
};
