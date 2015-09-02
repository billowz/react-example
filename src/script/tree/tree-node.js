/**!
 * React UI Module:/tree
 */
var React = require('react'),
  Util = require('../util/util'),
  {is, dom} = Util,
  {PropTypes} = React,
  Compontent = require('../compontent'),
  {DocumentEvent, Status} = require('../mixins/mixins'),
  Transition = require('../transition/transition'),
  TREE_NODE_STYLES = {
    // styles
    cls: ['tree-node'],
    nodeCls: ['node'],
    leafCls: ['leaf'],
    selectedCls: ['selected'],
    openCls: ['open'],
    childrenCls: ['children'],
    compontent: ['li'],
    childrenCompontent: ['ul'],

    // data config
    childrenProp: ['children'],
    leafProp: ['leaf'],

    // content builder
    contentBuilder: [function() {
      var contentProps = this.props,
        content = this.getData(contentProps.contentProp || 'text'),
        href = this.getData(contentProps.hrefProp || 'href'),
        props = {
          onClick: this.clickContent,
          className: contentProps.contentCls || 'content'
        },
        Comp = 'span';
      if (is.string(href)) {
        Comp = 'a';
        props.href = href;
        props.target = this.getData(contentProps.hrefTargetProp || 'target');
      }
      return <Comp {...props}>{content}</Comp>;
    }, PropTypes.func],

    // animate
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
      value: false,
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
    onClickContent: PropTypes.func,
    data: PropTypes.object
  }),

  getData(key) {
    if (!this.props.data) {
      return null;
    }
    if (is.defined(key)) {
      return this.props.data[key];
    }
    return this.props.data;
  },

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

  open(cascade) {
    this.setOpen(true);
    if (cascade) {
      this.getChildNodes.forEach(c => {
        if (c.isNode()) {
          c.open(cascade);
        }
      });
    }
  },

  close(cascade) {
    this.setClose(true);
    if (cascade) {
      this.getChildNodes.forEach(c => {
        if (c.isNode()) {
          c.close(cascade);
        }
      });
    }
  },

  isNode() {
    return !this.isLeaf();
  },

  isLeaf() {
    var leaf = this.getData(this.props.leafProp);
    if (is.boolean(leaf)) {
      return leaf;
    }
    return !this.hasChildNode();
  },

  hasChildNode() {
    var cnodes;
    return !!this.props.children || ((cnodes = this._getChildDatas()) && cnodes.length > 0);
  },

  toggleCls(add, cls) {
    if (add) {
      dom.addCls(this.getDOMNode(), cls);
    } else {
      dom.removeCls(this.getDOMNode(), cls);
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    if (Util.eq(nextProps, this.props)) {
      if (nextState.open != this.state.open) {
        this.toggleCls(nextState.open, this.props.openCls);
        this.state.open = nextState.open;
        this.componentWillUpdate(this.props, this.state);
        return false;
      } else if (nextState.selected != this.state.selected) {
        this.toggleCls(nextState.selected, this.props.selectedCls);
        return false;
      }
    }
    return true;
  },

  render() {

    var st = new Date();
    setTimeout(() => {
      console.log('init item use:' + (new Date() - st))
    }, 0)
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
      var children = [], childDatas, propChildren, childrenIdx;
      if ((childDatas = this._getChildDatas()) && childDatas.length > 0) {
        children = childDatas.map(this._renderChildNode);
      }
      if ( (propChildren = this.props.children) ) {
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
    var props = Util.assign(this._getChildProps(), child.props);
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

  _renderChildNode(data, idx) {
    var props = this._getChildProps();
    if (is.fn(this.props.onClickContent)) {
      props.onClickContent = this._onClickChildContent;
    }
    this._childNodeRefs.push(idx);
    return <TreeNode {...props} data={data} key={idx} ref={idx} onClickContent={this._onClickChildContent}></TreeNode>
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
    return Util.assignWithout({}, ['data', 'onClickContent', 'data', this.props.childrenProp], this.props);
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

  _getChildDatas() {
    return this.getData(this.props.childrenProp);
  }
});
TreeNode.DefaultStyle = defaultProps;
module.exports = TreeNode;
