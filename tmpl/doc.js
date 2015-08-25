let React = require('react'),
  RUI = require('react-ui'),
  {Workbench, Data} = RUI,
  MemoryDataPovider = Data.MemoryPovider,
  Doc={};
  Doc.Compontent = {<% for (var i = 0; i < modules.length; i++) { %>
    <%= modules[i].name %> : {
        demos : {<% var demoNames = Object.keys(modules[i].demos);
            demoNames.forEach(function(demoName, idx){ %>
            <%=demoName%> : {
                compontent : require('<%=modules[i].demos[demoName].path%>'),
                code : '<%=modules[i].demos[demoName].content.replace(/[\r\n]/g, '\\n').replace(/\t/g, '  ')%>'
            }<%= (idx < demoNames.length - 1) ? "," : "" %><%})%>
        },
        readmes : {<% var readmeNames = Object.keys(modules[i].readmes);
            readmeNames.forEach(function(readmeName, idx){ %>
            <%=readmeName%> : '<%=modules[i].readmes[readmeName].replace(/\n/g, '\\n').replace(/\t/g, '  ')%>'<%= idx < readmeNames.length - 1 ? "," : "" %><%})%>
        }
    }<%= i < modules.length - 1 ? "," : "" %><% } %>
  };

class MenuDataPovider extends MemoryDataPovider{
  constructor() {
    super({});
    let Compontents = []
    Object.keys(Doc.Compontent).forEach(compName=>{
      Compontents.push({
        text:compName
      });
    });
    this.data = [{
        text:'Introducation'
    },{
        text:'Getting Started'
    },{
        text:'Compontents',
        children:Compontents
      },{
        text:'GitHub',
        href:'https://github.com/tao-zeng/react-example'
    }];
  }
}
Doc.App = React.createClass({
  render: function(){
    let config = {
        type:'SideLayout',
        children:[{
            type:'Menu',
            option:{
                horizontal:false,
                title:'React UI'
            },
            dataPovider: new MenuDataPovider()
        },{
          type:'GridLayout',
          option:{
            size:'1-2'
          },
          children:[{
            type:'Button',
            text:'Btn1'
          },{
            type:'Button',
            text:'Btn2'
          },{
            type:'Button',
            text:'Btn3'
          }]
        }]
    }
    return <Workbench compontents={config}></Workbench>
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
