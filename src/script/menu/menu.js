let React = require('react'),
  {PropTypes} = React,
  Compontent = require('../compontent'),
  Util = require('../util/util'),
  {dom, is} = Util,
  Mixins = require('../mixins/mixins'),
  {DocumentEvent, Status} = Mixins,
  Transition = require('../transition/transition'),
  Tree = require('../tree/tree'),
  {TreeNode} = require('../tree/tree'),
  MENU_TREE_NODE_STYLE = {
    cls: 'pure-menu-item',
    nodeCls: 'pure-menu-has-children',
    leafCls: '',
    openCls: 'pure-menu-active',
    selectedCls: 'pure-menu-selected',
    childrenCls: 'pure-menu-children',
    compontent: 'li',
    childrenCompontent: 'ul',
    childNodesProp: 'children',
    leafProp: 'leaf',

    contentProp: 'text',
    contentCls: 'pure-menu-link',
    hrefProp: 'href',
    hrefTargetProp: 'target'
  };

let Menu = Compontent('Menu', {
  mixins: [
    Status.Prop({
      prop: 'horizontal',
      type: PropTypes.bool,
      value: true
    })
  ],
  propTypes: {
    onMenuSelected: PropTypes.func,
    cls: PropTypes.string,
    horizontalCls: PropTypes.string,
    verticalCls: PropTypes.string,
    headerCls: PropTypes.string,
    headerContentCls: PropTypes.string,
    headerLinkContentCls: PropTypes.string,
    menuCls: PropTypes.string,
    menuItemStyle: PropTypes.object
  },
  getDefaultProps() {
    return {
      cls: 'pure-menu',
      horizontalCls: 'pure-menu-horizontal',
      verticalCls: 'pure-menu-vertical',
      headerCls: 'pure-menu-heading',
      headerContentCls: 'pure-menu-heading-content',
      headerLinkContentCls: 'pure-menu-link',
      menuCls: 'pure-menu-list',

      menuAnimation: {
        enter: {
          class: ['animated', 'fadeInDown']
        },
        leave: {
          class: ['animated', 'fadeOutDown']
        }
      }
    }
  },
  render() {
    var {className, horizontal} = this.props,
      cls = Util.parseClassName(
        this.props.cls,
        horizontal && this.props.horizontalCls,
        !horizontal && this.props.verticalCls
      );
    var st = new Date();
    setTimeout(() => {
      console.log('init menu use:' + (new Date() - st))
    }, 0)
    return <div className={cls}>
            <div className={this.props.headerCls}>{this._renderHeader()}</div>
            <Transition component="ul" className={this.props.menuCls} animation={this.props.menuAnimation}>
              {this._renderContent()}
            </Transition>
          </div>
  },
  _renderHeader() {
    if (is.string(this.props.header)) {
      var Comp = 'span',
        cls = [this.props.headerContentCls],
        props = {},
        href = this.props.headerHref;
      if (is.string(href)) {
        Comp = 'a';
        cls.push(this.props.headerLinkContentCls)
        props.href = href;
      }
      props.className = cls.join(' ');
      return <Comp {...props}>{this.props.header}</Comp>
    }
  },
  _renderContent() {
    var data = this.state.data || this.props.data;
    if (data) {
      var menuItemStyle = Util.assignIf(this.props.menuItemStyle || {}, MENU_TREE_NODE_STYLE);
      this._menuItemRefs = [];
      return data.map((c, idx) => {
        var ref = 'item-' + idx;
        this._menuItemRefs.push(ref);
        return <TreeNode {...menuItemStyle} data={c} key={idx} ref={ref} autoClose={this.props.horizontal} onClickContent={this._onMenuSelected}></TreeNode>;
      })
    }
  },
  _onMenuSelected(node, hierarchy) {
    if (node.isLeaf()) {
      hierarchy[0].setOpen(false);
    }
  }
});
module.exports = Menu;
