var webpack = require('webpack');
var libraryPath = './src/react.js';
module.exports = {
    entry: {
        app: [
            libraryPath
        ]
    },
    output: {
        path: __dirname + '/dist/',
        filename: 'react.js',
        library: 'React',
        libraryTarget: 'umd'
    },
    stats: {
        colors: true,
        reasons: false
    },
    resolve: {
        root: [libraryPath],
        extensions: ['', '.js']
    },
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel'
        }]
    }
};
