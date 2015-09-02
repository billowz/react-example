
/**!
 * React UI Module:/tree
 */
var React = require('react'),
  {PropTypes} = React,
  Compontent = require('../compontent'),
  Util = require('../util/util'),
  {dom, is} = Util,
  Mixins = require('../mixins/mixins'),
  {DocumentEvent, Status} = Mixins,
  Transition = require('../transition/transition'),
  TreeNode = require('./tree-node'),
  {DefaultStyle} = TreeNode;
var Tree = Compontent('Tree', {
  propTypes: {
    treeNodeConfig: PropTypes.object,
    data: PropTypes.oneOfType(PropTypes.array, PropTypes.object),
    rootDisplay: PropTypes.bool,
    rootCls: PropTypes.string,
    autoClose: PropTypes.bool,
    rootCompontent: PropTypes.string
  },
  getDefaultProps() {
    return {
      rootCls: 'tree',
      autoClose: false,
      rootCompontent: 'li'
    }
  },
  render() {
    var data = this.state.data || this.props.data,
      definedRootDisplay = is.boolean(this.props.rootDisplay),
      rootDisplay = definedRootDisplay ? this.props.rootDisplay : true,
      treeNodeConfig = Object.assign(this.props.treeNodeConfig || {}, {
        autoClose: this.props.autoClose
      }),
      root,
      children,
      contentProp = treeNodeConfig.contentProp || 'text',
      leafProp = treeNodeConfig.leafProp || DefaultStyle.leafProp,
      childrenProp = treeNodeConfig.childrenProp || DefaultStyle.childrenProp;
    if (!data || is.array(data)) {
      data = data || [];
      root = {}
      root[contentProp] = 'Root';
      root[leafProp] = false;
      if (!definedRootDisplay) {
        rootDisplay = false;
      }
    } else {
      root = data;
      data = root[childrenProp] || [];
      delete root[childrenProp];
    }
    children = data.map((c, idx) => {
      return <TreeNode key={idx} data={c} {...treeNodeConfig}></TreeNode>;
    });
    return <TreeNode {...treeNodeConfig}
      cls={this.props.rootCls}
      nodeCls="" compontent={this.props.rootCompontent}
      contentBuilder={rootDisplay ? DefaultStyle.contentBuilder : function() {}}
      data={root} ref="root" onClickContent={this._onNodeClick}>
      {children}
    </TreeNode>
  },
  _onNodeClick(node, hierarchy) {
    if (node.isLeaf()) {
      hierarchy[0].setOpen(false);
    }
  }
});
Tree.TreeNode = TreeNode;
module.exports = Tree;
