webpackJsonp([1,0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(3);


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = undefined;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = undefined;

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);
	__webpack_require__(2);

	module.exports = {
	    WorkBench: __webpack_require__(4)
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var React = __webpack_require__(1);
	__webpack_require__(2);
	var WorkBench = React.createClass({
	    displayName: 'WorkBench',

	    render: function render() {
	        return React.createElement(AppBar, { title: 'Title',
	            iconClassNameRight: 'muidocs-icon-navigation-expand-more' });
	    }
	});

	module.exports = WorkBench;

/***/ }
]);