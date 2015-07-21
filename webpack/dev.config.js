var webpack = require('webpack');
var host = 'localhost',
  port = 8089;
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
    library: 'ReactUI2',
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
    },
    'material-ui': {
      root: 'Material',
      commonjs: "material-ui",
      commonjs2: "material-ui",
      amd: "material-ui"
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
