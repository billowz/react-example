/*@MODULE_GENERATOR@*/
/*Thu, 30 Jul 2015 10:04:49 GMT*/
let React = require('react'),
  Router = require('react-router'),
  {Routes, Route} = Router,
  rui = require('react-ui'),
  Workbench = rui.Workbench,
  Doc = {
      LayoutDocDemo : require('./layout/doc/demo'),
      WorkbenchDocDemo : require('./workbench/doc/demo')
  };
Doc.App = React.createClass({
  render: function(){
  }
});
var routes = (
  <Route handler={Workbench} path="/">
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});

rui.Doc = Doc;
module.exports = rui;
