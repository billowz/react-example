var React = require('react'),
  CssAnimate = require('../animate/css'),
  Util = require('../util/util'),
  Compontent = require('../compontent'),
  {is} = Util;

var Transition = React.createClass({
  protoTypes: {
    animation: React.PropTypes.object,
    component: React.PropTypes.string,
    onEnd: React.PropTypes.func
  },

  getDefaultProps() {
    return {
      animation: {},
      component: 'span',
      onEnd: function() {}
    };
  },

  getAnimate(opt, type) {
    var el = React.findDOMNode(this),
      animate;
    if (opt) {
      if (!this.__animates) {
        this.__animates = new Map();
      }
      animate = this.__animates.get(opt);
      if (!animate) {
        animate = new CssAnimate(el, opt);
        this.__animates.set(opt, animate);
        animate.type = type;
      }
    } else {
      throw 'Invalid Transition';
    }
    return animate;
  },

  stopTransition(type) {
    var animate;
    if (this.__animates) {
      for (animate of this.__animates.values()) {
      animate.stop();
      }
    }
  },

  transition(animationType, val) {
    var opt = this.props.animation[animationType];
    if (opt && animationType !== 'enter' && animationType !== 'leave') {
      opt = opt[val];
    }
    if (!opt) {
      if (is.fn(this.props.onEnd)) {
        this.props.onEnd(animationType, val);
      }
      Util.debug('Transition is undefined ' + animationType + '[' + val + ']');
      return Util.promise(def => {
        def.reject('non Transition');
      });
    }
    this.stopTransition(animationType);
    var prom = this.getAnimate(opt, animationType).run();
    if (is.fn(this.props.onEnd)) {
      var endLis = function(err) {
        this.props.onEnd(animationType, val);
      }.bind(this);
      prom.then(endLis, endLis);
    }
    return prom;
  },

  componentWillReceiveProps(nextProps, updated) {
    Object.keys(this.props.animation).forEach(function(type) {
      var oldVal = this.props[type],
        val = nextProps[type];
      if (val !== oldVal) {
        this.transition(type, val);
      }
    }.bind(this))
  },

  componentWillUnmount() {
    this.stopTransition();
  },

  componentDidMount() {
    this.transition('enter');
  },
  componentWillEnter() {
    var done = function() {
      console.log('====>>>', arguments);
    }
    console.log('componentWillEnter====>>>', arguments);
    this.transition('enter').then(done, done);
  },

  componentWillLeave() {
    console.log('componentWillLeave====>>>', arguments);
    this.transition('leave').then(done, done);
  },

  render() {
    let Component = this.props.component,
      props = Util.assignWithout({}, Object.keys(this.protoTypes).concat('children'), this.props);
    return <Component {...props}>{this.props.children}</Component>;
  }
});
module.exports = Transition;
