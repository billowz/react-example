var React = require('react');
var WorkBench = React.createClass({displayName: "WorkBench",
    render: function() {
        return React.createElement("input", {type: "text", value: "hello, word."});
    }
});
React.render(React.createElement(WorkBench, null), document.body);
module.exports = WorkBench;
