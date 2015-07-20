var webpack = require('webpack');
module.exports = {
  entry: {
    app: ['./src/index.js']
  },
  output: {
    path: __dirname + '/dist/',
    filename: 'react-ui.js',
    library: 'RUI',
    libraryTarget: 'umd'
  },
  stats: {
    colors: true,
    reasons: false
  },
  resolve: {
    extensions: ['', '.js','.jsx']
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
      loader: 'babel'
    }]
  },
  plugins: []
};
