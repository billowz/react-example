var webpack = require('webpack');
var host = 'localhost',
    port = 8080;
module.exports = {
    host: host,
    port: port,
    entry: {
        app: ['webpack-dev-server/client?http://' + host + ':' + port, 'webpack/hot/only-dev-server', './src/index.js']
    },
    devtool: 'sourcemap',
    output: {
        publicPath: '/assets/',
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
            loader: 'react-hot!babel'
        }]
    },
    plugins: [new webpack.HotModuleReplacementPlugin(), new webpack.NoErrorsPlugin()]
};
