let {PropTypes} = require('react'),
  Util = require('../util/util'),
  {is} = Util;
module.exports = function(statusProp, defVal, handler) {
  let mixins = {},
    bool = is.bool(defVal),
    propFormat = Util.upperFirst(statusProp),
    getfn = (bool ? 'is' : 'get') + propFormat,
    setfn = 'set' + propFormat;
  mixins['getInitialState'] = function() {
    let state = {};
    state[statusProp] = defVal;
    return state;
  }
  mixins[getfn] = function() {
    return this.state[statusProp];
  }
  mixins[setfn] = function(val) {
    if (is.fn(handler)) {
      handler(val, this[getfn]());
    }
    let state = {};
    state[statusProp] = val;
    this.setState(state);
  }
  return mixins;
}
