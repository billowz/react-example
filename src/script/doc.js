/*@MODULE_GENERATOR@*/
/*Mon, 03 Aug 2015 14:44:47 GMT*/
let React = require('react'),
  Router = require('react-router'),
  {Routes, Route} = Router,
  rui = require('react-ui'),
  Workbench = rui.Workbench,
  Doc={};
  Doc.Compontent = {
      LayoutDocDemo : {
        main: require('./layout/doc/demo'),
        content: ''
      },
      WorkbenchDocDemo : {
        main: require('./workbench/doc/demo'),
        content: 'let React = require(&#39;react&#39;),\n  {WorkBench} = require(&#39;react-ui&#39;);\nmodule.exports = React.createClass({\n  render() {\n    return (&lt;WorkBench title=&#34;Workbench Demo&#34;/&gt;);\n  }\n});\n'
      }
  };
Doc.App = React.createClass({
  render: function(){
  }
});
React.render(<Workbench/>, document.body);


/*var routes = (
  <Route handler={Workbench} path="/">
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});*/

rui.Doc = Doc;
module.exports = rui;
