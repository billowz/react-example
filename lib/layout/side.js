'use strict';

var React = require('react');

var _require = require('material-ui');

var Utils = _require.Utils;
var Mixins = _require.Mixins;
var Styles = _require.Styles;
var Paper = _require.Paper;
var Overlay = _require.Overlay;
var KeyCode = Utils.KeyCode;
var StylePropable = Mixins.StylePropable;
var WindowListenable = Mixins.WindowListenable;
var Transitions = Styles.Transitions;
var AutoPrefix = Styles.AutoPrefix;
var Spacing = Styles.Spacing;

var Side = React.createClass({
  displayName: 'Side',

  mixins: [StylePropable],
  contextTypes: {
    muiTheme: React.PropTypes.object
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
  getDefaultProps: function getDefaultProps() {
    return {
      open: false,
      docked: true,
      direction: 'left',
      width: Spacing.desktopKeylineIncrement * 3
    };
  },
  getInitialState: function getInitialState() {
    return {
      open: this.props.open
    };
  },
  toggle: function toggle() {
    this.setState({
      open: !this.state.open
    });
    return this;
  },
  close: function close() {
    this.setState({
      open: false
    });
    if (this.props.onClose) this.props.onClose();
    return this;
  },
  open: function open() {
    this.setState({
      open: true
    });
    if (this.props.onOpen) this.props.onOpen();
    return this;
  },
  getThemePalette: function getThemePalette() {
    return this.context.muiTheme.palette;
  },
  getTheme: function getTheme() {
    return this.context.muiTheme.component.leftNav;
  },
  getStyles: function getStyles() {
    var styles = {
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
        overflow: 'hidden'
      },
      horizontal: {
        height: '100%',
        width: this.props.width
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
      }
    };
    return styles;
  },
  render: function render() {
    var overlay = undefined;
    var styles = this.getStyles();
    if (!this.props.docked) {
      overlay = React.createElement(Overlay, { ref: 'overlay',
        show: this.state.open,
        transitionEnabled: !this.state.swiping,
        onTouchTap: this._onOverlayTouchTap });
    }
    var style = this.mergeAndPrefix(styles.root, styles[this.props.direction], styles[this._isVertical() ? 'vertical' : 'horizontal'], this.props.style);

    return React.createElement(
      'div',
      { className: this.props.className },
      overlay,
      React.createElement(
        Paper,
        { ref: 'clickAwayableElement',
          zDepth: 2,
          rounded: false,
          transitionEnabled: !this.state.swiping,
          style: style },
        this.props.children
      )
    );
  },
  _isVertical: function _isVertical() {
    return this.props.direction === 'top' || this.props.direction === 'bottom';
  },
  _getTransformCss: function _getTransformCss(translateSize) {
    if (translateSize === null || translateSize === undefined) {
      translateSize = this._getMaxTranslate();
    }
    var size = this._getTranslateMultiplier() * (this.state.open ? 0 : translateSize);
    if (!this._isVertical()) {
      return 'translate3d(' + size + 'px, 0, 0)';
    } else {
      return 'translate3d(0, ' + size + 'px, 0)';
    }
  },
  _getTranslateMultiplier: function _getTranslateMultiplier() {
    return this.props.direction === 'left' || this.props.direction === 'top' ? -1 : 1;
  },
  _getMaxTranslate: function _getMaxTranslate() {
    if (!this._isVertical()) {
      return this.props.width + 10;
    } else {
      return this.props.width + 10;
    }
  },
  _onOverlayTouchTap: function _onOverlayTouchTap() {
    this.close();
  }
});
module.exports = Side;