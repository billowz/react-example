var webpack = require('webpack');
var cfg = Object.create(require('./config.js'));
cfg.host = 'localhost';
cfg.port = 8080;
cfg.output.publicPath = "/assets/";
cfg.entry.app.push('webpack-dev-server/client?http://' + cfg.host + ':' + cfg.port, 'webpack/hot/only-dev-server');
cfg.devtool = 'sourcemap';

for (var i = 0; i < cfg.module.loaders.length; i++) {
    cfg.module.loaders[i].loader = 'react-hot!' + cfg.module.loaders[i].loader;
}
cfg.plugins = cfg.plugins || [];
cfg.plugins.push(new webpack.HotModuleReplacementPlugin(), new webpack.NoErrorsPlugin());
module.exports = cfg;
