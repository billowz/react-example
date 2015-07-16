'use strict';

var React = require('react');

var _require = require('material-ui');

var MenuItem = _require.MenuItem;
var LeftNav = _require.LeftNav;
var Styles = _require.Styles;
var Colors = Styles.Colors;
var Spacing = Styles.Spacing;
var Typography = Styles.Typography;
var Side = require('../layout/side');
var SildeNav = React.createClass({
  displayName: 'SildeNav',

  getInitialState: function getInitialState() {
    return {
      menuItems: [{ route: 'get-started', text: 'Get Started' }, { route: 'customization', text: 'Customization' }, { route: 'components', text: 'Components' }, { type: MenuItem.Types.SUBHEADER, text: 'Resources' }, { type: MenuItem.Types.LINK, payload: 'https://github.com/callemall/material-ui', text: 'GitHub' }, { type: MenuItem.Types.LINK, payload: 'http://facebook.github.io/react', text: 'React' }, { type: MenuItem.Types.LINK, payload: 'https://www.google.com/design/spec/material-design/introduction.html', text: 'Material Design' }]
    };
  },
  getStyles: function getStyles() {
    return {
      cursor: 'pointer',
      //.mui-font-style-headline
      fontSize: '24px',
      color: Typography.textFullWhite,
      lineHeight: Spacing.desktopKeylineIncrement + 'px',
      fontWeight: Typography.fontWeightLight,
      backgroundColor: Colors.cyan500,
      paddingLeft: Spacing.desktopGutter,
      paddingTop: '0px',
      marginBottom: '8px'
    };
  },
  render: function render() {
    var header = React.createElement(
      'div',
      { style: this.getStyles(), onTouchTap: this._onHeaderClick },
      this.props.title
    );

    return React.createElement(
      Side,
      { ref: 'nav' },
      React.createElement(
        'div',
        { style: this.getStyles(), onTouchTap: this._onHeaderClick },
        this.props.title
      )
    );
  },
  toggle: function toggle() {
    this.refs.nav.toggle();
  },
  _getSelectedIndex: function _getSelectedIndex() {
    return 0;
  },
  _onNavChange: function _onNavChange(e, key, payload) {},
  _onHeaderClick: function _onHeaderClick() {
    //this.context.router.transitionTo('root');
    this.refs.nav.close();
  }
});
module.exports = SildeNav;

//this.context.router.transitionTo(payload.route);