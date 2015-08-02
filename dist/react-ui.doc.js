(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"), require("react-router"), require("react-ui"));
	else if(typeof define === 'function' && define.amd)
		define(["react", "react-router", "react-ui"], factory);
	else if(typeof exports === 'object')
		exports["RUI"] = factory(require("react"), require("react-router"), require("react-ui"));
	else
		root["RUI"] = factory(root["React"], root["ReactRouter"], root["RUI"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__, __WEBPACK_EXTERNAL_MODULE_2__, __WEBPACK_EXTERNAL_MODULE_3__) {
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

	/*@MODULE_GENERATOR@*/
	/*Sun, 02 Aug 2015 04:03:39 GMT*/
	'use strict';

	var React = __webpack_require__(1);
	var Router = __webpack_require__(2);
	var Routes = Router.Routes;
	var Route = Router.Route;
	var rui = __webpack_require__(3);
	var Workbench = rui.Workbench;
	var Doc = {};
	Doc.Compontent = {
	  LayoutDocDemo: {
	    main: __webpack_require__(4),
	    content: ''
	  },
	  WorkbenchDocDemo: {
	    main: __webpack_require__(5),
	    content: 'let React = require(&#39;react&#39;),\n  {WorkBench} = require(&#39;react-ui&#39;);\nmodule.exports = React.createClass({\n  render() {\n    return (&lt;WorkBench title=&#34;Workbench Demo&#34;/&gt;);\n  }\n});\n'
	  }
	};
	Doc.App = React.createClass({
	  displayName: 'App',

	  render: function render() {}
	});
	var routes = React.createElement(Route, { handler: Workbench, path: '/' });

	Router.run(routes, function (Handler) {
	  React.render(React.createElement(Handler, null), document.body);
	});

	rui.Doc = Doc;
	module.exports = rui;

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_3__;

/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);

	var _require = __webpack_require__(3);

	var WorkBench = _require.WorkBench;

	module.exports = React.createClass({
	  displayName: 'exports',

	  render: function render() {
	    return React.createElement(WorkBench, { title: 'Workbench Demo' });
	  }
	});

/***/ }
/******/ ])
});
;