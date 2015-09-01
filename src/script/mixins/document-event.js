var {PropTypes} = require('react'),
  Status = require('./status'),
  Util = require('../util/util'),
  {dom, is} = Util;

module.exports = function(option) {
  option = option || {};

  var prop = option.prop,
    type = option.type || PropTypes.bool,
    value = type === PropTypes.bool ? !!option.value : option.value,
    onChanged = is.fn(option.onChanged) ? option.onChanged : null,
    bindEventCheckor = is.fn(option.bindEventCheckor) ? option.bindEventCheckor : function(value) {
      return !!value;
    },
    eventValue = (eventValue in option) ? option.eventValue : false,
    eventTypes = option.events || ['click', 'keyup'],
    autoBindProp = is.string(option.autoBindProp) ? option.autoBindProp : false,
    autoBind = option.autoBind !== false,
    autoBindCheckor = is.fn(option.autoBindCheckor) ? option.autoBindCheckor : function() {
      if (autoBindProp) {
        return !!this.props[autoBindProp];
      }
      return autoBind;
    },
    documentEventHandler = is.fn(option.eventHandler) ? option.eventHandler : function(e) {
      if (e.keyCode === 27 ||
        !dom.isDecendantOf(e.target || e.srcElement, React.findDOMNode(this))) {
        Status.set(this, option.prop, eventValue);
      }
    },
    propChanged = function(val) {
      if (autoBindCheckor.call(this)) {
        var docEvts = this.__documentEvents, evts;
        if (!docEvts) {
          this.__documentEvents = docEvts = {};
        }
        evts = docEvts[prop];
        if (bindEventCheckor.call(this, val)) {
          if (!evts || evts.length == 0) {
            docEvts[prop] = eventTypes.map(event => {
              return dom.on(window.document, event, documentEventHandler.bind(this))
            });
          }
        } else if (evts && evts.length > 0) {
          evts.forEach(h => h());
          docEvts[prop] = null;
        }
      }
      if (onChanged) {
        onChanged.apply(this, arguments);
      }
    },
    mixins = [Status({
      prop: prop,
      type: type,
      value: value,
      onChanged: propChanged
    })],
    mixinsDefine = {
      mixins: mixins,
      componentDidMount: function() {
        propChanged.call(this, Status.get(this, option.prop));
      }
    };
  if (option.buildAutoBindProp) {
    mixins.push(Status.Prop({
      prop: autoBindProp,
      type: PropTypes.bool,
      value: autoBind
    }));
  }
  return mixinsDefine;
}
