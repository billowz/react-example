/*@MODULE_GENERATOR@*/
/*Thu, 30 Jul 2015 10:04:39 GMT*/
'use strict';

var React = require('react');
var Router = require('react-router');
var Routes = Router.Routes;
var Route = Router.Route;
var rui = require('react-ui');
var Workbench = rui.Workbench;
var Doc = {
  LayoutDocDemo: require('./layout/doc/demo'),
  WorkbenchDocDemo: require('./workbench/doc/demo')
};
Doc.App = React.createClass({
  displayName: 'App',

  render: function render() {}
});
var routes = React.createElement(Route, { handler: Workbench, path: '/' });

Router.run(routes, function (Handler) {
  React.render(React.createElement(Handler, null), document.body);
});

rui.Doc = Doc;
module.exports = rui;