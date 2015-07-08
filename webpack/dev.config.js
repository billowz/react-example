var webpack = require('webpack');
var pkg = require('./package.json');
module.exports = {
    entry: {
        app: [
            'webpack/hot/only-dev-server',
            './src/index.js'
        ]
    },
    devtool: 'sourcemap',
    output: {
        publicPath: 'assets/',
        filename: pkg.name + '.js'
    },
    stats: {
        colors: true,
        reasons: false
    },
    externals: [{
        "react": {
            root: "React",
            commonjs2: "react",
            commonjs: "react",
            amd: "react"
        },
        "material-ui": {
            root: "material-ui",
            commonjs2: "material-ui",
            commonjs: "material-ui",
            amd: "material-ui"
        }
    }],
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'eslint-loader!babel-loader'
        }, {
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
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};
