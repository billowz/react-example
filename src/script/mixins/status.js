var {PropTypes} = require('react'),
  Util = require('../util/util'),
  {is} = Util,
  Status = function(statusProp, defVal, handler) {
    var mixins = {},
      bool = is.boolean(defVal),
      propFormat = Util.upperFirst(statusProp),
      getfn = (bool ? 'is' : 'get') + propFormat,
      setfn = 'set' + propFormat;
    mixins['getInitialState'] = function() {
      var state = {};
      state[statusProp] = defVal;
      return state;
    }
    mixins[getfn] = function() {
      return this.state[statusProp];
    }
    mixins[setfn] = function(val) {
      if (val === this.state[statusProp]) {
        return;
      }
      var state = {};
      state[statusProp] = val;
      this.setState(state);
      if (is.fn(handler)) {
        handler(val, this[getfn]());
      }
    }
    return mixins;
  }
Status.Props = function(statusProp, type, defVal) {
  var mixins = {},
    bool = is.boolean(defVal),
    propFormat = Util.upperFirst(statusProp),
    getfn = (bool ? 'is' : 'get') + propFormat,
    propTypes = {};
  // prop types
  propTypes[statusProp] = type;
  mixins['propTypes'] = propTypes;

  // default value
  mixins['getDefaultProps'] = function() {
    var props = {};
    props[statusProp] = defVal;
    return props;
  }

  //get function
  mixins[getfn] = function() {
    return this.props[statusProp];
  }
  return mixins;
}
module.exports = Status;
