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
      getter = (option.getter === false || is.string(option.getter)) ? option.getter : (type === PropTypes.bool ? 'is' : 'get') + formatName,
      setter = (option.setter === false || is.string(option.setter)) ? option.setter : option.setter || 'set' + formatName,
      value = option.value,
      bindProp = (option.bindProp && is.string(option.bindProp)) ?
        option.bindProp : option.bindProp !== false ? prop : false,
      onChanged = is.fn(option.onChanged) ? option.onChanged : null,
      getterFn = function() {
        return this.state[prop];
      },
      setterFn = function(val) {
        if (val === this.state[prop]) {
          return;
        }
        var state = {};
        state[prop] = val;
        this.setState(state);
      },
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
            getterFn: getterFn,
            setterFn: setterFn,
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
      mixinsDefine.componentWillUpdate = function(prevProps, prevState) {
        var oldVal = prevState[prop],
          val = this.state[prop];
        if (val !== oldVal) {
          onChanged.call(this, val, oldVal);
        }
        return true;
      }
    }
    if (bindProp) {
      mixinsDefine.propTypes = {};
      mixinsDefine.propTypes[bindProp] = type;
    }
    if (getter)
      mixinsDefine[getter] = getterFn;
    if (setter)
      mixinsDefine[setter] = setterFn;
    return mixinsDefine;
  }
Status.define = function(compontent, prop) {
  return compontent.__status && compontent.__status[prop];
}
Status.get = function(compontent, prop) {
  var define = Status.define(compontent, prop);
  return define.getterFn.call(compontent);
}
Status.set = function(compontent, prop, val) {
  var define = Status.define(compontent, prop);
  return define.setterFn.call(compontent, val);
}
Status.Prop = function(option) {
  if (!option || !option.prop) {
    throw 'Invalid Param';
  }
  var prop = option.prop,
    formatName = Util.upperFirst(prop),
    type = option.type || PropTypes.object,
    getter = (!option.getter || is.string(option.getter)) ? option.getter : (type === PropTypes.bool ? 'is' : 'get') + formatName,
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
  if (getter) {
    mixinsDefine[getter] = function() {
      return this.props[prop];
    }
  }
  return mixinsDefine;
}
module.exports = Status;
