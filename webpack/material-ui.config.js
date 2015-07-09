var webpack = require('webpack');
var libraryPath = './node_modules/material-ui/lib';
module.exports = {
    entry: {
        app: [
            libraryPath
        ]
    },
    output: {
        path: __dirname + '/dist/',
        filename: 'material-ui.js',
        library: 'Material',
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
    externals: {
        react: {
            root: 'React',
            commonjs: "react",
            commonjs2: "react",
            amd: "react"
        }
    }
};
