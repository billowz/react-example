/*@MODULE_GENERATOR@*/
let React = require('react'),
  Router = require('react-router'),
  {Routes, Route} = Router,
  rui = require('react-ui'),
  Workbench = rui.Workbench,
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
    Watch : {
        demos : {
        },
        readmes : {
            Readme : 'Watch\n'
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
