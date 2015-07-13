let React = require('react'),
  {AppCanvas, AppBar, IconButton, TimePicker, DatePicker, Styles} = require('material-ui'),
  SildeNav = require('../nav/SildeNav'),
  side = require('../side/Side');


let ThemeManager = new Styles.ThemeManager();
let WorkBench = React.createClass({displayName: "WorkBench",
  mixins: [React.addons.LinkedStateMixin],
  getInitialState() {
    return {
    };
  },
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  getRightIconStyle() {
    return {
      color: Styles.Colors.darkWhite
    };
  },
  render() {
    let githubIcon = (
    React.createElement(IconButton, {iconClassName: "fa fa-github", iconStyle: this.getRightIconStyle(), href: "https://github.com/tao-zeng/react-example", linkButton: true})
    );
    return (React.createElement(AppCanvas, null, 
            React.createElement("div", null, 
            React.createElement(AppBar, {title: this.props.title, onLeftIconButtonTouchTap: this._onLeftIconButtonTouchTap, iconElementRight: githubIcon})
            ), React.createElement(TimePicker, {
  format: "24hr", 
  hintText: "24hr Format"}), 
React.createElement(DatePicker, {
  hintText: "Landscape Dialog", 
  mode: "landscape"}), 
            React.createElement(SildeNav, {ref: "nav", title: this.props.title})

        )
      );
  },
  _onLeftIconButtonTouchTap() {
    this.refs.nav.toggle();
    console.log('-->', this);
  }
});
React.render(React.createElement(WorkBench, {title: "React UI"}/), document.body);
module.exports = WorkBench;
