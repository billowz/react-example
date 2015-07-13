(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("material-ui"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "material-ui"], factory);
	else if(typeof exports === 'object')
		exports["ReactUI"] = factory(require("react"), require("material-ui"));
	else
		root["ReactUI"] = factory(root["React"], root["Material"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_4__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(2);

	module.exports = {
	    WorkBench: __webpack_require__(3)
	};

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);

	var _require = __webpack_require__(4);

	var AppCanvas = _require.AppCanvas;
	var AppBar = _require.AppBar;
	var IconButton = _require.IconButton;
	var TimePicker = _require.TimePicker;
	var DatePicker = _require.DatePicker;
	var Styles = _require.Styles;
	var SildeNav = __webpack_require__(5);
	var side = __webpack_require__(6);

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
	      React.createElement(TimePicker, {
	        format: '24hr',
	        hintText: '24hr Format' }),
	      React.createElement(DatePicker, {
	        hintText: 'Landscape Dialog',
	        mode: 'landscape' }),
	      React.createElement(SildeNav, { ref: 'nav', title: this.props.title })
	    );
	  },
	  _onLeftIconButtonTouchTap: function _onLeftIconButtonTouchTap() {
	    this.refs.nav.toggle();
	    console.log('-->', this);
	  }
	});
	React.render(React.createElement(WorkBench, { title: 'React UI' }), document.body);
	module.exports = WorkBench;

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_4__;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);

	var _require = __webpack_require__(4);

	var MenuItem = _require.MenuItem;
	var LeftNav = _require.LeftNav;
	var Styles = _require.Styles;
	var Colors = Styles.Colors;
	var Spacing = Styles.Spacing;
	var Typography = Styles.Typography;

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

	    return React.createElement(LeftNav, {
	      ref: 'nav',
	      docked: true,
	      isInitiallyOpen: true,
	      header: header,
	      menuItems: this.state.menuItems,
	      selectedIndex: this._getSelectedIndex(),
	      openRight: true,
	      onChange: this._onNavChange });
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

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(2);

	var _require = __webpack_require__(4);

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

	var Side = React.createClass({
	  displayName: 'Side',

	  mixins: [StylePropable, WindowListenable],
	  contextTypes: {
	    muiTheme: React.PropTypes.object
	  },
	  propTypes: {
	    className: React.PropTypes.string,
	    docked: React.PropTypes.bool,
	    model: React.PropTypes.bool,
	    header: React.PropTypes.element,
	    onChange: React.PropTypes.func,
	    onOpen: React.PropTypes.func,
	    onClose: React.PropTypes.func,
	    direction: React.PropTypes.string
	  },
	  direction: {
	    left: 'left',
	    right: 'right',
	    top: 'top',
	    bottom: 'bottom'
	  },

	  windowListeners: {
	    'keyup': '_onWindowKeyUp',
	    'resize': '_onWindowResize'
	  },

	  getDefaultProps: function getDefaultProps() {
	    return {
	      docked: true,
	      model: true
	    };
	  },

	  getInitialState: function getInitialState() {
	    return {
	      open: this.props.docked,
	      maybeSwiping: false,
	      swiping: null
	    };
	  },

	  componentDidMount: function componentDidMount() {
	    this._updateMenuHeight();
	    this._enableSwipeHandling();
	  },

	  componentDidUpdate: function componentDidUpdate() {
	    this._updateMenuHeight();
	    this._enableSwipeHandling();
	  },

	  componentWillUnmount: function componentWillUnmount() {
	    this._disableSwipeHandling();
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
	    if (this.props.onNavClose) this.props.onNavClose();
	    return this;
	  },

	  open: function open() {
	    this.setState({
	      open: true
	    });
	    if (this.props.onNavOpen) this.props.onNavOpen();
	    return this;
	  },

	  getThemePalette: function getThemePalette() {
	    return this.context.muiTheme.palette;
	  },

	  getTheme: function getTheme() {
	    return this.context.muiTheme.component.leftNav;
	  },

	  getStyles: function getStyles() {
	    var x = this._getTranslateMultiplier() * (this.state.open ? 0 : this._getMaxTranslateX());
	    var styles = {
	      root: {
	        height: '100%',
	        width: this.getTheme().width,
	        position: 'fixed',
	        zIndex: 10,
	        left: 0,
	        top: 0,
	        transform: 'translate3d(' + x + 'px, 0, 0)',
	        transition: !this.state.swiping && Transitions.easeOut(),
	        backgroundColor: this.getTheme().color,
	        overflow: 'hidden'
	      },
	      menu: {
	        overflowY: 'auto',
	        overflowX: 'hidden',
	        height: '100%'
	      },
	      menuItem: {
	        height: this.context.muiTheme.spacing.desktopLeftNavMenuItemHeight,
	        lineHeight: this.context.muiTheme.spacing.desktopLeftNavMenuItemHeight + 'px'
	      },
	      rootWhenOpenRight: {
	        left: 'auto',
	        right: 0
	      }
	    };
	    styles.menuItemLink = this.mergeAndPrefix(styles.menuItem, {
	      display: 'block',
	      textDecoration: 'none',
	      color: this.getThemePalette().textColor
	    });
	    styles.menuItemSubheader = this.mergeAndPrefix(styles.menuItem, {
	      overflow: 'hidden'
	    });

	    return styles;
	  },

	  render: function render() {
	    var selectedIndex = this.props.selectedIndex;
	    var overlay = undefined;

	    var styles = this.getStyles();
	    if (!this.props.docked) {
	      overlay = React.createElement(Overlay, { ref: 'overlay',
	        show: this.state.open,
	        transitionEnabled: !this.state.swiping,
	        onTouchTap: this._onOverlayTouchTap
	      });
	    }

	    return React.createElement(
	      'div',
	      { className: this.props.className },
	      ' ',
	      overlay,
	      ' ',
	      React.createElement(
	        Paper,
	        { ref: 'clickAwayableElement',
	          zDepth: 2,
	          rounded: false,
	          transitionEnabled: !this.state.swiping,
	          style: this.mergeAndPrefix(styles.root, this.props.openRight && styles.rootWhenOpenRight, this.props.style) },
	        ' ',
	        this.props.header,
	        ' '
	      ),
	      ' '
	    );
	  },

	  _updateMenuHeight: function _updateMenuHeight() {
	    if (this.props.header) {
	      var container = React.findDOMNode(this.refs.clickAwayableElement);
	      var menu = React.findDOMNode(this.refs.menuItems);
	      var menuHeight = container.clientHeight - menu.offsetTop;
	      menu.style.height = menuHeight + 'px';
	    }
	  },

	  _onMenuItemClick: function _onMenuItemClick(e, key, payload) {
	    if (this.props.onChange && this.props.selectedIndex !== key) {
	      this.props.onChange(e, key, payload);
	    }
	    if (!this.props.docked) this.close();
	  },

	  _onOverlayTouchTap: function _onOverlayTouchTap() {
	    this.close();
	  },

	  _onWindowKeyUp: function _onWindowKeyUp(e) {
	    if (e.keyCode === KeyCode.ESC && !this.props.docked && this.state.open) {
	      this.close();
	    }
	  },

	  _onWindowResize: function _onWindowResize() {
	    this._updateMenuHeight();
	  },

	  _getMaxTranslateX: function _getMaxTranslateX() {
	    return this.getTheme().width + 10;
	  },

	  _getTranslateMultiplier: function _getTranslateMultiplier() {
	    return this.props.openRight ? 1 : -1;
	  },

	  _enableSwipeHandling: function _enableSwipeHandling() {
	    if (!this.props.docked) {
	      document.body.addEventListener('touchstart', this._onBodyTouchStart);
	      if (!openNavEventHandler) {
	        openNavEventHandler = this._onBodyTouchStart;
	      }
	    } else {
	      this._disableSwipeHandling();
	    }
	  },

	  _disableSwipeHandling: function _disableSwipeHandling() {
	    document.body.removeEventListener('touchstart', this._onBodyTouchStart);
	    if (openNavEventHandler === this._onBodyTouchStart) {
	      openNavEventHandler = null;
	    }
	  },

	  _onBodyTouchStart: function _onBodyTouchStart(e) {
	    if (!this.state.open && openNavEventHandler !== this._onBodyTouchStart) {
	      return;
	    }

	    var touchStartX = e.touches[0].pageX;
	    var touchStartY = e.touches[0].pageY;
	    this.setState({
	      maybeSwiping: true,
	      touchStartX: touchStartX,
	      touchStartY: touchStartY
	    });

	    document.body.addEventListener('touchmove', this._onBodyTouchMove);
	    document.body.addEventListener('touchend', this._onBodyTouchEnd);
	    document.body.addEventListener('touchcancel', this._onBodyTouchEnd);
	  },

	  _setPosition: function _setPosition(translateX) {
	    var leftNav = React.findDOMNode(this.refs.clickAwayableElement);
	    leftNav.style[AutoPrefix.single('transform')] = 'translate3d(' + this._getTranslateMultiplier() * translateX + 'px, 0, 0)';
	    this.refs.overlay.setOpacity(1 - translateX / this._getMaxTranslateX());
	  },

	  _getTranslateX: function _getTranslateX(currentX) {
	    return Math.min(Math.max(this.state.swiping === 'closing' ? this._getTranslateMultiplier() * (currentX - this.state.swipeStartX) : this._getMaxTranslateX() - this._getTranslateMultiplier() * (this.state.swipeStartX - currentX), 0), this._getMaxTranslateX());
	  },

	  _onBodyTouchMove: function _onBodyTouchMove(e) {
	    var currentX = e.touches[0].pageX;
	    var currentY = e.touches[0].pageY;

	    if (this.state.swiping) {
	      e.preventDefault();
	      this._setPosition(this._getTranslateX(currentX));
	    } else if (this.state.maybeSwiping) {
	      var dXAbs = Math.abs(currentX - this.state.touchStartX);
	      var dYAbs = Math.abs(currentY - this.state.touchStartY);
	      // If the user has moved his thumb ten pixels in either direction,
	      // we can safely make an assumption about whether he was intending
	      // to swipe or scroll.
	      var threshold = 10;

	      if (dXAbs > threshold && dYAbs <= threshold) {
	        this.setState({
	          swiping: this.state.open ? 'closing' : 'opening',
	          open: true,
	          swipeStartX: currentX
	        });
	        this._setPosition(this._getTranslateX(currentX));
	      } else if (dXAbs <= threshold && dYAbs > threshold) {
	        this._onBodyTouchEnd();
	      }
	    }
	  },

	  _onBodyTouchEnd: function _onBodyTouchEnd(e) {
	    if (this.state.swiping) {
	      var currentX = e.changedTouches[0].pageX;
	      var translateRatio = this._getTranslateX(currentX) / this._getMaxTranslateX();

	      this.setState({
	        maybeSwiping: false,
	        swiping: null
	      });

	      // We have to open or close after setting swiping to null,
	      // because only then CSS transition is enabled.
	      if (translateRatio > 0.5) {
	        this.close();
	      } else {
	        this._setPosition(0);
	      }
	    } else {
	      this.setState({
	        maybeSwiping: false
	      });
	    }

	    document.body.removeEventListener('touchmove', this._onBodyTouchMove);
	    document.body.removeEventListener('touchend', this._onBodyTouchEnd);
	    document.body.removeEventListener('touchcancel', this._onBodyTouchEnd);
	  }

	});

	module.exports = Side;

/***/ }
/******/ ])
});
;