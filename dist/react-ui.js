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
	var Styles = _require.Styles;
	var SildeNav = __webpack_require__(5);

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
	      React.createElement(AppBar, { title: this.props.title, onLeftIconButtonTouchTap: this._onLeftIconButtonTouchTap, iconElementRight: githubIcon }),
	      React.createElement(SildeNav, { title: this.props.title })
	    );
	  },
	  _onLeftIconButtonTouchTap: function _onLeftIconButtonTouchTap() {
	    //this.refs.leftNav.toggle();
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
	      docked: false,
	      isInitiallyOpen: false,
	      header: header,
	      menuItems: this.state.menuItems,
	      selectedIndex: this._getSelectedIndex(),
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

/***/ }
/******/ ])
});
;