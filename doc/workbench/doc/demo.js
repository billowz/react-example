let React = require('react'),
  {WorkBench} = require('react-ui');
module.exports = React.createClass({displayName: "exports",
  render() {
    return (React.createElement(WorkBench, {title: "Workbench Demo"}));
  }
});
