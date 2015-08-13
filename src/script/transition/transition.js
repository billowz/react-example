let React = require('react'),
  Animate = require('./animate'),
  Util = require('../util/util'),
  {is} = Util;

let Transition = React.createClass({
  protoTypes: {
    animation: React.PropTypes.object,
    component: React.PropTypes.string
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
        animate = new Animate(el, opt);
        this.__animates.set(opt, animate);
      }
    } else {
      throw 'Invalid Transition';
    }
    return animate;
  },

  stopTransition() {
    if (this.__animates) {
      let animate;
      for (animate of this.__animates.values()) {
        animate.stop();
      }
    }
  },

  transition(animationType, val) {
    let opt = this.props.animation[animationType];
    if (opt && animationType !== 'enter' && animationType !== 'leave') {
      opt = opt[val];
    }
    if (!opt) {
      throw 'Transition is undefined';
    }
    return getAnimate(opt).run();
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
Transition.Animate = Animate;
module.exports = Transition;
