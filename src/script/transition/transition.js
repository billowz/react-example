let React = require('react'),
  CssAnimate = require('css-animation'),
  Util = require('../util/util'),
  is = require('is'),
  transElement = document.createElement('trans'),
  transitionEndEventNames = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'transition': 'transitionend'
  },
  animationEndEventNames = {
    'WebkitTransition': 'webkitAnimationEnd',
    'MozTransition': 'animationend',
    'OTransition': 'oAnimationEnd',
    'transition': 'animationend'
  };

function transition(el, trigger) {
  return Util.promise(function(def) {
    let transitionEndHandler,
      cssAni = function() {
        transitionEndHandler = Util.dom.on(el, transition.transitionEndEventName, function() {
          transitionEndHandler.remove();
          def.resolve(el);
        })
      },
      supportCss = !!transition.transitionEndEventName,
      err;

    if (is.string(trigger)) {
      if (supportCss) {
        cssAni();
        Util.dom.addCls(el, trigger);
      } else {
        err = ('Transition unsupported');
      }
    } else if (is.fn(trigger)) {
      trigger(el, def);
    } else if (is.hash(trigger)) {
      if (supportCss) {
        cssAni();
        el.css(el, trigger);
      } else {
        err = ('Transition unsupported');
      }
    } else {
      err = ('Invalid Transition');
    }
    if (err) {
      setTimeout(def.reject.bind(def, err), 0);
      def.promise.cancel = function() {}
    } else {
      def.promise.cancel = function() {
        if (transitionEndHandler)
          transitionEndHandler.remove();
        def.reject('Transition cancelled');
      };
    }
  });
}

function findEndEventName(endEventNames) {
  for (var name in endEventNames) {
    if (transElement.style[name] !== undefined) {
      return endEventNames[name];
    }
  }
}
transition.transitionEndEventName = findEndEventName(transitionEndEventNames);
transition.animationEndEventName = findEndEventName(animationEndEventNames);

let Transition = React.createClass({
  protoTypes: {
    animation: React.PropTypes.object,
    onEnd: React.PropTypes.func,
    component: React.PropTypes.string
  },

  getDefaultProps() {
    return {
      animation: {},
      component: 'span',
      onEnd: function() {}
    };
  },
  transition(animationType, val) {
    let node = React.findDOMNode(this),
      props = this.props,
      ani = props.animation[animationType];
    if (arguments.length > 1 && animationType !== 'enter' && animationType !== 'leave') {
      ani = ani[val];
    }
    this.stop();
    let prom = transition(node, ani);
    this.stopper = {
      stop: prom.cancel
    }
    prom.done(function() {
      this.stopper = null;
      if (is.fn(props.onEnd)) {
        props.onEnd(animationType, val);
      }
    });
  },
  /*
    transition(animationType, val) {
      let node = React.findDOMNode(this),
        props = this.props,
        ani = props.animation[animationType],
        end = function(animationType, val) {
          this.stopper = null;
          if (is.fn(props.onEnd)) {
            props.onEnd(animationType, val);
          }
        }.bind(this, animationType, val);
      if (arguments.length > 1 && animationType !== 'enter' && animationType !== 'leave') {
        ani = ani[val];
      }
      this.stop();
      if (CssAnimate.isCssAnimationSupported) {
        if (is.string(ani)) {
          this.stopper = CssAnimate(node, ani, end);
          return;
        } else if (is.fn(ani)) {
          this.stopper = ani(node, end);
          return;
        }
      }
      end();
    },*/

  stop() {
    if (this.stopper) {
      this.stopper.stop();
      this.stopper = null;
    }
  },

  componentWillReceiveProps(nextProps) {
    Object.keys(this.props.animation).forEach(function(type) {
      if (this.props[type] != nextProps[type]) {
        this.transition(type, nextProps[type]);
        console.log('--->>', type, nextProps[type])
      }
    }.bind(this))
    console.log(nextProps, this.props)
  },

  componentWillUnmount() {
    this.transition('leave');
  },

  componentDidMount() {
    this.transition('enter');
  },

  render() {
    let Component = this.props.component,
      props = Util.objectWithoutProperties(this.props, Object.keys(this.protoTypes).concat('children')),
      cls = Util.parseClassName('animated', this.props.className);
    return <Component {...props} className = {cls}>{this.props.children}</Component>;
  }
});
Transition.transition = transition;
module.exports = Transition;
