var {PropTypes} = require('react'),
  Util = require('../util/util'),
  {is} = Util,
  Status = function(option) {
    if (!option || !option.prop) {
      throw 'Invalid Param';
    }
    var prop = option.prop,
      formatName = Util.upperFirst(prop),
      type = option.type || PropTypes.object,
      getter = option.getter || (type === PropTypes.bool ? 'is' : 'get') + formatName,
      setter = option.setter || 'set' + formatName,
      value = option.value,
      bindProp = (option.bindProp && is.string(option.bindProp)) ?
        option.bindProp : option.bindProp !== false ? prop : false,
      onChanged = is.fn(option.onChanged) ? option.onChanged : null,
      mixinsDefine = {
        getInitialState() {
          if (!this.__status) {
            this.__status = {};
          }
          this.__status[prop] = {
            prop: prop,
            formatName: formatName,
            type: type,
            getter: getter,
            setter: setter,
            value: value,
            bindProp: bindProp
          };
          var state = {}, propVal;
          if (bindProp && is.defined((propVal = this.props[bindProp]))) {
            state[prop] = propVal;
          } else {
            state[prop] = value;
          }
          return state;
        }
      };
    if (onChanged) {
      mixinsDefine.componentDidUpdate = function(prevProps, prevState) {

        var oldVal = prevState[prop],
          val = this.state[prop];
        if (val !== oldVal) {
          console.log('...changes', prop, val, oldVal)
          onChanged.call(this, val, oldVal);
        }
      }
    }
    if (bindProp) {
      mixinsDefine.propTypes = {};
      mixinsDefine.propTypes[bindProp] = type;
    }
    mixinsDefine[getter] = function() {
      return this.state[prop];
    };
    mixinsDefine[setter] = function(val) {
      if (val === this.state[prop]) {
        return;
      }
      var state = {};
      state[prop] = val;
      this.setState(state);
    };
    return mixinsDefine;
  }
Status.define = function(compontent, prop) {
  return compontent.__status && compontent.__status[prop];
}
Status.getter = function(compontent, prop) {
  var define = Status.define(compontent, prop);
  return compontent[define.getter];
}
Status.setter = function(compontent, prop) {
  var define = Status.define(compontent, prop);
  return compontent[define.setter];
}
Status.Prop = function(option) {
  if (!option || !option.prop) {
    throw 'Invalid Param';
  }
  var prop = option.prop,
    formatName = Util.upperFirst(prop),
    type = option.type || PropTypes.object,
    getter,
    value = option.value,
    propTypes = {},
    mixinsDefine = {
      propTypes: propTypes,
      getDefaultProps() {
        var props = {};
        props[prop] = value;
        return props;
      }
    };
  propTypes[prop] = type;
  if (option.getter) {
    getter = is.string(option.getter) ?
      option.getter :
      (option.type === PropTypes.bool ? 'is' : 'get') + formatName
  }
  if (getter) {
    mixinsDefine[getter] = function() {
      return this.props[prop];
    }
  }
  return mixinsDefine;
}
module.exports = Status;
