/**!
 * React UI Module:/tree
 */
var React = require('react'),
  Util = require('../util/util'),
  {is} = Util,
  {PropTypes} = React,
  Compontent = require('../compontent'),
  {DocumentEvent, Status} = require('../mixins/mixins'),
  Transition = require('../transition/transition'),
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
    leafProp: ['leaf'],

    content: [{
      contentProp: 'text',
      contentCls: 'content',
      hrefProp: 'href',
      hrefTargetProp: 'hrefTtarget'
    }, PropTypes.object],

    contentBuilder: [function() {
      var href = this.props[this.props.hrefProp || 'href'];
      if (!is.string(href)) {
        href = 'javascript:void(0);';
      }
      return <a onClick={this.clickContent}
        className={this.props.contentCls || 'content'}
        href={href}
        target={this.props[this.props.hrefTargetProp || 'hrefTtarget']}>
        {this.props[this.props.contentProp || 'text']}
      </a>;
    }, PropTypes.func],

    openChildrenAnimation: [{
      tween: {
        from: {
          overflow: 'hidden',
          height: '0px'
        },
        height: 'auto',
        effect: 'bounce-out'
      }
    }, PropTypes.object],
    closeChildrenAnimation: [{
      tween: {
        from: {
          overflow: 'hidden',
          display: 'inline-block'
        },
        height: '0px',
        effect: 'circ-in'
      }
    }, PropTypes.object]
  },
  defaultProps = {},
  propTypes = {};

Object.keys(TREE_NODE_STYLES).forEach(name => {
  var val = TREE_NODE_STYLES[name];
  defaultProps[name] = val[0];
  propTypes[name] = val[1] || PropTypes.string;
});

var TreeNode = Compontent('TreeNode', {
  mixins: [
    DocumentEvent({
      prop: 'open',
      value: true,
      autoBindProp: 'autoClose',
      buildAutoBindProp: true
    }),
    Status({
      prop: 'selected',
      type: PropTypes.object,
      value: false,
      getter: false
    })
  ],

  propTypes: Util.assign(propTypes, {
    onClickContent: PropTypes.func
  }),

  getDefaultProps() {
    return defaultProps;
  },


  getChildNode(idx) {
    var idx = this._childNodeRefs.indexOf(idx);
    if (idx != -1) {
      return this.refs[this._childNodeRefs[idx]];
    }
    return null;
  },

  getChildNodes() {
    return this._childNodeRefs.map(ref => {
      return this.refs[ref];
    });
  },

  isSelected() {
    var sel = this.state.selected;
    if (this.isLeaf()) {
      return !!sel;
    } else {
      return sel && sel.all;
    }
  },

  isSelectAll() {
    var sel = this.state.selected;
    if (this.isLeaf()) {
      return !!sel;
    } else {
      return sel && sel.all;
    }
  },

  select() {
    if (this.isLeaf()) {
      this.setSelected(true);
    } else {
      this.setSelected({
        all: true
      });
      this.getChildNodes().forEach((cnode) => {
        cnode.select();
      });
    }
  },

  unselect() {
    if (this.isLeaf()) {
      this.setSelected(false);
    } else {
      this.getChildNodes().forEach((cnode) => {
        cnode.unSelect();
      });
    }
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
    var cnodes = this._getChildNodes();
    if (cnodes && cnodes.length > 0) {
      return true;
    }
    if (this.props.childNodesProp !== 'children') {
      return !!this.props.children;
    }
    return false;
  },

  render() {
    this._childNodeRefs = [];
    var leaf = this.isLeaf(),
      cls;
    if (leaf && this.isOpen()) {
      this.state.open = false;
    }
    cls = Util.parseClassName(
      this.props.cls,
      leaf ? this.props.leafCls : this.props.nodeCls,
      !leaf && this.isOpen() && this.props.openCls,
      this.isSelected() && this.props.selectedCls),
    Compontent = this.props.compontent;

    return <Compontent className={cls}>
              {this._renderContent()}
              {this._renderChildren()}
          </Compontent>
  },

  _renderContent() {
    if (is.fn(this.props.contentBuilder)) {
      return this.props.contentBuilder.call(this);
    }
  },

  _renderChildren() {
    if (this.isNode()) {
      var children = [], childNodes, propChildren, childrenIdx;
      if ((childNodes = this._getChildNodes()) && childNodes.length > 0) {
        children = childNodes.map(this._renderChildNode);
      }
      if (this.props.childNodesProp !== 'children' && (propChildren = this.props.children)) {
        if (!is.array(propChildren)) {
          propChildren = [propChildren];
        }
        childrenIdx = children.length;
        children = children.concat(propChildren.filter((child, idx) => {
          return React.isValidElement(child) && child.type === TreeNode;
        }).map(child => {
          return this._renderChildElement(child, childrenIdx++);
        }));
      }
      if (children.length > 0) {
        //return <ul>children</ul>;
        return <Transition
          component={this.props.childrenCompontent}
          className={this.props.childrenCls}
          open={this.isOpen()}
          animation={this._getChildrenAnimation()}>
          {children}
        </Transition>
      }
    }
    return null;
  },
  _renderChildElement(child, idx) {
    var props = Util.assign(_getChildProps, child.props);
    if (!child.key) {
      props.key = idx;
    }
    if (!child.ref) {
      props.ref = idx;
    }
    if (is.fn(child.props.onClickContent)) {
      props.onClickContent = Util.chainedFunc([child.props.onClickContent, this._onClickChildContent], this)
    } else {
      props.onClickContent = this._onClickChildContent;
    }
    this._childNodeRefs.push(props.ref);
    return React.cloneElement(child, props);
  },
  _renderChildNode(childNode, idx) {
    var props = this._getChildProps();
    if (is.fn(this.props.onClickContent)) {
      props.onClickContent = this._onClickChildContent;
    }
    this._childNodeRefs.push(idx);
    return <TreeNode {...props} {...childNode} key={idx} ref={idx} onClickContent={this._onClickChildContent}></TreeNode>
  },

  _onClickChildContent(node, hierarchy) {
    if (is.fn(this.props.onClickContent)) {
      hierarchy.splice(0, 0, this);
      this.props.onClickContent(node, hierarchy);
    }
  },

  clickContent(e) {
    if (this.isNode()) {
      this.setOpen(!this.isOpen());
    }
    if (is.fn(this.props.onClickContent)) {
      this.props.onClickContent(this, [this]);
    }
  },

  _getChildProps() {
    return Util.assignWith({}, Object.keys(TREE_NODE_STYLES), this.props);
  },

  _getChildrenAnimation() {
    return {
      enter: this.props.openChildrenAnimation,
      open: {
        true: this.props.openChildrenAnimation,
        false: this.props.closeChildrenAnimation
      }
    }
  },

  _getChildNodes() {
    return this.props[this.props.childNodesProp];
  }
});
module.exports = TreeNode;
