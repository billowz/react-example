var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config.js');
var host = 'localhost';
var post = 9000;
config.entry.app.push('webpack-dev-server/client?http://' + host + ':' + port,
    'webpack/hot/only-dev-server');
new WebpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true,
    noInfo: false,
    historyApiFallback: true
}).listen(port, host, function(err, result) {
    if (err) console.log(err);
    console.log('Listening at ' + host + ':' + port);
});
