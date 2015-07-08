var webpack = require('webpack');
var libraryPath = './node_modules/material-ui/lib';
var libraryName = 'material-ui';
module.exports = {
    libraryPath: libraryPath,
    libraryName: libraryName,
    entry: {
        app: [
            libraryPath
        ]
    },
    output: {
        publicPath: 'assets/',
        filename: libraryName + '.js',
        library: libraryName,
        libraryTarget: 'amd'
    },
    stats: {
        colors: true,
        reasons: false
    },
    resolve: {
        root: [libraryPath],
        extensions: ['', '.js']
    },
    externals: {
        react: "react"
    }
};
