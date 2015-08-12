/*@MODULE_GENERATOR@*/
let React = require('react'),
  Router = require('react-router'),
  {Routes, Route} = Router,
  RUI = require('react-ui'),
  {Workbench} = RUI,
  MemoryDataPovider = RUI.Data.MemoryPovider,
  Doc={};
  Doc.Compontent = {
    Layout : {
        demos : {
            Demo : {
                compontent : require('./layout/doc/demo'),
                code : ''
            }
        },
        readmes : {
        }
    },
    Workbench : {
        demos : {
            Demo : {
                compontent : require('./workbench/doc/demo'),
                code : 'let React = require(&#39;react&#39;),\n  {WorkBench} = require(&#39;react-ui&#39;);\nmodule.exports = React.createClass({\n  render() {\n    return (&lt;WorkBench title=&#34;Workbench Demo&#34;/&gt;);\n  }\n});\n'
            }
        },
        readmes : {
            Readme : 'read me\n'
        }
    }
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
