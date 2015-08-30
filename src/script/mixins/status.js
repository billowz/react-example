var {PropTypes} = require('react'),
  Util = require('../util/util'),
  {is} = Util,
  Status = function(option) {
    if (!option || !option.name) {
      throw 'Invalid Param';
    }
    var name = option.name,
      formatName = Util.upperFirst(name),
      type = option.type || PropTypes.object,
      getter = option.getter ||
        (option.type === PropTypes.boolean ? 'is' : 'get') + formatName,
      setter = option.setter || 'set' + formatName,
      value = option.value,
      bindProp = (option.bindProp && is.string(option.bindProp)) ?
        option.bindProp : option.bindProp !== false ? name : false,
      mixinsDefine = {
        getInitialState() {
          if (!this.__status) {
            this.__status = {};
          }
          this.__status[name] = {
            name: name,
            formatName: formatName,
            type: type,
            getter: getter,
            setter: setter,
            value: value,
            bindProp: bindProp
          };
          var state = {}, propVal;
          if (bindProp && is.defined((propVal = this.props[bindProp]))) {
            state[name] = propVal;
          } else {
            state[name] = value;
          }
          return state;
        }
      };
    if (bindProp) {
      mixinsDefine.propTypes = {};
      mixinsDefine.propTypes[bindProp] = type;
    }
    mixinsDefine[getter] = function() {
      return this.state[name];
    };
    mixinsDefine[setter] = function(val) {
      if (val === this.state[name]) {
        return;
      }
      var state = {};
      state[name] = val;
      this.setState(state);
    };
    return mixinsDefine;
  }
Status.define = function(compontent, name) {
  return compontent.__status && compontent.__status[name];
}
Status.getter = function(compontent, name) {
  var define = Status.define(compontent, name);
  return compontent[define.getter];
}
Status.setter = function(compontent, name) {
  var define = Status.define(compontent, name);
  return compontent[define.setter];
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

  mixins[Status.Props.parseGetterName(statusProp)] = mixins[getfn];
  return mixins;
}
Status.Props.parseGetterName = function(statusProp) {
  return 'props-' + statusProp + '-setter';
}
module.exports = Status;
