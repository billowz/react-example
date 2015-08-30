var {PropTypes} = require('react'),
  Status = require('./status'),
  Util = require('../util/util');

module.exports = function(option) {
  option = Util.assignIf(option || {}, {
    expandProp: 'expand',
    expand: true,
    autoCollspace: false,
    autoCollspaceProp: 'autoCollspace'
  });
  var obj = {},
    mixins = [Status(option.expandProp)]
  var mixs = [Status(dropdownProp, !!defDropdown)],
    mixins = {
      onAutoCollapseHandler(e) {
        if (e.keyCode === 27 ||
          !dom.isDecendantOf(e.target || e.srcElement, React.findDOMNode(this))) {
          this[Status.parseGetterName(dropdownProp)](false);
        }
      },
      _autoCollapseHandler = [],
      onToggleDropdown(type, dropdown) {
        if (autoCollapseProp && type === 'dropdown' && this.props[autoCollapseProp]) {
          if (dropdown && !this._autoCollapseHandler.length == 0) {
            this._autoCollapseHandler.push(
              dom.on(window.document, 'click', this.onAutoCollapseHandler),
              dom.on(window.document, 'keyup', this.onAutoCollapseHandler));
          } else if (!dropdown && this._autoCollapseHandler.length > 0) {
            this._autoCollapseHandler.forEach(h => h());
            this._autoCollapseHandler = [];
          }
        }
      }
    };
  if (arguments.length > 2) {
    mixs.push(Status.Props(autoCollapseProp, defAutlCollapse));
  }
  mixins.mixins = mixs;
  return mixins;
}
