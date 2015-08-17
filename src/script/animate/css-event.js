let DomUtil = require('../util/dom'),
  EVENT_NAME_MAP = {
    transitionend: {
      transition: 'transitionend',
      WebkitTransition: 'webkitTransitionEnd',
      MozTransition: 'mozTransitionEnd',
      OTransition: 'oTransitionEnd',
      msTransition: 'MSTransitionEnd'
    },

    animationend: {
      animation: 'animationend',
      WebkitAnimation: 'webkitAnimationEnd',
      MozAnimation: 'mozAnimationEnd',
      OAnimation: 'oAnimationEnd',
      msAnimation: 'MSAnimationEnd'
    }
  },
  endEvents = (function detectEvents(window, document) {
    let testEl = document.createElement('div'),
      style = testEl.style,
      endEvents = [];
    if (!('AnimationEvent' in window)) {
      delete EVENT_NAME_MAP.animationend.animation;
    }
    if (!('TransitionEvent' in window)) {
      delete EVENT_NAME_MAP.transitionend.transition;
    }
    Object.keys(EVENT_NAME_MAP).forEach(function(baseEventName) {
      let baseEvents = EVENT_NAME_MAP[baseEventName];
      Object.keys(baseEvents).forEach(function(styleName) {
        if (styleName in style) {
          endEvents.push(baseEvents[styleName]);
        }
      });
    });
    return endEvents;
  })(window, document);

var AnimateEvents = {
  onEnd(node, eventListener) {
    if (endEvents.length == 0) {
      setTimeout(eventListener, 0);
    } else {
      endEvents.forEach(function(endEvent) {
        DomUtil.on(node, endEvent, eventListener);
      });
    }
  },
  unEnd(node, eventListener) {
    if (endEvents.length >= 0) {
      endEvents.forEach(function(endEvent) {
        DomUtil.un(node, endEvent, eventListener);
      });
    }
  },
  endEvents: endEvents,
  isSupport() {
    return endEvents.length > 0;
  }
};

module.exports = AnimateEvents;
