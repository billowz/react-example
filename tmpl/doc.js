let React = require('react'),
  RUI = require('react-ui'),
  {Workbench, Data} = RUI,
  MemoryDataPovider = Data.MemoryPovider,
  Doc={};
  Doc.Compontent = {<% for (var i = 0; i < modules.length; i++) { %>
    <%= modules[i].name %> : {
        demos : {<% Object.keys(modules[i].demos).forEach(function(demoName, idx){ %>
            <%=demoName%> : {
                compontent : require('<%=modules[i].demos[demoName].path%>'),
                code : '<%=modules[i].demos[demoName].content.replace(/[\r\n]/g, '\\n').replace(/\t/g, '  ')%>'
            }<%= idx < modules[i].demos.length - 1 ? "," : "" %><%})%>
        },
        readmes : {<% Object.keys(modules[i].readmes).forEach(function(readmeName, idx){ %>
            <%=readmeName%> : '<%=modules[i].readmes[readmeName].replace(/\n/g, '\\n').replace(/\t/g, '  ')%>'<%= idx < modules[i].readmes.length - 1 ? "," : "" %><%})%>
        }
    }<%= i < modules.length - 1 ? "," : "" %><% } %>
  };

Doc.App = React.createClass({
  render: function(){
    let config = {
        type:'GridLayout',
        option:{
            size:'1-12'
        },
        children:[{
            type:'Menu',
            option:{
                horizontal:false,
                title:'React UI'
            },
            dataPovider: new MemoryDataPovider([{
                text:'Introducation',
                href:'#'
            },{
                text:'Getting Started',
                href:'#'
            },{
                text:'Compontents',
                href:'#',
                children:Object.keys(Doc.Compontent).map(function(key){
                    return {
                        text:key,
                        href:'#',
                        target: '_blank',
                        children:[{
                              text:'Introducation',
                              href:'#'
                          },{
                              text:'Getting Started',
                              href:'#'
                          }]
                    }
                })
            },{
                text:'GitHub',
                href:'https://github.com/tao-zeng/react-example'
            }])
        }]
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

RUI.Doc = Doc;
module.exports = RUI;
