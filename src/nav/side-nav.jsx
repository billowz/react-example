let React = require('react'),
  {MenuItem, LeftNav, Styles} = require('material-ui'),
  {Colors, Spacing, Typography} = Styles,
  Side = require('../layout/side');
let SildeNav = React.createClass({
  getInitialState() {
    return {
      menuItems: [
        { route: 'get-started', text: 'Get Started' },
        { route: 'customization', text: 'Customization' },
        { route: 'components', text: 'Components' },
        { type: MenuItem.Types.SUBHEADER, text: 'Resources' },
        { type: MenuItem.Types.LINK, payload: 'https://github.com/callemall/material-ui', text: 'GitHub' },
        { type: MenuItem.Types.LINK, payload: 'http://facebook.github.io/react', text: 'React' },
        { type: MenuItem.Types.LINK, payload: 'https://www.google.com/design/spec/material-design/introduction.html', text: 'Material Design' }
      ]
    };
  },
  getStyles() {
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
  render() {
    let header = (
    <div style={this.getStyles()} onTouchTap={this._onHeaderClick}>
        {this.props.title}
      </div>
    );

    return (
      <Side ref="nav">
          <div style={this.getStyles()} onTouchTap={this._onHeaderClick}>
            {this.props.title}
          </div>
      </Side>
      );
  },
  toggle() {
    this.refs.nav.toggle();
  },
  _getSelectedIndex() {
    return 0;
  },
  _onNavChange(e, key, payload) {
    //this.context.router.transitionTo(payload.route);
  },
  _onHeaderClick() {
    //this.context.router.transitionTo('root');
    this.refs.nav.close();
  }
});
module.exports = SildeNav;
