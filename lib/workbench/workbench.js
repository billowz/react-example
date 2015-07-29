'use strict';

var React = require('react');

var _require = require('material-ui');

var AppCanvas = _require.AppCanvas;
var AppBar = _require.AppBar;
var IconButton = _require.IconButton;
var TimePicker = _require.TimePicker;
var DatePicker = _require.DatePicker;
var Styles = _require.Styles;
var SildeNav = require('../nav/side-nav');

var ThemeManager = new Styles.ThemeManager();
var WorkBench = React.createClass({
  displayName: 'WorkBench',

  mixins: [React.addons.LinkedStateMixin],
  getInitialState: function getInitialState() {
    return {};
  },
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext: function getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  getRightIconStyle: function getRightIconStyle() {
    return {
      color: Styles.Colors.darkWhite
    };
  },
  render: function render() {
    var githubIcon = React.createElement(IconButton, { iconClassName: 'fa fa-github', iconStyle: this.getRightIconStyle(), href: 'https://github.com/tao-zeng/react-example', linkButton: true });
    return React.createElement(
      AppCanvas,
      null,
      React.createElement(
        'div',
        null,
        React.createElement(AppBar, { title: this.props.title, onLeftIconButtonTouchTap: this._onLeftIconButtonTouchTap, iconElementRight: githubIcon })
      ),
      React.createElement(TimePicker, { format: '24hr', hintText: '24hr Format' }),
      React.createElement(DatePicker, {
        hintText: 'Landscape Dialog',
        mode: 'landscape',
        showYearSelector: true }),
      React.createElement(SildeNav, { ref: 'nav', title: this.props.title })
    );
  },
  _onLeftIconButtonTouchTap: function _onLeftIconButtonTouchTap() {
    this.refs.nav.toggle();
    console.log('-->', this);
  }
});
module.exports = WorkBench;