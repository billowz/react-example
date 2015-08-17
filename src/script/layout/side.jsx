let React = require('react'),
  {PropTypes} = React,
  Compontent = require('../compontent'),
  Util = require('../util/util'),
  {is} = Util;
let Side = Compontent('SideLayout', {
  propTypes: {
    direction: PropTypes.oneOf('left', 'right', 'top', 'buttom'),
    compontents: PropTypes.array,
    sideCompontentIdx: PropTypes.number
  },
  componentWillUnmount() {},

  componentDidMount() {
    console.log(this.getCompontent(this.props.sideCompontentIdx || 0))
  },
  render() {
    let cls = Util.parseClassName('side', this.props.className)
    return <div className={cls}>{this.renderCompontents('main')}</div>;
  }
});
