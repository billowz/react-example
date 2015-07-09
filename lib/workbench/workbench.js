var React = require('react');
var WorkBench = React.createClass({displayName: "WorkBench",
    render: function() {
        return React.createElement("p", null, "h1121");
    }
});
React.render(React.createElement(WorkBench, null), document.body);
module.exports = WorkBench;
