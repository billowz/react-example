/**!
 * React UI Module:/tree
 */
var React = require('react'),
  {PropTypes} = React,
  Compontent = require('../compontent'),
  {DocumentEvent, Status} = require('../mixins/mixins'),
  Util = require('../util/util'),
  {is} = Util,
  TREE_NODE_STYLES = {
    cls: ['tree-node'],
    nodeCls: ['node'],
    leafCls: ['leaf'],
    selectedCls: ['selected'],
    openCls: ['open'],
    childrenCls: ['children'],
    compontent: ['li'],
    childrenCompontent: ['ul'],
    childNodesProp: ['childNodes'],
    leafProp: ['leaf']
  },
  defaultProps = {},
  propTypes = {};

Object.keys(TREE_NODE_STYLES).forEach(name => {
  var val = TREE_NODE_STYLES[name];
  defaultProps[name] = val[0];
  propTypes[name] = val[1] || PropTypes.string;
});
console.log(propTypes, defaultProps)
var TreeNode = Compontent('TreeNode', {
  mixins: [
    DocumentEvent({
      prop: 'open',
      autoBindProp: 'autoClose',
      buildAutoBindProp: true
    }),
    Status({
      prop: 'selected',
      type: PropTypes.bool,
      value: false
    })
  ],
  propTypes: Util.assign(propTypes, {
    onSelected: PropTypes.func,
    onOpened: PropTypes.func,
    animation: PropTypes.object
  }),
  getDefaultProps() {
    return defaultProps;
  },
  render() {
    var leaf = this.isLeaf,
      cls = Util.parseClassName(
        this.props.cls,
        this.isLeaf() ? this.props.leafCls : this.props.nodeCls,
        this.isOpen() && this.props.openCls,
        this.isSelected() && this.props.selectedCls),
      Compontent = this.props.compontent;
    return <Compontent className={cls}>
              {this._renderNode()}
              {this.props.children}
          </Compontent>
  },
  _renderNode() {
    return 'abcde'
  },
  _renderChildren() {
    if (this.isNode()) {
      var children = [], childNodes, propChildren;
      if ((childNodes = this.getChildNodes()) && childNodes.length > 0) {
        children = childNodes.map(this._renderChildNode);
      }
      if (this.props.childNodesProp !== 'children' &&
        (propChildren = this.props.children)) {
        if (!is.array(propChildren)) {
          propChildren = [propChildren];
        }
        children = children.concat(propChildren.map(c => {
          return c;
        }));
      }
      if (children.length > 0) {
        return <Transition
          component={this.props.childrenCompontent}
          className={this.props.childrenCls}
          animation={this.props.animation}>
          {children}
        </Transition>
      }
    }
  },
  _renderChildNode(childNode, key) {
    var props = this._getChildProps();
    return <TreeNode {...props} {...childNode}></TreeNode>
  },
  _getChildProps() {
    return Util.assignWith({}, Object.keys(TREE_NODE_STYLES), this.props);
  },
  isNode() {
    return !this.isLeaf();
  },
  isLeaf() {
    var leaf = this.props[this.props.leafProp];
    if (is.boolean(leaf)) {
      return leaf;
    }
    return !this.hasChildNode();
  },
  hasChildNode() {
    var cnodes = this.getChildNodes();
    if (cnodes && cnodes.length > 0) {
      return true;
    }
    if (this.props.childNodesProp !== 'children') {
      return !!this.props.children;
    }
    return false;
  },
  getChildNodes() {
    return this.props[this.props.childNodesProp];
  }
});
module.exports = TreeNode;
