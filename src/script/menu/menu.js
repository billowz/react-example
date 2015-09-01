let React = require('react'),
  {PropTypes} = React,
  Compontent = require('../compontent'),
  Util = require('../util/util'),
  {dom, is} = Util,
  Mixins = require('../mixins/mixins'),
  {DocumentEvent, Status} = Mixins,
  Transition = require('../transition/transition'),
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
    content: {
      contentProp: 'text',
      contentCls: 'pure-menu-link',
      hrefProp: 'href',
      hrefTargetProp: 'target'
    }
  };

let Menu = Compontent('Menu', {
  mixins: [
    DocumentEvent({
      prop: 'open',
      autoBindProp: 'horizontal'
    }),
    Status.Prop({
      prop: 'horizontal',
      type: PropTypes.bool,
      value: true
    })
  ],
  propTypes: {
    onMenuSelected: PropTypes.func
  },
  getDefaultProps() {
    return {
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
        'pure-menu', className,
        horizontal && 'pure-menu-horizontal',
        !horizontal && 'pure-menu-vertical'
      );
    return <div className={cls}>
            <div className="pure-menu-heading">{this._renderHeader()}</div>
            <Transition component="ul" className='pure-menu-list' animation={this.props.menuAnimation}>
              {this._renderContent()}
            </Transition>
          </div>
  },
  _renderHeader() {
    var headerContent;
    if (is.string(this.props.header)) {
      if (is.string(this.props.headerHref)) {
        return <a className="pure-menu-heading-content pure-menu-link" href={this.props.headerHref}>
          {this.props.header}
        </a>;
      } else {
        return <span className="pure-menu-heading-content">{this.props.header}</span>;
      }
    }
  },
  _renderContent() {
    if (this.state.data) {
      return this.state.data.map((c, idx) => {
        return <TreeNode {...MENU_TREE_NODE_STYLE} {...c}
          key={idx} autoClose={this.props.horizontal} onClickContent={this._onMenuSelected}></TreeNode>;
      });
    }
  },
  _onMenuSelected(node, hierarchy) {
    if (node.isLeaf()) {
      hierarchy[0].setOpen(false);
    }
  }
});
module.exports = Menu;
