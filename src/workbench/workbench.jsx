let React = require('react'),
  {AppCanvas, AppBar, IconButton, TimePicker, DatePicker, Styles} = require('material-ui'),
  SildeNav = require('../nav/side-nav');


let ThemeManager = new Styles.ThemeManager();
let WorkBench = React.createClass({
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
    <IconButton iconClassName="fa fa-github" iconStyle={this.getRightIconStyle()} href="https://github.com/tao-zeng/react-example" linkButton={true} />
    );
    return (<AppCanvas>
            <div>
            <AppBar title={this.props.title} onLeftIconButtonTouchTap={this._onLeftIconButtonTouchTap} iconElementRight={githubIcon}/>
            </div>
            <TimePicker format="24hr" hintText="24hr Format" />
            <DatePicker
              hintText="Landscape Dialog"
              mode="landscape"
              showYearSelector={true}/>
            <SildeNav ref="nav" title={this.props.title}/>

        </AppCanvas>
      );
  },
  _onLeftIconButtonTouchTap() {
    this.refs.nav.toggle();
    console.log('-->', this);
  }
});
React.render(<WorkBench title="Workbench Demo"/>, document.body);
module.exports = WorkBench;
