'use strict';

var React = require('react');

var _require = require('react-ui');

var WorkBench = _require.WorkBench;

module.exports = React.createClass({
  displayName: 'exports',

  render: function render() {
    return React.createElement(WorkBench, { title: 'Workbench Demo' });
  }
});