let React = require('react'),
  {Utils, Mixins, Styles, Paper, Overlay} = require('material-ui'),
  {KeyCode} = Utils,
  {StylePropable, WindowListenable} = Mixins,
  {Transitions, AutoPrefix, Spacing} = Styles;

let Side = React.createClass({displayName: "Side",
  mixins: [StylePropable],
  contextTypes: {
    muiTheme: React.PropTypes.object,
  },
  propTypes: {
    className: React.PropTypes.string,
    docked: React.PropTypes.bool,
    model: React.PropTypes.bool,
    header: React.PropTypes.element,
    onOpen: React.PropTypes.func,
    onClose: React.PropTypes.func,
    direction: React.PropTypes.string
  },
  getDefaultProps() {
    return {
      open: false,
      docked: true,
      direction: 'left',
      width: Spacing.desktopKeylineIncrement * 3
    };
  },
  getInitialState() {
    return {
      open: this.props.open
    };
  },
  toggle() {
    this.setState({
      open: !this.state.open
    });
    return this;
  },
  close() {
    this.setState({
      open: false
    });
    if (this.props.onClose) this.props.onClose();
    return this;
  },
  open() {
    this.setState({
      open: true
    });
    if (this.props.onOpen) this.props.onOpen();
    return this;
  },
  getThemePalette() {
    return this.context.muiTheme.palette;
  },
  getTheme() {
    return this.context.muiTheme.component.leftNav;
  },
  getStyles() {
    let styles = {
      root: {
        position: 'fixed',
        zIndex: 10,
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        transform: this._getTransformCss(),
        transition: !this.state.swiping && Transitions.easeOut(),
        backgroundColor: this.getTheme().color,
        overflow: 'hidden',
      },
      horizontal: {
        height: '100%',
        width: this.props.width,
      },
      vertical: {
        width: '100%',
        height: this.props.width
      },
      right: {
        left: 'auto'
      },
      bottom: {
        top: 'auto'
      },
    };
    return styles;
  },
  render() {
    let overlay;
    let styles = this.getStyles();
    if (!this.props.docked) {
      overlay = ( React.createElement(Overlay, {ref: "overlay", 
      show: this.state.open, 
      transitionEnabled: !this.state.swiping, 
      onTouchTap: this._onOverlayTouchTap})
      );
    }
    let style = this.mergeAndPrefix(styles.root,
      styles[this.props.direction],
      styles[this._isVertical() ? 'vertical' : 'horizontal'],
      this.props.style);

    return ( React.createElement("div", {className: this.props.className}, 
        overlay, 
        React.createElement(Paper, {ref: "clickAwayableElement", 
      zDepth: 2, 
      rounded: false, 
      transitionEnabled: !this.state.swiping, 
      style: style}, 
          this.props.children
        )
      )
      );
  },
  _isVertical() {
    return this.props.direction === 'top' || this.props.direction === 'bottom';
  },
  _getTransformCss(translateSize) {
    if (translateSize === null || translateSize === undefined) {
      translateSize = this._getMaxTranslate();
    }
    let size = this._getTranslateMultiplier() * (this.state.open ? 0 : translateSize);
    if (!this._isVertical()) {
      return 'translate3d(' + size + 'px, 0, 0)';
    } else {
      return 'translate3d(0, ' + size + 'px, 0)';
    }
  },
  _getTranslateMultiplier() {
    return this.props.direction === 'left' || this.props.direction === 'top' ? -1 : 1;
  },
  _getMaxTranslate() {
    if (!this._isVertical()) {
      return this.props.width + 10;
    } else {
      return this.props.width + 10;
    }
  },
  _onOverlayTouchTap() {
    this.close();
  }
});
module.exports = Side;
