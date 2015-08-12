let React = require('react'),
  Animate = require('./animate'),
  Util = require('../util/util'),
  {is} = Util;

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
      ani = this.props.animation[animationType],
      end = function(animationType, val) {
        this._currentAnimate = null;
        if (is.fn(this.props.onEnd)) {
          this.props.onEnd(animationType, val);
        }
      }.bind(this, animationType, val);
    if (arguments.length > 1 && animationType !== 'enter' && animationType !== 'leave') {
      ani = ani[val];
    }
    this.stop();
    this._currentAnimate = new Animate(node, ani, end);
    this._currentAnimate.run();
  },

  stop() {
    if (this._currentAnimate) {
      this._currentAnimate.stop();
      this._currentAnimate = null;
    }
  },

  componentWillReceiveProps(nextProps) {
    Object.keys(this.props.animation).forEach(function(type) {
      if (this.props[type] != nextProps[type]) {
        this.transition(type, nextProps[type]);
        console.log('--->>', type, this.props[type], nextProps[type])
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
