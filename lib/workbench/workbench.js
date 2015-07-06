var React = require('react');
require('material-ui');
var WorkBench = React.createClass({displayName: "WorkBench",
    render: function() {
        return React.createElement(AppBar, {title: "Title", 
        iconClassNameRight: "muidocs-icon-navigation-expand-more"}/) ;
    }
});

module.exports = WorkBench;
