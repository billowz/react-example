let React = require('react'),
  Router = require('react-router'),
  {Routes, Route} = Router,
  rui = require('react-ui'),
  Workbench = rui.Workbench,
  Doc;
  Doc.Compontent = {<% for (var i = 0; i < modules.length; i++) { %>
      <%= modules[i].name %> : {
        main: require('<%=modules[i].path%>'),
        content: '<%=modules[i].getContent().replace(/\n/g, '\\n')%>'
      }<%= i < modules.length - 1 ? "," : "" %><% } %>
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
