var webpack = require('webpack');
module.exports = {
    entry: {
        app: ['./src/index.js']
    },
    output: {
        path: __dirname + '/dist/',
        filename: 'react-ui.js',
        library: 'ReactUI',
        libraryTarget: 'umd'
    },
    stats: {
        colors: true,
        reasons: false
    },
    resolve: {
        root: ['./src'],
        extensions: ['', '.js', '.jsx']
    },
    externals: {
        react: {
            root: 'React',
            commonjs: "react",
            commonjs2: "react",
            amd: "react"
        }
    },
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel'
        }]
    },
    plugins: []
};
