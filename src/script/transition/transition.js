let React = require('react'),
  CssAnimate = require('../animate/css'),
  Util = require('../util/util'),
  {is} = Util;

let Transition = React.createClass({
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

  getAnimate(opt) {
    let el = React.findDOMNode(this),
      animate;
    if (opt) {
      if (!this.__animates) {
        this.__animates = new Map();
      }
      animate = this.__animates.get(opt);
      if (!animate) {
        animate = new CssAnimate(el, opt);
        this.__animates.set(opt, animate);
      }
    } else {
      throw 'Invalid Transition';
    }
    return animate;
  },

  stopTransition() {
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
      Util.warn('Transition is undefined %s[%s]', animationType, val);
      return;
    }
    this.stopTransition();
    var prom = this.getAnimate(opt).run();
    if (is.fn(this.props.onEnd)) {
      var endLis = function(err) {
        this.props.onEnd(animationType, val);
      }.bind(this);
      prom.then(endLis, endLis);
    }
    return prom;
  },

  componentWillReceiveProps(nextProps) {
    Object.keys(this.props.animation).forEach(function(type) {
      if (this.props[type] != nextProps[type]) {
        this.transition(type, nextProps[type]);
      }
    }.bind(this))
  },

  componentWillUnmount() {
    this.transition('leave');
  },

  componentDidMount() {
    this.transition('enter');
  },

  render() {
    let Component = this.props.component,
      props = Util.assignWithout({}, Object.keys(this.protoTypes).concat('children'), this.props);
    return <Component {...props}>{this.props.children}</Component>;
  }
});
module.exports = Transition;
