var {PropTypes} = require('react'),
  Status = require('./status'),
  Util = require('../util/util'),
  {dom, is} = Util;

module.exports = function(option) {
  option = option || {};

  var prop = option.prop,
    type = option.type || PropTypes.bool,
    value = type === PropTypes.bool ? !!option.value : option.value,
    bindEventCheckor = is.fn(option.bindEventCheckor) ? option.bindEventCheckor : function(value) {
      return !!value;
    },
    eventValue = (eventValue in option) ? option.eventValue : !bindEventCheckor(true),
    events = option.events || ['click', 'keyup'],
    autoBindProp = is.string(option.autoBindProp) ? option.autoBindProp : false,
    autoBind = option.autoBind !== false,
    autoBindCheckor = is.fn(option.autoBindCheckor) ? option.autoBindCheckor : function() {
      if (autoBindProp) {
        return !!this.props[autoBindProp];
      }
      return autoBind;
    },
    documentEvents,
    documentEventHandler = is.fn(option.eventHandler) ? option.eventHandler : function(e) {
      if (e.keyCode === 27 ||
        !dom.isDecendantOf(e.target || e.srcElement, React.findDOMNode(this))) {
        Status.setter(this, option.prop)(eventValue);
      }
    },
    propChanged = function(val) {
      if (!autoBindCheckor.call(this)) {
        return;
      }
      if (bindEventCheckor.call(this, val)) {
        if (!documentEvents || documentEvents.length == 0) {
          documentEvents = events.map(event => {
            return dom.on(window.document, event, documentEventHandler.bind(this))
          })
        }
      } else if (documentEvents && documentEvents.length > 0) {
        documentEvents.forEach(h => h());
        documentEvents = null;
      }
    },
    mixins = [Status({
      prop: prop,
      type: type,
      value: value,
      onChanged: propChanged
    })],
    mixinsDefine = {
      mixins: mixins
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
