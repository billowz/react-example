let React = require('react'),
  Router = require('react-router'),
  {Routes, Route} = Router,
  rui = require('react-ui'),
  Workbench = rui.Workbench,
  Doc={};
  Doc.Compontent = {<% for (var i = 0; i < modules.length; i++) { %>
    <%= modules[i].name %> : {
        demos : {<% Object.keys(modules[i].demos).forEach(function(demoName, idx){ %>
            <%=demoName%> : {
                compontent : require('<%=modules[i].demos[demoName].path%>'),
                code : '<%=modules[i].demos[demoName].content.replace(/\n/g, '\\n')%>'
            }<%= idx < modules[i].demos.length - 1 ? "," : "" %><%})%>
        },
        readmes : {<% Object.keys(modules[i].readmes).forEach(function(readmeName, idx){ %>
            <%=readmeName%> : '<%=modules[i].readmes[readmeName].replace(/\n/g, '\\n')%>'<%= idx < modules[i].readmes.length - 1 ? "," : "" %><%})%>
        }
    }<%= i < modules.length - 1 ? "," : "" %><% } %>
  };
Doc.App = React.createClass({
  render: function(){
    let config = {
        type:'GridLayout',
        option:{
            size:'1'
        },
        children:[
        ]
    }
    return <Workbench compontents={[config]}></Workbench>
  }
});
React.render(<Doc.App/>, document.body);


/*var routes = (
  <Route handler={Workbench} path="/">
  </Route>
);

Router.run(routes, function (Handler) {
  React.render(<Handler/>, document.body);
});*/

rui.Doc = Doc;
module.exports = rui;
