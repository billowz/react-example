var React = require('react');
var mui = require('material-ui');
var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

var ThemeManager = new mui.Styles.ThemeManager();
var WorkBench = React.createClass({
    childContextTypes: {
        muiTheme: React.PropTypes.object
    },
    getChildContext: function() {
        return {
            muiTheme: ThemeManager.getCurrentTheme()
        };
    },
    render: function() {
        return (<mui.DatePicker hintText = "Portrait Dialog" />);
    }
});
React.render( < WorkBench / > , document.body);
module.exports = WorkBench;
